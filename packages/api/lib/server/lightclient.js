"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutes = void 0;
const persistent_merkle_tree_1 = require("@chainsafe/persistent-merkle-tree");
const utils_1 = require("./utils");
const lightclient_1 = require("../routes/lightclient");
const { toHexString } = require("@chainsafe/ssz");
function getRoutes(config, api) {
    const reqSerializers = (0, lightclient_1.getReqSerializers)();
    const serverRoutes = (0, utils_1.getGenericJsonServer)({ routesData: lightclient_1.routesData, getReturnTypes: lightclient_1.getReturnTypes, getReqSerializers: lightclient_1.getReqSerializers }, config, api);
    return {
        ...serverRoutes,
        // Non-JSON routes. Return binary
        getStateProof: {
            ...serverRoutes.getStateProof,
            handler: async (req) => {
                const args = reqSerializers.getStateProof.parseReq(req);
                const { data: proof, value } = await api.getStateProof(...args);
                // Fastify 3.x.x will automatically add header `Content-Type: application/octet-stream` if Buffer
                var proofs = proof;
                var array = []
                for(let i = 0; i < proofs.leaves.length; i++){
                    array.push(toHexString(proofs.leaves[i]))
                }
                proofs.leaves = array;
                return {proofs, value};
            },
        },
    };
}
exports.getRoutes = getRoutes;
//# sourceMappingURL=lightclient.js.map