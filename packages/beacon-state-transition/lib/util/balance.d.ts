/**
 * @module chain/stateTransition/util
 */
import { allForks, altair, Gwei, ValidatorIndex } from "@chainsafe/lodestar-types";
import { CachedBeaconState } from "../allForks";
/**
 * Return the combined effective balance of the [[indices]].
 * `EFFECTIVE_BALANCE_INCREMENT` Gwei minimum to avoid divisions by zero.
 *
 * SLOW CODE - 🐢
 */
export declare function getTotalBalance(state: allForks.BeaconState, indices: ValidatorIndex[]): Gwei;
/**
 * Increase the balance for a validator with the given ``index`` by ``delta``.
 */
export declare function increaseBalance(state: CachedBeaconState<allForks.BeaconState> | CachedBeaconState<altair.BeaconState>, index: ValidatorIndex, delta: number): void;
/**
 * Decrease the balance for a validator with the given ``index`` by ``delta``.
 *
 * Set to ``0`` when underflow.
 */
export declare function decreaseBalance(state: CachedBeaconState<allForks.BeaconState> | CachedBeaconState<altair.BeaconState>, index: ValidatorIndex, delta: number): void;
/**
 * This method is used to get justified balances from a justified state.
 * This is consumed by forkchoice which based on delta so we return "by increment" (in ether) value,
 * ie [30, 31, 32] instead of [30e9, 31e9, 32e9]
 */
export declare function getEffectiveBalances(justifiedState: CachedBeaconState<allForks.BeaconState>): number[];
//# sourceMappingURL=balance.d.ts.map