"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIBeaconPreset = void 0;
const preset_1 = require("./preset");
function createIBeaconPreset(input) {
    const params = {};
    for (const [fieldName, fieldType] of Object.entries(preset_1.BeaconPreset.fields)) {
        if (input[fieldName] != null) {
            try {
                params[fieldName] = fieldType.fromJson(input[fieldName]);
            }
            catch (e) {
                e.message = `Error parsing '${fieldName}': ${e.message}`;
                throw e;
            }
        }
    }
    return params;
}
exports.createIBeaconPreset = createIBeaconPreset;
//# sourceMappingURL=utils.js.map