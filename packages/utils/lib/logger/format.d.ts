import { Json } from "@chainsafe/ssz";
import { format } from "winston";
import { Context, ILoggerOptions } from "./interface";
declare type Format = ReturnType<typeof format.combine>;
export declare function getFormat(opts: ILoggerOptions): Format;
/**
 * Extract stack property from context to allow appending at the end of the log
 */
export declare function printStackTraceLast(context?: Context | Error): string;
/**
 * Extract 'stack' from Json-ified error recursively.
 * Mutates the `json` argument deleting all 'stack' properties.
 * `json` argument must not contain circular properties, which should be guaranteed by `toJson()`
 */
export declare function extractStackTraceFromJson(json: Json, stackTraces?: string[]): string[];
export {};
//# sourceMappingURL=format.d.ts.map