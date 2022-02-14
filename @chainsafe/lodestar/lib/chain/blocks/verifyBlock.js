"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyBlockStateTransition = exports.verifyBlockSanityChecks = exports.verifyBlock = void 0;
const lodestar_types_1 = require("@chainsafe/lodestar-types");
const lodestar_beacon_state_transition_1 = require("@chainsafe/lodestar-beacon-state-transition");
const ssz_1 = require("@chainsafe/ssz");
const errors_1 = require("../errors");
const regen_1 = require("../regen");
const interface_1 = require("../../executionEngine/interface");
/**
 * Fully verify a block to be imported immediately after. Does not produce any side-effects besides adding intermediate
 * states in the state cache through regen.
 */
async function verifyBlock(chain, partiallyVerifiedBlock, opts) {
    const parentBlock = verifyBlockSanityChecks(chain, partiallyVerifiedBlock);
    const postState = await verifyBlockStateTransition(chain, partiallyVerifiedBlock, opts);
    return {
        block: partiallyVerifiedBlock.block,
        postState,
        parentBlock,
        skipImportingAttestations: partiallyVerifiedBlock.skipImportingAttestations,
    };
}
exports.verifyBlock = verifyBlock;
/**
 * Verifies som early cheap sanity checks on the block before running the full state transition.
 *
 * - Parent is known to the fork-choice
 * - Check skipped slots limit
 * - check_block_relevancy()
 *   - Block not in the future
 *   - Not genesis block
 *   - Block's slot is < Infinity
 *   - Not finalized slot
 *   - Not already known
 */
function verifyBlockSanityChecks(chain, partiallyVerifiedBlock) {
    const { block } = partiallyVerifiedBlock;
    const blockSlot = block.message.slot;
    // Not genesis block
    if (blockSlot === 0) {
        throw new errors_1.BlockError(block, { code: errors_1.BlockErrorCode.GENESIS_BLOCK });
    }
    // Not finalized slot
    const finalizedSlot = (0, lodestar_beacon_state_transition_1.computeStartSlotAtEpoch)(chain.forkChoice.getFinalizedCheckpoint().epoch);
    if (blockSlot <= finalizedSlot) {
        throw new errors_1.BlockError(block, { code: errors_1.BlockErrorCode.WOULD_REVERT_FINALIZED_SLOT, blockSlot, finalizedSlot });
    }
    // Parent is known to the fork-choice
    const parentRoot = (0, ssz_1.toHexString)(block.message.parentRoot);
    const parentBlock = chain.forkChoice.getBlockHex(parentRoot);
    if (!parentBlock) {
        throw new errors_1.BlockError(block, { code: errors_1.BlockErrorCode.PARENT_UNKNOWN, parentRoot });
    }
    // Check skipped slots limit
    // TODO
    // Block not in the future, also checks for infinity
    const currentSlot = chain.clock.currentSlot;
    if (blockSlot > currentSlot) {
        throw new errors_1.BlockError(block, { code: errors_1.BlockErrorCode.FUTURE_SLOT, blockSlot, currentSlot });
    }
    // Not already known
    const blockHash = (0, ssz_1.toHexString)(chain.config.getForkTypes(block.message.slot).BeaconBlock.hashTreeRoot(block.message));
    if (chain.forkChoice.hasBlockHex(blockHash)) {
        throw new errors_1.BlockError(block, { code: errors_1.BlockErrorCode.ALREADY_KNOWN, root: blockHash });
    }
    return parentBlock;
}
exports.verifyBlockSanityChecks = verifyBlockSanityChecks;
/**
 * Verifies a block is fully valid running the full state transition. To relieve the main thread signatures are
 * verified separately in workers with chain.bls worker pool.
 *
 * - Advance state to block's slot - per_slot_processing()
 * - STFN - per_block_processing()
 * - Check state root matches
 */
async function verifyBlockStateTransition(chain, partiallyVerifiedBlock, opts) {
    const { block, validProposerSignature, validSignatures } = partiallyVerifiedBlock;
    // TODO: Skip in process chain segment
    // Retrieve preState from cache (regen)
    const preState = await chain.regen.getPreState(block.message, regen_1.RegenCaller.processBlocksInEpoch).catch((e) => {
        throw new errors_1.BlockError(block, { code: errors_1.BlockErrorCode.PRESTATE_MISSING, error: e });
    });
    // STFN - per_slot_processing() + per_block_processing()
    // NOTE: `regen.getPreState()` should have dialed forward the state already caching checkpoint states
    const useBlsBatchVerify = !(opts === null || opts === void 0 ? void 0 : opts.disableBlsBatchVerify);
    const postState = lodestar_beacon_state_transition_1.allForks.stateTransition(preState, block, {
        // false because it's verified below with better error typing
        verifyStateRoot: false,
        // if block is trusted don't verify proposer or op signature
        verifyProposer: !useBlsBatchVerify && !validSignatures && !validProposerSignature,
        verifySignatures: !useBlsBatchVerify && !validSignatures,
    }, chain.metrics);
    // TODO: Review mergeBlock conditions
    /** Not null if execution is enabled */
    const executionPayloadEnabled = lodestar_beacon_state_transition_1.merge.isMergeStateType(postState) &&
        lodestar_beacon_state_transition_1.merge.isMergeBlockBodyType(block.message.body) &&
        lodestar_beacon_state_transition_1.merge.isExecutionEnabled(postState, block.message.body)
        ? block.message.body.executionPayload
        : null;
    // Verify signatures after running state transition, so all SyncCommittee signed roots are known at this point.
    // We must ensure block.slot <= state.slot before running getAllBlockSignatureSets().
    // NOTE: If in the future multiple blocks signatures are verified at once, all blocks must be in the same epoch
    // so the attester and proposer shufflings are correct.
    if (useBlsBatchVerify && !validSignatures) {
        const signatureSets = validProposerSignature
            ? lodestar_beacon_state_transition_1.allForks.getAllBlockSignatureSetsExceptProposer(postState, block)
            : lodestar_beacon_state_transition_1.allForks.getAllBlockSignatureSets(postState, block);
        if (signatureSets.length > 0 && !(await chain.bls.verifySignatureSets(signatureSets))) {
            throw new errors_1.BlockError(block, { code: errors_1.BlockErrorCode.INVALID_SIGNATURE, state: postState });
        }
    }
    if (executionPayloadEnabled) {
        // TODO: Handle better executePayload() returning error is syncing
        const status = await chain.executionEngine.executePayload(
        // executionPayload must be serialized as JSON and the TreeBacked structure breaks the baseFeePerGas serializer
        // For clarity and since it's needed anyway, just send the struct representation at this level such that
        // executePayload() can expect a regular JS object.
        // TODO: If blocks are no longer TreeBacked, remove.
        executionPayloadEnabled.valueOf());
        switch (status) {
            case interface_1.ExecutePayloadStatus.VALID:
                break; // OK
            case interface_1.ExecutePayloadStatus.INVALID:
                throw new errors_1.BlockError(block, { code: errors_1.BlockErrorCode.EXECUTION_PAYLOAD_NOT_VALID });
            case interface_1.ExecutePayloadStatus.SYNCING:
                // It's okay to ignore SYNCING status because:
                // - We MUST verify execution payloads of blocks we attest
                // - We are NOT REQUIRED to check the execution payload of blocks we don't attest
                // When EL syncs from genesis to a chain post-merge, it doesn't know what the head, CL knows. However, we
                // must verify (complete this fn) and import a block to sync. Since we are syncing we only need to verify
                // consensus and trust that whatever the chain agrees is valid, is valid; no need to verify. When we
                // verify consensus up to the head we notify forkchoice update head and then EL can sync to our head. At that
                // point regular EL sync kicks in and it does verify the execution payload (EL blocks). If after syncing EL
                // gets to an invalid payload or we can prepare payloads on what we consider the head that's a critical error
                //
                // TODO: Exit with critical error if we can't prepare payloads on top of what we consider head.
                if (partiallyVerifiedBlock.fromRangeSync) {
                    break;
                }
                else {
                    throw new errors_1.BlockError(block, { code: errors_1.BlockErrorCode.EXECUTION_ENGINE_SYNCING });
                }
        }
    }
    // Check state root matches
    if (!lodestar_types_1.ssz.Root.equals(block.message.stateRoot, postState.tree.root)) {
        throw new errors_1.BlockError(block, { code: errors_1.BlockErrorCode.INVALID_STATE_ROOT, preState, postState });
    }
    return postState;
}
exports.verifyBlockStateTransition = verifyBlockStateTransition;
//# sourceMappingURL=verifyBlock.js.map