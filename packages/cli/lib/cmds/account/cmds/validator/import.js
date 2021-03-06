"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importCmd = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const inquirer_1 = __importDefault(require("inquirer"));
const bls_keystore_1 = require("@chainsafe/bls-keystore");
const util_1 = require("../../../../util");
const paths_1 = require("../../../../validatorDir/paths");
const paths_2 = require("../../paths");
exports.importCmd = {
    command: "import",
    describe: "Imports one or more EIP-2335 keystores into a Lodestar validator client directory, \
requesting passwords interactively. The directory flag provides a convenient \
method for importing a directory of keys generated by the eth2-deposit-cli \
Ethereum Foundation utility.",
    examples: [
        {
            command: "account validator import --network prater --directory $HOME/eth2.0-deposit-cli/validator_keys",
            description: "Import validator keystores generated with the Ethereum Foundation Staking Launchpad",
        },
    ],
    options: {
        keystore: {
            description: "Path to a single keystore to be imported.",
            describe: "Path to a single keystore to be imported.",
            conflicts: ["directory"],
            type: "string",
        },
        directory: {
            description: "Path to a directory which contains zero or more keystores \
for import. This directory and all sub-directories will be \
searched and any file name which contains 'keystore' and \
has the '.json' extension will be attempted to be imported.",
            describe: "Path to a directory which contains zero or more keystores \
  for import. This directory and all sub-directories will be \
  searched and any file name which contains 'keystore' and \
  has the '.json' extension will be attempted to be imported.",
            conflicts: ["keystore"],
            type: "string",
        },
        passphraseFile: {
            description: "Path to a file that contains password that protects the keystore.",
            describe: "Path to a file that contains password that protects the keystore.",
            type: "string",
        },
    },
    handler: async (args) => {
        const singleKeystorePath = args.keystore;
        const directoryPath = args.directory;
        const passphraseFile = args.passphraseFile;
        const { keystoresDir, secretsDir } = (0, paths_2.getAccountPaths)(args);
        const keystorePaths = singleKeystorePath
            ? [singleKeystorePath]
            : directoryPath
                ? (0, util_1.recursivelyFind)(directoryPath, util_1.isVotingKeystore)
                : null;
        const passphrasePaths = directoryPath ? (0, util_1.recursivelyFind)(directoryPath, util_1.isPassphraseFile) : [];
        if (!keystorePaths) {
            throw new util_1.YargsError("Must supply either keystore or directory");
        }
        if (keystorePaths.length === 0) {
            throw new util_1.YargsError("No keystores found");
        }
        // For each keystore:
        //
        // - Obtain the keystore password, if the user desires.
        // - Copy the keystore into the `validator_dir`.
        //
        // Skip keystores that already exist, but exit early if any operation fails.
        let numOfImportedValidators = 0;
        if (keystorePaths.length > 1) {
            console.log(`
  ${keystorePaths.join("\n")}

  Found ${keystorePaths.length} keystores in \t${directoryPath}
  Importing to \t\t${keystoresDir}
  `);
        }
        for (const keystorePath of keystorePaths) {
            const keystore = bls_keystore_1.Keystore.parse(node_fs_1.default.readFileSync(keystorePath, "utf8"));
            const pubkey = keystore.pubkey;
            const uuid = keystore.uuid;
            if (!pubkey) {
                throw Error("Invalid keystore, must contain .pubkey property");
            }
            const dir = (0, paths_1.getValidatorDirPath)({ keystoresDir, pubkey, prefixed: true });
            if (node_fs_1.default.existsSync(dir) || node_fs_1.default.existsSync((0, paths_1.getValidatorDirPath)({ keystoresDir, pubkey }))) {
                console.log(`Skipping existing validator ${pubkey}`);
                continue;
            }
            console.log(`Importing keystore ${keystorePath}
  - Public key: ${pubkey}
  - UUID: ${uuid}`);
            const passphrase = await getKeystorePassphrase(keystore, passphrasePaths, passphraseFile);
            node_fs_1.default.mkdirSync(secretsDir, { recursive: true });
            node_fs_1.default.mkdirSync(dir, { recursive: true });
            node_fs_1.default.writeFileSync(node_path_1.default.join(dir, paths_1.VOTING_KEYSTORE_FILE), keystore.stringify());
            (0, util_1.writeValidatorPassphrase)({ secretsDir, pubkey, passphrase });
            console.log(`Successfully imported validator ${pubkey}`);
            numOfImportedValidators++;
        }
        if (numOfImportedValidators === 0) {
            console.log("\nAll validators are already imported");
        }
        else if (keystorePaths.length > 1) {
            const skippedCount = keystorePaths.length - numOfImportedValidators;
            console.log(`\nSuccessfully imported ${numOfImportedValidators} validators (${skippedCount} skipped)`);
        }
        console.log(`
  DO NOT USE THE ORIGINAL KEYSTORES TO VALIDATE WITH
  ANOTHER CLIENT, OR YOU WILL GET SLASHED.
  `);
    },
};
/**
 * Fetches the passphrase of an imported Kestore
 *
 * Paths that may contain valid passphrases
 * @param keystore
 * @param passphrasePaths ["secrets/0x12341234"]
 * @param passphraseFile
 */
async function getKeystorePassphrase(keystore, passphrasePaths, passphraseFile) {
    // First, try to use a passphrase file if provided, if not, find a passphrase file in the provided directory
    passphraseFile = passphraseFile !== null && passphraseFile !== void 0 ? passphraseFile : passphrasePaths.find((filepath) => filepath.endsWith(keystore.pubkey));
    if (passphraseFile) {
        const passphrase = node_fs_1.default.readFileSync(passphraseFile, "utf8");
        try {
            await keystore.decrypt((0, util_1.stripOffNewlines)(passphrase));
            console.log(`Imported passphrase ${passphraseFile}`);
            return passphrase;
        }
        catch (e) {
            console.log(`Imported passphrase ${passphraseFile}, but it's invalid: ${e.message}`);
        }
    }
    console.log(`
If you enter the password it will be stored as plain-text so that it is not \
required each time the validator client starts
`);
    const answers = await inquirer_1.default.prompt([
        {
            name: "password",
            type: "password",
            message: "Enter the keystore password, or press enter to omit it",
            validate: async (input) => {
                try {
                    console.log("\nValidating password...");
                    await keystore.decrypt((0, util_1.stripOffNewlines)(input));
                    return true;
                }
                catch (e) {
                    return `Invalid password: ${e.message}`;
                }
            },
        },
    ]);
    console.log("Password is correct");
    await (0, util_1.sleep)(1000); // For UX
    return answers.password;
}
//# sourceMappingURL=import.js.map