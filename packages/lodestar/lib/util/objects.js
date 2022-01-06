"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mostFrequent = void 0;
const ssz_1 = require("@chainsafe/ssz");
function mostFrequent(type, array) {
    const hashMap = new Map();
    for (const [index, e] of array.entries()) {
        // We can optimize this by using faster hash like https://github.com/bevacqua/hash-sum
        const hash = (0, ssz_1.toHexString)(type.hashTreeRoot(e));
        const desc = hashMap.get(hash);
        if (desc) {
            desc.count++;
            hashMap.set(hash, desc);
        }
        else {
            hashMap.set(hash, { count: 1, index });
        }
    }
    let max = 0;
    let results = [];
    for (const elem of hashMap.values()) {
        if (elem.count > max) {
            max = elem.count;
            results = [array[elem.index]];
        }
        else if (elem.count === max) {
            results.push(array[elem.index]);
        }
    }
    return results;
}
exports.mostFrequent = mostFrequent;
//# sourceMappingURL=objects.js.map