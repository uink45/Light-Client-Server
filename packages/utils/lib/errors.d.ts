import { Json } from "@chainsafe/ssz";
/**
 * Generic Lodestar error with attached metadata
 */
export declare class LodestarError<T extends {
    code: string;
}> extends Error {
    type: T;
    constructor(type: T, message?: string);
    getMetadata(): {
        [key: string]: Json;
    };
    /**
     * Get the metadata and the stacktrace for the error.
     */
    toObject(): {
        [key: string]: Json;
    };
}
/**
 * Throw this error when an upstream abort signal aborts
 */
export declare class ErrorAborted extends Error {
    constructor(message?: string);
}
/**
 * Throw this error when wrapped timeout expires
 */
export declare class TimeoutError extends Error {
    constructor(message?: string);
}
/**
 * Returns true if arg `e` is an instance of `ErrorAborted`
 */
export declare function isErrorAborted(e: unknown): e is ErrorAborted;
//# sourceMappingURL=errors.d.ts.map