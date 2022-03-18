"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.networksChainConfig = exports.kilnChainConfig = exports.praterChainConfig = exports.mainnetChainConfig = void 0;
const mainnet_1 = require("./chainConfig/networks/mainnet");
Object.defineProperty(exports, "mainnetChainConfig", { enumerable: true, get: function () { return mainnet_1.mainnetChainConfig; } });
const prater_1 = require("./chainConfig/networks/prater");
Object.defineProperty(exports, "praterChainConfig", { enumerable: true, get: function () { return prater_1.praterChainConfig; } });
const kiln_1 = require("./chainConfig/networks/kiln");
Object.defineProperty(exports, "kilnChainConfig", { enumerable: true, get: function () { return kiln_1.kilnChainConfig; } });
exports.networksChainConfig = {
    mainnet: mainnet_1.mainnetChainConfig,
    prater: prater_1.praterChainConfig,
    kiln: kiln_1.kilnChainConfig,
};
//# sourceMappingURL=networks.js.map