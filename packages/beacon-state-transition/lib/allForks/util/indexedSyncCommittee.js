"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndexedSyncCommittee = exports.computeSyncComitteeMap = exports.convertToIndexedSyncCommittee = exports.createIndexedSyncCommittee = exports.emptyIndexedSyncCommittee = exports.IndexedSyncCommittee = void 0;
const lodestar_types_1 = require("@chainsafe/lodestar-types");
const epoch_1 = require("../../util/epoch");
/**
 * A sync committee with additional index data.
 *
 * TODO: Rename to CachedSyncCommittee for consistency with other structures
 */
class IndexedSyncCommittee {
    constructor(treeBacked, validatorIndices, validatorIndexMap) {
        this.treeBacked = treeBacked;
        this.pubkeys = treeBacked.pubkeys;
        this.aggregatePubkey = treeBacked.aggregatePubkey;
        this.validatorIndices = validatorIndices;
        this.validatorIndexMap = validatorIndexMap;
    }
    /**
     * clone() shares the same index data.
     */
    clone() {
        return new IndexedSyncCommittee(this.treeBacked.clone(), this.validatorIndices, this.validatorIndexMap);
    }
}
exports.IndexedSyncCommittee = IndexedSyncCommittee;
exports.emptyIndexedSyncCommittee = new IndexedSyncCommittee(lodestar_types_1.ssz.altair.SyncCommittee.defaultTreeBacked(), [], new Map());
function createIndexedSyncCommittee(pubkey2index, state, isNext) {
    const syncCommittee = isNext ? state.nextSyncCommittee : state.currentSyncCommittee;
    return convertToIndexedSyncCommittee(syncCommittee, pubkey2index);
}
exports.createIndexedSyncCommittee = createIndexedSyncCommittee;
function convertToIndexedSyncCommittee(syncCommittee, pubkey2index) {
    const validatorIndices = computeSyncCommitteeIndices(syncCommittee, pubkey2index);
    const validatorIndexMap = computeSyncComitteeMap(validatorIndices);
    return new IndexedSyncCommittee(syncCommittee, validatorIndices, validatorIndexMap);
}
exports.convertToIndexedSyncCommittee = convertToIndexedSyncCommittee;
/**
 * Compute all index in sync committee for all validatorIndexes in `syncCommitteeIndexes`.
 * Helps reduce work necessary to verify a validatorIndex belongs in a sync committee and which.
 * This is similar to compute_subnets_for_sync_committee in https://github.com/ethereum/eth2.0-specs/blob/v1.1.0-alpha.5/specs/altair/validator.md
 */
function computeSyncComitteeMap(syncCommitteeIndexes) {
    const map = new Map();
    for (let i = 0, len = syncCommitteeIndexes.length; i < len; i++) {
        const validatorIndex = syncCommitteeIndexes[i];
        let indexes = map.get(validatorIndex);
        if (!indexes) {
            indexes = [];
            map.set(validatorIndex, indexes);
        }
        if (!indexes.includes(i)) {
            indexes.push(i);
        }
    }
    return map;
}
exports.computeSyncComitteeMap = computeSyncComitteeMap;
/**
 * Extract validator indices from current and next sync committee
 */
function computeSyncCommitteeIndices(syncCommittee, pubkey2index) {
    const result = [];
    for (const pubkey of syncCommittee.pubkeys) {
        const validatorIndex = pubkey2index.get(pubkey.valueOf());
        if (validatorIndex !== undefined) {
            result.push(validatorIndex);
        }
    }
    return result;
}
/**
 * Note: The range of slots a validator has to perform duties is off by one.
 * The previous slot wording means that if your validator is in a sync committee for a period that runs from slot
 * 100 to 200,then you would actually produce signatures in slot 99 - 199.
 */
function getIndexedSyncCommittee(state, slot) {
    const statePeriod = (0, epoch_1.computeAbsoluteSyncPeriodAtSlot)(state.slot);
    const slotPeriod = (0, epoch_1.computeAbsoluteSyncPeriodAtSlot)(slot + 1); // See note above for the +1 offset
    if (slotPeriod === statePeriod) {
        return state.currentSyncCommittee;
    }
    else if (slotPeriod === statePeriod + 1) {
        return state.nextSyncCommittee;
    }
    else {
        throw new Error(`State ${state.slot} does not contain sync committee for slot ${slot}`);
    }
}
exports.getIndexedSyncCommittee = getIndexedSyncCommittee;
//# sourceMappingURL=indexedSyncCommittee.js.map