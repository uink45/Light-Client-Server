import { IBeaconNodeOptions } from "@chainsafe/lodestar";
import { ICliCommandOptions } from "../../util";
export interface IChainArgs {
    "chain.useSingleThreadVerifier": boolean;
    "chain.disableBlsBatchVerify": boolean;
    "chain.persistInvalidSszObjects": boolean;
}
export declare function parseArgs(args: IChainArgs): IBeaconNodeOptions["chain"];
export declare const options: ICliCommandOptions<IChainArgs>;
//# sourceMappingURL=chain.d.ts.map