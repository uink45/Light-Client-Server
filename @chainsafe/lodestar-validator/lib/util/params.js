"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertEqualParams = exports.NotEqualParamsError = void 0;
const lodestar_config_1 = require("@chainsafe/lodestar-config");
class NotEqualParamsError extends Error {
}
exports.NotEqualParamsError = NotEqualParamsError;
/**
 * Assert that two IBeaconParams are identical. Throws error otherwise
 */
function assertEqualParams(currentParams, expectedParams) {
    const params1Json = lodestar_config_1.ChainConfig.toJson(currentParams);
    const params2Json = lodestar_config_1.ChainConfig.toJson(expectedParams);
    const keys = new Set([...Object.keys(params1Json), ...Object.keys(params2Json)]);
    const errors = [];
    for (const key of keys) {
        if (!params1Json[key])
            errors.push(`${key} not in current params`);
        if (!params2Json[key])
            errors.push(`${key} not in expected params`);
        if (params1Json[key] !== params2Json[key])
            errors.push(`${key} different value: ${params1Json[key]} != ${params2Json[key]}`);
    }
    if (errors.length > 0) {
        throw new NotEqualParamsError("Not equal BeaconParams\n" + errors.join("\n"));
    }
}
exports.assertEqualParams = assertEqualParams;
//# sourceMappingURL=params.js.map