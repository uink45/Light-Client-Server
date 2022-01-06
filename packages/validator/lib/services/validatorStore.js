"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorStore = void 0;
const lodestar_beacon_state_transition_1 = require("@chainsafe/lodestar-beacon-state-transition");
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const lodestar_types_1 = require("@chainsafe/lodestar-types");
const ssz_1 = require("@chainsafe/ssz");
const utils_1 = require("./utils");
/**
 * Service that sets up and handles validator attester duties.
 */
class ValidatorStore {
    constructor(config, slashingProtection, secretKeys, genesis) {
        this.config = config;
        this.slashingProtection = slashingProtection;
        this.validators = (0, utils_1.mapSecretKeysToValidators)(secretKeys);
        this.slashingProtection = slashingProtection;
        this.genesisValidatorsRoot = genesis.genesisValidatorsRoot;
    }
    /** Return true if there is at least 1 pubkey registered */
    hasSomeValidators() {
        return this.validators.size > 0;
    }
    votingPubkeys() {
        return Array.from(this.validators.values()).map((keypair) => keypair.publicKey);
    }
    hasVotingPubkey(pubkeyHex) {
        return this.validators.has(pubkeyHex);
    }
    async signBlock(pubkey, block, currentSlot) {
        // Make sure the block slot is not higher than the current slot to avoid potential attacks.
        if (block.slot > currentSlot) {
            throw Error(`Not signing block with slot ${block.slot} greater than current slot ${currentSlot}`);
        }
        const proposerDomain = this.config.getDomain(lodestar_params_1.DOMAIN_BEACON_PROPOSER, block.slot);
        const blockType = this.config.getForkTypes(block.slot).BeaconBlock;
        const signingRoot = (0, lodestar_beacon_state_transition_1.computeSigningRoot)(blockType, block, proposerDomain);
        const secretKey = this.getSecretKey(pubkey); // Get before writing to slashingProtection
        await this.slashingProtection.checkAndInsertBlockProposal(pubkey, { slot: block.slot, signingRoot });
        return {
            message: block,
            signature: secretKey.sign(signingRoot).toBytes(),
        };
    }
    async signRandao(pubkey, slot) {
        const epoch = (0, lodestar_beacon_state_transition_1.computeEpochAtSlot)(slot);
        const randaoDomain = this.config.getDomain(lodestar_params_1.DOMAIN_RANDAO, slot);
        const randaoSigningRoot = (0, lodestar_beacon_state_transition_1.computeSigningRoot)(lodestar_types_1.ssz.Epoch, epoch, randaoDomain);
        return this.getSecretKey(pubkey).sign(randaoSigningRoot).toBytes();
    }
    async signAttestation(duty, attestationData, currentEpoch) {
        // Make sure the target epoch is not higher than the current epoch to avoid potential attacks.
        if (attestationData.target.epoch > currentEpoch) {
            throw Error(`Not signing attestation with target epoch ${attestationData.target.epoch} greater than current epoch ${currentEpoch}`);
        }
        this.validateAttestationDuty(duty, attestationData);
        const slot = (0, lodestar_beacon_state_transition_1.computeStartSlotAtEpoch)(attestationData.target.epoch);
        const domain = this.config.getDomain(lodestar_params_1.DOMAIN_BEACON_ATTESTER, slot);
        const signingRoot = (0, lodestar_beacon_state_transition_1.computeSigningRoot)(lodestar_types_1.ssz.phase0.AttestationData, attestationData, domain);
        const secretKey = this.getSecretKey(duty.pubkey); // Get before writing to slashingProtection
        await this.slashingProtection.checkAndInsertAttestation(duty.pubkey, {
            sourceEpoch: attestationData.source.epoch,
            targetEpoch: attestationData.target.epoch,
            signingRoot,
        });
        return {
            aggregationBits: (0, utils_1.getAggregationBits)(duty.committeeLength, duty.validatorCommitteeIndex),
            data: attestationData,
            signature: secretKey.sign(signingRoot).toBytes(),
        };
    }
    async signAggregateAndProof(duty, selectionProof, aggregate) {
        this.validateAttestationDuty(duty, aggregate.data);
        const aggregateAndProof = {
            aggregate,
            aggregatorIndex: duty.validatorIndex,
            selectionProof,
        };
        const domain = this.config.getDomain(lodestar_params_1.DOMAIN_AGGREGATE_AND_PROOF, aggregate.data.slot);
        const signingRoot = (0, lodestar_beacon_state_transition_1.computeSigningRoot)(lodestar_types_1.ssz.phase0.AggregateAndProof, aggregateAndProof, domain);
        return {
            message: aggregateAndProof,
            signature: this.getSecretKey(duty.pubkey).sign(signingRoot).toBytes(),
        };
    }
    async signSyncCommitteeSignature(pubkey, validatorIndex, slot, beaconBlockRoot) {
        const domain = this.config.getDomain(lodestar_params_1.DOMAIN_SYNC_COMMITTEE, slot);
        const signingRoot = (0, lodestar_beacon_state_transition_1.computeSigningRoot)(lodestar_types_1.ssz.Root, beaconBlockRoot, domain);
        return {
            slot,
            validatorIndex,
            beaconBlockRoot,
            signature: this.getSecretKey(pubkey).sign(signingRoot).toBytes(),
        };
    }
    async signContributionAndProof(duty, selectionProof, contribution) {
        const contributionAndProof = {
            contribution,
            aggregatorIndex: duty.validatorIndex,
            selectionProof,
        };
        const domain = this.config.getDomain(lodestar_params_1.DOMAIN_CONTRIBUTION_AND_PROOF, contribution.slot);
        const signingRoot = (0, lodestar_beacon_state_transition_1.computeSigningRoot)(lodestar_types_1.ssz.altair.ContributionAndProof, contributionAndProof, domain);
        return {
            message: contributionAndProof,
            signature: this.getSecretKey(duty.pubkey).sign(signingRoot).toBytes(),
        };
    }
    async signAttestationSelectionProof(pubkey, slot) {
        const domain = this.config.getDomain(lodestar_params_1.DOMAIN_SELECTION_PROOF, slot);
        const signingRoot = (0, lodestar_beacon_state_transition_1.computeSigningRoot)(lodestar_types_1.ssz.Slot, slot, domain);
        return this.getSecretKey(pubkey).sign(signingRoot).toBytes();
    }
    async signSyncCommitteeSelectionProof(pubkey, slot, subCommitteeIndex) {
        const domain = this.config.getDomain(lodestar_params_1.DOMAIN_SYNC_COMMITTEE_SELECTION_PROOF, slot);
        const signingData = {
            slot,
            subCommitteeIndex: subCommitteeIndex,
        };
        const signingRoot = (0, lodestar_beacon_state_transition_1.computeSigningRoot)(lodestar_types_1.ssz.altair.SyncAggregatorSelectionData, signingData, domain);
        return this.getSecretKey(pubkey).sign(signingRoot).toBytes();
    }
    getSecretKey(pubkey) {
        // TODO: Refactor indexing to not have to run toHexString() on the pubkey every time
        const pubkeyHex = typeof pubkey === "string" ? pubkey : (0, ssz_1.toHexString)(pubkey);
        const validator = this.validators.get(pubkeyHex);
        if (!validator) {
            throw Error(`Validator ${pubkeyHex} not in local validators map`);
        }
        return validator.secretKey;
    }
    /** Prevent signing bad data sent by the Beacon node */
    validateAttestationDuty(duty, data) {
        if (duty.slot !== data.slot) {
            throw Error(`Inconsistent duties during signing: duty.slot ${duty.slot} != att.slot ${data.slot}`);
        }
        if (duty.committeeIndex != data.index) {
            throw Error(`Inconsistent duties during signing: duty.committeeIndex ${duty.committeeIndex} != att.committeeIndex ${data.index}`);
        }
    }
}
exports.ValidatorStore = ValidatorStore;
//# sourceMappingURL=validatorStore.js.map