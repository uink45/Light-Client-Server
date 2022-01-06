import { altair, merge } from "@chainsafe/lodestar-types";
import { CachedBeaconState } from "../allForks/util";
/**
 * Upgrade a state from altair to merge.
 */
export declare function upgradeState(state: CachedBeaconState<altair.BeaconState>): CachedBeaconState<merge.BeaconState>;
//# sourceMappingURL=upgradeState.d.ts.map