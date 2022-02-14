/**
 * @module chain/stateTransition/util
 */
import { Epoch, Bytes32, DomainType, allForks } from "@chainsafe/lodestar-types";
/**
 * Return the shuffled validator index corresponding to ``seed`` (and ``index_count``).
 *
 * Swap or not
 * https://link.springer.com/content/pdf/10.1007%2F978-3-642-32009-5_1.pdf
 *
 * See the 'generalized domain' algorithm on page 3.
 */
export declare function computeShuffledIndex(index: number, indexCount: number, seed: Bytes32): number;
/**
 * Return the randao mix at a recent [[epoch]].
 */
export declare function getRandaoMix(state: allForks.BeaconState, epoch: Epoch): Bytes32;
/**
 * Return the seed at [[epoch]].
 */
export declare function getSeed(state: allForks.BeaconState, epoch: Epoch, domainType: DomainType): Uint8Array;
//# sourceMappingURL=seed.d.ts.map