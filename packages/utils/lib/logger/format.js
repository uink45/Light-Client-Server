"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractStackTraceFromJson = exports.printStackTraceLast = exports.getFormat = void 0;
const winston_1 = require("winston");
const json_1 = require("../json");
const interface_1 = require("./interface");
const util_1 = require("./util");
function getFormat(opts) {
    switch (opts.format) {
        case "json":
            return jsonLogFormat(opts);
        case "human":
        default:
            return humanReadableLogFormat(opts);
    }
}
exports.getFormat = getFormat;
function humanReadableLogFormat(opts) {
    return winston_1.format.combine(...(opts.hideTimestamp ? [] : [formatTimestamp(opts)]), winston_1.format.colorize(), winston_1.format.printf(humanReadableTemplateFn));
}
function formatTimestamp(opts) {
    const { timestampFormat } = opts;
    switch (timestampFormat === null || timestampFormat === void 0 ? void 0 : timestampFormat.format) {
        case interface_1.TimestampFormatCode.EpochSlot:
            return {
                transform: (info) => {
                    info.timestamp = (0, util_1.formatEpochSlotTime)(timestampFormat);
                    return info;
                },
            };
        case interface_1.TimestampFormatCode.DateRegular:
        default:
            return winston_1.format.timestamp({ format: "MMM-DD HH:mm:ss.SSS" });
    }
}
function jsonLogFormat(opts) {
    return winston_1.format.combine(...(opts.hideTimestamp ? [] : [winston_1.format.timestamp()]), 
    // eslint-disable-next-line @typescript-eslint/naming-convention
    (0, winston_1.format)((_info) => {
        const info = _info;
        info.context = (0, json_1.toJson)(info.context);
        info.error = (0, json_1.toJson)(info.error);
        return info;
    })(), winston_1.format.json());
}
/**
 * Winston template function print a human readable string given a log object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention
function humanReadableTemplateFn(_info) {
    const info = _info;
    const paddingBetweenInfo = 30;
    const infoString = info.module || info.namespace || "";
    const infoPad = paddingBetweenInfo - infoString.length;
    const logParts = [
        info.timestamp,
        `[${infoString.toUpperCase()}]`,
        `${info.level.padStart(infoPad)}:`,
        info.message,
        info.context !== undefined ? printStackTraceLast(info.context) : undefined,
        info.error !== undefined ? printStackTraceLast(info.error) : undefined,
        info.durationMs && ` - duration=${info.durationMs}ms`,
    ];
    return logParts.filter((s) => s).join(" ");
}
/**
 * Extract stack property from context to allow appending at the end of the log
 */
function printStackTraceLast(context) {
    if (context === undefined) {
        return "";
    }
    const json = (0, json_1.toJson)(context);
    const stackTraces = extractStackTraceFromJson(json);
    if (stackTraces.length > 0) {
        return [(0, json_1.toString)(json), ...stackTraces].join("\n");
    }
    else {
        return (0, json_1.toString)(json);
    }
}
exports.printStackTraceLast = printStackTraceLast;
/**
 * Extract 'stack' from Json-ified error recursively.
 * Mutates the `json` argument deleting all 'stack' properties.
 * `json` argument must not contain circular properties, which should be guaranteed by `toJson()`
 */
function extractStackTraceFromJson(json, stackTraces = []) {
    if (typeof json === "object" && json !== null && !Array.isArray(json)) {
        let stack = null;
        for (const [key, value] of Object.entries(json)) {
            if (key === "stack" && typeof value === "string") {
                stack = value;
                delete json[key];
            }
            else {
                extractStackTraceFromJson(value, stackTraces);
            }
        }
        // Push stack trace last so nested errors come first
        if (stack)
            stackTraces.push(stack);
    }
    return stackTraces;
}
exports.extractStackTraceFromJson = extractStackTraceFromJson;
//# sourceMappingURL=format.js.map