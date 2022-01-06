import { allForks, Epoch, Root } from "@chainsafe/lodestar-types";
import { CachedBeaconState } from "../allForks/util/cachedBeaconState";
/**
 * Returns the block root which decided the proposer shuffling for the current epoch. This root
 * can be used to key this proposer shuffling.
 *
 * Returns `null` on the one-off scenario where the genesis block decides its own shuffling.
 * It should be set to the latest block applied to this `state` or the genesis block root.
 */
export declare function proposerShufflingDecisionRoot(state: CachedBeaconState<allForks.BeaconState>): Root | null;
/**
 * Returns the block root which decided the attester shuffling for the given `requestedEpoch`.
 * This root can be used to key that attester shuffling.
 *
 * Returns `null` on the one-off scenario where the genesis block decides its own shuffling.
 * It should be set to the latest block applied to this `state` or the genesis block root.
 */
export declare function attesterShufflingDecisionRoot(state: CachedBeaconState<allForks.BeaconState>, requestedEpoch: Epoch): Root | null;
//# sourceMappingURL=shufflingDecisionRoot.d.ts.map