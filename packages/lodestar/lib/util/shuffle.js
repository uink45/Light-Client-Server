"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffle = void 0;
/**
 * Randomize an array of items without mutation.
 * Note: Uses Math.random() as entropy source, use for non-critical stuff
 */
function shuffle(arr) {
    const _arr = [...arr];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [_arr[i], _arr[j]] = [_arr[j], _arr[i]];
    }
    return _arr;
}
exports.shuffle = shuffle;
//# sourceMappingURL=shuffle.js.map