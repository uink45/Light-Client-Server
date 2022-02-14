"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidatorFlat = void 0;
// A "flat" validator is a concrete `Validator`
// For intermediate computation, the TreeBacked representation slows things down, so a regular object is used instead.
function createValidatorFlat(v) {
    return {
        pubkey: v.pubkey.valueOf(),
        withdrawalCredentials: v.withdrawalCredentials.valueOf(),
        effectiveBalance: v.effectiveBalance,
        slashed: v.slashed,
        activationEligibilityEpoch: v.activationEligibilityEpoch,
        activationEpoch: v.activationEpoch,
        exitEpoch: v.exitEpoch,
        withdrawableEpoch: v.withdrawableEpoch,
    };
}
exports.createValidatorFlat = createValidatorFlat;
//# sourceMappingURL=flat.js.map