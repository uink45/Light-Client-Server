import { IChainConfig } from "./types";
export * from "./types";
export * from "./sszTypes";
export * from "./default";
/**
 * Create an `IChainConfig`, filling in missing values with preset defaults
 */
export declare function createIChainConfig(input: Partial<IChainConfig>): IChainConfig;
export declare function parsePartialIChainConfigJson(input?: Record<string, unknown>): Partial<IChainConfig>;
//# sourceMappingURL=index.d.ts.map