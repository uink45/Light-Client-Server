import { SecretKey } from "@chainsafe/bls";
import { routes } from "@chainsafe/lodestar-api";
import { CommitteeIndex, SubCommitteeIndex } from "@chainsafe/lodestar-types";
import { PubkeyHex, BLSKeypair } from "../types";
import { AttDutyAndProof } from "./attestationDuties";
import { SyncDutyAndProofs, SyncSelectionProof } from "./syncCommitteeDuties";
/** Sync committee duty associated to a single sub committee subnet */
export declare type SubCommitteeDuty = {
    duty: routes.validator.SyncDuty;
    selectionProof: SyncSelectionProof["selectionProof"];
};
export declare function mapSecretKeysToValidators(secretKeys: SecretKey[]): Map<PubkeyHex, BLSKeypair>;
export declare function getAggregationBits(committeeLength: number, validatorIndexInCommittee: number): boolean[];
export declare function groupAttDutiesByCommitteeIndex(duties: AttDutyAndProof[]): Map<CommitteeIndex, AttDutyAndProof[]>;
export declare function groupSyncDutiesBySubCommitteeIndex(duties: SyncDutyAndProofs[]): Map<SubCommitteeIndex, SubCommitteeDuty[]>;
//# sourceMappingURL=utils.d.ts.map