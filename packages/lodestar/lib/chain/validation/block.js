"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGossipBlock = void 0;
const lodestar_beacon_state_transition_1 = require("@chainsafe/lodestar-beacon-state-transition");
const lodestar_beacon_state_transition_2 = require("@chainsafe/lodestar-beacon-state-transition");
const lodestar_utils_1 = require("@chainsafe/lodestar-utils");
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const ssz_1 = require("@chainsafe/ssz");
const constants_1 = require("../../constants");
const errors_1 = require("../errors");
const regen_1 = require("../regen");
async function validateGossipBlock(config, chain, signedBlock, fork) {
    const block = signedBlock.message;
    const blockSlot = block.slot;
    // [IGNORE] The block is not from a future slot (with a MAXIMUM_GOSSIP_CLOCK_DISPARITY allowance) -- i.e.validate
    // that signed_beacon_block.message.slot <= current_slot (a client MAY queue future blocks for processing at the
    // appropriate slot).
    const currentSlotWithGossipDisparity = chain.clock.currentSlotWithGossipDisparity;
    if (currentSlotWithGossipDisparity < blockSlot) {
        throw new errors_1.BlockGossipError(errors_1.GossipAction.IGNORE, {
            code: errors_1.BlockErrorCode.FUTURE_SLOT,
            currentSlot: currentSlotWithGossipDisparity,
            blockSlot,
        });
    }
    // [IGNORE] The block is from a slot greater than the latest finalized slot -- i.e. validate that
    // signed_beacon_block.message.slot > compute_start_slot_at_epoch(state.finalized_checkpoint.epoch)
    const finalizedCheckpoint = chain.forkChoice.getFinalizedCheckpoint();
    const finalizedSlot = (0, lodestar_beacon_state_transition_1.computeStartSlotAtEpoch)(finalizedCheckpoint.epoch);
    if (blockSlot <= finalizedSlot) {
        throw new errors_1.BlockGossipError(errors_1.GossipAction.IGNORE, {
            code: errors_1.BlockErrorCode.WOULD_REVERT_FINALIZED_SLOT,
            blockSlot,
            finalizedSlot,
        });
    }
    // Check if the block is already known. We know it is post-finalization, so it is sufficient to check the fork choice.
    //
    // In normal operation this isn't necessary, however it is useful immediately after a
    // reboot if the `observed_block_producers` cache is empty. In that case, without this
    // check, we will load the parent and state from disk only to find out later that we
    // already know this block.
    const blockRoot = (0, ssz_1.toHexString)(config.getForkTypes(blockSlot).BeaconBlock.hashTreeRoot(block));
    if (chain.forkChoice.getBlockHex(blockRoot) !== null) {
        throw new errors_1.BlockGossipError(errors_1.GossipAction.IGNORE, { code: errors_1.BlockErrorCode.ALREADY_KNOWN, root: blockRoot });
    }
    // No need to check for badBlock
    // Gossip de-duplicates messages so we shouldn't be able to receive a bad block twice
    // [IGNORE] The block is the first block with valid signature received for the proposer for the slot, signed_beacon_block.message.slot.
    const proposerIndex = block.proposerIndex;
    if (chain.seenBlockProposers.isKnown(blockSlot, proposerIndex)) {
        throw new errors_1.BlockGossipError(errors_1.GossipAction.IGNORE, { code: errors_1.BlockErrorCode.REPEAT_PROPOSAL, proposerIndex });
    }
    // [REJECT] The current finalized_checkpoint is an ancestor of block -- i.e.
    // get_ancestor(store, block.parent_root, compute_start_slot_at_epoch(store.finalized_checkpoint.epoch)) == store.finalized_checkpoint.root
    const parentRoot = (0, ssz_1.toHexString)(block.parentRoot);
    const parentBlock = chain.forkChoice.getBlockHex(parentRoot);
    if (parentBlock === null) {
        // If fork choice does *not* consider the parent to be a descendant of the finalized block,
        // then there are two more cases:
        //
        // 1. We have the parent stored in our database. Because fork-choice has confirmed the
        //    parent is *not* in our post-finalization DAG, all other blocks must be either
        //    pre-finalization or conflicting with finalization.
        // 2. The parent is unknown to us, we probably want to download it since it might actually
        //    descend from the finalized root.
        // (Non-Lighthouse): Since we prune all blocks non-descendant from finalized checking the `db.block` database won't be useful to guard
        // against known bad fork blocks, so we throw PARENT_UNKNOWN for cases (1) and (2)
        throw new errors_1.BlockGossipError(errors_1.GossipAction.IGNORE, { code: errors_1.BlockErrorCode.PARENT_UNKNOWN, parentRoot });
    }
    // [REJECT] The block is from a higher slot than its parent.
    if (parentBlock.slot >= blockSlot) {
        throw new errors_1.BlockGossipError(errors_1.GossipAction.IGNORE, {
            code: errors_1.BlockErrorCode.NOT_LATER_THAN_PARENT,
            parentSlot: parentBlock.slot,
            slot: blockSlot,
        });
    }
    // getBlockSlotState also checks for whether the current finalized checkpoint is an ancestor of the block.
    // As a result, we throw an IGNORE (whereas the spec says we should REJECT for this scenario).
    // this is something we should change this in the future to make the code airtight to the spec.
    // [IGNORE] The block's parent (defined by block.parent_root) has been seen (via both gossip and non-gossip sources) (a client MAY queue blocks for processing once the parent block is retrieved).
    // [REJECT] The block's parent (defined by block.parent_root) passes validation.
    const blockState = await chain.regen
        .getBlockSlotState(parentRoot, blockSlot, regen_1.RegenCaller.validateGossipBlock)
        .catch(() => {
        throw new errors_1.BlockGossipError(errors_1.GossipAction.IGNORE, { code: errors_1.BlockErrorCode.PARENT_UNKNOWN, parentRoot });
    });
    // Extra conditions for merge fork blocks
    // [REJECT] The block's execution payload timestamp is correct with respect to the slot
    // -- i.e. execution_payload.timestamp == compute_timestamp_at_slot(state, block.slot).
    if (fork === lodestar_params_1.ForkName.merge) {
        if (!lodestar_beacon_state_transition_1.merge.isMergeBlockBodyType(block.body))
            throw Error("Not merge block type");
        const executionPayload = block.body.executionPayload;
        if (lodestar_beacon_state_transition_1.merge.isMergeStateType(blockState) && lodestar_beacon_state_transition_1.merge.isExecutionEnabled(blockState, block.body)) {
            const expectedTimestamp = (0, lodestar_beacon_state_transition_1.computeTimeAtSlot)(config, blockSlot, chain.genesisTime);
            if (executionPayload.timestamp !== (0, lodestar_beacon_state_transition_1.computeTimeAtSlot)(config, blockSlot, chain.genesisTime)) {
                throw new errors_1.BlockGossipError(errors_1.GossipAction.REJECT, {
                    code: errors_1.BlockErrorCode.INCORRECT_TIMESTAMP,
                    timestamp: executionPayload.timestamp,
                    expectedTimestamp,
                });
            }
        }
    }
    // [REJECT] The proposer signature, signed_beacon_block.signature, is valid with respect to the proposer_index pubkey.
    const signatureSet = lodestar_beacon_state_transition_2.allForks.getProposerSignatureSet(blockState, signedBlock);
    // Don't batch so verification is not delayed
    if (!(await chain.bls.verifySignatureSets([signatureSet]))) {
        throw new errors_1.BlockGossipError(errors_1.GossipAction.REJECT, { code: errors_1.BlockErrorCode.PROPOSAL_SIGNATURE_INVALID });
    }
    // [REJECT] The block is proposed by the expected proposer_index for the block's slot in the context of the current
    // shuffling (defined by parent_root/slot). If the proposer_index cannot immediately be verified against the expected
    // shuffling, the block MAY be queued for later processing while proposers for the block's branch are calculated --
    // in such a case do not REJECT, instead IGNORE this message.
    if (blockState.epochCtx.getBeaconProposer(blockSlot) !== proposerIndex) {
        throw new errors_1.BlockGossipError(errors_1.GossipAction.REJECT, { code: errors_1.BlockErrorCode.INCORRECT_PROPOSER, proposerIndex });
    }
    // Check again in case there two blocks are processed concurrently
    if (chain.seenBlockProposers.isKnown(blockSlot, proposerIndex)) {
        throw new errors_1.BlockGossipError(errors_1.GossipAction.IGNORE, { code: errors_1.BlockErrorCode.REPEAT_PROPOSAL, proposerIndex });
    }
    // Simple implementation of a pending block queue. Keeping the block here recycles the queue logic, and keeps the
    // gossip validation promise without any extra infrastructure.
    // Do the sleep at the end, since regen and signature validation can already take longer than `msToBlockSlot`.
    const msToBlockSlot = (0, lodestar_beacon_state_transition_1.computeTimeAtSlot)(config, blockSlot, chain.genesisTime) * 1000 - Date.now();
    if (msToBlockSlot <= constants_1.MAXIMUM_GOSSIP_CLOCK_DISPARITY && msToBlockSlot > 0) {
        // If block is between 0 and 500 ms early, hold it in a promise. Equivalent to a pending queue.
        await (0, lodestar_utils_1.sleep)(msToBlockSlot);
    }
    chain.seenBlockProposers.add(blockSlot, proposerIndex);
}
exports.validateGossipBlock = validateGossipBlock;
//# sourceMappingURL=block.js.map