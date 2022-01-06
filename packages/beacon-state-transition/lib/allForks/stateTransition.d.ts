import { allForks, Slot } from "@chainsafe/lodestar-types";
import { IBeaconStateTransitionMetrics } from "../metrics";
import { CachedBeaconState } from "./util";
/**
 * Implementation Note: follows the optimizations in protolambda's eth2fastspec (https://github.com/protolambda/eth2fastspec)
 */
export declare function stateTransition(state: CachedBeaconState<allForks.BeaconState>, signedBlock: allForks.SignedBeaconBlock, options?: {
    verifyStateRoot?: boolean;
    verifyProposer?: boolean;
    verifySignatures?: boolean;
}, metrics?: IBeaconStateTransitionMetrics | null): CachedBeaconState<allForks.BeaconState>;
/**
 * Multifork capable processBlock()
 *
 * Implementation Note: follows the optimizations in protolambda's eth2fastspec (https://github.com/protolambda/eth2fastspec)
 */
export declare function processBlock(postState: CachedBeaconState<allForks.BeaconState>, block: allForks.BeaconBlock, options?: {
    verifySignatures?: boolean;
}, metrics?: IBeaconStateTransitionMetrics | null): void;
/**
 * Like `processSlots` from the spec but additionally handles fork upgrades
 *
 * Implementation Note: follows the optimizations in protolambda's eth2fastspec (https://github.com/protolambda/eth2fastspec)
 */
export declare function processSlots(state: CachedBeaconState<allForks.BeaconState>, slot: Slot, metrics?: IBeaconStateTransitionMetrics | null): CachedBeaconState<allForks.BeaconState>;
//# sourceMappingURL=stateTransition.d.ts.map