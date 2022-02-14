import { IBeaconNodeOptions } from "@chainsafe/lodestar";
import { ICliCommandOptions } from "../../util";
export interface ISyncArgs {
    "sync.isSingleNode": boolean;
    "sync.disableProcessAsChainSegment": boolean;
}
export declare function parseArgs(args: ISyncArgs): IBeaconNodeOptions["sync"];
export declare const options: ICliCommandOptions<ISyncArgs>;
//# sourceMappingURL=sync.d.ts.map