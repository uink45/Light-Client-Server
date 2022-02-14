"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beacon = void 0;
const options_1 = require("./options");
const handler_1 = require("./handler");
exports.beacon = {
    command: "beacon",
    describe: "Run a beacon chain node",
    examples: [
        {
            command: "beacon --network pyrmont",
            description: "Run a beacon chain node and connect to the pyrmont testnet",
        },
    ],
    options: options_1.beaconOptions,
    handler: handler_1.beaconHandler,
};
//# sourceMappingURL=index.js.map