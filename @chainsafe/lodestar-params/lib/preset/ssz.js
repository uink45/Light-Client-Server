"use strict";
/* eslint-disable @typescript-eslint/naming-convention */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeaconPreset = void 0;
const ssz_1 = require("@chainsafe/ssz");
const phase0_1 = require("./phase0");
const altair_1 = require("./altair");
const merge_1 = require("./merge");
exports.BeaconPreset = new ssz_1.ContainerType({
    fields: {
        ...phase0_1.Phase0Preset.fields,
        ...altair_1.AltairPreset.fields,
        ...merge_1.MergePreset.fields,
    },
    expectedCase: "notransform",
});
//# sourceMappingURL=ssz.js.map