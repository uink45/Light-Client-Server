import { allForks } from "@chainsafe/lodestar-types";
import { ISignatureSet } from "../../util";
import { CachedBeaconState } from "../util";
export * from "./attesterSlashings";
export * from "./indexedAttestation";
export * from "./proposer";
export * from "./proposerSlashings";
export * from "./randao";
export * from "./voluntaryExits";
/**
 * Includes all signatures on the block (except the deposit signatures) for verification.
 * Deposits are not included because they can legally have invalid signatures.
 */
export declare function getAllBlockSignatureSets(state: CachedBeaconState<allForks.BeaconState>, signedBlock: allForks.SignedBeaconBlock): ISignatureSet[];
/**
 * Includes all signatures on the block (except the deposit signatures) for verification.
 * Useful since block proposer signature is verified beforehand on gossip validation
 */
export declare function getAllBlockSignatureSetsExceptProposer(state: CachedBeaconState<allForks.BeaconState>, signedBlock: allForks.SignedBeaconBlock): ISignatureSet[];
//# sourceMappingURL=index.d.ts.map