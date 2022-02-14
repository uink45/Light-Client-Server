"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initBeaconState = void 0;
const lodestar_types_1 = require("@chainsafe/lodestar-types");
const lodestar_config_1 = require("@chainsafe/lodestar-config");
const lodestar_utils_1 = require("@chainsafe/lodestar-utils");
const lodestar_beacon_state_transition_1 = require("@chainsafe/lodestar-beacon-state-transition");
const lodestar_1 = require("@chainsafe/lodestar");
// eslint-disable-next-line no-restricted-imports
const multifork_1 = require("@chainsafe/lodestar/lib/util/multifork");
const util_1 = require("../../util");
const globalOptions_1 = require("../../options/globalOptions");
const networks_1 = require("../../networks");
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const checkpointRegex = new RegExp("^(?:0x)?([0-9a-f]{64}):([0-9]+)$");
function getCheckpointFromArg(checkpointStr) {
    const match = checkpointRegex.exec(checkpointStr.toLowerCase());
    if (!match) {
        throw new Error(`Could not parse checkpoint string: ${checkpointStr}`);
    }
    return { root: (0, lodestar_utils_1.fromHex)(match[1]), epoch: parseInt(match[2]) };
}
function getCheckpointFromState(config, state) {
    return {
        epoch: (0, lodestar_beacon_state_transition_1.computeEpochAtSlot)(state.latestBlockHeader.slot),
        root: lodestar_beacon_state_transition_1.allForks.getLatestBlockRoot(config, state),
    };
}
async function initAndVerifyWeakSubjectivityState(config, db, logger, store, wsState, wsCheckpoint) {
    // Check if the store's state and wsState are compatible
    if (store.genesisTime !== wsState.genesisTime ||
        !lodestar_types_1.ssz.Root.equals(store.genesisValidatorsRoot, wsState.genesisValidatorsRoot)) {
        throw new Error("Db state and checkpoint state are not compatible, either clear the db or verify your checkpoint source");
    }
    // Pick the state which is ahead as an anchor to initialize the beacon chain
    let anchorState = wsState;
    let anchorCheckpoint = wsCheckpoint;
    if (store.slot > wsState.slot) {
        anchorState = store;
        anchorCheckpoint = getCheckpointFromState(config, store);
        logger.verbose("Db state is ahead of the provided checkpoint state, using the db state to initialize the beacon chain");
    }
    if (!lodestar_beacon_state_transition_1.allForks.isWithinWeakSubjectivityPeriod(config, anchorState, anchorCheckpoint)) {
        throw new Error("Fetched weak subjectivity checkpoint not within weak subjectivity period.");
    }
    return await (0, lodestar_1.initStateFromAnchorState)(config, db, logger, anchorState);
}
/**
 * Initialize a beacon state, picking the strategy based on the `IBeaconArgs`
 *
 * State is initialized in one of three ways:
 * 1. restore from weak subjectivity state (possibly downloaded from a remote beacon node)
 * 2. restore from db
 * 3. restore from genesis state (possibly downloaded via URL)
 * 4. create genesis state from eth1
 */
async function initBeaconState(options, args, chainForkConfig, db, logger, signal) {
    // fetch the latest state stored in the db
    // this will be used in all cases, if it exists, either used during verification of a weak subjectivity state, or used directly as the anchor state
    const lastDbState = await db.stateArchive.lastValue();
    if (args.weakSubjectivityStateFile) {
        // weak subjectivity sync from a provided state file:
        // if a weak subjectivity checkpoint has been provided, it is used for additional verification
        // otherwise, the state itself is used for verification (not bad, because the trusted state has been explicitly provided)
        const stateBytes = await (0, util_1.downloadOrLoadFile)(args.weakSubjectivityStateFile);
        const wsState = (0, multifork_1.getStateTypeFromBytes)(chainForkConfig, stateBytes).createTreeBackedFromBytes(stateBytes);
        const config = (0, lodestar_config_1.createIBeaconConfig)(chainForkConfig, wsState.genesisValidatorsRoot);
        const store = lastDbState !== null && lastDbState !== void 0 ? lastDbState : wsState;
        const checkpoint = args.weakSubjectivityCheckpoint
            ? getCheckpointFromArg(args.weakSubjectivityCheckpoint)
            : getCheckpointFromState(config, wsState);
        return initAndVerifyWeakSubjectivityState(config, db, logger, store, wsState, checkpoint);
    }
    else if (args.weakSubjectivitySyncLatest) {
        // weak subjectivity sync from a state that needs to be fetched:
        // if a weak subjectivity checkpoint has been provided, it is used to inform which state to download and used for additional verification
        // otherwise, the 'finalized' state is downloaded and the state itself is used for verification (all trust delegated to the remote beacon node)
        const remoteBeaconUrl = args.weakSubjectivityServerUrl;
        if (!remoteBeaconUrl) {
            throw Error(`Must set arg --weakSubjectivityServerUrl for network ${args.network}`);
        }
        let stateId = "finalized";
        let checkpoint;
        if (args.weakSubjectivityCheckpoint) {
            checkpoint = getCheckpointFromArg(args.weakSubjectivityCheckpoint);
            stateId = (checkpoint.epoch * lodestar_params_1.SLOTS_PER_EPOCH).toString();
        }
        const url = `${remoteBeaconUrl}/eth/v1/debug/beacon/states/${stateId}`;
        logger.info("Fetching weak subjectivity state from " + url);
        const wsState = await (0, networks_1.fetchWeakSubjectivityState)(chainForkConfig, url);
        const config = (0, lodestar_config_1.createIBeaconConfig)(chainForkConfig, wsState.genesisValidatorsRoot);
        const store = lastDbState !== null && lastDbState !== void 0 ? lastDbState : wsState;
        return initAndVerifyWeakSubjectivityState(config, db, logger, store, wsState, checkpoint || getCheckpointFromState(config, wsState));
    }
    else if (lastDbState) {
        // start the chain from the latest stored state in the db
        const config = (0, lodestar_config_1.createIBeaconConfig)(chainForkConfig, lastDbState.genesisValidatorsRoot);
        return await (0, lodestar_1.initStateFromAnchorState)(config, db, logger, lastDbState);
    }
    else {
        const genesisStateFile = args.genesisStateFile || (0, networks_1.getGenesisFileUrl)(args.network || globalOptions_1.defaultNetwork);
        if (genesisStateFile && !args.forceGenesis) {
            const stateBytes = await (0, util_1.downloadOrLoadFile)(genesisStateFile);
            const anchorState = (0, multifork_1.getStateTypeFromBytes)(chainForkConfig, stateBytes).createTreeBackedFromBytes(stateBytes);
            const config = (0, lodestar_config_1.createIBeaconConfig)(chainForkConfig, anchorState.genesisValidatorsRoot);
            return await (0, lodestar_1.initStateFromAnchorState)(config, db, logger, anchorState);
        }
        else {
            return await (0, lodestar_1.initStateFromEth1)({ config: chainForkConfig, db, logger, opts: options.eth1, signal });
        }
    }
}
exports.initBeaconState = initBeaconState;
//# sourceMappingURL=initBeaconState.js.map