import { ICliCommandOptions, ILogArgs } from "../../util";
import { IAccountValidatorArgs } from "../account/cmds/validator/options";
import { IBeaconPaths } from "../beacon/paths";
export declare type IValidatorCliArgs = IAccountValidatorArgs & ILogArgs & {
    validatorsDbDir?: string;
    server: string;
    force: boolean;
    graffiti: string;
    importKeystoresPath?: string[];
    importKeystoresPassword?: string;
    interopIndexes?: string;
    fromMnemonic?: string;
    mnemonicIndexes?: string;
    logFile: IBeaconPaths["logFile"];
};
export declare const validatorOptions: ICliCommandOptions<IValidatorCliArgs>;
//# sourceMappingURL=options.d.ts.map