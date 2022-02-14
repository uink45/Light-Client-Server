"use strict";
/* eslint-disable @typescript-eslint/naming-convention */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergePreset = void 0;
const ssz_1 = require("@chainsafe/ssz");
const Number64 = new ssz_1.NumberUintType({ byteLength: 8 });
exports.MergePreset = new ssz_1.ContainerType({
    fields: {
        INACTIVITY_PENALTY_QUOTIENT_MERGE: Number64,
        MIN_SLASHING_PENALTY_QUOTIENT_MERGE: Number64,
        PROPORTIONAL_SLASHING_MULTIPLIER_MERGE: Number64,
        MAX_BYTES_PER_TRANSACTION: Number64,
        MAX_TRANSACTIONS_PER_PAYLOAD: Number64,
        BYTES_PER_LOGS_BLOOM: Number64,
        MAX_EXTRA_DATA_BYTES: Number64,
    },
    // Expected and container fields are the same here
    expectedCase: "notransform",
});
//# sourceMappingURL=ssz.js.map