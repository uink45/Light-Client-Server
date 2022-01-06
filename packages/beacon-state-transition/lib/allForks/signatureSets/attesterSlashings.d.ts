import { allForks, phase0 } from "@chainsafe/lodestar-types";
import { ISignatureSet } from "../../util";
import { CachedBeaconState } from "../util";
/** Get signature sets from a single AttesterSlashing object */
export declare function getAttesterSlashingSignatureSets(state: CachedBeaconState<allForks.BeaconState>, attesterSlashing: phase0.AttesterSlashing): ISignatureSet[];
/** Get signature sets from all AttesterSlashing objects in a block */
export declare function getAttesterSlashingsSignatureSets(state: CachedBeaconState<allForks.BeaconState>, signedBlock: allForks.SignedBeaconBlock): ISignatureSet[];
//# sourceMappingURL=attesterSlashings.d.ts.map