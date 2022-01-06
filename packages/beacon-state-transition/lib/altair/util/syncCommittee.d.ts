import { altair, ValidatorIndex, allForks } from "@chainsafe/lodestar-types";
import { MutableVector } from "@chainsafe/persistent-ts";
/**
 * TODO: NAIVE
 *
 * Return the sync committee indices for a given state and epoch.
 * Aligns `epoch` to `baseEpoch` so the result is the same with any `epoch` within a sync period.
 *  Note: This function should only be called at sync committee period boundaries, as
 *  ``get_sync_committee_indices`` is not stable within a given period.
 *
 * SLOW CODE - 🐢
 */
export declare function getNextSyncCommitteeIndices(state: allForks.BeaconState, activeValidatorIndices: ValidatorIndex[], effectiveBalances: MutableVector<number>): ValidatorIndex[];
/**
 * Return the sync committee for a given state and epoch.
 *
 * SLOW CODE - 🐢
 */
export declare function getNextSyncCommittee(state: allForks.BeaconState, activeValidatorIndices: ValidatorIndex[], effectiveBalances: MutableVector<number>): altair.SyncCommittee;
//# sourceMappingURL=syncCommittee.d.ts.map