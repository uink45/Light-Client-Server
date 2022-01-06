"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpochContextError = exports.EpochContextErrorCode = exports.EpochContext = exports.afterProcessEpoch = exports.computeSyncParticipantReward = exports.computeProposers = exports.syncPubkeys = exports.createEpochContext = exports.PubkeyIndexMap = void 0;
const ssz_1 = require("@chainsafe/ssz");
const bls_1 = __importStar(require("@chainsafe/bls"));
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const lodestar_utils_1 = require("@chainsafe/lodestar-utils");
const persistent_ts_1 = require("@chainsafe/persistent-ts");
const util_1 = require("../../util");
const epochShuffling_1 = require("./epochShuffling");
const misc_1 = require("../../altair/util/misc");
/**
 * toHexString() creates hex strings via string concatenation, which are very memory inneficient.
 * Memory benchmarks show that Buffer.toString("hex") produces strings with 10x less memory.
 *
 * Does not prefix to save memory, thus the prefix is removed from an already string representation.
 *
 * See https://github.com/ChainSafe/lodestar/issues/3446
 */
function toMemoryEfficientHexStr(hex) {
    if (typeof hex === "string") {
        if (hex.startsWith("0x")) {
            hex = hex.slice(2);
        }
        return hex;
    }
    return Buffer.from(hex).toString("hex");
}
class PubkeyIndexMap {
    constructor() {
        // We don't really need the full pubkey. We could just use the first 20 bytes like an Ethereum address
        this.map = new Map();
    }
    get size() {
        return this.map.size;
    }
    /**
     * Must support reading with string for API support where pubkeys are already strings
     */
    get(key) {
        return this.map.get(toMemoryEfficientHexStr(key));
    }
    set(key, value) {
        this.map.set(toMemoryEfficientHexStr(key), value);
    }
}
exports.PubkeyIndexMap = PubkeyIndexMap;
/**
 * Create an epoch cache
 * @param validators cached validators that matches `state.validators`
 *
 * SLOW CODE - 🐢
 */
function createEpochContext(config, state, opts) {
    const pubkey2index = (opts === null || opts === void 0 ? void 0 : opts.pubkey2index) || new PubkeyIndexMap();
    const index2pubkey = (opts === null || opts === void 0 ? void 0 : opts.index2pubkey) || [];
    if (!(opts === null || opts === void 0 ? void 0 : opts.skipSyncPubkeys)) {
        syncPubkeys(state, pubkey2index, index2pubkey);
    }
    const currentEpoch = (0, util_1.computeEpochAtSlot)(state.slot);
    const previousEpoch = currentEpoch === lodestar_params_1.GENESIS_EPOCH ? lodestar_params_1.GENESIS_EPOCH : currentEpoch - 1;
    const nextEpoch = currentEpoch + 1;
    let totalActiveBalanceByIncrement = 0;
    let exitQueueEpoch = (0, util_1.computeActivationExitEpoch)(currentEpoch);
    let exitQueueChurn = 0;
    const effectiveBalancesArr = [];
    const previousActiveIndices = [];
    const currentActiveIndices = [];
    const nextActiveIndices = [];
    const validators = (0, ssz_1.readonlyValuesListOfLeafNodeStruct)(state.validators);
    const validatorCount = validators.length;
    for (let i = 0; i < validatorCount; i++) {
        const validator = validators[i];
        if ((0, util_1.isActiveValidator)(validator, previousEpoch)) {
            previousActiveIndices.push(i);
        }
        if ((0, util_1.isActiveValidator)(validator, currentEpoch)) {
            currentActiveIndices.push(i);
            // We track totalActiveBalanceByIncrement as ETH to fit total network balance in a JS number (53 bits)
            totalActiveBalanceByIncrement += Math.floor(validator.effectiveBalance / lodestar_params_1.EFFECTIVE_BALANCE_INCREMENT);
        }
        if ((0, util_1.isActiveValidator)(validator, nextEpoch)) {
            nextActiveIndices.push(i);
        }
        const { exitEpoch } = validator;
        if (exitEpoch !== lodestar_params_1.FAR_FUTURE_EPOCH) {
            if (exitEpoch > exitQueueEpoch) {
                exitQueueEpoch = exitEpoch;
                exitQueueChurn = 1;
            }
            else if (exitEpoch === exitQueueEpoch) {
                exitQueueChurn += 1;
            }
        }
        // TODO: Should have 0 for not active validators to be re-usable in ForkChoice
        effectiveBalancesArr.push(validator.effectiveBalance);
    }
    const effectiveBalances = persistent_ts_1.MutableVector.from(effectiveBalancesArr);
    // Spec: `EFFECTIVE_BALANCE_INCREMENT` Gwei minimum to avoid divisions by zero
    // 1 = 1 unit of EFFECTIVE_BALANCE_INCREMENT
    if (totalActiveBalanceByIncrement < 1) {
        totalActiveBalanceByIncrement = 1;
    }
    else if (totalActiveBalanceByIncrement >= Number.MAX_SAFE_INTEGER) {
        throw Error("totalActiveBalanceByIncrement >= Number.MAX_SAFE_INTEGER. MAX_EFFECTIVE_BALANCE is too low.");
    }
    const currentShuffling = (0, epochShuffling_1.computeEpochShuffling)(state, currentActiveIndices, currentEpoch);
    const previousShuffling = previousEpoch === currentEpoch
        ? // in case of genesis
            currentShuffling
        : (0, epochShuffling_1.computeEpochShuffling)(state, previousActiveIndices, previousEpoch);
    const nextShuffling = (0, epochShuffling_1.computeEpochShuffling)(state, nextActiveIndices, nextEpoch);
    // Allow to create CachedBeaconState for empty states
    const proposers = state.validators.length > 0 ? computeProposers(state, currentShuffling, effectiveBalances) : [];
    // Only after altair, compute the indices of the current sync committee
    const onAltairFork = currentEpoch >= config.ALTAIR_FORK_EPOCH;
    const totalActiveBalance = BigInt(totalActiveBalanceByIncrement) * BigInt(lodestar_params_1.EFFECTIVE_BALANCE_INCREMENT);
    const syncParticipantReward = onAltairFork ? computeSyncParticipantReward(config, totalActiveBalance) : 0;
    const syncProposerReward = onAltairFork
        ? Math.floor((syncParticipantReward * lodestar_params_1.PROPOSER_WEIGHT) / (lodestar_params_1.WEIGHT_DENOMINATOR - lodestar_params_1.PROPOSER_WEIGHT))
        : 0;
    const baseRewardPerIncrement = onAltairFork ? (0, misc_1.computeBaseRewardPerIncrement)(totalActiveBalanceByIncrement) : 0;
    // Precompute churnLimit for efficient initiateValidatorExit() during block proposing MUST be recompute everytime the
    // active validator indices set changes in size. Validators change active status only when:
    // - validator.activation_epoch is set. Only changes in process_registry_updates() if validator can be activated. If
    //   the value changes it will be set to `epoch + 1 + MAX_SEED_LOOKAHEAD`.
    // - validator.exit_epoch is set. Only changes in initiate_validator_exit() if validator exits. If the value changes,
    //   it will be set to at least `epoch + 1 + MAX_SEED_LOOKAHEAD`.
    // ```
    // is_active_validator = validator.activation_epoch <= epoch < validator.exit_epoch
    // ```
    // So the returned value of is_active_validator(epoch) is guaranteed to not change during `MAX_SEED_LOOKAHEAD` epochs.
    //
    // activeIndices size is dependant on the state epoch. The epoch is advanced after running the epoch transition, and
    // the first block of the epoch process_block() call. So churnLimit must be computed at the end of the before epoch
    // transition and the result is valid until the end of the next epoch transition
    const churnLimit = (0, util_1.getChurnLimit)(config, currentShuffling.activeIndices.length);
    if (exitQueueChurn >= churnLimit) {
        exitQueueEpoch += 1;
        exitQueueChurn = 0;
    }
    return new EpochContext({
        config,
        pubkey2index,
        index2pubkey,
        proposers,
        previousShuffling,
        currentShuffling,
        nextShuffling,
        effectiveBalances,
        syncParticipantReward,
        syncProposerReward,
        baseRewardPerIncrement,
        totalActiveBalanceByIncrement,
        churnLimit,
        exitQueueEpoch,
        exitQueueChurn,
    });
}
exports.createEpochContext = createEpochContext;
/**
 * Checks the pubkey indices against a state and adds missing pubkeys
 *
 * Mutates `pubkey2index` and `index2pubkey`
 *
 * If pubkey caches are empty: SLOW CODE - 🐢
 */
function syncPubkeys(state, pubkey2index, index2pubkey) {
    const currentCount = pubkey2index.size;
    if (currentCount !== index2pubkey.length) {
        throw new Error(`Pubkey indices have fallen out of sync: ${currentCount} != ${index2pubkey.length}`);
    }
    // Get the validators sub tree once for all the loop
    const validators = state.validators;
    const newCount = state.validators.length;
    for (let i = currentCount; i < newCount; i++) {
        const pubkey = validators[i].pubkey.valueOf();
        pubkey2index.set(pubkey, i);
        // Pubkeys must be checked for group + inf. This must be done only once when the validator deposit is processed.
        // Afterwards any public key is the state consider validated.
        // > Do not do any validation here
        index2pubkey.push(bls_1.default.PublicKey.fromBytes(pubkey, bls_1.CoordType.jacobian)); // Optimize for aggregation
    }
}
exports.syncPubkeys = syncPubkeys;
/**
 * Compute proposer indices for an epoch
 */
function computeProposers(state, shuffling, effectiveBalances) {
    const epochSeed = (0, util_1.getSeed)(state, shuffling.epoch, lodestar_params_1.DOMAIN_BEACON_PROPOSER);
    const startSlot = (0, util_1.computeStartSlotAtEpoch)(shuffling.epoch);
    const proposers = [];
    for (let slot = startSlot; slot < startSlot + lodestar_params_1.SLOTS_PER_EPOCH; slot++) {
        proposers.push((0, util_1.computeProposerIndex)(effectiveBalances, shuffling.activeIndices, (0, ssz_1.hash)(Buffer.concat([epochSeed, (0, lodestar_utils_1.intToBytes)(slot, 8)]))));
    }
    return proposers;
}
exports.computeProposers = computeProposers;
/**
 * Same logic in https://github.com/ethereum/eth2.0-specs/blob/v1.1.0-alpha.5/specs/altair/beacon-chain.md#sync-committee-processing
 */
function computeSyncParticipantReward(config, totalActiveBalance) {
    // TODO: manage totalActiveBalance in eth
    const totalActiveIncrements = Number(totalActiveBalance / BigInt(lodestar_params_1.EFFECTIVE_BALANCE_INCREMENT));
    const baseRewardPerIncrement = Math.floor((lodestar_params_1.EFFECTIVE_BALANCE_INCREMENT * lodestar_params_1.BASE_REWARD_FACTOR) / Number((0, lodestar_utils_1.bigIntSqrt)(totalActiveBalance)));
    const totalBaseRewards = baseRewardPerIncrement * totalActiveIncrements;
    const maxParticipantRewards = Math.floor(Math.floor((totalBaseRewards * lodestar_params_1.SYNC_REWARD_WEIGHT) / lodestar_params_1.WEIGHT_DENOMINATOR) / lodestar_params_1.SLOTS_PER_EPOCH);
    return Math.floor(maxParticipantRewards / lodestar_params_1.SYNC_COMMITTEE_SIZE);
}
exports.computeSyncParticipantReward = computeSyncParticipantReward;
/**
 * Called to re-use information, such as the shuffling of the next epoch, after transitioning into a
 * new epoch.
 */
function afterProcessEpoch(state, epochProcess) {
    const { epochCtx } = state;
    epochCtx.previousShuffling = epochCtx.currentShuffling;
    epochCtx.currentShuffling = epochCtx.nextShuffling;
    const currEpoch = epochCtx.currentShuffling.epoch;
    const nextEpoch = currEpoch + 1;
    epochCtx.nextShuffling = (0, epochShuffling_1.computeEpochShuffling)(state, epochProcess.nextEpochShufflingActiveValidatorIndices, nextEpoch);
    epochCtx.proposers = computeProposers(state, epochCtx.currentShuffling, epochCtx.effectiveBalances);
    // TODO: DEDUPLICATE from createEpochContext
    //
    // Precompute churnLimit for efficient initiateValidatorExit() during block proposing MUST be recompute everytime the
    // active validator indices set changes in size. Validators change active status only when:
    // - validator.activation_epoch is set. Only changes in process_registry_updates() if validator can be activated. If
    //   the value changes it will be set to `epoch + 1 + MAX_SEED_LOOKAHEAD`.
    // - validator.exit_epoch is set. Only changes in initiate_validator_exit() if validator exits. If the value changes,
    //   it will be set to at least `epoch + 1 + MAX_SEED_LOOKAHEAD`.
    // ```
    // is_active_validator = validator.activation_epoch <= epoch < validator.exit_epoch
    // ```
    // So the returned value of is_active_validator(epoch) is guaranteed to not change during `MAX_SEED_LOOKAHEAD` epochs.
    //
    // activeIndices size is dependant on the state epoch. The epoch is advanced after running the epoch transition, and
    // the first block of the epoch process_block() call. So churnLimit must be computed at the end of the before epoch
    // transition and the result is valid until the end of the next epoch transition
    epochCtx.churnLimit = (0, util_1.getChurnLimit)(epochCtx.config, epochCtx.currentShuffling.activeIndices.length);
    // Maybe advance exitQueueEpoch at the end of the epoch if there haven't been any exists for a while
    const exitQueueEpoch = (0, util_1.computeActivationExitEpoch)(currEpoch);
    if (exitQueueEpoch > epochCtx.exitQueueEpoch) {
        epochCtx.exitQueueEpoch = exitQueueEpoch;
        epochCtx.exitQueueChurn = 0;
    }
    const totalActiveBalanceByIncrement = epochProcess.nextEpochTotalActiveBalanceByIncrement;
    epochCtx.totalActiveBalanceByIncrement = totalActiveBalanceByIncrement;
    if (currEpoch >= epochCtx.config.ALTAIR_FORK_EPOCH) {
        const totalActiveBalance = BigInt(totalActiveBalanceByIncrement) * BigInt(lodestar_params_1.EFFECTIVE_BALANCE_INCREMENT);
        epochCtx.syncParticipantReward = computeSyncParticipantReward(epochCtx.config, totalActiveBalance);
        epochCtx.syncProposerReward = Math.floor((epochCtx.syncParticipantReward * lodestar_params_1.PROPOSER_WEIGHT) / (lodestar_params_1.WEIGHT_DENOMINATOR - lodestar_params_1.PROPOSER_WEIGHT));
        epochCtx.baseRewardPerIncrement = (0, misc_1.computeBaseRewardPerIncrement)(totalActiveBalanceByIncrement);
    }
}
exports.afterProcessEpoch = afterProcessEpoch;
/**
 * Cached persisted data constant through an epoch attached to a state:
 * - pubkey cache
 * - proposer indexes
 * - shufflings
 *
 * This data is used for faster processing of the beacon-state-transition-function plus gossip and API validation.
 **/
class EpochContext {
    constructor(data) {
        this.config = data.config;
        this.pubkey2index = data.pubkey2index;
        this.index2pubkey = data.index2pubkey;
        this.proposers = data.proposers;
        this.previousShuffling = data.previousShuffling;
        this.currentShuffling = data.currentShuffling;
        this.nextShuffling = data.nextShuffling;
        this.effectiveBalances = data.effectiveBalances;
        this.syncParticipantReward = data.syncParticipantReward;
        this.syncProposerReward = data.syncProposerReward;
        this.baseRewardPerIncrement = data.baseRewardPerIncrement;
        this.totalActiveBalanceByIncrement = data.totalActiveBalanceByIncrement;
        this.churnLimit = data.churnLimit;
        this.exitQueueEpoch = data.exitQueueEpoch;
        this.exitQueueChurn = data.exitQueueChurn;
    }
    /**
     * Copies a given EpochContext while avoiding copying its immutable parts.
     */
    copy() {
        // warning: pubkey cache is not copied, it is shared, as eth1 is not expected to reorder validators.
        // Shallow copy all data from current epoch context to the next
        // All data is completely replaced, or only-appended
        return new EpochContext({
            config: this.config,
            // Common append-only structures shared with all states, no need to clone
            pubkey2index: this.pubkey2index,
            index2pubkey: this.index2pubkey,
            // Immutable data
            proposers: this.proposers,
            previousShuffling: this.previousShuffling,
            currentShuffling: this.currentShuffling,
            nextShuffling: this.nextShuffling,
            // MutableVector, requires cloning
            effectiveBalances: this.effectiveBalances.clone(),
            // Basic types (numbers) cloned implicitly
            syncParticipantReward: this.syncParticipantReward,
            syncProposerReward: this.syncProposerReward,
            baseRewardPerIncrement: this.baseRewardPerIncrement,
            totalActiveBalanceByIncrement: this.totalActiveBalanceByIncrement,
            churnLimit: this.churnLimit,
            exitQueueEpoch: this.exitQueueEpoch,
            exitQueueChurn: this.exitQueueChurn,
        });
    }
    /**
     * Return the beacon committee at slot for index.
     */
    getBeaconCommittee(slot, index) {
        const slotCommittees = this.getShufflingAtSlot(slot).committees[slot % lodestar_params_1.SLOTS_PER_EPOCH];
        if (index >= slotCommittees.length) {
            throw new EpochContextError({
                code: EpochContextErrorCode.COMMITTEE_INDEX_OUT_OF_RANGE,
                index,
                maxIndex: slotCommittees.length,
            });
        }
        return slotCommittees[index];
    }
    getCommitteeCountPerSlot(epoch) {
        return this.getShufflingAtEpoch(epoch).committeesPerSlot;
    }
    getBeaconProposer(slot) {
        const epoch = (0, util_1.computeEpochAtSlot)(slot);
        if (epoch !== this.currentShuffling.epoch) {
            throw new Error(`Requesting beacon proposer for different epoch current shuffling: ${epoch} != ${this.currentShuffling.epoch}`);
        }
        return this.proposers[slot % lodestar_params_1.SLOTS_PER_EPOCH];
    }
    /**
     * Return the indexed attestation corresponding to ``attestation``.
     */
    getIndexedAttestation(attestation) {
        const { aggregationBits, data } = attestation;
        const committeeIndices = this.getBeaconCommittee(data.slot, data.index);
        const attestingIndices = (0, util_1.zipIndexesCommitteeBits)(committeeIndices, aggregationBits);
        // sort in-place
        attestingIndices.sort((a, b) => a - b);
        return {
            attestingIndices: attestingIndices,
            data: data,
            signature: attestation.signature,
        };
    }
    getAttestingIndices(data, bits) {
        const committeeIndices = this.getBeaconCommittee(data.slot, data.index);
        const validatorIndices = (0, util_1.zipIndexesCommitteeBits)(committeeIndices, bits);
        return validatorIndices;
    }
    getCommitteeAssignments(epoch, requestedValidatorIndices) {
        const requestedValidatorIndicesSet = new Set(requestedValidatorIndices);
        const duties = new Map();
        const epochCommittees = this.getShufflingAtEpoch(epoch).committees;
        for (let epochSlot = 0; epochSlot < lodestar_params_1.SLOTS_PER_EPOCH; epochSlot++) {
            const slotCommittees = epochCommittees[epochSlot];
            for (let i = 0, committeesAtSlot = slotCommittees.length; i < committeesAtSlot; i++) {
                for (let j = 0, committeeLength = slotCommittees[i].length; j < committeeLength; j++) {
                    const validatorIndex = slotCommittees[i][j];
                    if (requestedValidatorIndicesSet.has(validatorIndex)) {
                        // no-non-null-assertion: We know that if index is in set there must exist an entry in the map
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        duties.set(validatorIndex, {
                            validatorIndex,
                            committeeLength,
                            committeesAtSlot,
                            validatorCommitteeIndex: j,
                            committeeIndex: i,
                            slot: epoch * lodestar_params_1.SLOTS_PER_EPOCH + epochSlot,
                        });
                    }
                }
            }
        }
        return duties;
    }
    /**
     * Return the committee assignment in the ``epoch`` for ``validator_index``.
     * ``assignment`` returned is a tuple of the following form:
     * ``assignment[0]`` is the list of validators in the committee
     * ``assignment[1]`` is the index to which the committee is assigned
     * ``assignment[2]`` is the slot at which the committee is assigned
     * Return null if no assignment..
     */
    getCommitteeAssignment(epoch, validatorIndex) {
        if (epoch > this.currentShuffling.epoch + 1) {
            throw Error(`Requesting committee assignment for more than 1 epoch ahead: ${epoch} > ${this.currentShuffling.epoch} + 1`);
        }
        const epochStartSlot = (0, util_1.computeStartSlotAtEpoch)(epoch);
        const committeeCountPerSlot = this.getCommitteeCountPerSlot(epoch);
        for (let slot = epochStartSlot; slot < epochStartSlot + lodestar_params_1.SLOTS_PER_EPOCH; slot++) {
            for (let i = 0; i < committeeCountPerSlot; i++) {
                const committee = this.getBeaconCommittee(slot, i);
                if (committee.includes(validatorIndex)) {
                    return {
                        validators: committee,
                        committeeIndex: i,
                        slot,
                    };
                }
            }
        }
        return null;
    }
    isAggregator(slot, index, slotSignature) {
        const committee = this.getBeaconCommittee(slot, index);
        return (0, util_1.isAggregatorFromCommitteeLength)(committee.length, slotSignature);
    }
    addPubkey(index, pubkey) {
        this.pubkey2index.set(pubkey, index);
        this.index2pubkey[index] = bls_1.default.PublicKey.fromBytes(pubkey, bls_1.CoordType.jacobian); // Optimize for aggregation
    }
    getShufflingAtSlot(slot) {
        const epoch = (0, util_1.computeEpochAtSlot)(slot);
        return this.getShufflingAtEpoch(epoch);
    }
    getShufflingAtEpoch(epoch) {
        if (epoch === this.previousShuffling.epoch) {
            return this.previousShuffling;
        }
        else if (epoch === this.currentShuffling.epoch) {
            return this.currentShuffling;
        }
        else if (epoch === this.nextShuffling.epoch) {
            return this.nextShuffling;
        }
        else {
            throw new Error(`Requesting slot committee out of range epoch: ${epoch} current: ${this.currentShuffling.epoch}`);
        }
    }
}
exports.EpochContext = EpochContext;
var EpochContextErrorCode;
(function (EpochContextErrorCode) {
    EpochContextErrorCode["COMMITTEE_INDEX_OUT_OF_RANGE"] = "EPOCH_CONTEXT_ERROR_COMMITTEE_INDEX_OUT_OF_RANGE";
})(EpochContextErrorCode = exports.EpochContextErrorCode || (exports.EpochContextErrorCode = {}));
class EpochContextError extends lodestar_utils_1.LodestarError {
}
exports.EpochContextError = EpochContextError;
//# sourceMappingURL=epochContext.js.map