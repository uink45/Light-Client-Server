"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextSyncCommittee = exports.getNextSyncCommitteeIndices = void 0;
const bls_1 = require("@chainsafe/bls");
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const lodestar_utils_1 = require("@chainsafe/lodestar-utils");
const ssz_1 = require("@chainsafe/ssz");
const util_1 = require("../../util");
const MAX_RANDOM_BYTE = 2 ** 8 - 1;
/**
 * TODO: NAIVE
 *
 * Return the sync committee indices for a given state and epoch.
 * Aligns `epoch` to `baseEpoch` so the result is the same with any `epoch` within a sync period.
 *  Note: This function should only be called at sync committee period boundaries, as
 *  ``get_sync_committee_indices`` is not stable within a given period.
 *
 * SLOW CODE - 🐢
 */
function getNextSyncCommitteeIndices(state, activeValidatorIndices, effectiveBalances) {
    const epoch = (0, util_1.computeEpochAtSlot)(state.slot) + 1;
    const activeValidatorCount = activeValidatorIndices.length;
    const seed = (0, util_1.getSeed)(state, epoch, lodestar_params_1.DOMAIN_SYNC_COMMITTEE);
    let i = 0;
    const syncCommitteeIndices = [];
    while (syncCommitteeIndices.length < lodestar_params_1.SYNC_COMMITTEE_SIZE) {
        const shuffledIndex = (0, util_1.computeShuffledIndex)(i % activeValidatorCount, activeValidatorCount, seed);
        const candidateIndex = activeValidatorIndices[shuffledIndex];
        const randomByte = (0, ssz_1.hash)(Buffer.concat([seed, (0, lodestar_utils_1.intToBytes)((0, lodestar_utils_1.intDiv)(i, 32), 8, "le")]))[i % 32];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const effectiveBalance = effectiveBalances.get(candidateIndex);
        if (effectiveBalance * MAX_RANDOM_BYTE >= lodestar_params_1.MAX_EFFECTIVE_BALANCE * randomByte) {
            syncCommitteeIndices.push(candidateIndex);
        }
        i++;
    }
    return syncCommitteeIndices;
}
exports.getNextSyncCommitteeIndices = getNextSyncCommitteeIndices;
/**
 * Return the sync committee for a given state and epoch.
 *
 * SLOW CODE - 🐢
 */
function getNextSyncCommittee(state, activeValidatorIndices, effectiveBalances) {
    const indices = getNextSyncCommitteeIndices(state, activeValidatorIndices, effectiveBalances);
    // Using the index2pubkey cache is slower because it needs the serialized pubkey.
    const pubkeys = indices.map((index) => state.validators[index].pubkey);
    return {
        pubkeys,
        aggregatePubkey: (0, bls_1.aggregatePublicKeys)(pubkeys.map((pubkey) => pubkey.valueOf())),
    };
}
exports.getNextSyncCommittee = getNextSyncCommittee;
//# sourceMappingURL=syncCommittee.js.map