/**
 * @module chain/stateTransition/util
 */
import { IChainConfig } from "@chainsafe/lodestar-config";
import { allForks, Epoch, Slot, SyncPeriod } from "@chainsafe/lodestar-types";
/**
 * Return the epoch number at the given slot.
 */
export declare function computeEpochAtSlot(slot: Slot): Epoch;
/**
 * Return the starting slot of the given epoch.
 */
export declare function computeStartSlotAtEpoch(epoch: Epoch): Slot;
/**
 * Return the epoch at which an activation or exit triggered in ``epoch`` takes effect.
 */
export declare function computeActivationExitEpoch(epoch: Epoch): Epoch;
/**
 * Return the current epoch of the given state.
 */
export declare function getCurrentEpoch(state: allForks.BeaconState): Epoch;
/**
 * Return the previous epoch of the given state.
 */
export declare function getPreviousEpoch(state: allForks.BeaconState): Epoch;
/**
 * Return the sync committee period at slot
 */
export declare function computeSyncPeriodAtSlot(config: IChainConfig, slot: Slot): SyncPeriod;
/**
 * Return the sync committee period at epoch
 */
export declare function computeSyncPeriodAtEpoch(config: IChainConfig, epoch: Epoch): SyncPeriod;
/**
 * Return the sync committee period at slot, without offseting for ALTAIR_FORK_EPOCH
 */
export declare function computeAbsoluteSyncPeriodAtSlot(slot: Slot): SyncPeriod;
//# sourceMappingURL=epoch.d.ts.map