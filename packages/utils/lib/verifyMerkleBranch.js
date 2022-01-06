"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyMerkleBranch = void 0;
const math_1 = require("./math");
const ssz_1 = require("@chainsafe/ssz");
/**
 * Verify that the given ``leaf`` is on the merkle branch ``proof``
 * starting with the given ``root``.
 */
function verifyMerkleBranch(leaf, proof, depth, index, root) {
    let value = leaf;
    for (let i = 0; i < depth; i++) {
        if ((0, math_1.intDiv)(index, 2 ** i) % 2) {
            value = (0, ssz_1.hash)(Buffer.concat([proof[i], value]));
        }
        else {
            value = (0, ssz_1.hash)(Buffer.concat([value, proof[i]]));
        }
    }
    return Buffer.from(value).equals(root);
}
exports.verifyMerkleBranch = verifyMerkleBranch;
//# sourceMappingURL=verifyMerkleBranch.js.map