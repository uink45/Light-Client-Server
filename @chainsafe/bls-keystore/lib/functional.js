"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidKeystore = exports.validateKeystore = exports.schemaValidationErrors = exports.decrypt = exports.verifyPassword = exports.create = exports.defaultAes128CtrModule = exports.defaultSha256Module = exports.defaultScryptModule = exports.defaultPbkdfModule = void 0;
const Ajv = require("ajv");
const buffer_1 = require("buffer");
const uuid_1 = require("uuid");
const schema = require("./schema.json");
const kdf_1 = require("./kdf");
Object.defineProperty(exports, "defaultPbkdfModule", { enumerable: true, get: function () { return kdf_1.defaultPbkdfModule; } });
Object.defineProperty(exports, "defaultScryptModule", { enumerable: true, get: function () { return kdf_1.defaultScryptModule; } });
const checksum_1 = require("./checksum");
Object.defineProperty(exports, "defaultSha256Module", { enumerable: true, get: function () { return checksum_1.defaultSha256Module; } });
const cipher_1 = require("./cipher");
Object.defineProperty(exports, "defaultAes128CtrModule", { enumerable: true, get: function () { return cipher_1.defaultAes128CtrModule; } });
const password_1 = require("./password");
/**
 * Create a new keystore object
 *
 * @param password password used to encrypt the keystore
 * @param secret secret key material to be encrypted
 * @param pubkey public key, not checked for validity
 * @param path HD path used to generate the secret
 * @param kdfMod key derivation function (kdf) configuration module
 * @param checksumMod checksum configuration module
 * @param cipherMod cipher configuration module
 */
function create(password, secret, pubkey, path, description = null, kdfMod = kdf_1.defaultPbkdfModule(), checksumMod = checksum_1.defaultSha256Module(), cipherMod = cipher_1.defaultAes128CtrModule()) {
    return __awaiter(this, void 0, void 0, function* () {
        const encryptionKey = yield kdf_1.kdf(kdfMod, password_1.normalizePassword(password));
        const ciphertext = yield cipher_1.cipherEncrypt(cipherMod, encryptionKey.slice(0, 16), secret);
        return {
            version: 4,
            uuid: uuid_1.v4(),
            description: description || undefined,
            path: path,
            pubkey: buffer_1.Buffer.from(pubkey).toString("hex"),
            crypto: {
                kdf: {
                    function: kdfMod.function,
                    params: Object.assign({}, kdfMod.params),
                    message: "",
                },
                checksum: {
                    function: checksumMod.function,
                    params: {},
                    message: (yield checksum_1.checksum(checksumMod, encryptionKey, ciphertext)).toString("hex"),
                },
                cipher: {
                    function: cipherMod.function,
                    params: Object.assign({}, cipherMod.params),
                    message: ciphertext.toString("hex"),
                },
            },
        };
    });
}
exports.create = create;
/**
 * Verify the password of a keystore object
 */
function verifyPassword(keystore, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const decryptionKey = yield kdf_1.kdf(keystore.crypto.kdf, password_1.normalizePassword(password));
        const ciphertext = buffer_1.Buffer.from(keystore.crypto.cipher.message, "hex");
        return checksum_1.verifyChecksum(keystore.crypto.checksum, decryptionKey, ciphertext);
    });
}
exports.verifyPassword = verifyPassword;
/**
 * Decrypt a keystore, returns the secret key or throws on invalid password
 */
function decrypt(keystore, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const decryptionKey = yield kdf_1.kdf(keystore.crypto.kdf, password_1.normalizePassword(password));
        const ciphertext = buffer_1.Buffer.from(keystore.crypto.cipher.message, "hex");
        if (!(yield checksum_1.verifyChecksum(keystore.crypto.checksum, decryptionKey, ciphertext))) {
            throw new Error("Invalid password");
        }
        return cipher_1.cipherDecrypt(keystore.crypto.cipher, decryptionKey.slice(0, 16));
    });
}
exports.decrypt = decrypt;
// keystore validation
/**
 * Return schema validation errors for a potential keystore object
 */
function schemaValidationErrors(data) {
    const ajv = new Ajv();
    const validated = ajv.validate(schema, data);
    if (validated) {
        return null;
    }
    return ajv.errors;
}
exports.schemaValidationErrors = schemaValidationErrors;
/**
 * Validate an unknown object as a valid keystore, throws on invalid keystore
 */
function validateKeystore(keystore) {
    const errors = schemaValidationErrors(keystore);
    if (errors) {
        throw new Error(`${errors[0].dataPath}: ${errors[0].message}`);
    }
}
exports.validateKeystore = validateKeystore;
/**
 * Predicate for validating an unknown object as a valid keystore
 */
function isValidKeystore(keystore) {
    return !schemaValidationErrors(keystore);
}
exports.isValidKeystore = isValidKeystore;
