import { ILogger } from "@chainsafe/lodestar-utils";
import { allForks, RootHex, Slot, phase0 } from "@chainsafe/lodestar-types";
import { IBeaconConfig } from "@chainsafe/lodestar-config";
import { routes } from "@chainsafe/lodestar-api";
import { INetwork } from "../network";
import { IBeaconChain } from "../chain";
import { IMetrics } from "../metrics";
import { IBeaconDb } from "../db";
import { SyncChainDebugState } from "./range/chain";
export { SyncChainDebugState };
export declare type SyncingStatus = routes.node.SyncingStatus;
export interface IBeaconSync {
    state: SyncState;
    close(): void;
    getSyncStatus(): SyncingStatus;
    isSynced(): boolean;
    isSyncing(): boolean;
    getSyncChainsDebugState(): SyncChainDebugState[];
}
export declare enum SyncState {
    /** No useful peers are connected */
    Stalled = "Stalled",
    /** The node is performing a long-range sync over a finalized chain */
    SyncingFinalized = "SyncingFinalized",
    /** The node is performing a long-range sync over head chains */
    SyncingHead = "SyncingHead",
    /** The node is up to date with all known peers */
    Synced = "Synced"
}
/** Map a SyncState to an integer for rendering in Grafana */
export declare const syncStateMetric: {
    [K in SyncState]: number;
};
export interface ISyncModule {
    getHighestBlock(): Slot;
}
export interface ISlotRange {
    start: Slot;
    end: Slot;
}
export interface ISyncModules {
    config: IBeaconConfig;
    network: INetwork;
    db: IBeaconDb;
    metrics: IMetrics | null;
    logger: ILogger;
    chain: IBeaconChain;
    wsCheckpoint?: phase0.Checkpoint;
}
export declare type PendingBlock = {
    blockRootHex: RootHex;
    parentBlockRootHex: RootHex;
    signedBlock: allForks.SignedBeaconBlock;
    peerIdStrs: Set<string>;
    status: PendingBlockStatus;
    downloadAttempts: number;
};
export declare enum PendingBlockStatus {
    pending = "pending",
    fetching = "fetching",
    processing = "processing"
}
//# sourceMappingURL=interface.d.ts.map