"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const options_1 = require("../beacon/options");
const paths_1 = require("../beacon/paths");
const handler_1 = require("./handler");
const defaultBeaconPathsPyrmont = (0, paths_1.getBeaconPaths)({ rootDir: ".pyrmont" });
exports.init = {
    command: "init",
    describe: "Initialize Lodestar directories and files necessary to run a beacon chain node. \
This step is not required, and should only be used to prepare special configurations",
    examples: [
        {
            command: "init --network pyrmont",
            description: "Initialize a configuration for the Pyrmont testnet. " +
                `Then, you can edit the config file ${defaultBeaconPathsPyrmont.configFile} to customize your beacon node settings`,
        },
    ],
    options: options_1.beaconOptions,
    handler: handler_1.initHandler,
};
//# sourceMappingURL=index.js.map