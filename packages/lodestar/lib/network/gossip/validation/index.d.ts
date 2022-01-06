import { AbortSignal } from "@chainsafe/abort-controller";
import { IChainForkConfig } from "@chainsafe/lodestar-config";
import { ILogger } from "@chainsafe/lodestar-utils";
import { IMetrics } from "../../../metrics";
import { ValidatorFnsByType, GossipHandlers, ProcessRpcMessageFn, ProcessRpcMessageFnsByType, GossipJobQueues } from "../interface";
import { UncompressCache } from "../encoding";
declare type ValidatorFnModules = {
    config: IChainForkConfig;
    logger: ILogger;
    metrics: IMetrics | null;
    uncompressCache: UncompressCache;
};
/**
 * Returns GossipValidatorFn for each GossipType, given GossipHandlerFn indexed by type.
 *
 * @see getGossipHandlers for reasoning on why GossipHandlerFn are used for gossip validation.
 */
export declare function createValidatorFnsByType(gossipHandlers: GossipHandlers, modules: ValidatorFnModules & {
    signal: AbortSignal;
}): ValidatorFnsByType;
/**
 * Return ProcessRpcMessageFnsByType for each GossipType, this wraps the parent processRpcMsgFn()
 * (in js-libp2p-gossipsub) in a queue so that we only uncompress, compute message id, deserialize
 * messages when we execute them.
 */
export declare function createProcessRpcMessageFnsByType(processRpcMsgFn: ProcessRpcMessageFn, signal: AbortSignal, metrics: IMetrics | null): {
    processRpcMessagesFnByType: ProcessRpcMessageFnsByType;
    jobQueues: GossipJobQueues;
};
export {};
//# sourceMappingURL=index.d.ts.map