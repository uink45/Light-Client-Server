"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kilnChainConfig = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const ssz_1 = require("@chainsafe/ssz");
const mainnet_1 = require("../presets/mainnet");
/* eslint-disable max-len */
exports.kilnChainConfig = {
    ...mainnet_1.chainConfig,
    MIN_GENESIS_ACTIVE_VALIDATOR_COUNT: 95000,
    // Mar 11th, 2022, 14:00 UTC
    MIN_GENESIS_TIME: 1647007200,
    // Gensis fork
    GENESIS_FORK_VERSION: (0, ssz_1.fromHexString)("0x70000069"),
    // 300 seconds (5 min)
    GENESIS_DELAY: 300,
    // Forking
    ALTAIR_FORK_VERSION: (0, ssz_1.fromHexString)("0x70000070"),
    ALTAIR_FORK_EPOCH: 50,
    // Bellatrix
    BELLATRIX_FORK_VERSION: (0, ssz_1.fromHexString)("0x70000071"),
    BELLATRIX_FORK_EPOCH: 150,
    TERMINAL_TOTAL_DIFFICULTY: BigInt(20000000000000),
    // Sharding
    SHARDING_FORK_VERSION: (0, ssz_1.fromHexString)("0x03000000"),
    SHARDING_FORK_EPOCH: Infinity,
    // Time parameters
    // ---------------------------------------------------------------
    // 16 blocks is ~190s
    ETH1_FOLLOW_DISTANCE: 16,
    // Deposit contract
    // ---------------------------------------------------------------
    // Custom Ethereum testnet
    DEPOSIT_CHAIN_ID: 1337802,
    DEPOSIT_NETWORK_ID: 1337802,
    DEPOSIT_CONTRACT_ADDRESS: (0, ssz_1.fromHexString)("0x4242424242424242424242424242424242424242"),
};
//# sourceMappingURL=kiln.js.map