"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slashValidatorAllForks = void 0;
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const util_1 = require("../../util");
const _1 = require(".");
function slashValidatorAllForks(fork, state, slashedIndex, whistleblowerIndex) {
    const { epochCtx } = state;
    const epoch = epochCtx.currentShuffling.epoch;
    const validator = state.validators[slashedIndex];
    // TODO: Merge initiateValidatorExit validators.update() with the one below
    (0, _1.initiateValidatorExit)(state, validator);
    validator.slashed = true;
    validator.withdrawableEpoch = Math.max(validator.withdrawableEpoch, epoch + lodestar_params_1.EPOCHS_PER_SLASHINGS_VECTOR);
    const { effectiveBalance } = validator;
    // TODO: could state.slashings be number?
    state.slashings[epoch % lodestar_params_1.EPOCHS_PER_SLASHINGS_VECTOR] += BigInt(effectiveBalance);
    const minSlashingPenaltyQuotient = fork === lodestar_params_1.ForkName.phase0
        ? lodestar_params_1.MIN_SLASHING_PENALTY_QUOTIENT
        : fork === lodestar_params_1.ForkName.altair
            ? lodestar_params_1.MIN_SLASHING_PENALTY_QUOTIENT_ALTAIR
            : lodestar_params_1.MIN_SLASHING_PENALTY_QUOTIENT_MERGE;
    (0, util_1.decreaseBalance)(state, slashedIndex, Math.floor(effectiveBalance / minSlashingPenaltyQuotient));
    // apply proposer and whistleblower rewards
    const whistleblowerReward = Math.floor(effectiveBalance / lodestar_params_1.WHISTLEBLOWER_REWARD_QUOTIENT);
    const proposerReward = fork === lodestar_params_1.ForkName.phase0
        ? Math.floor(whistleblowerReward / lodestar_params_1.PROPOSER_REWARD_QUOTIENT)
        : Math.floor((whistleblowerReward * lodestar_params_1.PROPOSER_WEIGHT) / lodestar_params_1.WEIGHT_DENOMINATOR);
    const proposerIndex = epochCtx.getBeaconProposer(state.slot);
    if (whistleblowerIndex === undefined || !Number.isSafeInteger(whistleblowerIndex)) {
        // Call increaseBalance() once with `(whistleblowerReward - proposerReward) + proposerReward`
        (0, util_1.increaseBalance)(state, proposerIndex, whistleblowerReward);
    }
    else {
        (0, util_1.increaseBalance)(state, proposerIndex, proposerReward);
        (0, util_1.increaseBalance)(state, whistleblowerIndex, whistleblowerReward - proposerReward);
    }
}
exports.slashValidatorAllForks = slashValidatorAllForks;
//# sourceMappingURL=slashValidator.js.map