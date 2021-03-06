"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phase1Json = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
exports.phase1Json = {
    CONFIG_NAME: "minimal",
    // phase1-fork
    // ---------------------------------------------------------------
    // [customized] for testnet distinction
    PHASE_1_FORK_VERSION: "0x01000001",
    // [STUB]
    PHASE_1_FORK_SLOT: "0xffffffffffffffff",
    // [customized] reduced for testing
    INITIAL_ACTIVE_SHARDS: 2,
    // beacon-chain
    // ---------------------------------------------------------------
    // Misc
    // [customized] reduced for testing
    MAX_SHARDS: 8,
    // 2**7 (= 128)
    LIGHT_CLIENT_COMMITTEE_SIZE: 128,
    //  2**3 (= 8)
    GASPRICE_ADJUSTMENT_COEFFICIENT: 8,
    // Shard block configs
    // 2**20 (= 1048,576) bytes
    MAX_SHARD_BLOCK_SIZE: 1048576,
    // 2**18 (= 262,144) bytes
    TARGET_SHARD_BLOCK_SIZE: 262144,
    // Note: MAX_SHARD_BLOCKS_PER_ATTESTATION is derived from the list length.
    SHARD_BLOCK_OFFSETS: [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233],
    // len(SHARD_BLOCK_OFFSETS)
    MAX_SHARD_BLOCKS_PER_ATTESTATION: 12,
    // 2**12 (= 4,096)
    BYTES_PER_CUSTODY_CHUNK: 4096,
    // ceillog2(MAX_SHARD_BLOCK_SIZE // BYTES_PER_CUSTODY_CHUNK)
    CUSTODY_RESPONSE_DEPTH: 8,
    // Gwei values
    // 2**14 (= 16,384) Gwei
    MAX_GASPRICE: 16384,
    // 2**3 (= 8) Gwei
    MIN_GASPRICE: 8,
    // Time parameters
    // 2**3 (= 8) | online epochs
    ONLINE_PERIOD: 8,
    // 2**8 (= 256) | epochs
    LIGHT_CLIENT_COMMITTEE_PERIOD: 256,
    // Max operations per block
    // 2**20 (= 1,048,576)
    MAX_CUSTODY_CHUNK_CHALLENGE_RECORDS: 1048576,
    // Domain types
    DOMAIN_SHARD_PROPOSAL: "0x80000000",
    DOMAIN_SHARD_COMMITTEE: "0x81000000",
    DOMAIN_LIGHT_CLIENT: "0x82000000",
    // custody-game spec
    DOMAIN_CUSTODY_BIT_SLASHING: "0x83000000",
    DOMAIN_LIGHT_SELECTION_PROOF: "0x84000000",
    DOMAIN_LIGHT_AGGREGATE_AND_PROOF: "0x85000000",
    // custody-game
    // ---------------------------------------------------------------
    // Time parameters
    // 2**1 (= 2) epochs
    RANDAO_PENALTY_EPOCHS: 2,
    // [customized] quicker for testing
    EARLY_DERIVED_SECRET_PENALTY_MAX_FUTURE_EPOCHS: 64,
    // [customized] quicker for testing
    EPOCHS_PER_CUSTODY_PERIOD: 32,
    // [customized] quicker for testing
    CUSTODY_PERIOD_TO_RANDAO_PADDING: 8,
    // [customize for faster testing]
    MAX_CHUNK_CHALLENGE_DELAY: 64,
    // Misc parameters
    // 2**256 - 189
    CUSTODY_PRIME: "115792089237316195423570985008687907853269984665640564039457584007913129639747",
    // 3
    CUSTODY_SECRETS: 3,
    // 2**5 (= 32) bytes
    BYTES_PER_CUSTODY_ATOM: 32,
    // 1/4 chance of custody bit 1 [customized for faster testing]
    CUSTODY_PROBABILITY_EXPONENT: 2,
    // Max operations
    // 2**8 (= 256)
    MAX_CUSTODY_KEY_REVEALS: 256,
    // 2**0 (= 1)
    MAX_EARLY_DERIVED_SECRET_REVEALS: 1,
    // [customized]
    MAX_CUSTODY_CHUNK_CHALLENGES: 2,
    // [customized]
    MAX_CUSTODY_CHUNK_CHALLENGE_RESP: 8,
    // 2**0 (= 1)
    MAX_CUSTODY_SLASHINGS: 1,
    // Reward and penalty quotients
    EARLY_DERIVED_SECRET_REVEAL_SLOT_REWARD_MULTIPLE: 2,
    // 2**8 (= 256)
    MINOR_REWARD_QUOTIENT: 256,
};
//# sourceMappingURL=phase1.js.map