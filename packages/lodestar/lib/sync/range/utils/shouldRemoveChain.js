"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldRemoveChain = void 0;
/**
 * Checks if a Finalized or Head chain should be removed
 */
function shouldRemoveChain(syncChain, localFinalizedSlot, chain) {
    return (
    // Sync chain has completed syncing or encountered an error
    syncChain.isRemovable ||
        // Sync chain has no more peers to download from
        syncChain.peers === 0 ||
        // Outdated: our chain has progressed beyond this sync chain
        (syncChain.target !== null &&
            (syncChain.target.slot < localFinalizedSlot || chain.forkChoice.hasBlock(syncChain.target.root))));
}
exports.shouldRemoveChain = shouldRemoveChain;
//# sourceMappingURL=shouldRemoveChain.js.map