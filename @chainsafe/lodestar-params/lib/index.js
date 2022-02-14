"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var _a;
var _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAR_FUTURE_EPOCH = exports.GENESIS_EPOCH = exports.GENESIS_SLOT = exports.MAX_EXTRA_DATA_BYTES = exports.BYTES_PER_LOGS_BLOOM = exports.MAX_TRANSACTIONS_PER_PAYLOAD = exports.MAX_BYTES_PER_TRANSACTION = exports.PROPORTIONAL_SLASHING_MULTIPLIER_MERGE = exports.MIN_SLASHING_PENALTY_QUOTIENT_MERGE = exports.INACTIVITY_PENALTY_QUOTIENT_MERGE = exports.PROPORTIONAL_SLASHING_MULTIPLIER_ALTAIR = exports.MIN_SLASHING_PENALTY_QUOTIENT_ALTAIR = exports.INACTIVITY_PENALTY_QUOTIENT_ALTAIR = exports.EPOCHS_PER_SYNC_COMMITTEE_PERIOD = exports.SYNC_COMMITTEE_SIZE = exports.MAX_VOLUNTARY_EXITS = exports.MAX_DEPOSITS = exports.MAX_ATTESTATIONS = exports.MAX_ATTESTER_SLASHINGS = exports.MAX_PROPOSER_SLASHINGS = exports.PROPORTIONAL_SLASHING_MULTIPLIER = exports.MIN_SLASHING_PENALTY_QUOTIENT = exports.INACTIVITY_PENALTY_QUOTIENT = exports.PROPOSER_REWARD_QUOTIENT = exports.WHISTLEBLOWER_REWARD_QUOTIENT = exports.BASE_REWARD_FACTOR = exports.VALIDATOR_REGISTRY_LIMIT = exports.HISTORICAL_ROOTS_LIMIT = exports.EPOCHS_PER_SLASHINGS_VECTOR = exports.EPOCHS_PER_HISTORICAL_VECTOR = exports.MIN_EPOCHS_TO_INACTIVITY_PENALTY = exports.SLOTS_PER_HISTORICAL_ROOT = exports.EPOCHS_PER_ETH1_VOTING_PERIOD = exports.MAX_SEED_LOOKAHEAD = exports.MIN_SEED_LOOKAHEAD = exports.SLOTS_PER_EPOCH = exports.MIN_ATTESTATION_INCLUSION_DELAY = exports.EFFECTIVE_BALANCE_INCREMENT = exports.MAX_EFFECTIVE_BALANCE = exports.MIN_DEPOSIT_AMOUNT = exports.SAFE_SLOTS_TO_UPDATE_JUSTIFIED = exports.HYSTERESIS_UPWARD_MULTIPLIER = exports.HYSTERESIS_DOWNWARD_MULTIPLIER = exports.HYSTERESIS_QUOTIENT = exports.SHUFFLE_ROUND_COUNT = exports.MAX_VALIDATORS_PER_COMMITTEE = exports.TARGET_COMMITTEE_SIZE = exports.MAX_COMMITTEES_PER_SLOT = exports.ACTIVE_PRESET = exports.ForkName = void 0;
exports.NEXT_SYNC_COMMITTEE_INDEX = exports.NEXT_SYNC_COMMITTEE_DEPTH = exports.NEXT_SYNC_COMMITTEE_GINDEX = exports.FINALIZED_ROOT_INDEX = exports.FINALIZED_ROOT_DEPTH = exports.FINALIZED_ROOT_GINDEX = exports.MIN_SYNC_COMMITTEE_PARTICIPANTS = exports.GENESIS_BASE_FEE_PER_GAS = exports.GENESIS_GAS_LIMIT = exports.MAX_REQUEST_BLOCKS = exports.SYNC_COMMITTEE_SUBNET_COUNT = exports.TARGET_AGGREGATORS_PER_SYNC_SUBCOMMITTEE = exports.ATTESTATION_SUBNET_COUNT = exports.EPOCHS_PER_RANDOM_SUBNET_SUBSCRIPTION = exports.RANDOM_SUBNETS_PER_VALIDATOR = exports.TARGET_AGGREGATORS_PER_COMMITTEE = exports.PARTICIPATION_FLAG_WEIGHTS = exports.WEIGHT_DENOMINATOR = exports.PROPOSER_WEIGHT = exports.SYNC_REWARD_WEIGHT = exports.TIMELY_HEAD_WEIGHT = exports.TIMELY_TARGET_WEIGHT = exports.TIMELY_SOURCE_WEIGHT = exports.TIMELY_HEAD_FLAG_INDEX = exports.TIMELY_TARGET_FLAG_INDEX = exports.TIMELY_SOURCE_FLAG_INDEX = exports.DOMAIN_CONTRIBUTION_AND_PROOF = exports.DOMAIN_SYNC_COMMITTEE_SELECTION_PROOF = exports.DOMAIN_SYNC_COMMITTEE = exports.DOMAIN_AGGREGATE_AND_PROOF = exports.DOMAIN_SELECTION_PROOF = exports.DOMAIN_VOLUNTARY_EXIT = exports.DOMAIN_DEPOSIT = exports.DOMAIN_RANDAO = exports.DOMAIN_BEACON_ATTESTER = exports.DOMAIN_BEACON_PROPOSER = exports.ETH1_ADDRESS_WITHDRAWAL_PREFIX = exports.BLS_WITHDRAWAL_PREFIX = exports.JUSTIFICATION_BITS_LENGTH = exports.DEPOSIT_CONTRACT_TREE_DEPTH = exports.BASE_REWARDS_PER_EPOCH = void 0;
const preset_1 = require("./preset");
const mainnet_1 = require("./presets/mainnet");
const minimal_1 = require("./presets/minimal");
const presetStatus_1 = require("./presetStatus");
const setPreset_1 = require("./setPreset");
__exportStar(require("./preset"), exports);
var forkName_1 = require("./forkName");
Object.defineProperty(exports, "ForkName", { enumerable: true, get: function () { return forkName_1.ForkName; } });
const presets = {
    [preset_1.PresetName.mainnet]: mainnet_1.preset,
    [preset_1.PresetName.minimal]: minimal_1.preset,
};
// Once this file is imported, freeze the preset so calling setActivePreset() will throw an error
presetStatus_1.presetStatus.frozen = true;
/**
 * The preset name currently exported by this library
 *
 * The `LODESTAR_PRESET` environment variable is used to select the active preset
 * If `LODESTAR_PRESET` is not set, the default is `mainnet`.
 *
 * The active preset can be manually overridden with `setActivePreset`
 */
exports.ACTIVE_PRESET = setPreset_1.userSelectedPreset || preset_1.PresetName[(_b = process === null || process === void 0 ? void 0 : process.env) === null || _b === void 0 ? void 0 : _b.LODESTAR_PRESET] || preset_1.PresetName.mainnet;
// These variables must be exported individually and explicitly
// in order to be accessible as top-level exports
_a = presets[exports.ACTIVE_PRESET], exports.MAX_COMMITTEES_PER_SLOT = _a.MAX_COMMITTEES_PER_SLOT, exports.TARGET_COMMITTEE_SIZE = _a.TARGET_COMMITTEE_SIZE, exports.MAX_VALIDATORS_PER_COMMITTEE = _a.MAX_VALIDATORS_PER_COMMITTEE, exports.SHUFFLE_ROUND_COUNT = _a.SHUFFLE_ROUND_COUNT, exports.HYSTERESIS_QUOTIENT = _a.HYSTERESIS_QUOTIENT, exports.HYSTERESIS_DOWNWARD_MULTIPLIER = _a.HYSTERESIS_DOWNWARD_MULTIPLIER, exports.HYSTERESIS_UPWARD_MULTIPLIER = _a.HYSTERESIS_UPWARD_MULTIPLIER, exports.SAFE_SLOTS_TO_UPDATE_JUSTIFIED = _a.SAFE_SLOTS_TO_UPDATE_JUSTIFIED, exports.MIN_DEPOSIT_AMOUNT = _a.MIN_DEPOSIT_AMOUNT, exports.MAX_EFFECTIVE_BALANCE = _a.MAX_EFFECTIVE_BALANCE, exports.EFFECTIVE_BALANCE_INCREMENT = _a.EFFECTIVE_BALANCE_INCREMENT, exports.MIN_ATTESTATION_INCLUSION_DELAY = _a.MIN_ATTESTATION_INCLUSION_DELAY, exports.SLOTS_PER_EPOCH = _a.SLOTS_PER_EPOCH, exports.MIN_SEED_LOOKAHEAD = _a.MIN_SEED_LOOKAHEAD, exports.MAX_SEED_LOOKAHEAD = _a.MAX_SEED_LOOKAHEAD, exports.EPOCHS_PER_ETH1_VOTING_PERIOD = _a.EPOCHS_PER_ETH1_VOTING_PERIOD, exports.SLOTS_PER_HISTORICAL_ROOT = _a.SLOTS_PER_HISTORICAL_ROOT, exports.MIN_EPOCHS_TO_INACTIVITY_PENALTY = _a.MIN_EPOCHS_TO_INACTIVITY_PENALTY, exports.EPOCHS_PER_HISTORICAL_VECTOR = _a.EPOCHS_PER_HISTORICAL_VECTOR, exports.EPOCHS_PER_SLASHINGS_VECTOR = _a.EPOCHS_PER_SLASHINGS_VECTOR, exports.HISTORICAL_ROOTS_LIMIT = _a.HISTORICAL_ROOTS_LIMIT, exports.VALIDATOR_REGISTRY_LIMIT = _a.VALIDATOR_REGISTRY_LIMIT, exports.BASE_REWARD_FACTOR = _a.BASE_REWARD_FACTOR, exports.WHISTLEBLOWER_REWARD_QUOTIENT = _a.WHISTLEBLOWER_REWARD_QUOTIENT, exports.PROPOSER_REWARD_QUOTIENT = _a.PROPOSER_REWARD_QUOTIENT, exports.INACTIVITY_PENALTY_QUOTIENT = _a.INACTIVITY_PENALTY_QUOTIENT, exports.MIN_SLASHING_PENALTY_QUOTIENT = _a.MIN_SLASHING_PENALTY_QUOTIENT, exports.PROPORTIONAL_SLASHING_MULTIPLIER = _a.PROPORTIONAL_SLASHING_MULTIPLIER, exports.MAX_PROPOSER_SLASHINGS = _a.MAX_PROPOSER_SLASHINGS, exports.MAX_ATTESTER_SLASHINGS = _a.MAX_ATTESTER_SLASHINGS, exports.MAX_ATTESTATIONS = _a.MAX_ATTESTATIONS, exports.MAX_DEPOSITS = _a.MAX_DEPOSITS, exports.MAX_VOLUNTARY_EXITS = _a.MAX_VOLUNTARY_EXITS, exports.SYNC_COMMITTEE_SIZE = _a.SYNC_COMMITTEE_SIZE, exports.EPOCHS_PER_SYNC_COMMITTEE_PERIOD = _a.EPOCHS_PER_SYNC_COMMITTEE_PERIOD, exports.INACTIVITY_PENALTY_QUOTIENT_ALTAIR = _a.INACTIVITY_PENALTY_QUOTIENT_ALTAIR, exports.MIN_SLASHING_PENALTY_QUOTIENT_ALTAIR = _a.MIN_SLASHING_PENALTY_QUOTIENT_ALTAIR, exports.PROPORTIONAL_SLASHING_MULTIPLIER_ALTAIR = _a.PROPORTIONAL_SLASHING_MULTIPLIER_ALTAIR, exports.INACTIVITY_PENALTY_QUOTIENT_MERGE = _a.INACTIVITY_PENALTY_QUOTIENT_MERGE, exports.MIN_SLASHING_PENALTY_QUOTIENT_MERGE = _a.MIN_SLASHING_PENALTY_QUOTIENT_MERGE, exports.PROPORTIONAL_SLASHING_MULTIPLIER_MERGE = _a.PROPORTIONAL_SLASHING_MULTIPLIER_MERGE, exports.MAX_BYTES_PER_TRANSACTION = _a.MAX_BYTES_PER_TRANSACTION, exports.MAX_TRANSACTIONS_PER_PAYLOAD = _a.MAX_TRANSACTIONS_PER_PAYLOAD, exports.BYTES_PER_LOGS_BLOOM = _a.BYTES_PER_LOGS_BLOOM, exports.MAX_EXTRA_DATA_BYTES = _a.MAX_EXTRA_DATA_BYTES;
////////////
// Constants
////////////
// Exported directly on the index for faster accessing without commonjs compiled star import shenanigans
// Misc
exports.GENESIS_SLOT = 0;
exports.GENESIS_EPOCH = 0;
exports.FAR_FUTURE_EPOCH = Infinity;
exports.BASE_REWARDS_PER_EPOCH = 4;
exports.DEPOSIT_CONTRACT_TREE_DEPTH = 2 ** 5; // 32
exports.JUSTIFICATION_BITS_LENGTH = 4;
// Withdrawal prefixes
exports.BLS_WITHDRAWAL_PREFIX = Uint8Array.from([0]);
exports.ETH1_ADDRESS_WITHDRAWAL_PREFIX = Uint8Array.from([1]);
// Domain types
exports.DOMAIN_BEACON_PROPOSER = Uint8Array.from([0, 0, 0, 0]);
exports.DOMAIN_BEACON_ATTESTER = Uint8Array.from([1, 0, 0, 0]);
exports.DOMAIN_RANDAO = Uint8Array.from([2, 0, 0, 0]);
exports.DOMAIN_DEPOSIT = Uint8Array.from([3, 0, 0, 0]);
exports.DOMAIN_VOLUNTARY_EXIT = Uint8Array.from([4, 0, 0, 0]);
exports.DOMAIN_SELECTION_PROOF = Uint8Array.from([5, 0, 0, 0]);
exports.DOMAIN_AGGREGATE_AND_PROOF = Uint8Array.from([6, 0, 0, 0]);
exports.DOMAIN_SYNC_COMMITTEE = Uint8Array.from([7, 0, 0, 0]);
exports.DOMAIN_SYNC_COMMITTEE_SELECTION_PROOF = Uint8Array.from([8, 0, 0, 0]);
exports.DOMAIN_CONTRIBUTION_AND_PROOF = Uint8Array.from([9, 0, 0, 0]);
// Participation flag indices
exports.TIMELY_SOURCE_FLAG_INDEX = 0;
exports.TIMELY_TARGET_FLAG_INDEX = 1;
exports.TIMELY_HEAD_FLAG_INDEX = 2;
// Incentivization weights
exports.TIMELY_SOURCE_WEIGHT = 14;
exports.TIMELY_TARGET_WEIGHT = 26;
exports.TIMELY_HEAD_WEIGHT = 14;
exports.SYNC_REWARD_WEIGHT = 2;
exports.PROPOSER_WEIGHT = 8;
exports.WEIGHT_DENOMINATOR = 64;
// altair misc
exports.PARTICIPATION_FLAG_WEIGHTS = [exports.TIMELY_SOURCE_WEIGHT, exports.TIMELY_TARGET_WEIGHT, exports.TIMELY_HEAD_WEIGHT];
// phase0 validator
exports.TARGET_AGGREGATORS_PER_COMMITTEE = 16;
exports.RANDOM_SUBNETS_PER_VALIDATOR = 1;
exports.EPOCHS_PER_RANDOM_SUBNET_SUBSCRIPTION = 256;
/** Rationale: https://github.com/ethereum/eth2.0-specs/blob/dev/specs/phase0/p2p-interface.md#why-are-there-attestation_subnet_count-attestation-subnets */
exports.ATTESTATION_SUBNET_COUNT = 64;
// altair validator
exports.TARGET_AGGREGATORS_PER_SYNC_SUBCOMMITTEE = 16;
exports.SYNC_COMMITTEE_SUBNET_COUNT = 4;
exports.MAX_REQUEST_BLOCKS = 2 ** 10; // 1024
// Merge constants - Spec v1.0.1
// Genesis testing settings
// Note: These configuration settings do not apply to the mainnet and are utilized only by pure Merge testing.
exports.GENESIS_GAS_LIMIT = 30000000;
exports.GENESIS_BASE_FEE_PER_GAS = BigInt(1000000000);
//
exports.MIN_SYNC_COMMITTEE_PARTICIPANTS = 1;
// Lightclient pre-computed
/**
 * ```ts
 * config.types.altair.BeaconState.getPathGindex(["finalizedCheckpoint", "root"])
 * ```
 */
exports.FINALIZED_ROOT_GINDEX = 105;
/**
 * ```ts
 * Math.floor(Math.log2(FINALIZED_ROOT_GINDEX))
 * ```
 */
exports.FINALIZED_ROOT_DEPTH = 6;
exports.FINALIZED_ROOT_INDEX = 41;
/**
 * ```ts
 * config.types.altair.BeaconState.getPathGindex(["nextSyncCommittee"])
 * ```
 */
exports.NEXT_SYNC_COMMITTEE_GINDEX = 55;
/**
 * ```ts
 * Math.floor(Math.log2(NEXT_SYNC_COMMITTEE_GINDEX))
 * ```
 */
exports.NEXT_SYNC_COMMITTEE_DEPTH = 5;
exports.NEXT_SYNC_COMMITTEE_INDEX = 23;
//# sourceMappingURL=index.js.map