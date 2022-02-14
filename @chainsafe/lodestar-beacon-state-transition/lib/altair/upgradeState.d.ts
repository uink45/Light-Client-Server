import { altair, phase0 } from "@chainsafe/lodestar-types";
import { CachedBeaconState } from "../allForks/util";
/**
 * Upgrade a state from phase0 to altair.
 */
export declare function upgradeState(state: CachedBeaconState<phase0.BeaconState>): CachedBeaconState<altair.BeaconState>;
//# sourceMappingURL=upgradeState.d.ts.map