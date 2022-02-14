"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.votingPeriodStartTime = exports.pickEth1Vote = exports.getEth1VotesToConsider = void 0;
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const lodestar_types_1 = require("@chainsafe/lodestar-types");
const lodestar_beacon_state_transition_1 = require("@chainsafe/lodestar-beacon-state-transition");
const ssz_1 = require("@chainsafe/ssz");
const objects_1 = require("../../util/objects");
async function getEth1VotesToConsider(config, state, eth1DataGetter) {
    const periodStart = votingPeriodStartTime(config, state);
    const { SECONDS_PER_ETH1_BLOCK, ETH1_FOLLOW_DISTANCE } = config;
    // Modified version of the spec function to fetch the required range directly from the DB
    return (await eth1DataGetter({
        timestampRange: {
            // Spec v0.12.2
            // is_candidate_block =
            //   block.timestamp + SECONDS_PER_ETH1_BLOCK * ETH1_FOLLOW_DISTANCE <= period_start &&
            //   block.timestamp + SECONDS_PER_ETH1_BLOCK * ETH1_FOLLOW_DISTANCE * 2 >= period_start
            lte: periodStart - SECONDS_PER_ETH1_BLOCK * ETH1_FOLLOW_DISTANCE,
            gte: periodStart - SECONDS_PER_ETH1_BLOCK * ETH1_FOLLOW_DISTANCE * 2,
        },
    })).filter((eth1Data) => eth1Data.depositCount >= state.eth1Data.depositCount);
}
exports.getEth1VotesToConsider = getEth1VotesToConsider;
function pickEth1Vote(state, votesToConsider) {
    var _a;
    const votesToConsiderHashMap = new Set();
    for (const eth1Data of votesToConsider) {
        votesToConsiderHashMap.add(serializeEth1Data(eth1Data));
    }
    const validVotes = Array.from((0, ssz_1.readonlyValues)(state.eth1DataVotes)).filter((eth1Data) => votesToConsiderHashMap.has(serializeEth1Data(eth1Data)));
    if (validVotes.length > 0) {
        const frequentVotes = (0, objects_1.mostFrequent)(lodestar_types_1.ssz.phase0.Eth1Data, validVotes);
        if (frequentVotes.length === 1) {
            return frequentVotes[0];
        }
        else {
            return validVotes[Math.max(...frequentVotes.map((vote) => validVotes.findIndex((eth1Data) => lodestar_types_1.ssz.phase0.Eth1Data.equals(vote, eth1Data))))];
        }
    }
    else {
        return (_a = votesToConsider[votesToConsider.length - 1]) !== null && _a !== void 0 ? _a : state.eth1Data;
    }
}
exports.pickEth1Vote = pickEth1Vote;
/**
 * Serialize eth1Data types to a unique string ID. It is only used for comparison.
 */
function serializeEth1Data(eth1Data) {
    return (0, ssz_1.toHexString)(eth1Data.blockHash) + eth1Data.depositCount.toString(16) + (0, ssz_1.toHexString)(eth1Data.depositRoot);
}
function votingPeriodStartTime(config, state) {
    const eth1VotingPeriodStartSlot = state.slot - (state.slot % (lodestar_params_1.EPOCHS_PER_ETH1_VOTING_PERIOD * lodestar_params_1.SLOTS_PER_EPOCH));
    return (0, lodestar_beacon_state_transition_1.computeTimeAtSlot)(config, eth1VotingPeriodStartSlot, state.genesisTime);
}
exports.votingPeriodStartTime = votingPeriodStartTime;
//# sourceMappingURL=eth1Vote.js.map