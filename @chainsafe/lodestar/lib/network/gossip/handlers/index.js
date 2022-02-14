"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGossipHandlers = void 0;
const ssz_1 = require("@chainsafe/ssz");
const peer_id_1 = __importDefault(require("peer-id"));
const lodestar_types_1 = require("@chainsafe/lodestar-types");
const lodestar_utils_1 = require("@chainsafe/lodestar-utils");
const validatorMonitor_1 = require("../../../metrics/validatorMonitor");
const errors_1 = require("../../../chain/errors");
const interface_1 = require("../interface");
const validation_1 = require("../../../chain/validation");
const events_1 = require("../../events");
const peers_1 = require("../../peers");
/**
 * Gossip handlers perform validation + handling in a single function.
 * - This gossip handlers MUST only be registered as validator functions. No handler is registered for any topic.
 * - All `chain/validation/*` functions MUST throw typed GossipActionError instances so they gossip action is captured
 *   by `getGossipValidatorFn()` try catch block.
 * - This gossip handlers should not let any handling errors propagate to the caller. Only validation errors must be thrown.
 *
 * Note: `libp2p/js-libp2p-interfaces` would normally indicate to register separate validator functions and handler functions.
 * This approach is not suitable for us because:
 * - We do expensive processing on the object in the validator function that we need to re-use in the handler function.
 * - The validator function produces extra data that is needed for the handler function. Making this data available in
 *   the handler function scope is hard to achieve without very hacky strategies
 * - Eth2.0 gossipsub protocol strictly defined a single topic for message
 */
function getGossipHandlers(modules) {
    const { chain, config, metrics, network, logger } = modules;
    return {
        [interface_1.GossipType.beacon_block]: async (signedBlock, topic, peerIdStr, seenTimestampSec) => {
            const slot = signedBlock.message.slot;
            const blockHex = (0, lodestar_utils_1.prettyBytes)(config.getForkTypes(slot).BeaconBlock.hashTreeRoot(signedBlock.message));
            logger.verbose("Received gossip block", {
                slot: slot,
                root: blockHex,
                curentSlot: chain.clock.currentSlot,
                peerId: peerIdStr,
            });
            try {
                await (0, validation_1.validateGossipBlock)(config, chain, signedBlock, topic.fork);
            }
            catch (e) {
                if (e instanceof errors_1.BlockGossipError) {
                    if (e instanceof errors_1.BlockGossipError && e.type.code === errors_1.BlockErrorCode.PARENT_UNKNOWN) {
                        logger.debug("Gossip block has error", { slot, root: blockHex, code: e.type.code });
                        network.events.emit(events_1.NetworkEvent.unknownBlockParent, signedBlock, peerIdStr);
                    }
                }
                if (e instanceof errors_1.BlockGossipError && e.action === errors_1.GossipAction.REJECT) {
                    const archivedPath = chain.persistInvalidSszObject("signedBlock", config.getForkTypes(slot).SignedBeaconBlock.serialize(signedBlock), `gossip_slot_${slot}`);
                    logger.debug("The invalid gossip block was written to", archivedPath);
                }
                throw e;
            }
            // Handler - MUST NOT `await`, to allow validation result to be propagated
            metrics === null || metrics === void 0 ? void 0 : metrics.registerBeaconBlock(validatorMonitor_1.OpSource.gossip, seenTimestampSec, signedBlock.message);
            // `validProposerSignature = true`, in gossip validation the proposer signature is checked
            chain
                .processBlock(signedBlock, { validProposerSignature: true })
                .then(() => {
                // Returns the delay between the start of `block.slot` and `current time`
                const delaySec = Date.now() / 1000 - (chain.genesisTime + slot * config.SECONDS_PER_SLOT);
                metrics === null || metrics === void 0 ? void 0 : metrics.gossipBlock.elappsedTimeTillProcessed.observe(delaySec);
            })
                .catch((e) => {
                if (e instanceof errors_1.BlockError) {
                    switch (e.type.code) {
                        case errors_1.BlockErrorCode.ALREADY_KNOWN:
                        case errors_1.BlockErrorCode.PARENT_UNKNOWN:
                        case errors_1.BlockErrorCode.PRESTATE_MISSING:
                            break;
                        default:
                            network.peerRpcScores.applyAction(peer_id_1.default.createFromB58String(peerIdStr), peers_1.PeerAction.LowToleranceError, "BadGossipBlock");
                    }
                }
                logger.error("Error receiving block", { slot, peer: peerIdStr }, e);
            });
        },
        [interface_1.GossipType.beacon_aggregate_and_proof]: async (signedAggregateAndProof, _topic, _peer, seenTimestampSec) => {
            try {
                const { indexedAttestation, committeeIndices } = await (0, validation_1.validateGossipAggregateAndProof)(chain, signedAggregateAndProof);
                metrics === null || metrics === void 0 ? void 0 : metrics.registerAggregatedAttestation(validatorMonitor_1.OpSource.gossip, seenTimestampSec, signedAggregateAndProof, indexedAttestation);
                // TODO: Add DoS resistant pending attestation pool
                // switch (e.type.code) {
                //   case AttestationErrorCode.FUTURE_SLOT:
                //     chain.pendingAttestations.putBySlot(e.type.attestationSlot, attestation);
                //     break;
                //   case AttestationErrorCode.UNKNOWN_TARGET_ROOT:
                //   case AttestationErrorCode.UNKNOWN_BEACON_BLOCK_ROOT:
                //     chain.pendingAttestations.putByBlock(e.type.root, attestation);
                //     break;
                // }
                // Handler
                const aggregatedAttestation = signedAggregateAndProof.message.aggregate;
                chain.aggregatedAttestationPool.add(aggregatedAttestation, indexedAttestation.attestingIndices, committeeIndices);
            }
            catch (e) {
                if (e instanceof errors_1.AttestationError && e.action === errors_1.GossipAction.REJECT) {
                    const archivedPath = chain.persistInvalidSszObject("signedAggregatedAndProof", lodestar_types_1.ssz.phase0.SignedAggregateAndProof.serialize(signedAggregateAndProof), (0, ssz_1.toHexString)(lodestar_types_1.ssz.phase0.SignedAggregateAndProof.hashTreeRoot(signedAggregateAndProof)));
                    logger.debug("The invalid gossip aggregate and proof was written to", archivedPath, e);
                }
                throw e;
            }
        },
        [interface_1.GossipType.beacon_attestation]: async (attestation, { subnet }, _peer, seenTimestampSec) => {
            let indexedAttestation = undefined;
            try {
                indexedAttestation = (await (0, validation_1.validateGossipAttestation)(chain, attestation, subnet)).indexedAttestation;
            }
            catch (e) {
                if (e instanceof errors_1.AttestationError && e.action === errors_1.GossipAction.REJECT) {
                    const archivedPath = chain.persistInvalidSszObject("attestation", lodestar_types_1.ssz.phase0.Attestation.serialize(attestation), (0, ssz_1.toHexString)(lodestar_types_1.ssz.phase0.Attestation.hashTreeRoot(attestation)));
                    logger.debug("The invalid gossip attestation was written to", archivedPath);
                }
                throw e;
            }
            metrics === null || metrics === void 0 ? void 0 : metrics.registerUnaggregatedAttestation(validatorMonitor_1.OpSource.gossip, seenTimestampSec, indexedAttestation);
            // Handler
            // Node may be subscribe to extra subnets (long-lived random subnets). For those, validate the messages
            // but don't import them, to save CPU and RAM
            if (!network.attnetsService.shouldProcess(subnet, attestation.data.slot)) {
                return;
            }
            try {
                chain.attestationPool.add(attestation);
            }
            catch (e) {
                logger.error("Error adding attestation to pool", { subnet }, e);
            }
        },
        [interface_1.GossipType.attester_slashing]: async (attesterSlashing) => {
            await (0, validation_1.validateGossipAttesterSlashing)(chain, attesterSlashing);
            // Handler
            try {
                chain.opPool.insertAttesterSlashing(attesterSlashing);
            }
            catch (e) {
                logger.error("Error adding attesterSlashing to pool", {}, e);
            }
        },
        [interface_1.GossipType.proposer_slashing]: async (proposerSlashing) => {
            await (0, validation_1.validateGossipProposerSlashing)(chain, proposerSlashing);
            // Handler
            try {
                chain.opPool.insertProposerSlashing(proposerSlashing);
            }
            catch (e) {
                logger.error("Error adding attesterSlashing to pool", {}, e);
            }
        },
        [interface_1.GossipType.voluntary_exit]: async (voluntaryExit) => {
            await (0, validation_1.validateGossipVoluntaryExit)(chain, voluntaryExit);
            // Handler
            try {
                chain.opPool.insertVoluntaryExit(voluntaryExit);
            }
            catch (e) {
                logger.error("Error adding attesterSlashing to pool", {}, e);
            }
        },
        [interface_1.GossipType.sync_committee_contribution_and_proof]: async (contributionAndProof) => {
            try {
                await (0, validation_1.validateSyncCommitteeGossipContributionAndProof)(chain, contributionAndProof);
            }
            catch (e) {
                if (e instanceof errors_1.SyncCommitteeError && e.action === errors_1.GossipAction.REJECT) {
                    const archivedPath = chain.persistInvalidSszObject("contributionAndProof", lodestar_types_1.ssz.altair.SignedContributionAndProof.serialize(contributionAndProof), (0, ssz_1.toHexString)(lodestar_types_1.ssz.altair.SignedContributionAndProof.hashTreeRoot(contributionAndProof)));
                    logger.debug("The invalid gossip contribution and proof was written to", archivedPath);
                }
                throw e;
            }
            // Handler
            try {
                chain.syncContributionAndProofPool.add(contributionAndProof.message);
            }
            catch (e) {
                logger.error("Error adding to contributionAndProof pool", {}, e);
            }
        },
        [interface_1.GossipType.sync_committee]: async (syncCommittee, { subnet }) => {
            let indexInSubCommittee = 0;
            try {
                indexInSubCommittee = (await (0, validation_1.validateGossipSyncCommittee)(chain, syncCommittee, subnet)).indexInSubCommittee;
            }
            catch (e) {
                if (e instanceof errors_1.SyncCommitteeError && e.action === errors_1.GossipAction.REJECT) {
                    const archivedPath = chain.persistInvalidSszObject("syncCommittee", lodestar_types_1.ssz.altair.SyncCommitteeMessage.serialize(syncCommittee), (0, ssz_1.toHexString)(lodestar_types_1.ssz.altair.SyncCommitteeMessage.hashTreeRoot(syncCommittee)));
                    logger.debug("The invalid gossip sync committee was written to", archivedPath);
                }
                throw e;
            }
            // Handler
            try {
                chain.syncCommitteeMessagePool.add(subnet, syncCommittee, indexInSubCommittee);
            }
            catch (e) {
                logger.error("Error adding to syncCommittee pool", { subnet }, e);
            }
        },
    };
}
exports.getGossipHandlers = getGossipHandlers;
//# sourceMappingURL=index.js.map