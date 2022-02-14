/// <reference types="node" />
import Ajv = require("ajv");
import { IKeystore, IKdfModule, ICipherModule, IChecksumModule } from "./types";
import { defaultPbkdfModule, defaultScryptModule } from "./kdf";
import { defaultSha256Module } from "./checksum";
import { defaultAes128CtrModule } from "./cipher";
export { defaultPbkdfModule, defaultScryptModule, defaultSha256Module, defaultAes128CtrModule, };
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
export declare function create(password: string | Uint8Array, secret: Uint8Array, pubkey: Uint8Array, path: string, description?: string | null, kdfMod?: Pick<IKdfModule, "function" | "params">, checksumMod?: Pick<IChecksumModule, "function">, cipherMod?: Pick<ICipherModule, "function" | "params">): Promise<IKeystore>;
/**
 * Verify the password of a keystore object
 */
export declare function verifyPassword(keystore: IKeystore, password: string | Uint8Array): Promise<boolean>;
/**
 * Decrypt a keystore, returns the secret key or throws on invalid password
 */
export declare function decrypt(keystore: IKeystore, password: string | Uint8Array): Promise<Buffer>;
/**
 * Return schema validation errors for a potential keystore object
 */
export declare function schemaValidationErrors(data: unknown): Ajv.ErrorObject[] | null;
/**
 * Validate an unknown object as a valid keystore, throws on invalid keystore
 */
export declare function validateKeystore(keystore: unknown): asserts keystore is IKeystore;
/**
 * Predicate for validating an unknown object as a valid keystore
 */
export declare function isValidKeystore(keystore: unknown): keystore is IKeystore;
