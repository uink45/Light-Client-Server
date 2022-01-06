import { allForks } from "@chainsafe/lodestar-types";
import { ISignatureSet } from "../../util/signatureSets";
import { CachedBeaconState } from "../util";
export declare function verifyProposerSignature(state: CachedBeaconState<allForks.BeaconState>, signedBlock: allForks.SignedBeaconBlock): boolean;
export declare function getProposerSignatureSet(state: CachedBeaconState<allForks.BeaconState>, signedBlock: allForks.SignedBeaconBlock): ISignatureSet;
//# sourceMappingURL=proposer.d.ts.map