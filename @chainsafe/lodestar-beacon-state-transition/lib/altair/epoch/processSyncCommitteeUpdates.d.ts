import { altair } from "@chainsafe/lodestar-types";
import { CachedBeaconState, IEpochProcess } from "../../allForks/util";
/**
 * Rotate nextSyncCommittee to currentSyncCommittee if sync committee period is over.
 *
 * PERF: Once every `EPOCHS_PER_SYNC_COMMITTEE_PERIOD`, do an expensive operation to compute the next committee.
 * Calculating the next sync committee has a proportional cost to $VALIDATOR_COUNT
 */
export declare function processSyncCommitteeUpdates(state: CachedBeaconState<altair.BeaconState>, epochProcess: IEpochProcess): void;
//# sourceMappingURL=processSyncCommitteeUpdates.d.ts.map