import { altair } from "@chainsafe/lodestar-types";
import { ISignatureSet } from "../../util";
import { CachedBeaconState } from "../../allForks/util";
export declare function processSyncAggregate(state: CachedBeaconState<altair.BeaconState>, block: altair.BeaconBlock, verifySignatures?: boolean): void;
export declare function getSyncCommitteeSignatureSet(state: CachedBeaconState<altair.BeaconState>, block: altair.BeaconBlock, 
/** Optional parameter to prevent computing it twice */
participantIndices?: number[]): ISignatureSet | null;
//# sourceMappingURL=processSyncCommittee.d.ts.map