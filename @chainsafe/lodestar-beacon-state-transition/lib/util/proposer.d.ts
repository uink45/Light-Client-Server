/**
 * @module chain/stateTransition/util
 */
import { ValidatorIndex } from "@chainsafe/lodestar-types";
import { MutableVector } from "@chainsafe/persistent-ts";
/**
 * Return from ``indices`` a random index sampled by effective balance.
 *
 * SLOW CODE - 🐢
 */
export declare function computeProposerIndex(effectiveBalances: MutableVector<number>, indices: ValidatorIndex[], seed: Uint8Array): ValidatorIndex;
//# sourceMappingURL=proposer.d.ts.map