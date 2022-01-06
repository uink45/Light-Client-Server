"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.parseArgs = void 0;
const lodestar_1 = require("@chainsafe/lodestar");
function parseArgs(args) {
    return {
        isSingleNode: args["sync.isSingleNode"],
        disableProcessAsChainSegment: args["sync.disableProcessAsChainSegment"],
    };
}
exports.parseArgs = parseArgs;
exports.options = {
    "sync.isSingleNode": {
        hidden: true,
        type: "boolean",
        description: "Allow node to consider itself synced without being connected to a peer. \
Use only for local networks with a single node, can be dangerous in regular networks.",
        defaultDescription: String(lodestar_1.defaultOptions.sync.isSingleNode),
        group: "sync",
    },
    "sync.disableProcessAsChainSegment": {
        hidden: true,
        type: "boolean",
        description: "For RangeSync disable processing batches of blocks at once. Should only be used for debugging or testing.",
        defaultDescription: String(lodestar_1.defaultOptions.sync.disableProcessAsChainSegment),
        group: "sync",
    },
};
//# sourceMappingURL=sync.js.map