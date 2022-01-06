"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncCommitteeWitnessRepository = exports.SyncCommitteeRepository = exports.CheckpointHeaderRepository = exports.BestPartialLightClientUpdateRepository = exports.Eth1DataRepository = exports.DepositDataRootRepository = exports.DepositEventRepository = exports.VoluntaryExitRepository = exports.ProposerSlashingRepository = exports.AttesterSlashingRepository = exports.StateArchiveRepository = exports.BlockArchiveRepository = exports.BlockRepository = void 0;
var block_1 = require("./block");
Object.defineProperty(exports, "BlockRepository", { enumerable: true, get: function () { return block_1.BlockRepository; } });
var blockArchive_1 = require("./blockArchive");
Object.defineProperty(exports, "BlockArchiveRepository", { enumerable: true, get: function () { return blockArchive_1.BlockArchiveRepository; } });
var stateArchive_1 = require("./stateArchive");
Object.defineProperty(exports, "StateArchiveRepository", { enumerable: true, get: function () { return stateArchive_1.StateArchiveRepository; } });
var attesterSlashing_1 = require("./attesterSlashing");
Object.defineProperty(exports, "AttesterSlashingRepository", { enumerable: true, get: function () { return attesterSlashing_1.AttesterSlashingRepository; } });
var proposerSlashing_1 = require("./proposerSlashing");
Object.defineProperty(exports, "ProposerSlashingRepository", { enumerable: true, get: function () { return proposerSlashing_1.ProposerSlashingRepository; } });
var voluntaryExit_1 = require("./voluntaryExit");
Object.defineProperty(exports, "VoluntaryExitRepository", { enumerable: true, get: function () { return voluntaryExit_1.VoluntaryExitRepository; } });
var depositEvent_1 = require("./depositEvent");
Object.defineProperty(exports, "DepositEventRepository", { enumerable: true, get: function () { return depositEvent_1.DepositEventRepository; } });
var depositDataRoot_1 = require("./depositDataRoot");
Object.defineProperty(exports, "DepositDataRootRepository", { enumerable: true, get: function () { return depositDataRoot_1.DepositDataRootRepository; } });
var eth1Data_1 = require("./eth1Data");
Object.defineProperty(exports, "Eth1DataRepository", { enumerable: true, get: function () { return eth1Data_1.Eth1DataRepository; } });
var lightclientBestPartialUpdate_1 = require("./lightclientBestPartialUpdate");
Object.defineProperty(exports, "BestPartialLightClientUpdateRepository", { enumerable: true, get: function () { return lightclientBestPartialUpdate_1.BestPartialLightClientUpdateRepository; } });
var lightclientCheckpointHeader_1 = require("./lightclientCheckpointHeader");
Object.defineProperty(exports, "CheckpointHeaderRepository", { enumerable: true, get: function () { return lightclientCheckpointHeader_1.CheckpointHeaderRepository; } });
var lightclientSyncCommittee_1 = require("./lightclientSyncCommittee");
Object.defineProperty(exports, "SyncCommitteeRepository", { enumerable: true, get: function () { return lightclientSyncCommittee_1.SyncCommitteeRepository; } });
var lightclientSyncCommitteeWitness_1 = require("./lightclientSyncCommitteeWitness");
Object.defineProperty(exports, "SyncCommitteeWitnessRepository", { enumerable: true, get: function () { return lightclientSyncCommitteeWitness_1.SyncCommitteeWitnessRepository; } });
//# sourceMappingURL=index.js.map