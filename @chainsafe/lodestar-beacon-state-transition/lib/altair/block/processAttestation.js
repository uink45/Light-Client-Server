"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEpochParticipants = exports.RootCache = exports.getAttestationParticipationStatus = exports.processAttestations = void 0;
const lodestar_types_1 = require("@chainsafe/lodestar-types");
const lodestar_utils_1 = require("@chainsafe/lodestar-utils");
const util_1 = require("../../util");
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const processAttestation_1 = require("../../phase0/block/processAttestation");
const allForks_1 = require("../../allForks");
const PROPOSER_REWARD_DOMINATOR = ((lodestar_params_1.WEIGHT_DENOMINATOR - lodestar_params_1.PROPOSER_WEIGHT) * lodestar_params_1.WEIGHT_DENOMINATOR) / lodestar_params_1.PROPOSER_WEIGHT;
function processAttestations(state, attestations, verifySignature = true) {
    const { epochCtx } = state;
    const { effectiveBalances } = epochCtx;
    const stateSlot = state.slot;
    const rootCache = new RootCache(state);
    // Process all attestations first and then increase the balance of the proposer once
    let proposerReward = 0;
    const previousEpochStatuses = new Map();
    const currentEpochStatuses = new Map();
    for (const attestation of attestations) {
        const data = attestation.data;
        (0, processAttestation_1.validateAttestation)(state, attestation);
        // Retrieve the validator indices from the attestation participation bitfield
        const attestingIndices = epochCtx.getAttestingIndices(data, attestation.aggregationBits);
        // this check is done last because its the most expensive (if signature verification is toggled on)
        // TODO: Why should we verify an indexed attestation that we just created? If it's just for the signature
        // we can verify only that and nothing else.
        if (verifySignature) {
            const sigSet = (0, allForks_1.getAttestationWithIndicesSignatureSet)(state, attestation, attestingIndices);
            if (!(0, util_1.verifySignatureSet)(sigSet)) {
                throw new Error("Attestation signature is not valid");
            }
        }
        const epochParticipation = data.target.epoch === epochCtx.currentShuffling.epoch
            ? state.currentEpochParticipation
            : state.previousEpochParticipation;
        const epochStatuses = data.target.epoch === epochCtx.currentShuffling.epoch ? currentEpochStatuses : previousEpochStatuses;
        const { timelySource, timelyTarget, timelyHead } = getAttestationParticipationStatus(data, stateSlot - data.slot, rootCache, epochCtx);
        // For each participant, update their participation
        // In epoch processing, this participation info is used to calculate balance updates
        let totalBalancesWithWeight = 0;
        for (const index of attestingIndices) {
            const status = epochStatuses.get(index) || epochParticipation.getStatus(index);
            const newStatus = {
                timelySource: status.timelySource || timelySource,
                timelyTarget: status.timelyTarget || timelyTarget,
                timelyHead: status.timelyHead || timelyHead,
            };
            // For normal block, > 90% of attestations belong to current epoch
            // At epoch boundary, 100% of attestations belong to previous epoch
            // so we want to update the participation flag tree in batch
            epochStatuses.set(index, newStatus);
            // epochParticipation.setStatus(index, newStatus);
            /**
             * Spec:
             * baseReward = state.validators[index].effectiveBalance / EFFECTIVE_BALANCE_INCREMENT * baseRewardPerIncrement;
             * proposerRewardNumerator += baseReward * totalWeight
             */
            const tsWeight = !status.timelySource && timelySource ? lodestar_params_1.TIMELY_SOURCE_WEIGHT : 0;
            const ttWeight = !status.timelyTarget && timelyTarget ? lodestar_params_1.TIMELY_TARGET_WEIGHT : 0;
            const thWeight = !status.timelyHead && timelyHead ? lodestar_params_1.TIMELY_HEAD_WEIGHT : 0;
            const totalWeight = tsWeight + ttWeight + thWeight;
            if (totalWeight > 0) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                totalBalancesWithWeight += effectiveBalances.get(index) * totalWeight;
            }
        }
        // Do the discrete math inside the loop to ensure a deterministic result
        const totalIncrements = Math.floor(totalBalancesWithWeight / lodestar_params_1.EFFECTIVE_BALANCE_INCREMENT);
        const proposerRewardNumerator = totalIncrements * state.baseRewardPerIncrement;
        proposerReward += Math.floor(proposerRewardNumerator / PROPOSER_REWARD_DOMINATOR);
    }
    updateEpochParticipants(previousEpochStatuses, state.previousEpochParticipation, epochCtx.previousShuffling.activeIndices.length);
    updateEpochParticipants(currentEpochStatuses, state.currentEpochParticipation, epochCtx.currentShuffling.activeIndices.length);
    (0, util_1.increaseBalance)(state, epochCtx.getBeaconProposer(state.slot), proposerReward);
}
exports.processAttestations = processAttestations;
/**
 * https://github.com/ethereum/eth2.0-specs/blob/v1.1.0-alpha.4/specs/altair/beacon-chain.md#get_attestation_participation_flag_indices
 */
function getAttestationParticipationStatus(data, inclusionDelay, rootCache, epochCtx) {
    const justifiedCheckpoint = data.target.epoch === epochCtx.currentShuffling.epoch
        ? rootCache.currentJustifiedCheckpoint
        : rootCache.previousJustifiedCheckpoint;
    // The source and target votes are part of the FFG vote, the head vote is part of the fork choice vote
    // Both are tracked to properly incentivise validators
    //
    // The source vote always matches the justified checkpoint (else its invalid)
    // The target vote should match the most recent checkpoint (eg: the first root of the epoch)
    // The head vote should match the root at the attestation slot (eg: the root at data.slot)
    const isMatchingSource = lodestar_types_1.ssz.phase0.Checkpoint.equals(data.source, justifiedCheckpoint);
    if (!isMatchingSource) {
        throw new Error(`Attestation source does not equal justified checkpoint: source=${(0, processAttestation_1.checkpointToStr)(data.source)} justifiedCheckpoint=${(0, processAttestation_1.checkpointToStr)(justifiedCheckpoint)}`);
    }
    const isMatchingTarget = lodestar_types_1.ssz.Root.equals(data.target.root, rootCache.getBlockRoot(data.target.epoch));
    // a timely head is only be set if the target is _also_ matching
    const isMatchingHead = isMatchingTarget && lodestar_types_1.ssz.Root.equals(data.beaconBlockRoot, rootCache.getBlockRootAtSlot(data.slot));
    return {
        timelySource: isMatchingSource && inclusionDelay <= (0, lodestar_utils_1.intSqrt)(lodestar_params_1.SLOTS_PER_EPOCH),
        timelyTarget: isMatchingTarget && inclusionDelay <= lodestar_params_1.SLOTS_PER_EPOCH,
        timelyHead: isMatchingHead && inclusionDelay === lodestar_params_1.MIN_ATTESTATION_INCLUSION_DELAY,
    };
}
exports.getAttestationParticipationStatus = getAttestationParticipationStatus;
/**
 * Cache to prevent accessing the state tree to fetch block roots repeteadly.
 * In normal network conditions the same root is read multiple times, specially the target.
 */
class RootCache {
    constructor(state) {
        this.state = state;
        this.blockRootEpochCache = new Map();
        this.blockRootSlotCache = new Map();
        this.currentJustifiedCheckpoint = state.currentJustifiedCheckpoint;
        this.previousJustifiedCheckpoint = state.previousJustifiedCheckpoint;
    }
    getBlockRoot(epoch) {
        let root = this.blockRootEpochCache.get(epoch);
        if (!root) {
            root = (0, util_1.getBlockRoot)(this.state, epoch);
            this.blockRootEpochCache.set(epoch, root);
        }
        return root;
    }
    getBlockRootAtSlot(slot) {
        let root = this.blockRootSlotCache.get(slot);
        if (!root) {
            root = (0, util_1.getBlockRootAtSlot)(this.state, slot);
            this.blockRootSlotCache.set(slot, root);
        }
        return root;
    }
}
exports.RootCache = RootCache;
function updateEpochParticipants(epochStatuses, epochParticipation, numActiveValidators) {
    // all active validators are attesters, there are 32 slots per epoch
    // if 1/2 of that or more are updated status, do that in batch, see the benchmark for more details
    if (epochStatuses.size >= numActiveValidators / (2 * lodestar_params_1.SLOTS_PER_EPOCH)) {
        const transientVector = epochParticipation.persistent.asTransient();
        for (const [index, status] of epochStatuses.entries()) {
            transientVector.set(index, status);
        }
        epochParticipation.updateAllStatus(transientVector.vector);
    }
    else {
        for (const [index, status] of epochStatuses.entries()) {
            epochParticipation.setStatus(index, status);
        }
    }
}
exports.updateEpochParticipants = updateEpochParticipants;
//# sourceMappingURL=processAttestation.js.map