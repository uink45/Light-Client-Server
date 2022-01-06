"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toString = exports.toJson = exports.CIRCULAR_REFERENCE_TAG = void 0;
const ssz_1 = require("@chainsafe/ssz");
const errors_1 = require("./errors");
const objects_1 = require("./objects");
exports.CIRCULAR_REFERENCE_TAG = "CIRCULAR_REFERENCE";
function toJson(arg, refs = new WeakMap()) {
    switch (typeof arg) {
        case "bigint":
        case "symbol":
        case "function":
            return arg.toString();
        case "object":
            if (arg === null)
                return "null";
            // Prevent recursive loops
            if (refs.has(arg)) {
                return exports.CIRCULAR_REFERENCE_TAG;
            }
            refs.set(arg, true);
            if (arg instanceof Uint8Array)
                return (0, ssz_1.toHexString)(arg);
            if (arg instanceof errors_1.LodestarError)
                return toJson(arg.toObject(), refs);
            if (arg instanceof Error)
                return toJson(errorToObject(arg), refs);
            if (Array.isArray(arg))
                return arg.map((item) => toJson(item, refs));
            return (0, objects_1.mapValues)(arg, (item) => toJson(item, refs));
        // Already valid JSON
        case "number":
        case "string":
        case "undefined":
        case "boolean":
        default:
            return arg;
    }
}
exports.toJson = toJson;
function toString(json, nested = false) {
    switch (typeof json) {
        case "object": {
            if (nested)
                return JSONStringifyCircular(json);
            if (json === null)
                return "null";
            if (Array.isArray(json))
                return json.map((item) => toString(item, true)).join(", ");
            return Object.entries(json)
                .map(([key, value]) => `${key}=${toString(value, true)}`)
                .join(", ");
        }
        case "number":
        case "string":
        case "boolean":
        default:
            return String(json);
    }
}
exports.toString = toString;
function errorToObject(err) {
    return {
        message: err.message,
        ...(err.stack ? { stack: err.stack } : {}),
    };
}
/**
 * Does not throw on circular references, prevent silencing the actual logged error
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention
function JSONStringifyCircular(value) {
    try {
        return JSON.stringify(value);
    }
    catch (e) {
        if (e instanceof TypeError && e.message.includes("circular")) {
            return exports.CIRCULAR_REFERENCE_TAG;
        }
        else {
            throw e;
        }
    }
}
//# sourceMappingURL=json.js.map