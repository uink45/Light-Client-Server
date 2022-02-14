import { allForks, phase0 } from "@chainsafe/lodestar-types";
import { ISignatureSet } from "../../util";
import { CachedBeaconState } from "../util";
export declare function verifyVoluntaryExitSignature(state: CachedBeaconState<allForks.BeaconState>, signedVoluntaryExit: phase0.SignedVoluntaryExit): boolean;
/**
 * Extract signatures to allow validating all block signatures at once
 */
export declare function getVoluntaryExitSignatureSet(state: CachedBeaconState<allForks.BeaconState>, signedVoluntaryExit: phase0.SignedVoluntaryExit): ISignatureSet;
export declare function getVoluntaryExitsSignatureSets(state: CachedBeaconState<allForks.BeaconState>, signedBlock: allForks.SignedBeaconBlock): ISignatureSet[];
//# sourceMappingURL=voluntaryExits.d.ts.map