"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAndSubmitVoluntaryExit = void 0;
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const lodestar_beacon_state_transition_1 = require("@chainsafe/lodestar-beacon-state-transition");
const lodestar_types_1 = require("@chainsafe/lodestar-types");
/**
 * Perform a voluntary exit for the given validator by its key.
 */
async function signAndSubmitVoluntaryExit(publicKey, exitEpoch, secretKey, api, config) {
    const stateValidatorRes = await api.beacon.getStateValidators("head", { indices: [publicKey] });
    const stateValidator = stateValidatorRes.data[0];
    if (stateValidator === undefined) {
        throw new Error("Validator not found in beacon chain.");
    }
    const { data: fork } = await api.beacon.getStateFork("head");
    if (fork === undefined) {
        throw new Error("VoluntaryExit: Fork not found");
    }
    const genesisRes = await api.beacon.getGenesis();
    const { genesisValidatorsRoot, genesisTime } = genesisRes.data;
    const currentSlot = (0, lodestar_beacon_state_transition_1.getCurrentSlot)(config, Number(genesisTime));
    const currentEpoch = (0, lodestar_beacon_state_transition_1.computeEpochAtSlot)(currentSlot);
    const voluntaryExit = {
        epoch: exitEpoch || currentEpoch,
        validatorIndex: stateValidator.index,
    };
    const domain = (0, lodestar_beacon_state_transition_1.computeDomain)(lodestar_params_1.DOMAIN_VOLUNTARY_EXIT, fork.currentVersion, genesisValidatorsRoot);
    const signingRoot = (0, lodestar_beacon_state_transition_1.computeSigningRoot)(lodestar_types_1.ssz.phase0.VoluntaryExit, voluntaryExit, domain);
    const signedVoluntaryExit = {
        message: voluntaryExit,
        signature: secretKey.sign(signingRoot).toBytes(),
    };
    await api.beacon.submitPoolVoluntaryExit(signedVoluntaryExit);
}
exports.signAndSubmitVoluntaryExit = signAndSubmitVoluntaryExit;
//# sourceMappingURL=voluntaryExit.js.map