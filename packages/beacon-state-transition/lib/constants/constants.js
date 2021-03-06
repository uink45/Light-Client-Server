"use strict";
/**
 * @module constants
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.G2_POINT_AT_INFINITY = exports.BASE_REWARDS_PER_EPOCH = exports.SECONDS_PER_DAY = exports.EMPTY_SIGNATURE = exports.ZERO_HASH = void 0;
exports.ZERO_HASH = Buffer.alloc(32, 0);
exports.EMPTY_SIGNATURE = Buffer.alloc(96, 0);
exports.SECONDS_PER_DAY = 86400;
exports.BASE_REWARDS_PER_EPOCH = 4;
exports.G2_POINT_AT_INFINITY = Buffer.from("c000000000000000000000000000000000000000000000000000000000000000" +
    "0000000000000000000000000000000000000000000000000000000000000000" +
    "0000000000000000000000000000000000000000000000000000000000000000", "hex");
//# sourceMappingURL=constants.js.map