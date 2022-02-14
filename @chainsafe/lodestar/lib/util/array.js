"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLastIndex = void 0;
/**
 * Return the last index in the array that matches the predicate
 */
function findLastIndex(array, predicate) {
    let i = array.length;
    while (i--) {
        if (predicate(array[i])) {
            return i;
        }
    }
    return -1;
}
exports.findLastIndex = findLastIndex;
//# sourceMappingURL=array.js.map