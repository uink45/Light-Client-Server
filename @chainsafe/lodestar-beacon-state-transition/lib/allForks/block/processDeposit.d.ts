import { allForks, phase0 } from "@chainsafe/lodestar-types";
import { ForkName } from "@chainsafe/lodestar-params";
import { CachedBeaconState } from "../../allForks/util";
/**
 * Process a Deposit operation. Potentially adds a new validator to the registry. Mutates the validators and balances
 * trees, pushing contigious values at the end.
 *
 * PERF: Work depends on number of Deposit per block. On regular networks the average is 0 / block.
 */
export declare function processDeposit(fork: ForkName, state: CachedBeaconState<allForks.BeaconState>, deposit: phase0.Deposit): void;
//# sourceMappingURL=processDeposit.d.ts.map