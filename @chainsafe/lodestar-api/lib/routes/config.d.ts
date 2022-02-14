import { IBeaconPreset } from "@chainsafe/lodestar-params";
import { IChainConfig } from "@chainsafe/lodestar-config";
import { Bytes32, Number64, phase0 } from "@chainsafe/lodestar-types";
import { ContainerType } from "@chainsafe/ssz";
import { ReqEmpty, ReturnTypes, ReqSerializers, RoutesData } from "../utils";
export declare type DepositContract = {
    chainId: Number64;
    address: Bytes32;
};
export declare type ISpec = IBeaconPreset & IChainConfig;
export declare const Spec: ContainerType<ISpec>;
export declare type Api = {
    /**
     * Get deposit contract address.
     * Retrieve Eth1 deposit contract address and chain ID.
     */
    getDepositContract(): Promise<{
        data: DepositContract;
    }>;
    /**
     * Get scheduled upcoming forks.
     * Retrieve all scheduled upcoming forks this node is aware of.
     */
    getForkSchedule(): Promise<{
        data: phase0.Fork[];
    }>;
    /**
     * Get spec params.
     * Retrieve specification configuration used on this node.
     * [Specification params list](https://github.com/ethereum/eth2.0-specs/blob/v1.0.0-rc.0/configs/mainnet/phase0.yaml)
     *
     * Values are returned with following format:
     * - any value starting with 0x in the spec is returned as a hex string
     * - numeric values are returned as a quoted integer
     */
    getSpec(): Promise<{
        data: ISpec;
    }>;
};
/**
 * Define javascript values for each route
 */
export declare const routesData: RoutesData<Api>;
export declare type ReqTypes = {
    [K in keyof Api]: ReqEmpty;
};
export declare function getReqSerializers(): ReqSerializers<Api, ReqTypes>;
export declare function getReturnTypes(config: IChainConfig): ReturnTypes<Api>;
//# sourceMappingURL=config.d.ts.map