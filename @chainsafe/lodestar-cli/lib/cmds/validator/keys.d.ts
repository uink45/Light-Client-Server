import { SecretKey } from "@chainsafe/bls";
import { IGlobalArgs } from "../../options";
import { IValidatorCliArgs } from "./options";
export declare function getSecretKeys(args: IValidatorCliArgs & IGlobalArgs): Promise<{
    secretKeys: SecretKey[];
    unlockSecretKeys?: () => void;
}>;
//# sourceMappingURL=keys.d.ts.map