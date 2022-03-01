"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phase0 = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
exports.phase0 = {
    // Misc
    // ---------------------------------------------------------------
    // 2**6 (= 64)
    MAX_COMMITTEES_PER_SLOT: 64,
    // 2**7 (= 128)
    TARGET_COMMITTEE_SIZE: 128,
    // 2**11 (= 2,048)
    MAX_VALIDATORS_PER_COMMITTEE: 2048,
    // See issue 563
    SHUFFLE_ROUND_COUNT: 90,
    // 4
    HYSTERESIS_QUOTIENT: 4,
    // 1 (minus 0.25)
    HYSTERESIS_DOWNWARD_MULTIPLIER: 1,
    // 5 (plus 1.25)
    HYSTERESIS_UPWARD_MULTIPLIER: 5,
    // Fork Choice
    // ---------------------------------------------------------------
    // 2**3 (= 8)
    SAFE_SLOTS_TO_UPDATE_JUSTIFIED: 8,
    // Gwei values
    // ---------------------------------------------------------------
    // 2**0 * 10**9 (= 1,000,000,000) Gwei
    MIN_DEPOSIT_AMOUNT: 1000000000,
    // 2**5 * 10**9 (= 32,000,000,000) Gwei
    MAX_EFFECTIVE_BALANCE: 32000000000,
    // 2**0 * 10**9 (= 1,000,000,000) Gwei
    EFFECTIVE_BALANCE_INCREMENT: 1000000000,
    // Time parameters
    // ---------------------------------------------------------------
    // 2**0 (= 1) slots 12 seconds
    MIN_ATTESTATION_INCLUSION_DELAY: 1,
    // 2**5 (= 32) slots 6.4 minutes
    SLOTS_PER_EPOCH: 32,
    // 2**0 (= 1) epochs 6.4 minutes
    MIN_SEED_LOOKAHEAD: 1,
    // 2**2 (= 4) epochs 25.6 minutes
    MAX_SEED_LOOKAHEAD: 4,
    // 2**6 (= 64) epochs ~6.8 hours
    EPOCHS_PER_ETH1_VOTING_PERIOD: 64,
    // 2**13 (= 8,192) slots ~13 hours
    SLOTS_PER_HISTORICAL_ROOT: 8192,
    // 2**2 (= 4) epochs 25.6 minutes
    MIN_EPOCHS_TO_INACTIVITY_PENALTY: 4,
    // State vector lengths
    // ---------------------------------------------------------------
    // 2**16 (= 65,536) epochs ~0.8 years
    EPOCHS_PER_HISTORICAL_VECTOR: 65536,
    // 2**13 (= 8,192) epochs ~36 days
    EPOCHS_PER_SLASHINGS_VECTOR: 8192,
    // 2**24 (= 16,777,216) historical roots, ~26,131 years
    HISTORICAL_ROOTS_LIMIT: 16777216,
    // 2**40 (= 1,099,511,627,776) validator spots
    VALIDATOR_REGISTRY_LIMIT: 1099511627776,
    // Reward and penalty quotients
    // ---------------------------------------------------------------
    // 2**6 (= 64)
    BASE_REWARD_FACTOR: 64,
    // 2**9 (= 512)
    WHISTLEBLOWER_REWARD_QUOTIENT: 512,
    // 2**3 (= 8)
    PROPOSER_REWARD_QUOTIENT: 8,
    // 2**26 (= 67,108,864)
    INACTIVITY_PENALTY_QUOTIENT: 67108864,
    // 2**7 (= 128) (lower safety margin at Phase 0 genesis)
    MIN_SLASHING_PENALTY_QUOTIENT: 128,
    PROPORTIONAL_SLASHING_MULTIPLIER: 1,
    // Max operations per block
    // ---------------------------------------------------------------
    // 2**4 (= 16)
    MAX_PROPOSER_SLASHINGS: 16,
    // 2**1 (= 2)
    MAX_ATTESTER_SLASHINGS: 2,
    // 2**7 (= 128)
    MAX_ATTESTATIONS: 128,
    // 2**4 (= 16)
    MAX_DEPOSITS: 16,
    // 2**4 (= 16)
    MAX_VOLUNTARY_EXITS: 16,
};
//# sourceMappingURL=phase0.js.map