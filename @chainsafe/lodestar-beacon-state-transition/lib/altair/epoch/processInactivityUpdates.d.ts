import { altair } from "@chainsafe/lodestar-types";
import { CachedBeaconState, IEpochProcess } from "../../allForks/util";
/**
 * Mutates `inactivityScores` from pre-calculated validator statuses.
 *
 * PERF: Cost = iterate over an array of size $VALIDATOR_COUNT + 'proportional' to how many validtors are inactive or
 * have been inactive in the past, i.e. that require an update to their inactivityScore. Worst case = all validators
 * need to update their non-zero `inactivityScore`.
 *
 * - On normal mainnet conditions
 *   - prevTargetAttester: 96%
 *   - unslashed:          100%
 *   - eligibleAttester:   98%
 *
 * TODO: Compute from altair testnet inactivityScores updates on average
 */
export declare function processInactivityUpdates(state: CachedBeaconState<altair.BeaconState>, epochProcess: IEpochProcess): void;
//# sourceMappingURL=processInactivityUpdates.d.ts.map