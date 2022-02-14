"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSyncCommitteeUpdates = void 0;
const lodestar_params_1 = require("@chainsafe/lodestar-params");
/**
 * Rotate nextSyncCommittee to currentSyncCommittee if sync committee period is over.
 *
 * PERF: Once every `EPOCHS_PER_SYNC_COMMITTEE_PERIOD`, do an expensive operation to compute the next committee.
 * Calculating the next sync committee has a proportional cost to $VALIDATOR_COUNT
 */
function processSyncCommitteeUpdates(state, epochProcess) {
    const nextEpoch = epochProcess.currentEpoch + 1;
    if (nextEpoch % lodestar_params_1.EPOCHS_PER_SYNC_COMMITTEE_PERIOD === 0) {
        state.rotateSyncCommittee();
    }
}
exports.processSyncCommitteeUpdates = processSyncCommitteeUpdates;
//# sourceMappingURL=processSyncCommitteeUpdates.js.map