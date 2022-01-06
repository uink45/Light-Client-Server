import { allForks } from "@chainsafe/lodestar-types";
import { CachedBeaconState, IEpochProcess } from "../util";
/**
 * Update justified and finalized checkpoints depending on network participation.
 *
 * PERF: Very low (constant) cost. Persist small objects to the tree.
 */
export declare function processJustificationAndFinalization(state: CachedBeaconState<allForks.BeaconState>, epochProcess: IEpochProcess): void;
//# sourceMappingURL=processJustificationAndFinalization.d.ts.map