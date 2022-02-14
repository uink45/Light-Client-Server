"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRewardsAndPenalties = void 0;
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const balance_1 = require("./balance");
/**
 * Iterate over all validator and compute rewards and penalties to apply to balances.
 *
 * PERF: Cost = 'proportional' to $VALIDATOR_COUNT. Extra work is done per validator the more status flags
 * are true, worst case: FLAG_UNSLASHED + FLAG_ELIGIBLE_ATTESTER + FLAG_PREV_*
 */
function processRewardsAndPenalties(state, epochProcess) {
    if (state.currentShuffling.epoch == lodestar_params_1.GENESIS_EPOCH) {
        return;
    }
    const [rewards, penalties] = (0, balance_1.getRewardsPenaltiesDeltas)(state, epochProcess);
    const deltas = rewards.map((_, i) => Number(rewards[i] - penalties[i]));
    // important: do not change state one balance at a time
    // set them all at once, constructing the tree in one go
    // cache the balances array, too
    epochProcess.balances = state.balanceList.updateAll(deltas);
}
exports.processRewardsAndPenalties = processRewardsAndPenalties;
// // naive version, leave here for debugging purposes
// function processRewardsAndPenaltiesNAIVE() {
//   const flagDeltas = Array.from({length: PARTICIPATION_FLAG_WEIGHTS.length}, (_, flag) =>
//     getFlagIndexDeltas(state, process, flag)
//   );
//   const inactivityPenaltyDeltas = getInactivityPenaltyDeltas(state, process);
//   flagDeltas.push(inactivityPenaltyDeltas);
//   const newBalances = new BigUint64Array(balances.length);
//   balances.forEach((balance, i) => {
//     let newBalance = balance;
//     for (const [rewards, penalties] of flagDeltas) {
//       const b = newBalance + BigInt(rewards[i] - penalties[i]);
//       if (b > 0) {
//         newBalance = b;
//       } else {
//         newBalance = BigInt(0);
//       }
//     }
//     newBalances[i] = newBalance;
//   });
// }
//# sourceMappingURL=processRewardsAndPenalties.js.map