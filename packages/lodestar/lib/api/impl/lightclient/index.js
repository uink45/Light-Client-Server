"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLightclientApi = void 0;
const lodestar_types_1 = require("@chainsafe/lodestar-types");
const utils_1 = require("../beacon/state/utils");
const numpy_1 = require("../../../util/numpy");
const ssz_1 = require("@chainsafe/ssz");
const persistent_merkle_tree_1 = require("@chainsafe/persistent-merkle-tree");
// TODO: Import from lightclient/server package
function getLightclientApi(opts, { chain, config, db }) {
    var _a;
    // It's currently possible to request gigantic proofs (eg: a proof of the entire beacon state)
    // We want some some sort of resistance against this DoS vector.
    const maxGindicesInProof = (_a = opts.maxGindicesInProof) !== null && _a !== void 0 ? _a : 512;
    return {
        async getStateProof(stateId, paths) {
            const state = await (0, utils_1.resolveStateId)(config, chain, db, stateId);
            const stateTreeBacked = lodestar_types_1.ssz.altair.BeaconState.createTreeBackedFromStruct(state);
            const tree = stateTreeBacked.tree;
            const gindicesSet = new Set();
            for (const path of paths) {
                // Logic from TreeBacked#createProof is (mostly) copied here to expose the # of gindices in the proof
                const { type, gindex } = lodestar_types_1.ssz.altair.BeaconState.getPathInfo(path);
                if (!(0, ssz_1.isCompositeType)(type)) {
                    gindicesSet.add(gindex);
                }
                else {
                    // if the path subtype is composite, include the gindices of all the leaves
                    const gindexes = type.tree_getLeafGindices(type.hasVariableSerializedLength() ? tree.getSubtree(gindex) : undefined, gindex);
                    for (const gindex of gindexes) {
                        gindicesSet.add(gindex);
                    }
                }
            }
            if (gindicesSet.size > maxGindicesInProof) {
                throw new Error("Requested proof is too large.");
            }
            return {
                data: tree.getProof({
                    type: persistent_merkle_tree_1.ProofType.treeOffset,
                    gindices: Array.from(gindicesSet),
                }),
            };
        },
        async getCommitteeUpdates(from, to) {
            const periods = (0, numpy_1.linspace)(from, to);
            const updates = await Promise.all(periods.map((period) => chain.lightClientServer.getCommitteeUpdates(period)));
            return { data: updates };
        },
        async getHeadUpdate() {
            return { data: await chain.lightClientServer.getHeadUpdate() };
        },
        async getSnapshot(blockRoot) {
            const snapshotProof = await chain.lightClientServer.getSnapshot((0, ssz_1.fromHexString)(blockRoot));
            return { data: snapshotProof };
        },
    };
}
exports.getLightclientApi = getLightclientApi;
//# sourceMappingURL=index.js.map