import { IDiscv5DiscoveryInputOptions } from "@chainsafe/discv5";
import { PeerManagerOpts } from "./peers";
import { RateLimiterOpts } from "./reqresp/response/rateLimiter";
export interface INetworkOptions extends PeerManagerOpts, RateLimiterOpts {
    localMultiaddrs: string[];
    bootMultiaddrs?: string[];
    subscribeAllSubnets?: boolean;
    connectToDiscv5Bootnodes?: boolean;
}
export declare const defaultDiscv5Options: IDiscv5DiscoveryInputOptions;
export declare const defaultNetworkOptions: INetworkOptions;
//# sourceMappingURL=options.d.ts.map