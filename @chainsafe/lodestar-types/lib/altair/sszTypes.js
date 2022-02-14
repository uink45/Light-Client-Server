"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightClientStore = exports.LightClientUpdate = exports.LightClientSnapshot = exports.BeaconState = exports.InactivityScores = exports.EpochParticipation = exports.SignedBeaconBlock = exports.BeaconBlock = exports.BeaconBlockBody = exports.HistoricalBatch = exports.HistoricalStateRoots = exports.HistoricalBlockRoots = exports.SyncAggregate = exports.SyncCommitteeBits = exports.SyncAggregatorSelectionData = exports.SignedContributionAndProof = exports.ContributionAndProof = exports.SyncCommitteeContribution = exports.SyncCommitteeMessage = exports.SyncCommittee = exports.Metadata = exports.SyncSubnets = void 0;
const ssz_1 = require("@chainsafe/ssz");
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const phase0_1 = require("../phase0");
const primitive_1 = require("../primitive");
const lazyVar_1 = require("../utils/lazyVar");
const { Bytes32, Number64, Slot, SubCommitteeIndex, ValidatorIndex, Gwei, Root, Version, BLSPubkey, BLSSignature, ParticipationFlags, } = primitive_1.ssz;
// So the expandedRoots can be referenced, and break the circular dependency
const typesRef = new lazyVar_1.LazyVariable();
exports.SyncSubnets = new ssz_1.BitVectorType({
    length: lodestar_params_1.SYNC_COMMITTEE_SUBNET_COUNT,
});
exports.Metadata = new ssz_1.ContainerType({
    fields: {
        ...phase0_1.ssz.Metadata.fields,
        syncnets: exports.SyncSubnets,
    },
    // New keys are strictly appended, phase0 key order is preserved
    casingMap: {
        ...phase0_1.ssz.Metadata.casingMap,
        syncnets: "syncnets",
    },
});
exports.SyncCommittee = new ssz_1.ContainerType({
    fields: {
        pubkeys: new ssz_1.VectorType({ elementType: BLSPubkey, length: lodestar_params_1.SYNC_COMMITTEE_SIZE }),
        aggregatePubkey: BLSPubkey,
    },
    casingMap: {
        pubkeys: "pubkeys",
        aggregatePubkey: "aggregate_pubkey",
    },
});
exports.SyncCommitteeMessage = new ssz_1.ContainerType({
    fields: {
        slot: Slot,
        beaconBlockRoot: Root,
        validatorIndex: ValidatorIndex,
        signature: BLSSignature,
    },
    casingMap: {
        slot: "slot",
        beaconBlockRoot: "beacon_block_root",
        validatorIndex: "validator_index",
        signature: "signature",
    },
});
exports.SyncCommitteeContribution = new ssz_1.ContainerType({
    fields: {
        slot: Slot,
        beaconBlockRoot: Root,
        subCommitteeIndex: SubCommitteeIndex,
        aggregationBits: new ssz_1.BitVectorType({ length: lodestar_params_1.SYNC_COMMITTEE_SIZE / lodestar_params_1.SYNC_COMMITTEE_SUBNET_COUNT }),
        signature: BLSSignature,
    },
    casingMap: {
        slot: "slot",
        beaconBlockRoot: "beacon_block_root",
        subCommitteeIndex: "subcommittee_index",
        aggregationBits: "aggregation_bits",
        signature: "signature",
    },
});
exports.ContributionAndProof = new ssz_1.ContainerType({
    fields: {
        aggregatorIndex: ValidatorIndex,
        contribution: exports.SyncCommitteeContribution,
        selectionProof: BLSSignature,
    },
    casingMap: {
        aggregatorIndex: "aggregator_index",
        contribution: "contribution",
        selectionProof: "selection_proof",
    },
});
exports.SignedContributionAndProof = new ssz_1.ContainerType({
    fields: {
        message: exports.ContributionAndProof,
        signature: BLSSignature,
    },
    expectedCase: "notransform",
});
exports.SyncAggregatorSelectionData = new ssz_1.ContainerType({
    fields: {
        slot: Slot,
        subCommitteeIndex: SubCommitteeIndex,
    },
    casingMap: {
        slot: "slot",
        subCommitteeIndex: "subcommittee_index",
    },
});
exports.SyncCommitteeBits = new ssz_1.BitVectorType({
    length: lodestar_params_1.SYNC_COMMITTEE_SIZE,
});
exports.SyncAggregate = new ssz_1.ContainerType({
    fields: {
        syncCommitteeBits: exports.SyncCommitteeBits,
        syncCommitteeSignature: BLSSignature,
    },
    casingMap: {
        syncCommitteeBits: "sync_committee_bits",
        syncCommitteeSignature: "sync_committee_signature",
    },
});
// Re-declare with the new expanded type
exports.HistoricalBlockRoots = new ssz_1.VectorType({
    elementType: new ssz_1.RootType({ expandedType: () => typesRef.get().BeaconBlock }),
    length: lodestar_params_1.SLOTS_PER_HISTORICAL_ROOT,
});
exports.HistoricalStateRoots = new ssz_1.VectorType({
    elementType: new ssz_1.RootType({ expandedType: () => typesRef.get().BeaconState }),
    length: lodestar_params_1.SLOTS_PER_HISTORICAL_ROOT,
});
exports.HistoricalBatch = new ssz_1.ContainerType({
    fields: {
        blockRoots: exports.HistoricalBlockRoots,
        stateRoots: exports.HistoricalStateRoots,
    },
    casingMap: phase0_1.ssz.HistoricalBatch.casingMap,
});
exports.BeaconBlockBody = new ssz_1.ContainerType({
    fields: {
        ...phase0_1.ssz.BeaconBlockBody.fields,
        syncAggregate: exports.SyncAggregate,
    },
    casingMap: {
        ...phase0_1.ssz.BeaconBlockBody.casingMap,
        syncAggregate: "sync_aggregate",
    },
});
exports.BeaconBlock = new ssz_1.ContainerType({
    fields: {
        slot: Slot,
        proposerIndex: ValidatorIndex,
        // Reclare expandedType() with altair block and altair state
        parentRoot: new ssz_1.RootType({ expandedType: () => typesRef.get().BeaconBlock }),
        stateRoot: new ssz_1.RootType({ expandedType: () => typesRef.get().BeaconState }),
        body: exports.BeaconBlockBody,
    },
    casingMap: phase0_1.ssz.BeaconBlock.casingMap,
});
exports.SignedBeaconBlock = new ssz_1.ContainerType({
    fields: {
        message: exports.BeaconBlock,
        signature: BLSSignature,
    },
    expectedCase: "notransform",
});
exports.EpochParticipation = new ssz_1.ListType({ elementType: ParticipationFlags, limit: lodestar_params_1.VALIDATOR_REGISTRY_LIMIT });
exports.InactivityScores = new ssz_1.ListType({ elementType: Number64, limit: lodestar_params_1.VALIDATOR_REGISTRY_LIMIT });
// we don't reuse phase0.BeaconState fields since we need to replace some keys
// and we cannot keep order doing that
exports.BeaconState = new ssz_1.ContainerType({
    fields: {
        genesisTime: Number64,
        genesisValidatorsRoot: Root,
        slot: Slot,
        fork: phase0_1.ssz.Fork,
        // History
        latestBlockHeader: phase0_1.ssz.BeaconBlockHeader,
        blockRoots: exports.HistoricalBlockRoots,
        stateRoots: exports.HistoricalStateRoots,
        historicalRoots: new ssz_1.ListType({
            elementType: new ssz_1.RootType({ expandedType: exports.HistoricalBatch }),
            limit: lodestar_params_1.HISTORICAL_ROOTS_LIMIT,
        }),
        // Eth1
        eth1Data: phase0_1.ssz.Eth1Data,
        eth1DataVotes: phase0_1.ssz.Eth1DataVotes,
        eth1DepositIndex: Number64,
        // Registry
        validators: new ssz_1.ListType({ elementType: phase0_1.ssz.Validator, limit: lodestar_params_1.VALIDATOR_REGISTRY_LIMIT }),
        balances: new ssz_1.ListType({ elementType: Number64, limit: lodestar_params_1.VALIDATOR_REGISTRY_LIMIT }),
        randaoMixes: new ssz_1.VectorType({ elementType: Bytes32, length: lodestar_params_1.EPOCHS_PER_HISTORICAL_VECTOR }),
        // Slashings
        slashings: new ssz_1.VectorType({ elementType: Gwei, length: lodestar_params_1.EPOCHS_PER_SLASHINGS_VECTOR }),
        // Participation
        previousEpochParticipation: exports.EpochParticipation,
        currentEpochParticipation: exports.EpochParticipation,
        // Finality
        justificationBits: new ssz_1.BitVectorType({ length: lodestar_params_1.JUSTIFICATION_BITS_LENGTH }),
        previousJustifiedCheckpoint: phase0_1.ssz.Checkpoint,
        currentJustifiedCheckpoint: phase0_1.ssz.Checkpoint,
        finalizedCheckpoint: phase0_1.ssz.Checkpoint,
        // Inactivity
        inactivityScores: exports.InactivityScores,
        // Sync
        currentSyncCommittee: exports.SyncCommittee,
        nextSyncCommittee: exports.SyncCommittee,
    },
    casingMap: {
        ...phase0_1.ssz.BeaconState.casingMap,
        inactivityScores: "inactivity_scores",
        currentSyncCommittee: "current_sync_committee",
        nextSyncCommittee: "next_sync_committee",
    },
});
exports.LightClientSnapshot = new ssz_1.ContainerType({
    fields: {
        header: phase0_1.ssz.BeaconBlockHeader,
        nextSyncCommittee: exports.SyncCommittee,
        currentSyncCommittee: exports.SyncCommittee,
    },
    casingMap: {
        header: "header",
        nextSyncCommittee: "next_sync_committee",
        currentSyncCommittee: "current_sync_committee",
    },
});
exports.LightClientUpdate = new ssz_1.ContainerType({
    fields: {
        header: phase0_1.ssz.BeaconBlockHeader,
        nextSyncCommittee: exports.SyncCommittee,
        nextSyncCommitteeBranch: new ssz_1.VectorType({
            elementType: Bytes32,
            length: lodestar_params_1.NEXT_SYNC_COMMITTEE_DEPTH,
        }),
        finalityHeader: phase0_1.ssz.BeaconBlockHeader,
        finalityBranch: new ssz_1.VectorType({ elementType: Bytes32, length: lodestar_params_1.FINALIZED_ROOT_DEPTH }),
        syncCommitteeBits: new ssz_1.BitVectorType({ length: lodestar_params_1.SYNC_COMMITTEE_SIZE }),
        syncCommitteeSignature: BLSSignature,
        forkVersion: Version,
    },
    casingMap: {
        header: "header",
        nextSyncCommittee: "next_sync_committee",
        nextSyncCommitteeBranch: "next_sync_committee_branch",
        finalityHeader: "finality_header",
        finalityBranch: "finality_branch",
        syncCommitteeBits: "sync_committee_bits",
        syncCommitteeSignature: "sync_committee_signature",
        forkVersion: "fork_version",
    },
});
exports.LightClientStore = new ssz_1.ContainerType({
    fields: {
        snapshot: exports.LightClientSnapshot,
        validUpdates: new ssz_1.ListType({
            elementType: exports.LightClientUpdate,
            limit: lodestar_params_1.EPOCHS_PER_SYNC_COMMITTEE_PERIOD * lodestar_params_1.SLOTS_PER_EPOCH,
        }),
    },
    casingMap: {
        snapshot: "snapshot",
        validUpdates: "valid_updates",
    },
});
// MUST set typesRef here, otherwise expandedType() calls will throw
typesRef.set({ BeaconBlock: exports.BeaconBlock, BeaconState: exports.BeaconState });
//# sourceMappingURL=sszTypes.js.map