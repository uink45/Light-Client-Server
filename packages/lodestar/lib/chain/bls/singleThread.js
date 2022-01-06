"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlsSingleThreadVerifier = void 0;
const maybeBatch_1 = require("./maybeBatch");
const utils_1 = require("./utils");
class BlsSingleThreadVerifier {
    async verifySignatureSets(sets) {
        return (0, maybeBatch_1.verifySignatureSetsMaybeBatch)(sets.map((set) => ({
            publicKey: (0, utils_1.getAggregatedPubkey)(set),
            message: set.signingRoot.valueOf(),
            signature: set.signature,
        })));
    }
}
exports.BlsSingleThreadVerifier = BlsSingleThreadVerifier;
//# sourceMappingURL=singleThread.js.map