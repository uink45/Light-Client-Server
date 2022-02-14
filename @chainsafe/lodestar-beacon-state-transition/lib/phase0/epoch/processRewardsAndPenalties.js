"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRewardsAndPenalties = void 0;
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const getAttestationDeltas_1 = require("./getAttestationDeltas");
/**
 * Iterate over all validator and compute rewards and penalties to apply to balances.
 *
 * PERF: Cost = 'proportional' to $VALIDATOR_COUNT. Extra work is done per validator the more status flags
 * are true, worst case: FLAG_UNSLASHED + FLAG_ELIGIBLE_ATTESTER + FLAG_PREV_*
 */
function processRewardsAndPenalties(state, epochProcess) {
    // No rewards are applied at the end of `GENESIS_EPOCH` because rewards are for work done in the previous epoch
    if (epochProcess.currentEpoch === lodestar_params_1.GENESIS_EPOCH) {
        return;
    }
    const [rewards, penalties] = (0, getAttestationDeltas_1.getAttestationDeltas)(state, epochProcess);
    const deltas = rewards.map((_, i) => rewards[i] - penalties[i]);
    // important: do not change state one balance at a time
    // set them all at once, constructing the tree in one go
    // cache the balances array, too
    epochProcess.balances = state.balanceList.updateAll(deltas);
}
exports.processRewardsAndPenalties = processRewardsAndPenalties;
//# sourceMappingURL=processRewardsAndPenalties.js.map