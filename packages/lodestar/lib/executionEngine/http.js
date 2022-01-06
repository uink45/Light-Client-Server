"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseExecutionPayload = exports.serializeExecutionPayload = exports.ExecutionEngineHttp = exports.defaultExecutionEngineHttpOpts = void 0;
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const jsonRpcHttpClient_1 = require("../eth1/provider/jsonRpcHttpClient");
const utils_1 = require("../eth1/provider/utils");
const interface_1 = require("./interface");
exports.defaultExecutionEngineHttpOpts = {
    urls: ["http://localhost:8550"],
    timeout: 12000,
};
/**
 * based on Ethereum JSON-RPC API and inherits the following properties of this standard:
 * - Supported communication protocols (HTTP and WebSocket)
 * - Message format and encoding notation
 * - Error codes improvement proposal
 *
 * Client software MUST expose Engine API at a port independent from JSON-RPC API. The default port for the Engine API is 8550 for HTTP and 8551 for WebSocket.
 * https://github.com/ethereum/execution-apis/blob/v1.0.0-alpha.1/src/engine/interop/specification.md
 */
class ExecutionEngineHttp {
    constructor(opts, signal, rpc) {
        this.rpc =
            rpc !== null && rpc !== void 0 ? rpc : new jsonRpcHttpClient_1.JsonRpcHttpClient(opts.urls, {
                signal,
                timeout: opts.timeout,
            });
    }
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
    async executePayload(executionPayload) {
        const method = "engine_executePayloadV1";
        const serializedExecutionPayload = serializeExecutionPayload(executionPayload);
        const { status, latestValidHash, validationError } = await this.rpc
            .fetch({
            method,
            params: [serializedExecutionPayload],
        })
            // If there are errors by EL like connection refused, internal error, they need to be
            // treated seperate from being INVALID. For now, just pass the error upstream.
            .catch((e) => {
            if (e instanceof jsonRpcHttpClient_1.HttpRpcError || e instanceof jsonRpcHttpClient_1.ErrorJsonRpcResponse) {
                return { status: interface_1.ExecutePayloadStatus.ELERROR, latestValidHash: null, validationError: e.message };
            }
            else {
                return { status: interface_1.ExecutePayloadStatus.UNAVAILABLE, latestValidHash: null, validationError: e.message };
            }
        });
        // Validate status is known
        if (!interface_1.ExecutePayloadStatus[status]) {
            return {
                status: interface_1.ExecutePayloadStatus.ELERROR,
                latestValidHash: null,
                validationError: `Invalid EL status on executePayload: ${status}`,
            };
        }
        switch (status) {
            case interface_1.ExecutePayloadStatus.VALID:
                if (latestValidHash == null) {
                    return {
                        status: interface_1.ExecutePayloadStatus.ELERROR,
                        latestValidHash: null,
                        validationError: `Invalid null latestValidHash for status=${status}`,
                    };
                }
                else {
                    return { status, latestValidHash, validationError: null };
                }
            case interface_1.ExecutePayloadStatus.INVALID:
                if (latestValidHash == null) {
                    return {
                        status: interface_1.ExecutePayloadStatus.ELERROR,
                        latestValidHash: null,
                        validationError: `Invalid null latestValidHash for status=${status}`,
                    };
                }
                else {
                    return { status, latestValidHash, validationError };
                }
            case interface_1.ExecutePayloadStatus.SYNCING:
                return { status, latestValidHash, validationError: null };
            case interface_1.ExecutePayloadStatus.UNAVAILABLE:
            case interface_1.ExecutePayloadStatus.ELERROR:
                return {
                    status,
                    latestValidHash: null,
                    validationError: validationError !== null && validationError !== void 0 ? validationError : "Unknown ELERROR",
                };
        }
    }
    /**
     * `engine_forkchoiceUpdated`
     *
     * 1. This method call maps on the POS_FORKCHOICE_UPDATED event of EIP-3675 and MUST be processed according to the specification defined in the EIP.
     * 2. Client software MUST respond with 4: Unknown block error if the payload identified by either the headBlockHash or the finalizedBlockHash is unknown.
     */
    notifyForkchoiceUpdate(headBlockHash, finalizedBlockHash, payloadAttributes) {
        const method = "engine_forkchoiceUpdatedV1";
        const headBlockHashData = typeof headBlockHash === "string" ? headBlockHash : (0, utils_1.bytesToData)(headBlockHash);
        const apiPayloadAttributes = payloadAttributes
            ? [
                {
                    timestamp: (0, utils_1.numToQuantity)(payloadAttributes.timestamp),
                    random: (0, utils_1.bytesToData)(payloadAttributes.random),
                    suggestedFeeRecipient: (0, utils_1.bytesToData)(payloadAttributes.suggestedFeeRecipient),
                },
            ]
            : [];
        return this.rpc
            .fetch({
            method,
            params: [
                { headBlockHash: headBlockHashData, safeBlockHash: headBlockHashData, finalizedBlockHash },
                ...apiPayloadAttributes,
            ],
        })
            .then(({ status, payloadId }) => {
            // Validate status is known
            const statusEnum = interface_1.ForkChoiceUpdateStatus[status];
            if (statusEnum === undefined) {
                throw Error(`Unknown status ${status}`);
            }
            // Throw error on syncing if requested to produce a block, else silently ignore
            if (payloadAttributes && statusEnum === interface_1.ForkChoiceUpdateStatus.SYNCING)
                throw Error("Execution Layer Syncing");
            return payloadId !== "0x" ? payloadId : null;
        });
    }
    /**
     * `engine_getPayloadV1`
     *
     * 1. Given the payloadId client software MUST respond with the most recent version of the payload that is available in the corresponding building process at the time of receiving the call.
     * 2. The call MUST be responded with 5: Unavailable payload error if the building process identified by the payloadId doesn't exist.
     * 3. Client software MAY stop the corresponding building process after serving this call.
     */
    async getPayload(payloadId) {
        const method = "engine_getPayloadV1";
        const executionPayloadRpc = await this.rpc.fetch({
            method,
            params: [payloadId],
        });
        return parseExecutionPayload(executionPayloadRpc);
    }
}
exports.ExecutionEngineHttp = ExecutionEngineHttp;
function serializeExecutionPayload(data) {
    return {
        parentHash: (0, utils_1.bytesToData)(data.parentHash),
        feeRecipient: (0, utils_1.bytesToData)(data.feeRecipient),
        stateRoot: (0, utils_1.bytesToData)(data.stateRoot),
        receiptsRoot: (0, utils_1.bytesToData)(data.receiptsRoot),
        logsBloom: (0, utils_1.bytesToData)(data.logsBloom),
        random: (0, utils_1.bytesToData)(data.random),
        blockNumber: (0, utils_1.numToQuantity)(data.blockNumber),
        gasLimit: (0, utils_1.numToQuantity)(data.gasLimit),
        gasUsed: (0, utils_1.numToQuantity)(data.gasUsed),
        timestamp: (0, utils_1.numToQuantity)(data.timestamp),
        extraData: (0, utils_1.bytesToData)(data.extraData),
        baseFeePerGas: (0, utils_1.numToQuantity)(data.baseFeePerGas),
        blockHash: (0, utils_1.bytesToData)(data.blockHash),
        transactions: data.transactions.map((tran) => (0, utils_1.bytesToData)(tran)),
    };
}
exports.serializeExecutionPayload = serializeExecutionPayload;
function parseExecutionPayload(data) {
    return {
        parentHash: (0, utils_1.dataToBytes)(data.parentHash, 32),
        feeRecipient: (0, utils_1.dataToBytes)(data.feeRecipient, 20),
        stateRoot: (0, utils_1.dataToBytes)(data.stateRoot, 32),
        receiptsRoot: (0, utils_1.dataToBytes)(data.receiptsRoot, 32),
        logsBloom: (0, utils_1.dataToBytes)(data.logsBloom, lodestar_params_1.BYTES_PER_LOGS_BLOOM),
        random: (0, utils_1.dataToBytes)(data.random, 32),
        blockNumber: (0, utils_1.quantityToNum)(data.blockNumber),
        gasLimit: (0, utils_1.quantityToNum)(data.gasLimit),
        gasUsed: (0, utils_1.quantityToNum)(data.gasUsed),
        timestamp: (0, utils_1.quantityToNum)(data.timestamp),
        extraData: (0, utils_1.dataToBytes)(data.extraData),
        baseFeePerGas: (0, utils_1.quantityToBigint)(data.baseFeePerGas),
        blockHash: (0, utils_1.dataToBytes)(data.blockHash, 32),
        transactions: data.transactions.map((tran) => (0, utils_1.dataToBytes)(tran)),
    };
}
exports.parseExecutionPayload = parseExecutionPayload;
//# sourceMappingURL=http.js.map