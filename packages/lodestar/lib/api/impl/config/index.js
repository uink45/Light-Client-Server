"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigApi = void 0;
const lodestar_config_1 = require("@chainsafe/lodestar-config");
const params = __importStar(require("@chainsafe/lodestar-params"));
function getConfigApi({ config }) {
    const specWithExtraKeys = { ...params, ...config };
    const spec = {};
    [
        ...Object.keys(lodestar_config_1.ChainConfig.fields),
        ...Object.keys(params.BeaconPreset.fields),
    ].forEach((fieldName) => {
        spec[fieldName] = specWithExtraKeys[fieldName];
    });
    return {
        async getForkSchedule() {
            const forkInfos = Object.values(config.forks);
            const forks = forkInfos.map((fi, ix) => ({
                previousVersion: ix === 0 ? fi.version : forkInfos[ix - 1].version,
                currentVersion: fi.version,
                epoch: fi.epoch,
            }));
            return { data: forks };
        },
        async getDepositContract() {
            return {
                data: {
                    chainId: config.DEPOSIT_CHAIN_ID,
                    address: config.DEPOSIT_CONTRACT_ADDRESS,
                },
            };
        },
        async getSpec() {
            return {
                data: spec,
            };
        },
    };
}
exports.getConfigApi = getConfigApi;
//# sourceMappingURL=index.js.map