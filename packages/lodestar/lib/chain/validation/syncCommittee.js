"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGossipSyncCommitteeExceptSig = exports.validateSyncCommitteeSigOnly = exports.validateGossipSyncCommittee = void 0;
const lodestar_beacon_state_transition_1 = require("@chainsafe/lodestar-beacon-state-transition");
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const errors_1 = require("../errors");
const signatureSets_1 = require("./signatureSets");
/**
 * Spec v1.1.0-alpha.8
 */
async function validateGossipSyncCommittee(chain, syncCommittee, subnet) {
    const { slot, validatorIndex } = syncCommittee;
    const headState = chain.getHeadState();
    const indexInSubCommittee = validateGossipSyncCommitteeExceptSig(chain, headState, subnet, syncCommittee);
    // [IGNORE] The signature's slot is for the current slot, i.e. sync_committee_signature.slot == current_slot.
    // > Checked in validateGossipSyncCommitteeExceptSig()
    // [REJECT] The subnet_id is valid for the given validator, i.e. subnet_id in compute_subnets_for_sync_committee(state,
    // sync_committee_message.validator_index). Note this validation implies the validator is part of the broader current
    // sync committee along with the correct subcommittee.
    // > Checked in validateGossipSyncCommitteeExceptSig()
    // [IGNORE] There has been no other valid sync committee signature for the declared slot for the validator referenced
    // by sync_committee_signature.validator_index.
    if (chain.seenSyncCommitteeMessages.isKnown(slot, subnet, validatorIndex)) {
        throw new errors_1.SyncCommitteeError(errors_1.GossipAction.IGNORE, {
            code: errors_1.SyncCommitteeErrorCode.SYNC_COMMITTEE_ALREADY_KNOWN,
        });
    }
    // [REJECT] The subnet_id is valid for the given validator, i.e. subnet_id in compute_subnets_for_sync_committee(state, sync_committee_signature.validator_index).
    // Note this validation implies the validator is part of the broader current sync committee along with the correct subcommittee.
    // > Checked in validateGossipSyncCommitteeExceptSig()
    // [REJECT] The signature is valid for the message beacon_block_root for the validator referenced by validator_index.
    await validateSyncCommitteeSigOnly(chain, headState, syncCommittee);
    // Register this valid item as seen
    chain.seenSyncCommitteeMessages.add(slot, subnet, validatorIndex);
    return { indexInSubCommittee };
}
exports.validateGossipSyncCommittee = validateGossipSyncCommittee;
/**
 * Abstracted so it can be re-used in API validation.
 */
async function validateSyncCommitteeSigOnly(chain, headState, syncCommittee) {
    const signatureSet = (0, signatureSets_1.getSyncCommitteeSignatureSet)(headState, syncCommittee);
    if (!(await chain.bls.verifySignatureSets([signatureSet], { batchable: true }))) {
        throw new errors_1.SyncCommitteeError(errors_1.GossipAction.REJECT, {
            code: errors_1.SyncCommitteeErrorCode.INVALID_SIGNATURE,
        });
    }
}
exports.validateSyncCommitteeSigOnly = validateSyncCommitteeSigOnly;
/**
 * Spec v1.1.0-alpha.8
 */
function validateGossipSyncCommitteeExceptSig(chain, headState, subnet, data) {
    const { slot, validatorIndex } = data;
    // [IGNORE] The signature's slot is for the current slot, i.e. sync_committee_signature.slot == current_slot.
    // (with a MAXIMUM_GOSSIP_CLOCK_DISPARITY allowance)
    if (!chain.clock.isCurrentSlotGivenGossipDisparity(slot)) {
        throw new errors_1.SyncCommitteeError(errors_1.GossipAction.IGNORE, {
            code: errors_1.SyncCommitteeErrorCode.NOT_CURRENT_SLOT,
            currentSlot: chain.clock.currentSlot,
            slot,
        });
    }
    // [REJECT] The subcommittee index is in the allowed range, i.e. contribution.subcommittee_index < SYNC_COMMITTEE_SUBNET_COUNT.
    if (subnet >= lodestar_params_1.SYNC_COMMITTEE_SUBNET_COUNT) {
        throw new errors_1.SyncCommitteeError(errors_1.GossipAction.REJECT, {
            code: errors_1.SyncCommitteeErrorCode.INVALID_SUB_COMMITTEE_INDEX,
            subCommitteeIndex: subnet,
        });
    }
    // [REJECT] The subnet_id is valid for the given validator, i.e. subnet_id in compute_subnets_for_sync_committee(state, sync_committee_signature.validator_index).
    // Note this validation implies the validator is part of the broader current sync committee along with the correct subcommittee.
    const indexInSubCommittee = getIndexInSubCommittee(headState, subnet, data);
    if (indexInSubCommittee === null) {
        throw new errors_1.SyncCommitteeError(errors_1.GossipAction.REJECT, {
            code: errors_1.SyncCommitteeErrorCode.VALIDATOR_NOT_IN_SYNC_COMMITTEE,
            validatorIndex,
        });
    }
    return indexInSubCommittee;
}
exports.validateGossipSyncCommitteeExceptSig = validateGossipSyncCommitteeExceptSig;
/**
 * Returns the IndexInSubCommittee of the given `subnet`.
 * Returns `null` if not part of the sync committee or not part of the given `subnet`
 */
function getIndexInSubCommittee(headState, subnet, data) {
    const syncCommittee = lodestar_beacon_state_transition_1.allForks.getIndexedSyncCommittee(headState, data.slot);
    const indexesInCommittee = syncCommittee.validatorIndexMap.get(data.validatorIndex);
    if (indexesInCommittee === undefined) {
        // Not part of the sync committee
        return null;
    }
    // TODO: Cache this value
    const SYNC_COMMITTEE_SUBNET_SIZE = Math.floor(lodestar_params_1.SYNC_COMMITTEE_SIZE / lodestar_params_1.SYNC_COMMITTEE_SUBNET_COUNT);
    for (const indexInCommittee of indexesInCommittee) {
        if (Math.floor(indexInCommittee / SYNC_COMMITTEE_SUBNET_SIZE) === subnet) {
            return indexInCommittee % SYNC_COMMITTEE_SUBNET_SIZE;
        }
    }
    // Not part of this specific subnet
    return null;
}
//# sourceMappingURL=syncCommittee.js.map