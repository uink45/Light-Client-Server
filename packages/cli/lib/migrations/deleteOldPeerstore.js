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
exports.deleteOldPeerstorePreV036 = void 0;
const fs = __importStar(require("node:fs"));
const lodestar_db_1 = require("@chainsafe/lodestar-db");
/**
 * As of libp2p v0.36.0 (https://github.com/libp2p/js-libp2p/commit/978eb3676fad5d5d50ddb28d1a7868f448cbb20b)
 * the peerstore format has changed in a breaking way.
 *
 * Because of that, we need to wipe the old peerstore if it exists.
 */
async function deleteOldPeerstorePreV036(peerStoreDir, logger) {
    const db = new lodestar_db_1.LevelDbController({ name: peerStoreDir }, { logger });
    await db.start();
    // only read a single key
    const keys = await db.keys({ limit: 1 });
    // the old peerstore had keys that look like so:
    const isOldPeerstore = Boolean(keys.find((k) => {
        const key = k.toString();
        return (key.startsWith("/peers/addrs") ||
            key.startsWith("/peers/keys") ||
            key.startsWith("/peers/metadata") ||
            key.startsWith("/peers/proto"));
    }));
    await db.stop();
    if (isOldPeerstore) {
        if (peerStoreDir.endsWith("/")) {
            peerStoreDir = peerStoreDir.slice(0, peerStoreDir.length - 1);
        }
        fs.renameSync(peerStoreDir, peerStoreDir + ".pre-0.36.0.bak");
        logger.info("Migrated old peerstore");
    }
}
exports.deleteOldPeerstorePreV036 = deleteOldPeerstorePreV036;
//# sourceMappingURL=deleteOldPeerstore.js.map