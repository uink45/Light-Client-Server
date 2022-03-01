"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preset = exports.commit = void 0;
const phase0_1 = require("./phase0");
const altair_1 = require("./altair");
const bellatrix_1 = require("./bellatrix");
exports.commit = "v1.1.9";
exports.preset = {
    ...phase0_1.phase0,
    ...altair_1.altair,
    ...bellatrix_1.bellatrix,
};
//# sourceMappingURL=index.js.map