"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.parseArgs = void 0;
const lodestar_1 = require("@chainsafe/lodestar");
function parseArgs(args) {
    return {
        urls: args["execution.urls"],
        timeout: args["execution.timeout"],
    };
}
exports.parseArgs = parseArgs;
exports.options = {
    "execution.urls": {
        description: "Urls to execution client engine API",
        type: "array",
        defaultDescription: lodestar_1.defaultOptions.executionEngine.mode === "http" ? lodestar_1.defaultOptions.executionEngine.urls.join(" ") : "",
        group: "execution",
    },
    "execution.timeout": {
        description: "Timeout in miliseconds for execution engine API HTTP client",
        type: "number",
        defaultDescription: lodestar_1.defaultOptions.executionEngine.mode === "http" ? String(lodestar_1.defaultOptions.executionEngine.timeout) : "",
        group: "execution",
    },
};
//# sourceMappingURL=execution.js.map