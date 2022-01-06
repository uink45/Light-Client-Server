import { phase0, Epoch, allForks, RootHex } from "@chainsafe/lodestar-types";
import { CachedBeaconState } from "@chainsafe/lodestar-beacon-state-transition";
import { routes } from "@chainsafe/lodestar-api";
import { IMetrics } from "../../metrics";
declare type CheckpointHex = {
    epoch: Epoch;
    rootHex: RootHex;
};
/**
 * In memory cache of CachedBeaconState
 * belonging to checkpoint
 *
 * Similar API to Repository
 */
export declare class CheckpointStateCache {
    private readonly cache;
    /** Epoch -> Set<blockRoot> */
    private readonly epochIndex;
    private readonly metrics;
    private preComputedCheckpoint;
    private preComputedCheckpointHits;
    constructor({ metrics }: {
        metrics?: IMetrics | null;
    });
    get(cp: CheckpointHex): CachedBeaconState<allForks.BeaconState> | null;
    add(cp: phase0.Checkpoint, item: CachedBeaconState<allForks.BeaconState>): void;
    /**
     * Searches for the latest cached state with a `root`, starting with `epoch` and descending
     */
    getLatest(rootHex: RootHex, maxEpoch: Epoch): CachedBeaconState<allForks.BeaconState> | null;
    /**
     * Update the precomputed checkpoint and return the number of his for the
     * previous one (if any).
     */
    updatePreComputedCheckpoint(rootHex: RootHex, epoch: Epoch): number | null;
    pruneFinalized(finalizedEpoch: Epoch): void;
    prune(finalizedEpoch: Epoch, justifiedEpoch: Epoch): void;
    delete(cp: phase0.Checkpoint): void;
    deleteAllEpochItems(epoch: Epoch): void;
    clear(): void;
    /** ONLY FOR DEBUGGING PURPOSES. For lodestar debug API */
    dumpSummary(): routes.lodestar.StateCacheItem[];
}
export declare function toCheckpointHex(checkpoint: phase0.Checkpoint): CheckpointHex;
export {};
//# sourceMappingURL=stateContextCheckpointsCache.d.ts.map