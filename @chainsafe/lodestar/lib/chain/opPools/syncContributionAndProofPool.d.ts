import { Signature } from "@chainsafe/bls";
import { altair, Slot, Root } from "@chainsafe/lodestar-types";
import { InsertOutcome } from "./types";
/**
 * A one-one mapping to SyncContribution with fast data structure to help speed up the aggregation.
 */
export declare type SyncContributionFast = {
    syncSubCommitteeBits: boolean[];
    numParticipants: number;
    syncSubCommitteeSignature: Signature;
};
/**
 * Cache SyncCommitteeContribution and seen ContributionAndProof.
 * This is used for SignedContributionAndProof validation and block factory.
 * This stays in-memory and should be pruned per slot.
 */
export declare class SyncContributionAndProofPool {
    private readonly bestContributionBySubnetRootSlot;
    private lowestPermissibleSlot;
    /**
     * Only call this once we pass all validation.
     */
    add(contributionAndProof: altair.ContributionAndProof): InsertOutcome;
    /**
     * This is for the block factory, the same to process_sync_committee_contributions in the spec.
     */
    getAggregate(slot: Slot, prevBlockRoot: Root): altair.SyncAggregate;
    /**
     * Prune per head slot.
     * SyncCommittee aggregates are only useful for the next block they have signed.
     * We don't want to prune by clock slot in case there's a long period of skipped slots.
     */
    prune(headSlot: Slot): void;
}
/**
 * Mutate bestContribution if new contribution has more participants
 */
export declare function replaceIfBetter(bestContribution: SyncContributionFast, contribution: altair.SyncCommitteeContribution): InsertOutcome;
/**
 * Format `contribution` into an efficient data structure to aggregate later.
 */
export declare function contributionToFast(contribution: altair.SyncCommitteeContribution): SyncContributionFast;
/**
 * Aggregate best contributions of each subnet into SyncAggregate
 * @returns SyncAggregate to be included in block body.
 */
export declare function aggregate(bestContributionBySubnet: Map<number, SyncContributionFast>): altair.SyncAggregate;
//# sourceMappingURL=syncContributionAndProofPool.d.ts.map