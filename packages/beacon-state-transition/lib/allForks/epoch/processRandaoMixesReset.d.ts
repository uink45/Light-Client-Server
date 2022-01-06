import { allForks } from "@chainsafe/lodestar-types";
import { IEpochProcess, CachedBeaconState } from "../util";
/**
 * Write next randaoMix
 *
 * PERF: Almost no (constant) cost
 */
export declare function processRandaoMixesReset(state: CachedBeaconState<allForks.BeaconState>, epochProcess: IEpochProcess): void;
//# sourceMappingURL=processRandaoMixesReset.d.ts.map