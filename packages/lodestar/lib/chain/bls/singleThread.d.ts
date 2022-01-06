import { ISignatureSet } from "@chainsafe/lodestar-beacon-state-transition";
import { IBlsVerifier } from "./interface";
export declare class BlsSingleThreadVerifier implements IBlsVerifier {
    verifySignatureSets(sets: ISignatureSet[]): Promise<boolean>;
}
//# sourceMappingURL=singleThread.d.ts.map