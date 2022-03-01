"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RangeSync = exports.RangeSyncStatus = exports.RangeSyncEvent = void 0;
const events_1 = require("events");
const lodestar_beacon_state_transition_1 = require("@chainsafe/lodestar-beacon-state-transition");
const remoteSyncType_1 = require("../utils/remoteSyncType");
const utils_1 = require("./utils");
const chain_1 = require("./chain");
var RangeSyncEvent;
(function (RangeSyncEvent) {
    RangeSyncEvent["completedChain"] = "RangeSync-completedChain";
})(RangeSyncEvent = exports.RangeSyncEvent || (exports.RangeSyncEvent = {}));
var RangeSyncStatus;
(function (RangeSyncStatus) {
    /** A finalized chain is being synced */
    RangeSyncStatus[RangeSyncStatus["Finalized"] = 0] = "Finalized";
    /** There are no finalized chains and we are syncing one more head chains */
    RangeSyncStatus[RangeSyncStatus["Head"] = 1] = "Head";
    /** There are no head or finalized chains and no long range sync is in progress */
    RangeSyncStatus[RangeSyncStatus["Idle"] = 2] = "Idle";
})(RangeSyncStatus = exports.RangeSyncStatus || (exports.RangeSyncStatus = {}));
/**
 * RangeSync groups peers by their `status` into static target `SyncChain` instances
 * Peers on each chain will be queried for batches until reaching their target.
 *
 * Not all SyncChain-s will sync at once, and are grouped by sync type:
 * - Finalized Chain Sync
 * - Head Chain Sync
 *
 * ### Finalized Chain Sync
 *
 * At least one peer's status finalized checkpoint is greater than ours. Then we'll form
 * a chain starting from our finalized epoch and sync up to their finalized checkpoint.
 * - Only one finalized chain can sync at a time
 * - The finalized chain with the largest peer pool takes priority
 * - As peers' status progresses we will switch to a SyncChain with a better target
 *
 * ### Head Chain Sync
 *
 * If no Finalized Chain Sync is active, and the peer's STATUS head is beyond
 * `SLOT_IMPORT_TOLERANCE`, then we'll form a chain starting from our finalized epoch and sync
 * up to their head.
 * - More than one head chain can sync in parallel
 * - If there are many head chains the ones with more peers take priority
 */
class RangeSync extends events_1.EventEmitter {
    constructor(modules, opts) {
        super();
        /** There is a single chain per type, 1 finalized sync, 1 head sync */
        this.chains = new Map();
        /** Convenience method for `SyncChain` */
        this.processChainSegment = async (blocks) => {
            var _a;
            // Not trusted, verify signatures
            const flags = {
                // TODO: Review if this is okay, can we prevent some attacks by importing attestations?
                skipImportingAttestations: true,
                // Ignores ALREADY_KNOWN or GENESIS_BLOCK errors, and continues with the next block in chain segment
                ignoreIfKnown: true,
                // Ignore WOULD_REVERT_FINALIZED_SLOT error, continue with the next block in chain segment
                ignoreIfFinalized: true,
                // We won't attest to this block so it's okay to ignore a SYNCING message from execution layer
                fromRangeSync: true,
            };
            if ((_a = this.opts) === null || _a === void 0 ? void 0 : _a.disableProcessAsChainSegment) {
                // Should only be used for debugging or testing
                for (const block of blocks)
                    await this.chain.processBlock(block, flags);
            }
            else {
                await this.chain.processChainSegment(blocks, flags);
            }
        };
        /** Convenience method for `SyncChain` */
        this.downloadBeaconBlocksByRange = async (peerId, request) => {
            return await this.network.reqResp.beaconBlocksByRange(peerId, request);
        };
        /** Convenience method for `SyncChain` */
        this.reportPeer = (peer, action, actionName) => {
            this.network.reportPeer(peer, action, actionName);
        };
        /** Convenience method for `SyncChain` */
        this.onSyncChainEnd = () => {
            const localStatus = this.chain.getStatus();
            this.update(localStatus.finalizedEpoch);
            this.emit(RangeSyncEvent.completedChain);
        };
        this.chain = modules.chain;
        this.network = modules.network;
        this.metrics = modules.metrics;
        this.config = modules.config;
        this.logger = modules.logger;
        this.opts = opts;
    }
    /** Throw / return all AsyncGenerators inside every SyncChain instance */
    close() {
        for (const chain of this.chains.values()) {
            chain.remove();
        }
    }
    /**
     * A peer with a relevant STATUS message has been found, which also is advanced from us.
     * Add this peer to an existing chain or create a new one. The update the chains status.
     */
    addPeer(peerId, localStatus, peerStatus) {
        // Compute if we should do a Finalized or Head sync with this peer
        const syncType = (0, remoteSyncType_1.getRangeSyncType)(localStatus, peerStatus, this.chain.forkChoice);
        this.logger.debug("Sync peer joined", { peer: peerId.toB58String(), syncType });
        let startEpoch;
        let target;
        switch (syncType) {
            case remoteSyncType_1.RangeSyncType.Finalized: {
                startEpoch = localStatus.finalizedEpoch;
                target = {
                    slot: (0, lodestar_beacon_state_transition_1.computeStartSlotAtEpoch)(peerStatus.finalizedEpoch),
                    root: peerStatus.finalizedRoot,
                };
                break;
            }
            case remoteSyncType_1.RangeSyncType.Head: {
                // The new peer has the same finalized (earlier filters should prevent a peer with an
                // earlier finalized chain from reaching here).
                startEpoch = Math.min((0, lodestar_beacon_state_transition_1.computeEpochAtSlot)(localStatus.headSlot), peerStatus.finalizedEpoch);
                target = {
                    slot: peerStatus.headSlot,
                    root: peerStatus.headRoot,
                };
                break;
            }
        }
        // If the peer existed in any other chain, remove it.
        // re-status'd peers can exist in multiple finalized chains, only one sync at a time
        if (syncType === remoteSyncType_1.RangeSyncType.Head) {
            this.removePeer(peerId);
        }
        this.addPeerOrCreateChain(startEpoch, target, peerId, syncType);
        this.update(localStatus.finalizedEpoch);
    }
    /**
     * Remove this peer from all head and finalized chains. A chain may become peer-empty and be dropped
     */
    removePeer(peerId) {
        for (const syncChain of this.chains.values()) {
            syncChain.removePeer(peerId);
        }
    }
    /**
     * Compute the current RangeSync state, not cached
     */
    get state() {
        const syncingHeadTargets = [];
        for (const chain of this.chains.values()) {
            if (chain.isSyncing && chain.target) {
                if (chain.syncType === remoteSyncType_1.RangeSyncType.Finalized) {
                    return { status: RangeSyncStatus.Finalized, target: chain.target };
                }
                else {
                    syncingHeadTargets.push(chain.target);
                }
            }
        }
        if (syncingHeadTargets.length > 0) {
            return { status: RangeSyncStatus.Head, targets: syncingHeadTargets };
        }
        else {
            return { status: RangeSyncStatus.Idle };
        }
    }
    /** Full debug state for lodestar API */
    getSyncChainsDebugState() {
        return Array.from(this.chains.values())
            .map((syncChain) => syncChain.getDebugState())
            .reverse(); // Newest additions first
    }
    addPeerOrCreateChain(startEpoch, target, peer, syncType) {
        let syncChain = this.chains.get(syncType);
        if (!syncChain) {
            syncChain = new chain_1.SyncChain(startEpoch, syncType, {
                processChainSegment: this.processChainSegment,
                downloadBeaconBlocksByRange: this.downloadBeaconBlocksByRange,
                reportPeer: this.reportPeer,
                onEnd: this.onSyncChainEnd,
            }, { config: this.config, logger: this.logger }, this.opts);
            this.chains.set(syncType, syncChain);
            this.logger.verbose("New syncChain", { syncType });
        }
        syncChain.addPeer(peer, target);
    }
    update(localFinalizedEpoch) {
        var _a;
        const localFinalizedSlot = (0, lodestar_beacon_state_transition_1.computeStartSlotAtEpoch)(localFinalizedEpoch);
        // Remove chains that are out-dated, peer-empty, completed or failed
        for (const [id, syncChain] of this.chains.entries()) {
            if ((0, utils_1.shouldRemoveChain)(syncChain, localFinalizedSlot, this.chain)) {
                syncChain.remove();
                this.chains.delete(id);
                this.logger.debug("Removed syncChain", { id: syncChain.logId });
                // Re-status peers from successful chain. Potentially trigger a Head sync
                this.network.reStatusPeers(syncChain.getPeers());
            }
        }
        const { toStop, toStart } = (0, utils_1.updateChains)(Array.from(this.chains.values()));
        for (const syncChain of toStop) {
            syncChain.stopSyncing();
        }
        for (const syncChain of toStart) {
            syncChain.startSyncing(localFinalizedEpoch);
            if (!syncChain.isSyncing)
                (_a = this.metrics) === null || _a === void 0 ? void 0 : _a.syncChainsStarted.inc({ syncType: syncChain.syncType });
        }
    }
}
exports.RangeSync = RangeSync;
//# sourceMappingURL=range.js.map