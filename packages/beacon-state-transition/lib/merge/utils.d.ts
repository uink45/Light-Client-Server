import { allForks, merge } from "@chainsafe/lodestar-types";
/**
 * Execution enabled = merge is done.
 * When (A) state has execution data OR (B) block has execution data
 */
export declare function isExecutionEnabled(state: merge.BeaconState, body: merge.BeaconBlockBody): boolean;
/**
 * Merge block is the SINGLE block that transitions from POW to POS.
 * state has no execution data AND this block has execution data
 */
export declare function isMergeBlock(state: merge.BeaconState, body: merge.BeaconBlockBody): boolean;
/**
 * Merge is complete when the state includes execution layer data:
 * state.latestExecutionPayloadHeader NOT EMPTY
 */
export declare function isMergeComplete(state: merge.BeaconState): boolean;
/** Type guard for merge.BeaconState */
export declare function isMergeStateType(state: allForks.BeaconState): state is merge.BeaconState;
/** Type guard for merge.BeaconBlockBody */
export declare function isMergeBlockBodyType(blockBody: allForks.BeaconBlockBody): blockBody is merge.BeaconBlockBody;
//# sourceMappingURL=utils.d.ts.map