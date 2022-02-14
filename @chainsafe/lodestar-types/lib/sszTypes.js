"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allForks = exports.merge = exports.altair = exports.phase0 = void 0;
__exportStar(require("./primitive/sszTypes"), exports);
var phase0_1 = require("./phase0");
Object.defineProperty(exports, "phase0", { enumerable: true, get: function () { return phase0_1.ssz; } });
var altair_1 = require("./altair");
Object.defineProperty(exports, "altair", { enumerable: true, get: function () { return altair_1.ssz; } });
var merge_1 = require("./merge");
Object.defineProperty(exports, "merge", { enumerable: true, get: function () { return merge_1.ssz; } });
const allForks_1 = require("./allForks");
exports.allForks = allForks_1.ssz.allForks;
//# sourceMappingURL=sszTypes.js.map