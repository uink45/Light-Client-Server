"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eth1DepositsCache = void 0;
const lodestar_types_1 = require("@chainsafe/lodestar-types");
const eth1Data_1 = require("./utils/eth1Data");
const eth1DepositEvent_1 = require("./utils/eth1DepositEvent");
const deposits_1 = require("./utils/deposits");
const errors_1 = require("./errors");
class Eth1DepositsCache {
    constructor(config, db) {
        this.config = config;
        this.db = db;
    }
    /**
     * Returns a list of `Deposit` objects, within the given deposit index `range`.
     *
     * The `depositCount` is used to generate the proofs for the `Deposits`. For example, if we
     * have 100 proofs, but the eth2 chain only acknowledges 50 of them, we must produce our
     * proofs with respect to a tree size of 50.
     */
    async get(indexRange, eth1Data) {
        const depositEvents = await this.db.depositEvent.values(indexRange);
        const depositRootTree = await this.db.depositDataRoot.getDepositRootTree();
        return (0, deposits_1.getDepositsWithProofs)(depositEvents, depositRootTree, eth1Data);
    }
    /**
     * Add log to cache
     * This function enforces that `logs` are imported one-by-one with consecutive indexes
     */
    async add(depositEvents) {
        (0, eth1DepositEvent_1.assertConsecutiveDeposits)(depositEvents);
        const lastLog = await this.db.depositEvent.lastValue();
        const firstEvent = depositEvents[0];
        if (lastLog !== null && firstEvent !== undefined) {
            const newIndex = firstEvent.index;
            const prevIndex = lastLog.index;
            if (newIndex <= prevIndex) {
                throw new errors_1.Eth1Error({ code: errors_1.Eth1ErrorCode.DUPLICATE_DISTINCT_LOG, newIndex, prevIndex });
            }
            if (newIndex > prevIndex + 1) {
                throw new errors_1.Eth1Error({ code: errors_1.Eth1ErrorCode.NON_CONSECUTIVE_LOGS, newIndex, prevIndex });
            }
        }
        const depositRoots = depositEvents.map((depositEvent) => ({
            index: depositEvent.index,
            root: lodestar_types_1.ssz.phase0.DepositData.hashTreeRoot(depositEvent.depositData),
        }));
        // Store events after verifying that data is consecutive
        // depositDataRoot will throw if adding non consecutive roots
        await this.db.depositDataRoot.batchPutValues(depositRoots);
        await this.db.depositEvent.batchPutValues(depositEvents);
    }
    /**
     * Appends partial eth1 data (depositRoot, depositCount) in a block range (inclusive)
     * Returned array is sequential and ascending in blockNumber
     * @param fromBlock
     * @param toBlock
     */
    async getEth1DataForBlocks(blocks, lastProcessedDepositBlockNumber) {
        var _a;
        const highestBlock = (_a = blocks[blocks.length - 1]) === null || _a === void 0 ? void 0 : _a.blockNumber;
        return await (0, eth1Data_1.getEth1DataForBlocks)(blocks, this.db.depositEvent.valuesStream({ lte: highestBlock, reverse: true }), await this.db.depositDataRoot.getDepositRootTree(), lastProcessedDepositBlockNumber);
    }
    /**
     * Returns the highest blockNumber stored in DB if any
     */
    async getHighestDepositEventBlockNumber() {
        const latestEvent = await this.db.depositEvent.lastValue();
        return latestEvent && latestEvent.blockNumber;
    }
    /**
     * Returns the lowest blockNumber stored in DB if any
     */
    async getLowestDepositEventBlockNumber() {
        const firstEvent = await this.db.depositEvent.firstValue();
        return firstEvent && firstEvent.blockNumber;
    }
}
exports.Eth1DepositsCache = Eth1DepositsCache;
//# sourceMappingURL=eth1DepositsCache.js.map