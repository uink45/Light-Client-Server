/**
 * @module chain/blockAssembly
 */
import { allForks } from "@chainsafe/lodestar-beacon-state-transition";
import { Bytes32, Bytes96, ExecutionAddress, Slot } from "@chainsafe/lodestar-types";
import { ILogger } from "@chainsafe/lodestar-utils";
import { IMetrics } from "../../../metrics";
import { IBeaconChain } from "../../interface";
declare type AssembleBlockModules = {
    chain: IBeaconChain;
    metrics: IMetrics | null;
    logger?: ILogger | null;
};
export declare function assembleBlock({ chain, metrics, logger }: AssembleBlockModules, { randaoReveal, graffiti, slot, feeRecipient, }: {
    randaoReveal: Bytes96;
    graffiti: Bytes32;
    slot: Slot;
    feeRecipient: ExecutionAddress;
}): Promise<allForks.BeaconBlock>;
export {};
//# sourceMappingURL=index.d.ts.map