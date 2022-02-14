import { phase0 } from "@chainsafe/lodestar-types";
import { CachedBeaconState, IEpochProcess } from "../../allForks/util";
/**
 * Iterate over all validator and compute rewards and penalties to apply to balances.
 *
 * PERF: Cost = 'proportional' to $VALIDATOR_COUNT. Extra work is done per validator the more status flags
 * are true, worst case: FLAG_UNSLASHED + FLAG_ELIGIBLE_ATTESTER + FLAG_PREV_*
 */
export declare function processRewardsAndPenalties(state: CachedBeaconState<phase0.BeaconState>, epochProcess: IEpochProcess): void;
//# sourceMappingURL=processRewardsAndPenalties.d.ts.map