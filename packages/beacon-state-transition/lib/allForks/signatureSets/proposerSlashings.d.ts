import { allForks, phase0 } from "@chainsafe/lodestar-types";
import { ISignatureSet } from "../../util";
import { CachedBeaconState } from "../util";
/**
 * Extract signatures to allow validating all block signatures at once
 */
export declare function getProposerSlashingSignatureSets(state: CachedBeaconState<allForks.BeaconState>, proposerSlashing: phase0.ProposerSlashing): ISignatureSet[];
export declare function getProposerSlashingsSignatureSets(state: CachedBeaconState<allForks.BeaconState>, signedBlock: allForks.SignedBeaconBlock): ISignatureSet[];
//# sourceMappingURL=proposerSlashings.d.ts.map