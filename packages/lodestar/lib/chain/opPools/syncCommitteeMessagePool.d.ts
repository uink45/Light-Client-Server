import { altair, Root, Slot, SubCommitteeIndex } from "@chainsafe/lodestar-types";
import { InsertOutcome } from "./types";
declare type Subnet = SubCommitteeIndex;
/**
 * Preaggregate SyncCommitteeMessage into SyncCommitteeContribution
 * and cache seen SyncCommitteeMessage by slot + validator index.
 * This stays in-memory and should be pruned per slot.
 */
export declare class SyncCommitteeMessagePool {
    /**
     * Each array item is respective to a subCommitteeIndex.
     * Preaggregate into SyncCommitteeContribution.
     * */
    private readonly contributionsByRootBySubnetBySlot;
    private lowestPermissibleSlot;
    add(subnet: Subnet, signature: altair.SyncCommitteeMessage, indexInSubCommittee: number): InsertOutcome;
    /**
     * This is for the aggregator to produce ContributionAndProof.
     */
    getContribution(subnet: SubCommitteeIndex, slot: Slot, prevBlockRoot: Root): altair.SyncCommitteeContribution | null;
    /**
     * Prune per clock slot.
     * SyncCommittee signatures are only useful during a single slot according to our peer's clocks
     */
    prune(clockSlot: Slot): void;
}
export {};
//# sourceMappingURL=syncCommitteeMessagePool.d.ts.map