import { IChainConfig } from "./chainConfig";
import { mainnetChainConfig } from "./chainConfig/networks/mainnet";
import { praterChainConfig } from "./chainConfig/networks/prater";
import { kilnChainConfig } from "./chainConfig/networks/kiln";
export { mainnetChainConfig, praterChainConfig, kilnChainConfig };
export declare type NetworkName = "mainnet" | "prater" | "kiln";
export declare const networksChainConfig: Record<NetworkName, IChainConfig>;
//# sourceMappingURL=networks.d.ts.map