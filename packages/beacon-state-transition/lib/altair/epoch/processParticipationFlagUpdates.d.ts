import { altair } from "@chainsafe/lodestar-types";
import { CachedBeaconState } from "../../allForks/util";
/**
 * Updates `state.previousEpochParticipation` with precalculated epoch participation. Creates a new empty tree for
 * `state.currentEpochParticipation`.
 *
 * PERF: Cost = 'proportional' $VALIDATOR_COUNT. Since it updates all of them at once, it will always recreate both
 * trees completely.
 */
export declare function processParticipationFlagUpdates(state: CachedBeaconState<altair.BeaconState>): void;
//# sourceMappingURL=processParticipationFlagUpdates.d.ts.map