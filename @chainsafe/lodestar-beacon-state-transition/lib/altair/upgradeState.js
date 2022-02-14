"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upgradeState = void 0;
const lodestar_types_1 = require("@chainsafe/lodestar-types");
const util_1 = require("../allForks/util");
const util_2 = require("../util");
const processAttestation_1 = require("./block/processAttestation");
const syncCommittee_1 = require("./util/syncCommittee");
/**
 * Upgrade a state from phase0 to altair.
 */
function upgradeState(state) {
    const { config } = state;
    const pendingAttesations = Array.from(state.previousEpochAttestations);
    const postTreeBackedState = upgradeTreeBackedState(config, state);
    const postState = (0, util_1.createCachedBeaconState)(config, postTreeBackedState);
    translateParticipation(postState, pendingAttesations);
    return postState;
}
exports.upgradeState = upgradeState;
function upgradeTreeBackedState(config, state) {
    const nextEpochActiveIndices = state.nextShuffling.activeIndices;
    const stateTB = lodestar_types_1.ssz.phase0.BeaconState.createTreeBacked(state.tree);
    const validatorCount = stateTB.validators.length;
    const epoch = state.currentShuffling.epoch;
    // TODO: Does this preserve the hashing cache? In altair devnets memory spikes on the fork transition
    const postState = lodestar_types_1.ssz.altair.BeaconState.createTreeBacked(stateTB.tree);
    postState.fork = {
        previousVersion: stateTB.fork.currentVersion,
        currentVersion: config.ALTAIR_FORK_VERSION,
        epoch,
    };
    postState.previousEpochParticipation = (0, util_2.newZeroedArray)(validatorCount);
    postState.currentEpochParticipation = (0, util_2.newZeroedArray)(validatorCount);
    postState.inactivityScores = (0, util_2.newZeroedArray)(validatorCount);
    const syncCommittee = (0, syncCommittee_1.getNextSyncCommittee)(state, nextEpochActiveIndices, state.epochCtx.effectiveBalances);
    postState.currentSyncCommittee = syncCommittee;
    postState.nextSyncCommittee = syncCommittee;
    return postState;
}
/**
 * Translate_participation in https://github.com/ethereum/eth2.0-specs/blob/dev/specs/altair/fork.md
 */
function translateParticipation(state, pendingAttesations) {
    const { epochCtx } = state;
    const rootCache = new processAttestation_1.RootCache(state);
    const epochParticipation = state.previousEpochParticipation;
    for (const attestation of pendingAttesations) {
        const data = attestation.data;
        const { timelySource, timelyTarget, timelyHead } = (0, processAttestation_1.getAttestationParticipationStatus)(data, attestation.inclusionDelay, rootCache, epochCtx);
        const attestingIndices = state.getAttestingIndices(data, attestation.aggregationBits);
        for (const index of attestingIndices) {
            const status = epochParticipation.getStatus(index);
            const newStatus = {
                timelySource: status.timelySource || timelySource,
                timelyTarget: status.timelyTarget || timelyTarget,
                timelyHead: status.timelyHead || timelyHead,
            };
            epochParticipation.setStatus(index, newStatus);
        }
    }
}
//# sourceMappingURL=upgradeState.js.map