"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beaconOptions = exports.beaconPathsOptions = exports.logOptions = exports.beaconExtraOptions = void 0;
const lodestar_utils_1 = require("@chainsafe/lodestar-utils");
const options_1 = require("../../options");
const paths_1 = require("./paths");
exports.beaconExtraOptions = {
    port: {
        description: "The TCP/UDP port to listen on. The UDP port can be modified by the --discovery-port flag.",
        type: "number",
        // TODO: Derive from BeaconNode defaults
        defaultDescription: "9000",
    },
    discoveryPort: {
        description: "The UDP port that discovery will listen on. Defaults to `port`",
        type: "number",
        defaultDescription: "`port`",
    },
    forceGenesis: {
        description: "Force beacon to create genesis without file",
        type: "boolean",
    },
    genesisStateFile: {
        description: "Path or URL to download a genesis state file in ssz-encoded format",
        type: "string",
    },
    weakSubjectivityStateFile: {
        description: "Path or URL to download a weak subjectivity state file in ssz-encoded format",
        type: "string",
    },
    weakSubjectivitySyncLatest: {
        description: "Enable fetching of a weak subjectivity state via --weakSubjectivityServerUrl.  If an argument is provided to --weakSubjectivityCheckpoint, fetch the state at that checkpoint.  Else, fetch the latest finalized state.",
        type: "boolean",
        default: false,
    },
    weakSubjectivityCheckpoint: {
        description: "Tell the beacon node to fetch a weak subjectivity state at the specified checkpoint. The string arg must be in the form <blockRoot>:<epoch>. For example, 0x1234:100 would ask for the weak subjectivity state at checkpoint of epoch 100 with block root 0x1234.",
        type: "string",
    },
    weakSubjectivityServerUrl: {
        description: "Pass in a custom server from which to fetch weak subjectivity states (if you don't want to use the built-in Lodestar servers).",
        type: "string",
    },
};
exports.logOptions = {
    logLevel: {
        choices: lodestar_utils_1.LogLevels,
        description: "Logging verbosity level",
        defaultDescription: lodestar_utils_1.defaultLogLevel,
        type: "string",
    },
    logLevelFile: {
        choices: lodestar_utils_1.LogLevels,
        description: "Logging verbosity level for file transport",
        defaultDescription: lodestar_utils_1.defaultLogLevel,
        type: "string",
    },
    logFormatGenesisTime: {
        hidden: true,
        description: "Logger format - Use EpochSlot TimestampFormat",
        type: "number",
    },
    logFormatId: {
        hidden: true,
        description: "Logger format - Prefix module field with a string ID",
        type: "string",
    },
    logRotate: {
        description: "Daily rotate log files",
        type: "boolean",
    },
    logMaxFiles: {
        description: "Number of log files to maintain while rotating logs(if provided with logRotate)",
        type: "number",
    },
};
exports.beaconPathsOptions = {
    beaconDir: {
        description: "Beacon root directory",
        defaultDescription: paths_1.defaultBeaconPaths.beaconDir,
        hidden: true,
        type: "string",
    },
    dbDir: {
        description: "Beacon DB directory",
        defaultDescription: paths_1.defaultBeaconPaths.dbDir,
        hidden: true,
        type: "string",
    },
    persistInvalidSszObjectsDir: {
        description: "Directory to persist invalid ssz objects",
        defaultDescription: paths_1.defaultBeaconPaths.persistInvalidSszObjectsDir,
        hidden: true,
        type: "string",
    },
    configFile: {
        description: "Beacon node configuration file path",
        type: "string",
    },
    peerStoreDir: {
        hidden: true,
        description: "Peer store directory",
        defaultDescription: paths_1.defaultBeaconPaths.peerStoreDir,
        type: "string",
    },
    peerIdFile: {
        hidden: true,
        description: "Peer ID file path",
        defaultDescription: paths_1.defaultBeaconPaths.peerIdFile,
        type: "string",
    },
    enrFile: {
        hidden: true,
        description: "ENR file path",
        defaultDescription: paths_1.defaultBeaconPaths.enrFile,
        type: "string",
    },
    logFile: {
        description: "Path to output all logs to a persistent log file",
        type: "string",
    },
    bootnodesFile: {
        hidden: true,
        description: "Bootnodes file path",
        type: "string",
    },
};
exports.beaconOptions = {
    ...exports.beaconExtraOptions,
    ...exports.logOptions,
    ...exports.beaconPathsOptions,
    ...options_1.beaconNodeOptions,
    ...options_1.paramsOptions,
    ...options_1.enrOptions,
};
//# sourceMappingURL=options.js.map