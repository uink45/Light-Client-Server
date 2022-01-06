import { allForks } from "@chainsafe/lodestar-types";
import { ISignatureSet } from "../../util";
import { CachedBeaconState } from "../util";
export declare function verifyRandaoSignature(state: CachedBeaconState<allForks.BeaconState>, block: allForks.BeaconBlock): boolean;
/**
 * Extract signatures to allow validating all block signatures at once
 */
export declare function getRandaoRevealSignatureSet(state: CachedBeaconState<allForks.BeaconState>, block: allForks.BeaconBlock): ISignatureSet;
//# sourceMappingURL=randao.d.ts.map