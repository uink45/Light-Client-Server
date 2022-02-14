"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMergeBlockBodyType = exports.isMergeStateType = exports.isMergeComplete = exports.isMergeBlock = exports.isExecutionEnabled = void 0;
const lodestar_types_1 = require("@chainsafe/lodestar-types");
/**
 * Execution enabled = merge is done.
 * When (A) state has execution data OR (B) block has execution data
 */
function isExecutionEnabled(state, body) {
    return (isMergeComplete(state) ||
        !lodestar_types_1.ssz.merge.ExecutionPayload.equals(body.executionPayload, lodestar_types_1.ssz.merge.ExecutionPayload.defaultValue()));
}
exports.isExecutionEnabled = isExecutionEnabled;
/**
 * Merge block is the SINGLE block that transitions from POW to POS.
 * state has no execution data AND this block has execution data
 */
function isMergeBlock(state, body) {
    return (!isMergeComplete(state) &&
        !lodestar_types_1.ssz.merge.ExecutionPayload.equals(body.executionPayload, lodestar_types_1.ssz.merge.ExecutionPayload.defaultValue()));
}
exports.isMergeBlock = isMergeBlock;
/**
 * Merge is complete when the state includes execution layer data:
 * state.latestExecutionPayloadHeader NOT EMPTY
 */
function isMergeComplete(state) {
    return !lodestar_types_1.ssz.merge.ExecutionPayloadHeader.equals(state.latestExecutionPayloadHeader, lodestar_types_1.ssz.merge.ExecutionPayloadHeader.defaultTreeBacked());
}
exports.isMergeComplete = isMergeComplete;
/** Type guard for merge.BeaconState */
function isMergeStateType(state) {
    return state.latestExecutionPayloadHeader !== undefined;
}
exports.isMergeStateType = isMergeStateType;
/** Type guard for merge.BeaconBlockBody */
function isMergeBlockBodyType(blockBody) {
    return blockBody.executionPayload !== undefined;
}
exports.isMergeBlockBodyType = isMergeBlockBodyType;
//# sourceMappingURL=utils.js.map