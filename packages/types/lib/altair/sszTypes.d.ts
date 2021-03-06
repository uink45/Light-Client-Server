import { BitVectorType, ContainerType, VectorType, ListType, Vector } from "@chainsafe/ssz";
import { ts as phase0Types } from "../phase0";
import * as altair from "./types";
export declare const SyncSubnets: BitVectorType;
export declare const Metadata: ContainerType<altair.Metadata>;
export declare const SyncCommittee: ContainerType<altair.SyncCommittee>;
export declare const SyncCommitteeMessage: ContainerType<altair.SyncCommitteeMessage>;
export declare const SyncCommitteeContribution: ContainerType<altair.SyncCommitteeContribution>;
export declare const ContributionAndProof: ContainerType<altair.ContributionAndProof>;
export declare const SignedContributionAndProof: ContainerType<altair.SignedContributionAndProof>;
export declare const SyncAggregatorSelectionData: ContainerType<altair.SyncAggregatorSelectionData>;
export declare const SyncCommitteeBits: BitVectorType;
export declare const SyncAggregate: ContainerType<altair.SyncAggregate>;
export declare const HistoricalBlockRoots: VectorType<Vector<import("@chainsafe/ssz").ByteVector>>;
export declare const HistoricalStateRoots: VectorType<Vector<import("@chainsafe/ssz").ByteVector>>;
export declare const HistoricalBatch: ContainerType<phase0Types.HistoricalBatch>;
export declare const BeaconBlockBody: ContainerType<altair.BeaconBlockBody>;
export declare const BeaconBlock: ContainerType<altair.BeaconBlock>;
export declare const SignedBeaconBlock: ContainerType<altair.SignedBeaconBlock>;
export declare const EpochParticipation: ListType<import("@chainsafe/ssz").List<any>>;
export declare const InactivityScores: ListType<import("@chainsafe/ssz").List<any>>;
export declare const BeaconState: ContainerType<altair.BeaconState>;
export declare const LightClientUpdate: ContainerType<altair.LightClientUpdate>;
//# sourceMappingURL=sszTypes.d.ts.map