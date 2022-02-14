import { altair } from "@chainsafe/lodestar-types";
import { CachedBeaconState, IEpochProcess } from "../../allForks/util";
/**
 * An aggregate of getFlagIndexDeltas and getInactivityPenaltyDeltas that loop through process.statuses 1 time instead of 4.
 *
 * - On normal mainnet conditions
 *   - prevSourceAttester: 98%
 *   - prevTargetAttester: 96%
 *   - prevHeadAttester:   93%
 *   - currSourceAttester: 95%
 *   - currTargetAttester: 93%
 *   - currHeadAttester:   91%
 *   - unslashed:          100%
 *   - eligibleAttester:   98%
 */
export declare function getRewardsPenaltiesDeltas(state: CachedBeaconState<altair.BeaconState>, process: IEpochProcess): [number[], number[]];
//# sourceMappingURL=balance.d.ts.map