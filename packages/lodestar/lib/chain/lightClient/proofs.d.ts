import { allForks } from "@chainsafe/lodestar-types";
import { TreeBacked } from "@chainsafe/ssz";
import { SyncCommitteeWitness } from "./types";
export declare function getSyncCommitteesWitness(state: TreeBacked<allForks.BeaconState>): SyncCommitteeWitness;
export declare function getNextSyncCommitteeBranch(syncCommitteesWitness: SyncCommitteeWitness): Uint8Array[];
export declare function getCurrentSyncCommitteeBranch(syncCommitteesWitness: SyncCommitteeWitness): Uint8Array[];
export declare function getFinalizedRootProof(state: TreeBacked<allForks.BeaconState>): Uint8Array[];
//# sourceMappingURL=proofs.d.ts.map