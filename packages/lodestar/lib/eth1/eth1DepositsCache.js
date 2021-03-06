"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eth1DepositsCache = void 0;
const lodestar_types_1 = require("@chainsafe/lodestar-types");
const ssz_1 = require("@chainsafe/ssz");
const eth1Data_1 = require("./utils/eth1Data");
const eth1DepositEvent_1 = require("./utils/eth1DepositEvent");
const deposits_1 = require("./utils/deposits");
const errors_1 = require("./errors");
class Eth1DepositsCache {
    constructor(opts, config, db) {
        this.config = config;
        this.db = db;
        this.unsafeAllowDepositDataOverwrite = opts.unsafeAllowDepositDataOverwrite;
    }
    /**
     * Returns a list of `Deposit` objects, within the given deposit index `range`.
     *
     * The `depositCount` is used to generate the proofs for the `Deposits`. For example, if we
     * have 100 proofs, but the Ethereum Consensus chain only acknowledges 50 of them, we must produce our
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
        // Check, validate and skip if we got any deposit events already present in DB
        // This can happen if the remote eth1/EL resets its head in these four scenarios:
        //   1. Remote eth1/EL resynced/restarted from head behind its previous head pre-merge
        //   2. In a post merge scenario, Lodestar restarted from finalized state from DB which
        //      generally is a few epochs behind the last synced head. This causes eth1 tracker to reset
        //      and refetch the deposits as the lodestar syncs further along (Post merge there is 1-1
        //      correspondence between EL and CL blocks)
        //   3. The EL reorged beyond the eth1 follow distance.
        //
        // While 1. & 2. are benign and we handle them below by checking if the duplicate log fetched
        // is same as one written in DB. Refer to this issue for some data dump of how this happens
        // https://github.com/ChainSafe/lodestar/issues/3674
        //
        // If the duplicate log fetched is not same as written in DB then its probablu scenario 3.
        // which would be a catastrophic event for the network (or we messed up real bad!!!).
        //
        // So we provide for a way to overwrite this log without deleting full db via
        // --unsafeAllowDepositDataOverwrite cli flag which will just overwrite the previous tracker data
        // if any. This option as indicated by its name is unsafe and to be only used if you know what
        // you are doing.
        if (lastLog !== null && firstEvent !== undefined) {
            const newIndex = firstEvent.index;
            const lastLogIndex = lastLog.index;
            if (!this.unsafeAllowDepositDataOverwrite && firstEvent.index <= lastLog.index) {
                // lastLogIndex - newIndex + 1 events are duplicate since this is a consecutive log
                // as asserted by assertConsecutiveDeposits. Splice those events out from depositEvents.
                const skipEvents = depositEvents.splice(0, lastLogIndex - newIndex + 1);
                // After splicing skipEvents will contain duplicate events to be checked and validated
                // and rest of the remaining events in depositEvents could be safely written to DB and
                // move the tracker along.
                for (const depositEvent of skipEvents) {
                    const prevDBSerializedEvent = await this.db.depositEvent.getBinary(depositEvent.index);
                    if (!prevDBSerializedEvent) {
                        throw new errors_1.Eth1Error({ code: errors_1.Eth1ErrorCode.MISSING_DEPOSIT_LOG, newIndex, lastLogIndex });
                    }
                    const serializedEvent = lodestar_types_1.ssz.phase0.DepositEvent.serialize(depositEvent);
                    if (!(0, ssz_1.byteArrayEquals)(prevDBSerializedEvent, serializedEvent)) {
                        throw new errors_1.Eth1Error({ code: errors_1.Eth1ErrorCode.DUPLICATE_DISTINCT_LOG, newIndex, lastLogIndex });
                    }
                }
            }
            else if (newIndex > lastLogIndex + 1) {
                // deposit events need to be consective, the way we fetch our tracker. If the deposit event
                // is not consecutive it means either our tracker, or the corresponding eth1/EL
                // node or the database has messed up. All these failures are critical and the tracker
                // shouldn't proceed without the resolution of this error.
                throw new errors_1.Eth1Error({ code: errors_1.Eth1ErrorCode.NON_CONSECUTIVE_LOGS, newIndex, lastLogIndex });
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