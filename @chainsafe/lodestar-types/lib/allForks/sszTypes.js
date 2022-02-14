"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allForks = void 0;
const phase0_1 = require("../phase0");
const altair_1 = require("../altair");
const merge_1 = require("../merge");
/**
 * Index the ssz types that differ by fork
 * A record of AllForksSSZTypes indexed by fork
 */
exports.allForks = {
    phase0: {
        BeaconBlockBody: phase0_1.ssz.BeaconBlockBody,
        BeaconBlock: phase0_1.ssz.BeaconBlock,
        SignedBeaconBlock: phase0_1.ssz.SignedBeaconBlock,
        BeaconState: phase0_1.ssz.BeaconState,
        Metadata: phase0_1.ssz.Metadata,
    },
    altair: {
        BeaconBlockBody: altair_1.ssz.BeaconBlockBody,
        BeaconBlock: altair_1.ssz.BeaconBlock,
        SignedBeaconBlock: altair_1.ssz.SignedBeaconBlock,
        BeaconState: altair_1.ssz.BeaconState,
        Metadata: altair_1.ssz.Metadata,
    },
    merge: {
        BeaconBlockBody: merge_1.ssz.BeaconBlockBody,
        BeaconBlock: merge_1.ssz.BeaconBlock,
        SignedBeaconBlock: merge_1.ssz.SignedBeaconBlock,
        BeaconState: merge_1.ssz.BeaconState,
        Metadata: altair_1.ssz.Metadata,
    },
};
//# sourceMappingURL=sszTypes.js.map