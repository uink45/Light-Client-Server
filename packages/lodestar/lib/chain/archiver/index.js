"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Archiver = void 0;
const __1 = require("..");
const archiveBlocks_1 = require("./archiveBlocks");
const archiveStates_1 = require("./archiveStates");
const queue_1 = require("../../util/queue");
const PROCESS_FINALIZED_CHECKPOINT_QUEUE_LEN = 256;
/**
 * Used for running tasks that depends on some events or are executed
 * periodically.
 */
class Archiver {
    constructor(db, chain, logger, signal) {
        this.db = db;
        this.chain = chain;
        this.logger = logger;
        this.onFinalizedCheckpoint = async (finalized) => {
            return this.jobQueue.push(finalized);
        };
        this.onCheckpoint = () => {
            const headStateRoot = this.chain.forkChoice.getHead().stateRoot;
            this.chain.checkpointStateCache.prune(this.chain.forkChoice.getFinalizedCheckpoint().epoch, this.chain.forkChoice.getJustifiedCheckpoint().epoch);
            this.chain.stateCache.prune(headStateRoot);
        };
        this.processFinalizedCheckpoint = async (finalized) => {
            try {
                const finalizedEpoch = finalized.epoch;
                this.logger.verbose("Start processing finalized checkpoint", { epoch: finalizedEpoch });
                await (0, archiveBlocks_1.archiveBlocks)(this.db, this.chain.forkChoice, this.chain.lightClientServer, this.logger, finalized);
                // should be after ArchiveBlocksTask to handle restart cleanly
                await this.statesArchiver.maybeArchiveState(finalized);
                this.chain.checkpointStateCache.pruneFinalized(finalizedEpoch);
                this.chain.stateCache.deleteAllBeforeEpoch(finalizedEpoch);
                // tasks rely on extended fork choice
                this.chain.forkChoice.prune(finalized.rootHex);
                await this.updateBackfillRange(finalized);
                this.logger.verbose("Finish processing finalized checkpoint", { epoch: finalizedEpoch });
            }
            catch (e) {
                this.logger.error("Error processing finalized checkpoint", { epoch: finalized.epoch }, e);
            }
        };
        /**
         * Backfill sync relies on verified connected ranges (which are represented as key,value
         * with a verified jump from a key back to value). Since the node could have progressed
         * ahead from, we need to save the forward progress of this node as another backfill
         * range entry, that backfill sync will use to jump back if this node is restarted
         * for any reason.
         * The current backfill has its own backfill entry from anchor slot to last backfilled
         * slot. And this would create the entry from the current finalized slot to the anchor
         * slot.
         */
        this.updateBackfillRange = async (finalized) => {
            try {
                // Mark the sequence in backfill db from finalized block's slot till anchor slot as
                // filled.
                const finalizedBlockFC = this.chain.forkChoice.getBlockHex(finalized.rootHex);
                if (finalizedBlockFC && finalizedBlockFC.slot > this.chain.anchorStateLatestBlockSlot) {
                    await this.db.backfilledRanges.put(finalizedBlockFC.slot, this.chain.anchorStateLatestBlockSlot);
                    // Clear previously marked sequence till anchorStateLatestBlockSlot, without
                    // touching backfill sync process sequence which are at
                    // <=anchorStateLatestBlockSlot i.e. clear >anchorStateLatestBlockSlot
                    // and < currentSlot
                    const filteredSeqs = await this.db.backfilledRanges.keys({
                        gt: this.chain.anchorStateLatestBlockSlot,
                        lt: finalizedBlockFC.slot,
                    });
                    await this.db.backfilledRanges.batchDelete(filteredSeqs);
                    this.logger.debug("Updated backfilledRanges", {
                        key: finalizedBlockFC.slot,
                        value: this.chain.anchorStateLatestBlockSlot,
                    });
                }
            }
            catch (e) {
                this.logger.error("Error updating backfilledRanges on finalization", { epoch: finalized.epoch }, e);
            }
        };
        this.statesArchiver = new archiveStates_1.StatesArchiver(chain.checkpointStateCache, db, logger);
        this.jobQueue = new queue_1.JobItemQueue(this.processFinalizedCheckpoint, {
            maxLength: PROCESS_FINALIZED_CHECKPOINT_QUEUE_LEN,
            signal,
        });
        this.chain.emitter.on(__1.ChainEvent.forkChoiceFinalized, this.onFinalizedCheckpoint);
        this.chain.emitter.on(__1.ChainEvent.checkpoint, this.onCheckpoint);
        signal.addEventListener("abort", () => {
            this.chain.emitter.off(__1.ChainEvent.forkChoiceFinalized, this.onFinalizedCheckpoint);
            this.chain.emitter.off(__1.ChainEvent.checkpoint, this.onCheckpoint);
        }, { once: true });
    }
    /** Archive latest finalized state */
    async persistToDisk() {
        await this.statesArchiver.archiveState(this.chain.forkChoice.getFinalizedCheckpoint());
    }
}
exports.Archiver = Archiver;
//# sourceMappingURL=index.js.map