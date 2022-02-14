"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRewardsPenaltiesDeltas = void 0;
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const util_1 = require("../../allForks/util");
const util_2 = require("../../util");
/**
 * An aggregate of getFlagIndexDeltas and getInactivityPenaltyDeltas that loop through process.statuses 1 time instead of 4.
 *
 * - On normal mainnet conditions
 *   - prevSourceAttester: 98%
 *   - prevTargetAttester: 96%
 *   - prevHeadAttester:   93%
 *   - currSourceAttester: 95%
 *   - currTargetAttester: 93%
 *   - currHeadAttester:   91%
 *   - unslashed:          100%
 *   - eligibleAttester:   98%
 */
function getRewardsPenaltiesDeltas(state, process) {
    // TODO: Is there a cheaper way to measure length that going to `state.validators`?
    const validatorCount = state.validators.length;
    const activeIncrements = process.totalActiveStakeByIncrement;
    const rewards = (0, util_2.newZeroedArray)(validatorCount);
    const penalties = (0, util_2.newZeroedArray)(validatorCount);
    const isInInactivityLeakBn = (0, util_2.isInInactivityLeak)(state);
    // effectiveBalance is multiple of EFFECTIVE_BALANCE_INCREMENT and less than MAX_EFFECTIVE_BALANCE
    // so there are limited values of them like 32000000000, 31000000000, 30000000000
    const rewardPenaltyItemCache = new Map();
    const { config, epochCtx } = state;
    const fork = config.getForkName(state.slot);
    const inactivityPenalityMultiplier = fork === lodestar_params_1.ForkName.altair ? lodestar_params_1.INACTIVITY_PENALTY_QUOTIENT_ALTAIR : lodestar_params_1.INACTIVITY_PENALTY_QUOTIENT_MERGE;
    const penaltyDenominator = config.INACTIVITY_SCORE_BIAS * inactivityPenalityMultiplier;
    const { statuses } = process;
    for (let i = 0; i < statuses.length; i++) {
        const status = statuses[i];
        if (!(0, util_1.hasMarkers)(status.flags, util_1.FLAG_ELIGIBLE_ATTESTER)) {
            continue;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const effectiveBalance = epochCtx.effectiveBalances.get(i);
        let rewardPenaltyItem = rewardPenaltyItemCache.get(effectiveBalance);
        if (!rewardPenaltyItem) {
            const baseReward = (effectiveBalance / lodestar_params_1.EFFECTIVE_BALANCE_INCREMENT) * process.baseRewardPerIncrement;
            const tsWeigh = lodestar_params_1.PARTICIPATION_FLAG_WEIGHTS[lodestar_params_1.TIMELY_SOURCE_FLAG_INDEX];
            const ttWeigh = lodestar_params_1.PARTICIPATION_FLAG_WEIGHTS[lodestar_params_1.TIMELY_TARGET_FLAG_INDEX];
            const thWeigh = lodestar_params_1.PARTICIPATION_FLAG_WEIGHTS[lodestar_params_1.TIMELY_HEAD_FLAG_INDEX];
            const tsUnslashedParticipatingIncrements = process.prevEpochUnslashedStake.sourceStakeByIncrement;
            const ttUnslashedParticipatingIncrements = process.prevEpochUnslashedStake.targetStakeByIncrement;
            const thUnslashedParticipatingIncrements = process.prevEpochUnslashedStake.headStakeByIncrement;
            const tsRewardNumerator = baseReward * tsWeigh * tsUnslashedParticipatingIncrements;
            const ttRewardNumerator = baseReward * ttWeigh * ttUnslashedParticipatingIncrements;
            const thRewardNumerator = baseReward * thWeigh * thUnslashedParticipatingIncrements;
            rewardPenaltyItem = {
                baseReward: baseReward,
                timelySourceReward: Math.floor(tsRewardNumerator / (activeIncrements * lodestar_params_1.WEIGHT_DENOMINATOR)),
                timelyTargetReward: Math.floor(ttRewardNumerator / (activeIncrements * lodestar_params_1.WEIGHT_DENOMINATOR)),
                timelyHeadReward: Math.floor(thRewardNumerator / (activeIncrements * lodestar_params_1.WEIGHT_DENOMINATOR)),
                timelySourcePenalty: Math.floor((baseReward * tsWeigh) / lodestar_params_1.WEIGHT_DENOMINATOR),
                timelyTargetPenalty: Math.floor((baseReward * ttWeigh) / lodestar_params_1.WEIGHT_DENOMINATOR),
            };
            rewardPenaltyItemCache.set(effectiveBalance, rewardPenaltyItem);
        }
        const { timelySourceReward, timelySourcePenalty, timelyTargetReward, timelyTargetPenalty, timelyHeadReward, } = rewardPenaltyItem;
        // same logic to getFlagIndexDeltas
        if ((0, util_1.hasMarkers)(status.flags, util_1.FLAG_PREV_SOURCE_ATTESTER_OR_UNSLASHED)) {
            if (!isInInactivityLeakBn) {
                rewards[i] += timelySourceReward;
            }
        }
        else {
            penalties[i] += timelySourcePenalty;
        }
        if ((0, util_1.hasMarkers)(status.flags, util_1.FLAG_PREV_TARGET_ATTESTER_OR_UNSLASHED)) {
            if (!isInInactivityLeakBn) {
                rewards[i] += timelyTargetReward;
            }
        }
        else {
            penalties[i] += timelyTargetPenalty;
        }
        if ((0, util_1.hasMarkers)(status.flags, util_1.FLAG_PREV_HEAD_ATTESTER_OR_UNSLASHED)) {
            if (!isInInactivityLeakBn) {
                rewards[i] += timelyHeadReward;
            }
        }
        // Same logic to getInactivityPenaltyDeltas
        // TODO: if we have limited value in inactivityScores we can provide a cache too
        if (!(0, util_1.hasMarkers)(status.flags, util_1.FLAG_PREV_TARGET_ATTESTER_OR_UNSLASHED)) {
            const penaltyNumerator = effectiveBalance * state.inactivityScores[i];
            penalties[i] += Math.floor(penaltyNumerator / penaltyDenominator);
        }
    }
    return [rewards, penalties];
}
exports.getRewardsPenaltiesDeltas = getRewardsPenaltiesDeltas;
//# sourceMappingURL=balance.js.map