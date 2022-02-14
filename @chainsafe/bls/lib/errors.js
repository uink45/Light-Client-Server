"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This error should not be ignored by the functional interface
 * try / catch blocks, to prevent false negatives
 */
class NotInitializedError extends Error {
    constructor(implementation) {
        super(`NOT_INITIALIZED: ${implementation}`);
    }
}
exports.NotInitializedError = NotInitializedError;
class ZeroSecretKeyError extends Error {
    constructor() {
        super("ZERO_SECRET_KEY");
    }
}
exports.ZeroSecretKeyError = ZeroSecretKeyError;
class ZeroPublicKeyError extends Error {
    constructor() {
        super("ZERO_PUBLIC_KEY");
    }
}
exports.ZeroPublicKeyError = ZeroPublicKeyError;
class ZeroSignatureError extends Error {
    constructor() {
        super("ZERO_SIGNATURE");
    }
}
exports.ZeroSignatureError = ZeroSignatureError;
class EmptyAggregateError extends Error {
    constructor() {
        super("EMPTY_AGGREGATE_ARRAY");
    }
}
exports.EmptyAggregateError = EmptyAggregateError;
class InvalidOrderError extends Error {
    constructor() {
        super("INVALID_ORDER");
    }
}
exports.InvalidOrderError = InvalidOrderError;
class InvalidLengthError extends Error {
    constructor(arg, length) {
        super(`INVALID_LENGTH: ${arg} - ${length} bytes`);
    }
}
exports.InvalidLengthError = InvalidLengthError;
