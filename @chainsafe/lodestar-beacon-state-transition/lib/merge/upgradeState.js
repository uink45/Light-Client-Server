"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upgradeState = void 0;
const lodestar_types_1 = require("@chainsafe/lodestar-types");
const util_1 = require("../allForks/util");
/**
 * Upgrade a state from altair to merge.
 */
function upgradeState(state) {
    const { config } = state;
    const postTreeBackedState = upgradeTreeBackedState(config, state);
    // TODO: This seems very sub-optimal, review
    return (0, util_1.createCachedBeaconState)(config, postTreeBackedState);
}
exports.upgradeState = upgradeState;
function upgradeTreeBackedState(config, state) {
    const stateTB = lodestar_types_1.ssz.phase0.BeaconState.createTreeBacked(state.tree);
    // TODO: Does this preserve the hashing cache? In altair devnets memory spikes on the fork transition
    const postState = lodestar_types_1.ssz.merge.BeaconState.createTreeBacked(stateTB.tree);
    postState.fork = {
        previousVersion: stateTB.fork.currentVersion,
        currentVersion: config.MERGE_FORK_VERSION,
        epoch: state.currentShuffling.epoch,
    };
    // Execution-layer
    postState.latestExecutionPayloadHeader = lodestar_types_1.ssz.merge.ExecutionPayloadHeader.defaultTreeBacked();
    return postState;
}
//# sourceMappingURL=upgradeState.js.map