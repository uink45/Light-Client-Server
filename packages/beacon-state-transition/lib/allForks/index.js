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
__exportStar(require("./signatureSets"), exports);
__exportStar(require("./stateTransition"), exports);
__exportStar(require("./block"), exports);
__exportStar(require("./epoch"), exports);
// re-export allForks lodestar types for ergonomic usage downstream
// eg:
//
// import {allForks} from "@chainsafe/lodestar-beacon-state-transition";
//
// allForks.processDeposit(...)
//
// const x: allForks.BeaconState;
// eslint-disable-next-line no-restricted-imports
__exportStar(require("@chainsafe/lodestar-types/lib/allForks/types"), exports);
//# sourceMappingURL=index.js.map