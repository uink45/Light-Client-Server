import { allForks } from "@chainsafe/lodestar-types";
import { IEpochProcess, CachedBeaconState } from "../util";
/**
 * Persist blockRoots and stateRoots to historicalRoots.
 *
 * PERF: Very low (constant) cost. Most of the HistoricalBatch should already be hashed.
 */
export declare function processHistoricalRootsUpdate(state: CachedBeaconState<allForks.BeaconState>, epochProcess: IEpochProcess): void;
//# sourceMappingURL=processHistoricalRootsUpdate.d.ts.map