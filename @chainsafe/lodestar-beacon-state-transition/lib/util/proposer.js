"use strict";
/**
 * @module chain/stateTransition/util
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeProposerIndex = void 0;
const ssz_1 = require("@chainsafe/ssz");
const lodestar_utils_1 = require("@chainsafe/lodestar-utils");
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const seed_1 = require("./seed");
/**
 * Return from ``indices`` a random index sampled by effective balance.
 *
 * SLOW CODE - 🐢
 */
function computeProposerIndex(effectiveBalances, indices, seed) {
    lodestar_utils_1.assert.gt(indices.length, 0, "Validator indices must not be empty");
    // TODO: Inline outside this function
    const MAX_RANDOM_BYTE = 2 ** 8 - 1;
    let i = 0;
    /* eslint-disable-next-line no-constant-condition */
    while (true) {
        const candidateIndex = indices[(0, seed_1.computeShuffledIndex)(i % indices.length, indices.length, seed)];
        const randByte = (0, ssz_1.hash)(Buffer.concat([seed, (0, lodestar_utils_1.intToBytes)((0, lodestar_utils_1.intDiv)(i, 32), 8)]))[i % 32];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const effectiveBalance = effectiveBalances.get(candidateIndex);
        if (effectiveBalance * MAX_RANDOM_BYTE >= lodestar_params_1.MAX_EFFECTIVE_BALANCE * randByte) {
            return candidateIndex;
        }
        i += 1;
        if (i === indices.length) {
            return -1;
        }
    }
}
exports.computeProposerIndex = computeProposerIndex;
//# sourceMappingURL=proposer.js.map