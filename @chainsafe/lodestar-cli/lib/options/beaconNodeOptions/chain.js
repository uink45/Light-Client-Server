"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.parseArgs = void 0;
const lodestar_1 = require("@chainsafe/lodestar");
function parseArgs(args) {
    return {
        useSingleThreadVerifier: args["chain.useSingleThreadVerifier"],
        disableBlsBatchVerify: args["chain.disableBlsBatchVerify"],
        persistInvalidSszObjects: args["chain.persistInvalidSszObjects"],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        persistInvalidSszObjectsDir: undefined,
    };
}
exports.parseArgs = parseArgs;
exports.options = {
    "chain.useSingleThreadVerifier": {
        hidden: true,
        type: "boolean",
        description: "Disable spawning worker threads for BLS verification, use single thread implementation.",
        defaultDescription: String(lodestar_1.defaultOptions.chain.useSingleThreadVerifier),
        group: "chain",
    },
    "chain.disableBlsBatchVerify": {
        hidden: true,
        type: "boolean",
        description: "Do not use BLS batch verify to validate all block signatures at once. \
Will double processing times. Use only for debugging purposes.",
        defaultDescription: String(lodestar_1.defaultOptions.chain.disableBlsBatchVerify),
        group: "chain",
    },
    "chain.persistInvalidSszObjects": {
        hidden: true,
        type: "boolean",
        description: "Persist invalid ssz objects or not for debugging purpose",
        group: "chain",
    },
};
//# sourceMappingURL=chain.js.map