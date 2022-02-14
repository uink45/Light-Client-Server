import { CachedBeaconState, allForks } from "@chainsafe/lodestar-beacon-state-transition";
import { altair } from "@chainsafe/lodestar-types";
import { IBeaconChain } from "../interface";
declare type IndexInSubCommittee = number;
/**
 * Spec v1.1.0-alpha.8
 */
export declare function validateGossipSyncCommittee(chain: IBeaconChain, syncCommittee: altair.SyncCommitteeMessage, subnet: number): Promise<{
    indexInSubCommittee: IndexInSubCommittee;
}>;
/**
 * Abstracted so it can be re-used in API validation.
 */
export declare function validateSyncCommitteeSigOnly(chain: IBeaconChain, headState: CachedBeaconState<allForks.BeaconState>, syncCommittee: altair.SyncCommitteeMessage): Promise<void>;
/**
 * Spec v1.1.0-alpha.8
 */
export declare function validateGossipSyncCommitteeExceptSig(chain: IBeaconChain, headState: CachedBeaconState<allForks.BeaconState>, subnet: number, data: Pick<altair.SyncCommitteeMessage, "slot" | "validatorIndex">): IndexInSubCommittee;
export {};
//# sourceMappingURL=syncCommittee.d.ts.map