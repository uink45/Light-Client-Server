/**
 * @module logger
 */
/// <reference types="node" />
import { Writable } from "stream";
export declare enum LogLevel {
    error = "error",
    warn = "warn",
    info = "info",
    verbose = "verbose",
    debug = "debug",
    silly = "silly"
}
export declare const logLevelNum: {
    [K in LogLevel]: number;
};
export declare const LogLevels: LogLevel[];
export declare const customColors: {
    error: string;
    warn: string;
    info: string;
    verbose: string;
    debug: string;
    silly: string;
};
export declare const defaultLogLevel = LogLevel.info;
export declare type LogFormat = "human" | "json";
export declare const logFormats: LogFormat[];
export declare type EpochSlotOpts = {
    genesisTime: number;
    secondsPerSlot: number;
    slotsPerEpoch: number;
};
export declare enum TimestampFormatCode {
    DateRegular = 0,
    EpochSlot = 1
}
export declare type TimestampFormat = {
    format: TimestampFormatCode.DateRegular;
} | ({
    format: TimestampFormatCode.EpochSlot;
} & EpochSlotOpts);
export interface ILoggerOptions {
    level?: LogLevel;
    module?: string;
    format?: LogFormat;
    hideTimestamp?: boolean;
    timestampFormat?: TimestampFormat;
}
export declare type Context = string | number | boolean | bigint | null | {
    [property: string]: Context;
} | Context[];
export declare type LogHandler = (message: string, context?: Context, error?: Error) => void;
export interface ILogger {
    error: LogHandler;
    warn: LogHandler;
    info: LogHandler;
    important: LogHandler;
    verbose: LogHandler;
    debug: LogHandler;
    silly: LogHandler;
    profile(message: string, option?: {
        level: string;
        message: string;
    }): void;
    stream(): Writable;
    child(options: ILoggerOptions): ILogger;
}
//# sourceMappingURL=interface.d.ts.map