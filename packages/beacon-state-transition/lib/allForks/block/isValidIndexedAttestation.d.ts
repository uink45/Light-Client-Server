import { allForks, phase0 } from "@chainsafe/lodestar-types";
import { CachedBeaconState } from "../util";
/**
 * Check if `indexedAttestation` has sorted and unique indices and a valid aggregate signature.
 */
export declare function isValidIndexedAttestation(state: CachedBeaconState<allForks.BeaconState>, indexedAttestation: phase0.IndexedAttestation, verifySignature?: boolean): boolean;
//# sourceMappingURL=isValidIndexedAttestation.d.ts.map