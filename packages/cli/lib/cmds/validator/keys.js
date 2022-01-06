"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecretKeys = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const bls_keystore_1 = require("@chainsafe/bls-keystore");
const bls_1 = require("@chainsafe/bls");
const bls_keygen_1 = require("@chainsafe/bls-keygen");
const lodestar_beacon_state_transition_1 = require("@chainsafe/lodestar-beacon-state-transition");
const options_1 = require("../../options");
const util_1 = require("../../util");
const lockfile_1 = require("../../util/lockfile");
const validatorDir_1 = require("../../validatorDir");
const paths_1 = require("../account/paths");
const LOCK_FILE_EXT = ".lock";
async function getSecretKeys(args) {
    // UNSAFE - ONLY USE FOR TESTNETS. Derive keys directly from a mnemonic
    if (args.fromMnemonic) {
        if (args.network === options_1.defaultNetwork) {
            throw new util_1.YargsError("fromMnemonic must only be used in testnets");
        }
        if (!args.mnemonicIndexes) {
            throw new util_1.YargsError("Must specify mnemonicIndexes with fromMnemonic");
        }
        const masterSK = (0, bls_keygen_1.deriveKeyFromMnemonic)(args.fromMnemonic);
        const indexes = (0, util_1.parseRange)(args.mnemonicIndexes);
        return {
            secretKeys: indexes.map((index) => {
                const { signing } = (0, bls_keygen_1.deriveEth2ValidatorKeys)(masterSK, index);
                return bls_1.SecretKey.fromBytes(signing);
            }),
        };
    }
    // Derive interop keys
    else if (args.interopIndexes) {
        const indexes = (0, util_1.parseRange)(args.interopIndexes);
        return { secretKeys: indexes.map((index) => (0, lodestar_beacon_state_transition_1.interopSecretKey)(index)) };
    }
    // Import JSON keystores and run
    else if (args.importKeystoresPath) {
        if (!args.importKeystoresPassword) {
            throw new util_1.YargsError("Must specify importKeystoresPassword with importKeystoresPath");
        }
        const passphrase = (0, util_1.stripOffNewlines)(fs_1.default.readFileSync(args.importKeystoresPassword, "utf8"));
        const keystorePaths = args.importKeystoresPath.map((filepath) => resolveKeystorePaths(filepath)).flat(1);
        // Create lock files for all keystores
        const lockFile = (0, lockfile_1.getLockFile)();
        const lockFilePaths = keystorePaths.map((keystorePath) => keystorePath + LOCK_FILE_EXT);
        // Lock all keystores first
        for (const lockFilePath of lockFilePaths) {
            lockFile.lockSync(lockFilePath);
        }
        const secretKeys = await Promise.all(keystorePaths.map(async (keystorePath) => bls_1.SecretKey.fromBytes(await bls_keystore_1.Keystore.parse(fs_1.default.readFileSync(keystorePath, "utf8")).decrypt(passphrase))));
        return {
            secretKeys,
            unlockSecretKeys: () => {
                for (const lockFilePath of lockFilePaths) {
                    lockFile.unlockSync(lockFilePath);
                }
            },
        };
    }
    // Read keys from local account manager
    else {
        const accountPaths = (0, paths_1.getAccountPaths)(args);
        const validatorDirManager = new validatorDir_1.ValidatorDirManager(accountPaths);
        return { secretKeys: await validatorDirManager.decryptAllValidators({ force: args.force }) };
    }
}
exports.getSecretKeys = getSecretKeys;
function resolveKeystorePaths(fileOrDirPath) {
    if (fs_1.default.lstatSync(fileOrDirPath).isDirectory()) {
        return fs_1.default
            .readdirSync(fileOrDirPath)
            .map((file) => path_1.default.join(fileOrDirPath, file))
            .filter((filepath) => filepath.endsWith(".json"));
    }
    else {
        return [fileOrDirPath];
    }
}
//# sourceMappingURL=keys.js.map