import { CachedBeaconState } from "@chainsafe/lodestar-beacon-state-transition";
import { allForks, phase0 } from "@chainsafe/lodestar-types";
/**
 * Compute a Checkpoint type from `state.latestBlockHeader`
 */
export declare function getCheckpointFromState(checkpointState: CachedBeaconState<allForks.BeaconState>): phase0.Checkpoint;
//# sourceMappingURL=checkpoint.d.ts.map