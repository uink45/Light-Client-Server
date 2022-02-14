import { ByteVector, BitList } from "@chainsafe/ssz";
import { PublicKey } from "@chainsafe/bls";
import { BLSSignature, CommitteeIndex, Epoch, Slot, ValidatorIndex, phase0, allForks, Gwei, Number64 } from "@chainsafe/lodestar-types";
import { IBeaconConfig } from "@chainsafe/lodestar-config";
import { LodestarError } from "@chainsafe/lodestar-utils";
import { MutableVector } from "@chainsafe/persistent-ts";
import { IEpochShuffling } from "./epochShuffling";
import { CachedBeaconState } from "./cachedBeaconState";
import { IEpochProcess } from "./epochProcess";
export declare type AttesterDuty = {
    validatorIndex: ValidatorIndex;
    committeeIndex: CommitteeIndex;
    committeeLength: Number64;
    committeesAtSlot: Number64;
    validatorCommitteeIndex: Number64;
    slot: Slot;
};
export declare type Index2PubkeyCache = PublicKey[];
export declare type EpochContextOpts = {
    pubkey2index?: PubkeyIndexMap;
    index2pubkey?: Index2PubkeyCache;
    skipSyncPubkeys?: boolean;
};
declare type PubkeyHex = string;
export declare class PubkeyIndexMap {
    private readonly map;
    get size(): number;
    get(key: ByteVector | PubkeyHex): ValidatorIndex | undefined;
    set(key: ByteVector | PubkeyHex, value: ValidatorIndex): void;
}
/**
 * Create an epoch cache
 * @param validators cached validators that matches `state.validators`
 *
 * SLOW CODE - 🐢
 */
export declare function createEpochContext(config: IBeaconConfig, state: allForks.BeaconState, opts?: EpochContextOpts): EpochContext;
/**
 * Checks the pubkey indices against a state and adds missing pubkeys
 *
 * Mutates `pubkey2index` and `index2pubkey`
 *
 * If pubkey caches are empty: SLOW CODE - 🐢
 */
export declare function syncPubkeys(state: allForks.BeaconState, pubkey2index: PubkeyIndexMap, index2pubkey: Index2PubkeyCache): void;
/**
 * Compute proposer indices for an epoch
 */
export declare function computeProposers(state: allForks.BeaconState, shuffling: IEpochShuffling, effectiveBalances: MutableVector<number>): number[];
/**
 * Same logic in https://github.com/ethereum/eth2.0-specs/blob/v1.1.0-alpha.5/specs/altair/beacon-chain.md#sync-committee-processing
 */
export declare function computeSyncParticipantReward(config: IBeaconConfig, totalActiveBalance: Gwei): number;
/**
 * Called to re-use information, such as the shuffling of the next epoch, after transitioning into a
 * new epoch.
 */
export declare function afterProcessEpoch(state: CachedBeaconState<allForks.BeaconState>, epochProcess: IEpochProcess): void;
interface IEpochContextData {
    config: IBeaconConfig;
    pubkey2index: PubkeyIndexMap;
    index2pubkey: Index2PubkeyCache;
    proposers: number[];
    previousShuffling: IEpochShuffling;
    currentShuffling: IEpochShuffling;
    nextShuffling: IEpochShuffling;
    effectiveBalances: MutableVector<number>;
    syncParticipantReward: number;
    syncProposerReward: number;
    baseRewardPerIncrement: number;
    totalActiveBalanceByIncrement: number;
    churnLimit: number;
    exitQueueEpoch: Epoch;
    exitQueueChurn: number;
}
/**
 * Cached persisted data constant through an epoch attached to a state:
 * - pubkey cache
 * - proposer indexes
 * - shufflings
 *
 * This data is used for faster processing of the beacon-state-transition-function plus gossip and API validation.
 **/
export declare class EpochContext {
    config: IBeaconConfig;
    /**
     * Unique globally shared pubkey registry. There should only exist one for the entire application.
     *
     * TODO: this is a hack, we need a safety mechanism in case a bad eth1 majority vote is in,
     * or handle non finalized data differently, or use an immutable.js structure for cheap copies
     * Warning: may contain pubkeys that do not yet exist in the current state, but do in a later processed state.
     *
     * $VALIDATOR_COUNT x 192 char String -> Number Map
     */
    pubkey2index: PubkeyIndexMap;
    /**
     * Unique globally shared pubkey registry. There should only exist one for the entire application.
     *
     * Warning: may contain indices that do not yet exist in the current state, but do in a later processed state.
     *
     * $VALIDATOR_COUNT x BLST deserialized pubkey (Jacobian coordinates)
     */
    index2pubkey: Index2PubkeyCache;
    /**
     * Indexes of the block proposers for the current epoch.
     *
     * 32 x Number
     */
    proposers: ValidatorIndex[];
    /**
     * Shuffling of validator indexes. Immutable through the epoch, then it's replaced entirely.
     * Note: Per spec definition, shuffling will always be defined. They are never called before loadState()
     *
     * $VALIDATOR_COUNT x Number
     */
    previousShuffling: IEpochShuffling;
    /** Same as previousShuffling */
    currentShuffling: IEpochShuffling;
    /** Same as previousShuffling */
    nextShuffling: IEpochShuffling;
    /**
     * Effective balances, for altair processAttestations()
     */
    effectiveBalances: MutableVector<number>;
    syncParticipantReward: number;
    syncProposerReward: number;
    /**
     * Update freq: once per epoch after `process_effective_balance_updates()`
     */
    baseRewardPerIncrement: number;
    /**
     * Total active balance for current epoch, to be used instead of getTotalBalance()
     */
    totalActiveBalanceByIncrement: number;
    /**
     * Rate at which validators can enter or leave the set per epoch. Depends only on activeIndexes, so it does not
     * change through the epoch. It's used in initiateValidatorExit(). Must be update after changing active indexes.
     */
    churnLimit: number;
    /**
     * Closest epoch with available churn for validators to exit at. May be updated every block as validators are
     * initiateValidatorExit(). This value may vary on each fork of the state.
     *
     * NOTE: Changes block to block
     */
    exitQueueEpoch: Epoch;
    /**
     * Number of validators initiating an exit at exitQueueEpoch. May be updated every block as validators are
     * initiateValidatorExit(). This value may vary on each fork of the state.
     *
     * NOTE: Changes block to block
     */
    exitQueueChurn: number;
    constructor(data: IEpochContextData);
    /**
     * Copies a given EpochContext while avoiding copying its immutable parts.
     */
    copy(): EpochContext;
    /**
     * Return the beacon committee at slot for index.
     */
    getBeaconCommittee(slot: Slot, index: CommitteeIndex): ValidatorIndex[];
    getCommitteeCountPerSlot(epoch: Epoch): number;
    getBeaconProposer(slot: Slot): ValidatorIndex;
    /**
     * Return the indexed attestation corresponding to ``attestation``.
     */
    getIndexedAttestation(attestation: phase0.Attestation): phase0.IndexedAttestation;
    getAttestingIndices(data: phase0.AttestationData, bits: BitList): ValidatorIndex[];
    getCommitteeAssignments(epoch: Epoch, requestedValidatorIndices: ValidatorIndex[]): Map<ValidatorIndex, AttesterDuty>;
    /**
     * Return the committee assignment in the ``epoch`` for ``validator_index``.
     * ``assignment`` returned is a tuple of the following form:
     * ``assignment[0]`` is the list of validators in the committee
     * ``assignment[1]`` is the index to which the committee is assigned
     * ``assignment[2]`` is the slot at which the committee is assigned
     * Return null if no assignment..
     */
    getCommitteeAssignment(epoch: Epoch, validatorIndex: ValidatorIndex): phase0.CommitteeAssignment | null;
    isAggregator(slot: Slot, index: CommitteeIndex, slotSignature: BLSSignature): boolean;
    addPubkey(index: ValidatorIndex, pubkey: Uint8Array): void;
    getShufflingAtSlot(slot: Slot): IEpochShuffling;
    getShufflingAtEpoch(epoch: Epoch): IEpochShuffling;
}
export declare enum EpochContextErrorCode {
    COMMITTEE_INDEX_OUT_OF_RANGE = "EPOCH_CONTEXT_ERROR_COMMITTEE_INDEX_OUT_OF_RANGE"
}
declare type EpochContextErrorType = {
    code: EpochContextErrorCode.COMMITTEE_INDEX_OUT_OF_RANGE;
    index: number;
    maxIndex: number;
};
export declare class EpochContextError extends LodestarError<EpochContextErrorType> {
}
export {};
//# sourceMappingURL=epochContext.d.ts.map