import { allForks } from "@chainsafe/lodestar-types";
import { IEpochProcess, CachedBeaconState } from "../util";
/**
 * Reset eth1DataVotes tree every `EPOCHS_PER_ETH1_VOTING_PERIOD`.
 *
 * PERF: Almost no (constant) cost
 */
export declare function processEth1DataReset(state: CachedBeaconState<allForks.BeaconState>, epochProcess: IEpochProcess): void;
//# sourceMappingURL=processEth1DataReset.d.ts.map