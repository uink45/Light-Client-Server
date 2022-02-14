"use strict";
/**
 * @module chain/stateTransition/util
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeed = exports.getRandaoMix = exports.computeShuffledIndex = void 0;
const ssz_1 = require("@chainsafe/ssz");
const lodestar_utils_1 = require("@chainsafe/lodestar-utils");
const lodestar_params_1 = require("@chainsafe/lodestar-params");
/**
 * Return the shuffled validator index corresponding to ``seed`` (and ``index_count``).
 *
 * Swap or not
 * https://link.springer.com/content/pdf/10.1007%2F978-3-642-32009-5_1.pdf
 *
 * See the 'generalized domain' algorithm on page 3.
 */
function computeShuffledIndex(index, indexCount, seed) {
    let permuted = index;
    lodestar_utils_1.assert.lt(index, indexCount, "indexCount must be less than index");
    lodestar_utils_1.assert.lte(indexCount, 2 ** 40, "indexCount too big");
    const _seed = seed.valueOf();
    for (let i = 0; i < lodestar_params_1.SHUFFLE_ROUND_COUNT; i++) {
        const pivot = Number((0, lodestar_utils_1.bytesToBigInt)((0, ssz_1.hash)(Buffer.concat([_seed, (0, lodestar_utils_1.intToBytes)(i, 1)])).slice(0, 8)) % BigInt(indexCount));
        const flip = (pivot + indexCount - permuted) % indexCount;
        const position = Math.max(permuted, flip);
        const source = (0, ssz_1.hash)(Buffer.concat([_seed, (0, lodestar_utils_1.intToBytes)(i, 1), (0, lodestar_utils_1.intToBytes)(Math.floor(position / 256), 4)]));
        const byte = source[Math.floor((position % 256) / 8)];
        const bit = (byte >> position % 8) % 2;
        permuted = bit ? flip : permuted;
    }
    return permuted;
}
exports.computeShuffledIndex = computeShuffledIndex;
/**
 * Return the randao mix at a recent [[epoch]].
 */
function getRandaoMix(state, epoch) {
    return state.randaoMixes[epoch % lodestar_params_1.EPOCHS_PER_HISTORICAL_VECTOR];
}
exports.getRandaoMix = getRandaoMix;
/**
 * Return the seed at [[epoch]].
 */
function getSeed(state, epoch, domainType) {
    const mix = getRandaoMix(state, epoch + lodestar_params_1.EPOCHS_PER_HISTORICAL_VECTOR - lodestar_params_1.MIN_SEED_LOOKAHEAD - 1);
    return (0, ssz_1.hash)(Buffer.concat([domainType, (0, lodestar_utils_1.intToBytes)(epoch, 8), mix.valueOf()]));
}
exports.getSeed = getSeed;
//# sourceMappingURL=seed.js.map