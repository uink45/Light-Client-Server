"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preset = exports.commit = void 0;
const phase0_1 = require("./phase0");
const altair_1 = require("./altair");
const merge_1 = require("./merge");
exports.commit = "v1.1.4";
exports.preset = {
    ...phase0_1.phase0,
    ...altair_1.altair,
    ...merge_1.merge,
};
//# sourceMappingURL=index.js.map