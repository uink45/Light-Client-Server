"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigApi = void 0;
const lodestar_config_1 = require("@chainsafe/lodestar-config");
const lodestar_params_1 = require("@chainsafe/lodestar-params");
function getConfigApi({ config }) {
    // Retrieve specification configuration used on this node.  The configuration should include:
    //  - Constants for all hard forks known by the beacon node, for example the
    //    [phase 0](https://github.com/ethereum/consensus-specs/blob/v1.1.10/specs/phase0/beacon-chain.md#constants) and
    //    [altair](https://github.com/ethereum/consensus-specs/blob/v1.1.10/specs/altair/beacon-chain.md#constants) values
    //  - Presets for all hard forks supplied to the beacon node, for example the
    //    [phase 0](https://github.com/ethereum/consensus-specs/blob/v1.1.10/presets/mainnet/phase0.yaml) and
    //    [altair](https://github.com/ethereum/consensus.0-specs/blob/v1.1.10/presets/mainnet/altair.yaml) values
    //  - Configuration for the beacon node, for example the [mainnet](https://github.com/ethereum/consensus-specs/blob/v1.1.10/configs/mainnet.yaml) values
    let jsonSpec = null;
    function getJsonSpec() {
        // TODO: Include static constants exported in @chainsafe/lodestar-params (i.e. DOMAIN_BEACON_PROPOSER)
        const configJson = (0, lodestar_config_1.chainConfigToJson)(config);
        const presetJson = (0, lodestar_params_1.presetToJson)(lodestar_params_1.activePreset);
        jsonSpec = { ...configJson, ...presetJson };
        return jsonSpec;
    }
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
                data: getJsonSpec(),
            };
        },
    };
}
exports.getConfigApi = getConfigApi;
//# sourceMappingURL=index.js.map