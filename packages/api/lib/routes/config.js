"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReturnTypes = exports.getReqSerializers = exports.routesData = exports.Spec = void 0;
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const lodestar_config_1 = require("@chainsafe/lodestar-config");
const lodestar_types_1 = require("@chainsafe/lodestar-types");
const lodestar_utils_1 = require("@chainsafe/lodestar-utils");
const ssz_1 = require("@chainsafe/ssz");
const utils_1 = require("../utils");
// eslint-disable-next-line @typescript-eslint/naming-convention
exports.Spec = new ssz_1.ContainerType({
    fields: {
        ...lodestar_params_1.BeaconPreset.fields,
        ...lodestar_config_1.ChainConfig.fields,
    },
    expectedCase: "notransform",
});
/**
 * Define javascript values for each route
 */
exports.routesData = {
    getDepositContract: { url: "/eth/v1/config/deposit_contract", method: "GET" },
    getForkSchedule: { url: "/eth/v1/config/fork_schedule", method: "GET" },
    getSpec: { url: "/eth/v1/config/spec", method: "GET" },
};
function getReqSerializers() {
    return (0, lodestar_utils_1.mapValues)(exports.routesData, () => utils_1.reqEmpty);
}
exports.getReqSerializers = getReqSerializers;
function withJsonFilled(dataType, fillWith) {
    return {
        toJson: ({ data }, opts) => ({ data: dataType.toJson(data, opts) }),
        fromJson: ({ data }, opts) => ({ data: dataType.fromJson(Object.assign({}, fillWith, data), opts) }),
    };
}
/* eslint-disable @typescript-eslint/naming-convention */
function getReturnTypes(config) {
    const DepositContract = new ssz_1.ContainerType({
        fields: {
            chainId: lodestar_types_1.ssz.Number64,
            address: new ssz_1.ByteVectorType({ length: 20 }),
        },
        // From beacon apis
        casingMap: {
            chainId: "chain_id",
            address: "address",
        },
    });
    return {
        getDepositContract: (0, utils_1.ContainerData)(DepositContract),
        getForkSchedule: (0, utils_1.ContainerData)((0, utils_1.ArrayOf)(lodestar_types_1.ssz.phase0.Fork)),
        getSpec: withJsonFilled(exports.Spec, exports.Spec.toJson({ ...config, ...lodestar_params_1.activePreset })),
    };
}
exports.getReturnTypes = getReturnTypes;
//# sourceMappingURL=config.js.map