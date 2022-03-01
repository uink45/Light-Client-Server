"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeMostCommonTarget = void 0;
const ssz_1 = require("@chainsafe/ssz");
function computeMostCommonTarget(targets) {
    var _a, _b;
    const targetsById = new Map();
    const countById = new Map();
    for (const target of targets) {
        const targetId = `${target.slot}-${(0, ssz_1.toHexString)(target.root)}`;
        targetsById.set(targetId, target);
        countById.set(targetId, 1 + ((_a = countById.get(targetId)) !== null && _a !== void 0 ? _a : 0));
    }
    let mostCommon = null;
    for (const [targetId, count] of countById.entries()) {
        if (!mostCommon || count > mostCommon.count) {
            mostCommon = { count, targetId };
        }
    }
    return mostCommon && ((_b = targetsById.get(mostCommon.targetId)) !== null && _b !== void 0 ? _b : null);
}
exports.computeMostCommonTarget = computeMostCommonTarget;
//# sourceMappingURL=chainTarget.js.map