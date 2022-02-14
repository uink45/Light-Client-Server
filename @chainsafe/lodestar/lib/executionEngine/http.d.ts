import { AbortSignal } from "@chainsafe/abort-controller";
import { merge, RootHex, Root } from "@chainsafe/lodestar-types";
import { DATA, QUANTITY } from "../eth1/provider/utils";
import { IJsonRpcHttpClient } from "../eth1/provider/jsonRpcHttpClient";
import { ExecutePayloadStatus, IExecutionEngine, PayloadId, PayloadAttributes } from "./interface";
export declare type ExecutionEngineHttpOpts = {
    urls: string[];
    timeout?: number;
};
export declare const defaultExecutionEngineHttpOpts: ExecutionEngineHttpOpts;
/**
 * based on Ethereum JSON-RPC API and inherits the following properties of this standard:
 * - Supported communication protocols (HTTP and WebSocket)
 * - Message format and encoding notation
 * - Error codes improvement proposal
 *
 * Client software MUST expose Engine API at a port independent from JSON-RPC API. The default port for the Engine API is 8550 for HTTP and 8551 for WebSocket.
 * https://github.com/ethereum/execution-apis/blob/v1.0.0-alpha.1/src/engine/interop/specification.md
 */
export declare class ExecutionEngineHttp implements IExecutionEngine {
    private readonly rpc;
    constructor(opts: ExecutionEngineHttpOpts, signal: AbortSignal, rpc?: IJsonRpcHttpClient);
    /**
     * `engine_executePayloadV1`
     *
     * 1. Client software MUST validate the payload according to the execution environment rule set with modifications to this rule set defined in the Block Validity section of EIP-3675 and respond with the validation result.
     * 2. Client software MUST defer persisting a valid payload until the corresponding engine_consensusValidated message deems the payload valid with respect to the proof-of-stake consensus rules.
     * 3. Client software MUST discard the payload if it's deemed invalid.
     * 4. The call MUST be responded with SYNCING status while the sync process is in progress and thus the execution cannot yet be validated.
     * 5. In the case when the parent block is unknown, client software MUST pull the block from the network and take one of the following actions depending on the parent block properties:
     * 6. If the parent block is a PoW block as per EIP-3675 definition, then all missing dependencies of the payload MUST be pulled from the network and validated accordingly. The call MUST be responded according to the validity of the payload and the chain of its ancestors.
     *    If the parent block is a PoS block as per EIP-3675 definition, then the call MAY be responded with SYNCING status and sync process SHOULD be initiated accordingly.
     */
    executePayload(executionPayload: merge.ExecutionPayload): Promise<ExecutePayloadStatus>;
    /**
     * `engine_forkchoiceUpdated`
     *
     * 1. This method call maps on the POS_FORKCHOICE_UPDATED event of EIP-3675 and MUST be processed according to the specification defined in the EIP.
     * 2. Client software MUST respond with 4: Unknown block error if the payload identified by either the headBlockHash or the finalizedBlockHash is unknown.
     */
    notifyForkchoiceUpdate(headBlockHash: Root | RootHex, finalizedBlockHash: RootHex, payloadAttributes?: PayloadAttributes): Promise<PayloadId | null>;
    /**
     * `engine_getPayloadV1`
     *
     * 1. Given the payloadId client software MUST respond with the most recent version of the payload that is available in the corresponding building process at the time of receiving the call.
     * 2. The call MUST be responded with 5: Unavailable payload error if the building process identified by the payloadId doesn't exist.
     * 3. Client software MAY stop the corresponding building process after serving this call.
     */
    getPayload(payloadId: PayloadId): Promise<merge.ExecutionPayload>;
}
declare type ExecutionPayloadRpc = {
    parentHash: DATA;
    feeRecipient: DATA;
    stateRoot: DATA;
    receiptsRoot: DATA;
    logsBloom: DATA;
    random: DATA;
    blockNumber: QUANTITY;
    gasLimit: QUANTITY;
    gasUsed: QUANTITY;
    timestamp: QUANTITY;
    extraData: DATA;
    baseFeePerGas: QUANTITY;
    blockHash: DATA;
    transactions: DATA[];
};
export declare function serializeExecutionPayload(data: merge.ExecutionPayload): ExecutionPayloadRpc;
export declare function parseExecutionPayload(data: ExecutionPayloadRpc): merge.ExecutionPayload;
export {};
//# sourceMappingURL=http.d.ts.map