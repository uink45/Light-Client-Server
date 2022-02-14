import { PresetName } from "./preset";
export * from "./preset";
export { ForkName } from "./forkName";
/**
 * The preset name currently exported by this library
 *
 * The `LODESTAR_PRESET` environment variable is used to select the active preset
 * If `LODESTAR_PRESET` is not set, the default is `mainnet`.
 *
 * The active preset can be manually overridden with `setActivePreset`
 */
export declare const ACTIVE_PRESET: PresetName;
export declare const MAX_COMMITTEES_PER_SLOT: number, TARGET_COMMITTEE_SIZE: number, MAX_VALIDATORS_PER_COMMITTEE: number, SHUFFLE_ROUND_COUNT: number, HYSTERESIS_QUOTIENT: number, HYSTERESIS_DOWNWARD_MULTIPLIER: number, HYSTERESIS_UPWARD_MULTIPLIER: number, SAFE_SLOTS_TO_UPDATE_JUSTIFIED: number, MIN_DEPOSIT_AMOUNT: bigint, MAX_EFFECTIVE_BALANCE: number, EFFECTIVE_BALANCE_INCREMENT: number, MIN_ATTESTATION_INCLUSION_DELAY: number, SLOTS_PER_EPOCH: number, MIN_SEED_LOOKAHEAD: number, MAX_SEED_LOOKAHEAD: number, EPOCHS_PER_ETH1_VOTING_PERIOD: number, SLOTS_PER_HISTORICAL_ROOT: number, MIN_EPOCHS_TO_INACTIVITY_PENALTY: number, EPOCHS_PER_HISTORICAL_VECTOR: number, EPOCHS_PER_SLASHINGS_VECTOR: number, HISTORICAL_ROOTS_LIMIT: number, VALIDATOR_REGISTRY_LIMIT: number, BASE_REWARD_FACTOR: number, WHISTLEBLOWER_REWARD_QUOTIENT: number, PROPOSER_REWARD_QUOTIENT: number, INACTIVITY_PENALTY_QUOTIENT: number, MIN_SLASHING_PENALTY_QUOTIENT: number, PROPORTIONAL_SLASHING_MULTIPLIER: number, MAX_PROPOSER_SLASHINGS: number, MAX_ATTESTER_SLASHINGS: number, MAX_ATTESTATIONS: number, MAX_DEPOSITS: number, MAX_VOLUNTARY_EXITS: number, SYNC_COMMITTEE_SIZE: number, EPOCHS_PER_SYNC_COMMITTEE_PERIOD: number, INACTIVITY_PENALTY_QUOTIENT_ALTAIR: number, MIN_SLASHING_PENALTY_QUOTIENT_ALTAIR: number, PROPORTIONAL_SLASHING_MULTIPLIER_ALTAIR: number, INACTIVITY_PENALTY_QUOTIENT_MERGE: number, MIN_SLASHING_PENALTY_QUOTIENT_MERGE: number, PROPORTIONAL_SLASHING_MULTIPLIER_MERGE: number, MAX_BYTES_PER_TRANSACTION: number, MAX_TRANSACTIONS_PER_PAYLOAD: number, BYTES_PER_LOGS_BLOOM: number, MAX_EXTRA_DATA_BYTES: number;
export declare const GENESIS_SLOT = 0;
export declare const GENESIS_EPOCH = 0;
export declare const FAR_FUTURE_EPOCH: number;
export declare const BASE_REWARDS_PER_EPOCH = 4;
export declare const DEPOSIT_CONTRACT_TREE_DEPTH: number;
export declare const JUSTIFICATION_BITS_LENGTH = 4;
export declare const BLS_WITHDRAWAL_PREFIX: Uint8Array;
export declare const ETH1_ADDRESS_WITHDRAWAL_PREFIX: Uint8Array;
export declare const DOMAIN_BEACON_PROPOSER: Uint8Array;
export declare const DOMAIN_BEACON_ATTESTER: Uint8Array;
export declare const DOMAIN_RANDAO: Uint8Array;
export declare const DOMAIN_DEPOSIT: Uint8Array;
export declare const DOMAIN_VOLUNTARY_EXIT: Uint8Array;
export declare const DOMAIN_SELECTION_PROOF: Uint8Array;
export declare const DOMAIN_AGGREGATE_AND_PROOF: Uint8Array;
export declare const DOMAIN_SYNC_COMMITTEE: Uint8Array;
export declare const DOMAIN_SYNC_COMMITTEE_SELECTION_PROOF: Uint8Array;
export declare const DOMAIN_CONTRIBUTION_AND_PROOF: Uint8Array;
export declare const TIMELY_SOURCE_FLAG_INDEX = 0;
export declare const TIMELY_TARGET_FLAG_INDEX = 1;
export declare const TIMELY_HEAD_FLAG_INDEX = 2;
export declare const TIMELY_SOURCE_WEIGHT = 14;
export declare const TIMELY_TARGET_WEIGHT = 26;
export declare const TIMELY_HEAD_WEIGHT = 14;
export declare const SYNC_REWARD_WEIGHT = 2;
export declare const PROPOSER_WEIGHT = 8;
export declare const WEIGHT_DENOMINATOR = 64;
export declare const PARTICIPATION_FLAG_WEIGHTS: number[];
export declare const TARGET_AGGREGATORS_PER_COMMITTEE = 16;
export declare const RANDOM_SUBNETS_PER_VALIDATOR = 1;
export declare const EPOCHS_PER_RANDOM_SUBNET_SUBSCRIPTION = 256;
/** Rationale: https://github.com/ethereum/eth2.0-specs/blob/dev/specs/phase0/p2p-interface.md#why-are-there-attestation_subnet_count-attestation-subnets */
export declare const ATTESTATION_SUBNET_COUNT = 64;
export declare const TARGET_AGGREGATORS_PER_SYNC_SUBCOMMITTEE = 16;
export declare const SYNC_COMMITTEE_SUBNET_COUNT = 4;
export declare const MAX_REQUEST_BLOCKS: number;
export declare const GENESIS_GAS_LIMIT = 30000000;
export declare const GENESIS_BASE_FEE_PER_GAS: bigint;
export declare const MIN_SYNC_COMMITTEE_PARTICIPANTS = 1;
/**
 * ```ts
 * config.types.altair.BeaconState.getPathGindex(["finalizedCheckpoint", "root"])
 * ```
 */
export declare const FINALIZED_ROOT_GINDEX = 105;
/**
 * ```ts
 * Math.floor(Math.log2(FINALIZED_ROOT_GINDEX))
 * ```
 */
export declare const FINALIZED_ROOT_DEPTH = 6;
export declare const FINALIZED_ROOT_INDEX = 41;
/**
 * ```ts
 * config.types.altair.BeaconState.getPathGindex(["nextSyncCommittee"])
 * ```
 */
export declare const NEXT_SYNC_COMMITTEE_GINDEX = 55;
/**
 * ```ts
 * Math.floor(Math.log2(NEXT_SYNC_COMMITTEE_GINDEX))
 * ```
 */
export declare const NEXT_SYNC_COMMITTEE_DEPTH = 5;
export declare const NEXT_SYNC_COMMITTEE_INDEX = 23;
//# sourceMappingURL=index.d.ts.map