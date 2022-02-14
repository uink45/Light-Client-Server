"use strict";
/**
 * @module chain/stateTransition/util
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeAbsoluteSyncPeriodAtSlot = exports.computeSyncPeriodAtEpoch = exports.computeSyncPeriodAtSlot = exports.getPreviousEpoch = exports.getCurrentEpoch = exports.computeActivationExitEpoch = exports.computeStartSlotAtEpoch = exports.computeEpochAtSlot = void 0;
const lodestar_params_1 = require("@chainsafe/lodestar-params");
/**
 * Return the epoch number at the given slot.
 */
function computeEpochAtSlot(slot) {
    return Math.floor(slot / lodestar_params_1.SLOTS_PER_EPOCH);
}
exports.computeEpochAtSlot = computeEpochAtSlot;
/**
 * Return the starting slot of the given epoch.
 */
function computeStartSlotAtEpoch(epoch) {
    return epoch * lodestar_params_1.SLOTS_PER_EPOCH;
}
exports.computeStartSlotAtEpoch = computeStartSlotAtEpoch;
/**
 * Return the epoch at which an activation or exit triggered in ``epoch`` takes effect.
 */
function computeActivationExitEpoch(epoch) {
    return epoch + 1 + lodestar_params_1.MAX_SEED_LOOKAHEAD;
}
exports.computeActivationExitEpoch = computeActivationExitEpoch;
/**
 * Return the current epoch of the given state.
 */
function getCurrentEpoch(state) {
    return computeEpochAtSlot(state.slot);
}
exports.getCurrentEpoch = getCurrentEpoch;
/**
 * Return the previous epoch of the given state.
 */
function getPreviousEpoch(state) {
    const currentEpoch = getCurrentEpoch(state);
    if (currentEpoch === lodestar_params_1.GENESIS_EPOCH) {
        return lodestar_params_1.GENESIS_EPOCH;
    }
    return currentEpoch - 1;
}
exports.getPreviousEpoch = getPreviousEpoch;
/**
 * Return the sync committee period at slot
 */
function computeSyncPeriodAtSlot(config, slot) {
    return computeSyncPeriodAtEpoch(config, computeEpochAtSlot(slot));
}
exports.computeSyncPeriodAtSlot = computeSyncPeriodAtSlot;
/**
 * Return the sync committee period at epoch
 */
function computeSyncPeriodAtEpoch(config, epoch) {
    return Math.floor((epoch - config.ALTAIR_FORK_EPOCH) / lodestar_params_1.EPOCHS_PER_SYNC_COMMITTEE_PERIOD);
}
exports.computeSyncPeriodAtEpoch = computeSyncPeriodAtEpoch;
/**
 * Return the sync committee period at slot, without offseting for ALTAIR_FORK_EPOCH
 */
function computeAbsoluteSyncPeriodAtSlot(slot) {
    const epoch = computeEpochAtSlot(slot);
    return Math.floor(epoch / lodestar_params_1.EPOCHS_PER_SYNC_COMMITTEE_PERIOD);
}
exports.computeAbsoluteSyncPeriodAtSlot = computeAbsoluteSyncPeriodAtSlot;
//# sourceMappingURL=epoch.js.map