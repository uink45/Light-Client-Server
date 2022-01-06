import { allForks } from "@chainsafe/lodestar-types";
import { IEpochProcess, CachedBeaconState } from "../util";
/**
 * Reset the next slashings balance accumulator
 *
 * PERF: Almost no (constant) cost
 */
export declare function processSlashingsReset(state: CachedBeaconState<allForks.BeaconState>, epochProcess: IEpochProcess): void;
//# sourceMappingURL=processSlashingsReset.d.ts.map