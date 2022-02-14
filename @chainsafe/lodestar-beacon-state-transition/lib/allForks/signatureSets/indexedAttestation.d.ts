import { allForks, phase0 } from "@chainsafe/lodestar-types";
import { ISignatureSet } from "../../util";
import { CachedBeaconState } from "../util";
export declare function verifyIndexedAttestationSignature(state: CachedBeaconState<allForks.BeaconState>, indexedAttestation: phase0.IndexedAttestation, indices?: number[]): boolean;
export declare function getAttestationWithIndicesSignatureSet(state: CachedBeaconState<allForks.BeaconState>, attestation: Pick<phase0.Attestation, "data" | "signature">, indices: number[]): ISignatureSet;
export declare function getIndexedAttestationSignatureSet(state: CachedBeaconState<allForks.BeaconState>, indexedAttestation: phase0.IndexedAttestation, indices?: number[]): ISignatureSet;
export declare function getAttestationsSignatureSets(state: CachedBeaconState<allForks.BeaconState>, signedBlock: allForks.SignedBeaconBlock): ISignatureSet[];
//# sourceMappingURL=indexedAttestation.d.ts.map