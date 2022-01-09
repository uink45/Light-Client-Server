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
                await this.statesArchiver.maybeArchiveState(finalized, this.chain.anchorSlot);
                await Promise.all([
                    this.chain.checkpointStateCache.pruneFinalized(finalizedEpoch),
                    this.chain.stateCache.deleteAllBeforeEpoch(finalizedEpoch),
                ]);
                // tasks rely on extended fork choice
                this.chain.forkChoice.prune(finalized.rootHex);
                this.logger.verbose("Finish processing finalized checkpoint", { epoch: finalizedEpoch });
            }
            catch (e) {
                this.logger.error("Error processing finalized checkpoint", { epoch: finalized.epoch }, e);
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