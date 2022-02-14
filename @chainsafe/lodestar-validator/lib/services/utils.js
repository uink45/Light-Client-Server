"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupSyncDutiesBySubCommitteeIndex = exports.groupAttDutiesByCommitteeIndex = exports.getAggregationBits = exports.mapSecretKeysToValidators = void 0;
const ssz_1 = require("@chainsafe/ssz");
function mapSecretKeysToValidators(secretKeys) {
    const validators = new Map();
    for (const secretKey of secretKeys) {
        const publicKey = secretKey.toPublicKey().toBytes();
        validators.set((0, ssz_1.toHexString)(publicKey), { publicKey, secretKey });
    }
    return validators;
}
exports.mapSecretKeysToValidators = mapSecretKeysToValidators;
function getAggregationBits(committeeLength, validatorIndexInCommittee) {
    return Array.from({ length: committeeLength }, (_, i) => i === validatorIndexInCommittee);
}
exports.getAggregationBits = getAggregationBits;
function groupAttDutiesByCommitteeIndex(duties) {
    const dutiesByCommitteeIndex = new Map();
    for (const dutyAndProof of duties) {
        const { committeeIndex } = dutyAndProof.duty;
        let dutyAndProofArr = dutiesByCommitteeIndex.get(committeeIndex);
        if (!dutyAndProofArr) {
            dutyAndProofArr = [];
            dutiesByCommitteeIndex.set(committeeIndex, dutyAndProofArr);
        }
        dutyAndProofArr.push(dutyAndProof);
    }
    return dutiesByCommitteeIndex;
}
exports.groupAttDutiesByCommitteeIndex = groupAttDutiesByCommitteeIndex;
function groupSyncDutiesBySubCommitteeIndex(duties) {
    const dutiesBySubCommitteeIndex = new Map();
    for (const validatorDuty of duties) {
        for (const { selectionProof, subCommitteeIndex } of validatorDuty.selectionProofs) {
            let dutyAndProofArr = dutiesBySubCommitteeIndex.get(subCommitteeIndex);
            if (!dutyAndProofArr) {
                dutyAndProofArr = [];
                dutiesBySubCommitteeIndex.set(subCommitteeIndex, dutyAndProofArr);
            }
            dutyAndProofArr.push({ duty: validatorDuty.duty, selectionProof: selectionProof });
        }
    }
    return dutiesBySubCommitteeIndex;
}
exports.groupSyncDutiesBySubCommitteeIndex = groupSyncDutiesBySubCommitteeIndex;
//# sourceMappingURL=utils.js.map