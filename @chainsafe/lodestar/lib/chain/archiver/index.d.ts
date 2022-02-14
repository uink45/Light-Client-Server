import { AbortSignal } from "@chainsafe/abort-controller";
import { ILogger } from "@chainsafe/lodestar-utils";
import { IBeaconDb } from "../../db";
import { IBeaconChain } from "..";
/**
 * Used for running tasks that depends on some events or are executed
 * periodically.
 */
export declare class Archiver {
    private readonly db;
    private readonly chain;
    private readonly logger;
    private jobQueue;
    private readonly statesArchiver;
    constructor(db: IBeaconDb, chain: IBeaconChain, logger: ILogger, signal: AbortSignal);
    /** Archive latest finalized state */
    persistToDisk(): Promise<void>;
    private onFinalizedCheckpoint;
    private onCheckpoint;
    private processFinalizedCheckpoint;
}
//# sourceMappingURL=index.d.ts.map