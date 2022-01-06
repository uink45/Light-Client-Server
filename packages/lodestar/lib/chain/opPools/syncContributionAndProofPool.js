"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregate = exports.contributionToFast = exports.replaceIfBetter = exports.SyncContributionAndProofPool = void 0;
const bls_1 = __importDefault(require("@chainsafe/bls"));
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const lodestar_types_1 = require("@chainsafe/lodestar-types");
const lodestar_beacon_state_transition_1 = require("@chainsafe/lodestar-beacon-state-transition");
const ssz_1 = require("@chainsafe/ssz");
const map_1 = require("../../util/map");
const types_1 = require("./types");
const utils_1 = require("./utils");
/**
 * SyncCommittee aggregates are only useful for the next block they have signed.
 */
const SLOTS_RETAINED = 8;
/**
 * The maximum number of distinct `SyncAggregateFast` that will be stored in each slot.
 *
 * This is a DoS protection measure.
 */
const MAX_ITEMS_PER_SLOT = 512;
/**
 * Cache SyncCommitteeContribution and seen ContributionAndProof.
 * This is used for SignedContributionAndProof validation and block factory.
 * This stays in-memory and should be pruned per slot.
 */
class SyncContributionAndProofPool {
    constructor() {
        this.bestContributionBySubnetRootSlot = new map_1.MapDef(() => new map_1.MapDef(() => new Map()));
        this.lowestPermissibleSlot = 0;
    }
    /**
     * Only call this once we pass all validation.
     */
    add(contributionAndProof) {
        const { contribution } = contributionAndProof;
        const { slot, beaconBlockRoot } = contribution;
        const rootHex = (0, ssz_1.toHexString)(beaconBlockRoot);
        const lowestPermissibleSlot = this.lowestPermissibleSlot;
        // Reject if too old.
        if (slot < lowestPermissibleSlot) {
            throw new types_1.OpPoolError({ code: types_1.OpPoolErrorCode.SLOT_TOO_LOW, slot, lowestPermissibleSlot });
        }
        // Limit object per slot
        const bestContributionBySubnetByRoot = this.bestContributionBySubnetRootSlot.getOrDefault(slot);
        if (bestContributionBySubnetByRoot.size >= MAX_ITEMS_PER_SLOT) {
            throw new types_1.OpPoolError({ code: types_1.OpPoolErrorCode.REACHED_MAX_PER_SLOT });
        }
        const bestContributionBySubnet = bestContributionBySubnetByRoot.getOrDefault(rootHex);
        const subnet = contribution.subCommitteeIndex;
        const bestContribution = bestContributionBySubnet.get(subnet);
        if (bestContribution) {
            return replaceIfBetter(bestContribution, contribution);
        }
        else {
            bestContributionBySubnet.set(subnet, contributionToFast(contribution));
            return types_1.InsertOutcome.NewData;
        }
    }
    /**
     * This is for the block factory, the same to process_sync_committee_contributions in the spec.
     */
    getAggregate(slot, prevBlockRoot) {
        var _a;
        const bestContributionBySubnet = (_a = this.bestContributionBySubnetRootSlot.get(slot)) === null || _a === void 0 ? void 0 : _a.get((0, ssz_1.toHexString)(prevBlockRoot));
        if (!bestContributionBySubnet || bestContributionBySubnet.size === 0) {
            // TODO: Add metric for missing SyncAggregate
            // Must return signature as G2_POINT_AT_INFINITY when participating bits are empty
            // https://github.com/ethereum/eth2.0-specs/blob/30f2a076377264677e27324a8c3c78c590ae5e20/specs/altair/bls.md#eth2_fast_aggregate_verify
            return {
                syncCommitteeBits: lodestar_types_1.ssz.altair.SyncCommitteeBits.defaultValue(),
                syncCommitteeSignature: lodestar_beacon_state_transition_1.G2_POINT_AT_INFINITY,
            };
        }
        return aggregate(bestContributionBySubnet);
    }
    /**
     * Prune per head slot.
     * SyncCommittee aggregates are only useful for the next block they have signed.
     * We don't want to prune by clock slot in case there's a long period of skipped slots.
     */
    prune(headSlot) {
        (0, utils_1.pruneBySlot)(this.bestContributionBySubnetRootSlot, headSlot, SLOTS_RETAINED);
        this.lowestPermissibleSlot = Math.max(headSlot - SLOTS_RETAINED, 0);
    }
}
exports.SyncContributionAndProofPool = SyncContributionAndProofPool;
/**
 * Mutate bestContribution if new contribution has more participants
 */
function replaceIfBetter(bestContribution, contribution) {
    const { numParticipants } = bestContribution;
    const subnetSize = Math.floor(lodestar_params_1.SYNC_COMMITTEE_SIZE / lodestar_params_1.SYNC_COMMITTEE_SUBNET_COUNT);
    const newSyncSubCommitteeBits = (0, lodestar_beacon_state_transition_1.newFilledArray)(subnetSize, false);
    let newNumParticipants = 0;
    for (const [index, participated] of Array.from((0, ssz_1.readonlyValues)(contribution.aggregationBits)).entries()) {
        if (participated) {
            newSyncSubCommitteeBits[index] = true;
            newNumParticipants++;
        }
    }
    if (newNumParticipants <= numParticipants) {
        return types_1.InsertOutcome.NotBetterThan;
    }
    bestContribution.syncSubCommitteeBits = newSyncSubCommitteeBits;
    bestContribution.numParticipants = newNumParticipants;
    bestContribution.syncSubCommitteeSignature = bls_1.default.Signature.fromBytes(contribution.signature.valueOf(), undefined, true);
    return types_1.InsertOutcome.NewData;
}
exports.replaceIfBetter = replaceIfBetter;
/**
 * Format `contribution` into an efficient data structure to aggregate later.
 */
function contributionToFast(contribution) {
    const subnetSize = Math.floor(lodestar_params_1.SYNC_COMMITTEE_SIZE / lodestar_params_1.SYNC_COMMITTEE_SUBNET_COUNT);
    const syncSubCommitteeBits = (0, lodestar_beacon_state_transition_1.newFilledArray)(subnetSize, false);
    let numParticipants = 0;
    for (const [index, participated] of Array.from((0, ssz_1.readonlyValues)(contribution.aggregationBits)).entries()) {
        if (participated) {
            syncSubCommitteeBits[index] = true;
            numParticipants++;
        }
    }
    return {
        syncSubCommitteeBits,
        numParticipants,
        syncSubCommitteeSignature: bls_1.default.Signature.fromBytes(contribution.signature.valueOf(), undefined, true),
    };
}
exports.contributionToFast = contributionToFast;
/**
 * Aggregate best contributions of each subnet into SyncAggregate
 * @returns SyncAggregate to be included in block body.
 */
function aggregate(bestContributionBySubnet) {
    // check for empty/undefined bestContributionBySubnet earlier
    const syncCommitteeBits = (0, lodestar_beacon_state_transition_1.newFilledArray)(lodestar_params_1.SYNC_COMMITTEE_SIZE, false);
    const subnetSize = Math.floor(lodestar_params_1.SYNC_COMMITTEE_SIZE / lodestar_params_1.SYNC_COMMITTEE_SUBNET_COUNT);
    const signatures = [];
    for (const [subnet, bestContribution] of bestContributionBySubnet.entries()) {
        const indexOffset = subnet * subnetSize;
        for (const [index, participated] of bestContribution.syncSubCommitteeBits.entries()) {
            if (participated)
                syncCommitteeBits[indexOffset + index] = true;
        }
        signatures.push(bestContribution.syncSubCommitteeSignature);
    }
    return {
        syncCommitteeBits,
        syncCommitteeSignature: bls_1.default.Signature.aggregate(signatures).toBytes(),
    };
}
exports.aggregate = aggregate;
//# sourceMappingURL=syncContributionAndProofPool.js.map