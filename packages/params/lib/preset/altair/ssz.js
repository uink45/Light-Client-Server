"use strict";
/* eslint-disable @typescript-eslint/naming-convention */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AltairPreset = void 0;
const ssz_1 = require("@chainsafe/ssz");
const Number64 = new ssz_1.NumberUintType({ byteLength: 8 });
exports.AltairPreset = new ssz_1.ContainerType({
    fields: {
        SYNC_COMMITTEE_SIZE: Number64,
        EPOCHS_PER_SYNC_COMMITTEE_PERIOD: Number64,
        INACTIVITY_PENALTY_QUOTIENT_ALTAIR: Number64,
        MIN_SLASHING_PENALTY_QUOTIENT_ALTAIR: Number64,
        PROPORTIONAL_SLASHING_MULTIPLIER_ALTAIR: Number64,
    },
    // Expected and container fields are the same here
    expectedCase: "notransform",
});
//# sourceMappingURL=ssz.js.map