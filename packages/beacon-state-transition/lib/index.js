"use strict";
/**
 * @module chain/stateTransition
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCachedBeaconState = exports.allForks = exports.merge = exports.altair = exports.phase0 = void 0;
__exportStar(require("./constants"), exports);
__exportStar(require("./util"), exports);
__exportStar(require("./metrics"), exports);
exports.phase0 = __importStar(require("./phase0"));
exports.altair = __importStar(require("./altair"));
exports.merge = __importStar(require("./merge"));
exports.allForks = __importStar(require("./allForks"));
var cachedBeaconState_1 = require("./allForks/util/cachedBeaconState");
Object.defineProperty(exports, "createCachedBeaconState", { enumerable: true, get: function () { return cachedBeaconState_1.createCachedBeaconState; } });
//# sourceMappingURL=index.js.map