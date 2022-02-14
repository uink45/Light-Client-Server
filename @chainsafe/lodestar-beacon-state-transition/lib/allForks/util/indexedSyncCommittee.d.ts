import { altair, allForks, Slot, ValidatorIndex, BLSPubkey } from "@chainsafe/lodestar-types";
import { TreeBacked, Vector } from "@chainsafe/ssz";
import { CachedBeaconState } from "./cachedBeaconState";
import { PubkeyIndexMap } from "./epochContext";
declare type SyncComitteeValidatorIndexMap = Map<ValidatorIndex, number[]>;
/**
 * A sync committee with additional index data.
 *
 * TODO: Rename to CachedSyncCommittee for consistency with other structures
 */
export declare class IndexedSyncCommittee implements altair.SyncCommittee {
    treeBacked: TreeBacked<altair.SyncCommittee>;
    pubkeys: Vector<BLSPubkey>;
    aggregatePubkey: BLSPubkey;
    /**
     * Update freq: every ~ 27h.
     * Memory cost: 512 Number integers.
     */
    validatorIndices: ValidatorIndex[];
    /**
     * Update freq: every ~ 27h.
     * Memory cost: Map of Number -> Number with 512 entries.
     */
    validatorIndexMap: SyncComitteeValidatorIndexMap;
    constructor(treeBacked: TreeBacked<altair.SyncCommittee>, validatorIndices: ValidatorIndex[], validatorIndexMap: SyncComitteeValidatorIndexMap);
    /**
     * clone() shares the same index data.
     */
    clone(): IndexedSyncCommittee;
}
export declare const emptyIndexedSyncCommittee: IndexedSyncCommittee;
export declare function createIndexedSyncCommittee(pubkey2index: PubkeyIndexMap, state: TreeBacked<altair.BeaconState>, isNext: boolean): IndexedSyncCommittee;
export declare function convertToIndexedSyncCommittee(syncCommittee: TreeBacked<altair.SyncCommittee>, pubkey2index: PubkeyIndexMap): IndexedSyncCommittee;
/**
 * Compute all index in sync committee for all validatorIndexes in `syncCommitteeIndexes`.
 * Helps reduce work necessary to verify a validatorIndex belongs in a sync committee and which.
 * This is similar to compute_subnets_for_sync_committee in https://github.com/ethereum/eth2.0-specs/blob/v1.1.0-alpha.5/specs/altair/validator.md
 */
export declare function computeSyncComitteeMap(syncCommitteeIndexes: ValidatorIndex[]): SyncComitteeValidatorIndexMap;
/**
 * Note: The range of slots a validator has to perform duties is off by one.
 * The previous slot wording means that if your validator is in a sync committee for a period that runs from slot
 * 100 to 200,then you would actually produce signatures in slot 99 - 199.
 */
export declare function getIndexedSyncCommittee(state: CachedBeaconState<allForks.BeaconState> | CachedBeaconState<altair.BeaconState>, slot: Slot): IndexedSyncCommittee;
export {};
//# sourceMappingURL=indexedSyncCommittee.d.ts.map