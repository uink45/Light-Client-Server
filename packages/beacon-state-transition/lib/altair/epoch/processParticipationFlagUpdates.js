"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processParticipationFlagUpdates = void 0;
const persistent_ts_1 = require("@chainsafe/persistent-ts");
/**
 * Updates `state.previousEpochParticipation` with precalculated epoch participation. Creates a new empty tree for
 * `state.currentEpochParticipation`.
 *
 * PERF: Cost = 'proportional' $VALIDATOR_COUNT. Since it updates all of them at once, it will always recreate both
 * trees completely.
 */
function processParticipationFlagUpdates(state) {
    state.previousEpochParticipation.updateAllStatus(state.currentEpochParticipation.persistent.vector);
    state.currentEpochParticipation.updateAllStatus(persistent_ts_1.PersistentVector.from(Array.from({ length: state.validators.length }, () => ({
        timelyHead: false,
        timelySource: false,
        timelyTarget: false,
    }))));
}
exports.processParticipationFlagUpdates = processParticipationFlagUpdates;
//# sourceMappingURL=processParticipationFlagUpdates.js.map