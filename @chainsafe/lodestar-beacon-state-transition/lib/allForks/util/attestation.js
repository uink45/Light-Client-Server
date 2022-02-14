"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeSubnetForSlot = exports.computeSubnetForAttestation = void 0;
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const util_1 = require("../../util");
/**
 * Compute the correct subnet for an attestation
 */
function computeSubnetForAttestation(epochCtx, attestation) {
    const { slot, index } = attestation.data;
    return computeSubnetForSlot(epochCtx, slot, index);
}
exports.computeSubnetForAttestation = computeSubnetForAttestation;
/**
 * Compute the correct subnet for a slot/committee index
 */
function computeSubnetForSlot(epochCtx, slot, committeeIndex) {
    const slotsSinceEpochStart = slot % lodestar_params_1.SLOTS_PER_EPOCH;
    const committeesPerSlot = epochCtx.getCommitteeCountPerSlot((0, util_1.computeEpochAtSlot)(slot));
    const committeesSinceEpochStart = committeesPerSlot * slotsSinceEpochStart;
    return (committeesSinceEpochStart + committeeIndex) % lodestar_params_1.ATTESTATION_SUBNET_COUNT;
}
exports.computeSubnetForSlot = computeSubnetForSlot;
//# sourceMappingURL=attestation.js.map