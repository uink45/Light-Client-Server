import { allForks } from "@chainsafe/lodestar-types";
import { CachedBeaconState } from "../allForks/util";
export declare function getFinalityDelay(state: CachedBeaconState<allForks.BeaconState>): number;
/**
 * If the chain has not been finalized for >4 epochs, the chain enters an "inactivity leak" mode,
 * where inactive validators get progressively penalized more and more, to reduce their influence
 * until blocks get finalized again. See here (https://github.com/ethereum/annotated-spec/blob/master/phase0/beacon-chain.md#inactivity-quotient) for what the inactivity leak is, what it's for and how
 * it works.
 */
export declare function isInInactivityLeak(state: CachedBeaconState<allForks.BeaconState>): boolean;
//# sourceMappingURL=finality.d.ts.map