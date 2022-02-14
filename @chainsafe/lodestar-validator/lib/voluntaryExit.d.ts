import { SecretKey } from "@chainsafe/bls";
import { IChainForkConfig } from "@chainsafe/lodestar-config";
import { Api } from "@chainsafe/lodestar-api";
/**
 * Perform a voluntary exit for the given validator by its key.
 */
export declare function signAndSubmitVoluntaryExit(publicKey: string, exitEpoch: number, secretKey: SecretKey, api: Api, config: IChainForkConfig): Promise<void>;
//# sourceMappingURL=voluntaryExit.d.ts.map