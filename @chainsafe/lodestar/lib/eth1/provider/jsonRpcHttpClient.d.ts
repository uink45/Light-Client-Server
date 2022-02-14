import { AbortSignal } from "@chainsafe/abort-controller";
import { IJson, IRpcPayload, ReqOpts } from "../interface";
interface IRpcResponseError {
    jsonrpc: "2.0";
    id: number;
    error?: {
        code: number;
        message: string;
    };
}
export interface IJsonRpcHttpClient {
    fetch<R, P = IJson[]>(payload: IRpcPayload<P>, opts?: ReqOpts): Promise<R>;
    fetchBatch<R>(rpcPayloadArr: IRpcPayload[], opts?: ReqOpts): Promise<R[]>;
}
export declare class JsonRpcHttpClient implements IJsonRpcHttpClient {
    private readonly urls;
    private readonly opts?;
    private id;
    constructor(urls: string[], opts?: {
        signal?: AbortSignal | undefined;
        timeout?: number | undefined;
        /** If returns true, do not fallback to other urls and throw early */
        shouldNotFallback?: ((error: Error) => boolean) | undefined;
    } | undefined);
    /**
     * Perform RPC request
     */
    fetch<R, P = IJson[]>(payload: IRpcPayload<P>, opts?: ReqOpts): Promise<R>;
    /**
     * Perform RPC batched request
     * Type-wise assumes all requests results have the same type
     */
    fetchBatch<R>(rpcPayloadArr: IRpcPayload[], opts?: ReqOpts): Promise<R[]>;
    private fetchJson;
    /**
     * Fetches JSON and throws detailed errors in case the HTTP request is not ok
     */
    private fetchJsonOneUrl;
}
export declare class ErrorParseJson extends Error {
    constructor(json: string, e: Error);
}
export declare class ErrorJsonRpcResponse<P> extends Error {
    response: IRpcResponseError;
    payload: IRpcPayload<P>;
    constructor(res: IRpcResponseError, payload: IRpcPayload<P>);
}
export declare class HttpRpcError extends Error {
    readonly status: number;
    constructor(status: number, message: string);
}
export {};
//# sourceMappingURL=jsonRpcHttpClient.d.ts.map