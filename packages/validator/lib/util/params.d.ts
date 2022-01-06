import { IChainConfig } from "@chainsafe/lodestar-config";
export declare class NotEqualParamsError extends Error {
}
/**
 * Assert that two IBeaconParams are identical. Throws error otherwise
 */
export declare function assertEqualParams(currentParams: IChainConfig, expectedParams: IChainConfig): void;
//# sourceMappingURL=params.d.ts.map