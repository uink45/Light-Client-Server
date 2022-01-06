"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeBaseRewardPerIncrement = exports.hasFlag = exports.addFlag = void 0;
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const lodestar_utils_1 = require("@chainsafe/lodestar-utils");
function addFlag(flags, flagIndex) {
    const flag = 2 ** flagIndex;
    return flags | flag;
}
exports.addFlag = addFlag;
function hasFlag(flags, flagIndex) {
    const flag = 2 ** flagIndex;
    return (flags & flag) == flag;
}
exports.hasFlag = hasFlag;
/**
 * Before we manage bigIntSqrt(totalActiveStake) as BigInt and return BigInt.
 * bigIntSqrt(totalActiveStake) should fit a number (2 ** 53 -1 max)
 **/
function computeBaseRewardPerIncrement(totalActiveStakeByIncrement) {
    return Math.floor((lodestar_params_1.EFFECTIVE_BALANCE_INCREMENT * lodestar_params_1.BASE_REWARD_FACTOR) /
        Number((0, lodestar_utils_1.bigIntSqrt)(BigInt(totalActiveStakeByIncrement) * BigInt(lodestar_params_1.EFFECTIVE_BALANCE_INCREMENT))));
}
exports.computeBaseRewardPerIncrement = computeBaseRewardPerIncrement;
// OLD VERSION
// TODO: remove?
// export function computeBaseRewardPerIncrement(totalActiveStake: Gwei): number {
//   return Math.floor((EFFECTIVE_BALANCE_INCREMENT * BASE_REWARD_FACTOR) / Number(bigIntSqrt(totalActiveStake)));
// }
//# sourceMappingURL=misc.js.map