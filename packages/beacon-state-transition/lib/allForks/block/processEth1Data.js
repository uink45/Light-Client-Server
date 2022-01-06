"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewEth1Data = exports.processEth1Data = void 0;
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const lodestar_types_1 = require("@chainsafe/lodestar-types");
const ssz_1 = require("@chainsafe/ssz");
/**
 * Store vote counts for every eth1 block that has votes; if any eth1 block wins majority support within a 1024-slot
 * voting period, formally accept that eth1 block and set it as the official "latest known eth1 block" in the eth2 state.
 *
 * PERF: Processing cost depends on the current amount of votes.
 * - Best case: Vote is already decided, zero work. See getNewEth1Data conditions
 * - Worst case: 1023 votes and no majority vote yet.
 */
function processEth1Data(state, body) {
    const newEth1Data = getNewEth1Data(state, body.eth1Data);
    if (newEth1Data) {
        state.eth1Data = body.eth1Data;
    }
    state.eth1DataVotes.push(body.eth1Data);
}
exports.processEth1Data = processEth1Data;
/**
 * Returns `newEth1Data` if adding the given `eth1Data` to `state.eth1DataVotes` would
 * result in a change to `state.eth1Data`.
 */
function getNewEth1Data(state, newEth1Data) {
    const SLOTS_PER_ETH1_VOTING_PERIOD = lodestar_params_1.EPOCHS_PER_ETH1_VOTING_PERIOD * lodestar_params_1.SLOTS_PER_EPOCH;
    // If there are not more than 50% votes, then we do not have to count to find a winner.
    if ((state.eth1DataVotes.length + 1) * 2 <= SLOTS_PER_ETH1_VOTING_PERIOD) {
        return null;
    }
    if (lodestar_types_1.ssz.phase0.Eth1Data.equals(state.eth1Data, newEth1Data)) {
        return null; // Nothing to do if the state already has this as eth1data (happens a lot after majority vote is in)
    }
    const sameVotesCount = Array.from((0, ssz_1.readonlyValues)(state.eth1DataVotes)).filter((e) => lodestar_types_1.ssz.phase0.Eth1Data.equals(e, newEth1Data)).length;
    // The +1 is to account for the `eth1Data` supplied to the function.
    if ((sameVotesCount + 1) * 2 > SLOTS_PER_ETH1_VOTING_PERIOD) {
        return newEth1Data;
    }
    else {
        return null;
    }
}
exports.getNewEth1Data = getNewEth1Data;
//# sourceMappingURL=processEth1Data.js.map