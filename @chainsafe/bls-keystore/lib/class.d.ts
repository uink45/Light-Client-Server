/// <reference types="node" />
import { IKeystore, IKdfModule, IChecksumModule, ICipherModule } from "./types";
/**
 * Class-based BLS Keystore
 */
export declare class Keystore implements IKeystore {
    version: number;
    uuid: string;
    description?: string;
    path: string;
    pubkey: string;
    crypto: {
        kdf: IKdfModule;
        checksum: IChecksumModule;
        cipher: ICipherModule;
    };
    constructor(obj: IKeystore);
    /**
     * Create a new Keystore object
     */
    static create(password: string | Uint8Array, secret: Uint8Array, pubkey: Uint8Array, path: string, description?: string | null, kdfMod?: Pick<IKdfModule, "function" | "params">, checksumMod?: Pick<IChecksumModule, "function">, cipherMod?: Pick<ICipherModule, "function" | "params">): Promise<Keystore>;
    /**
     * Create a keystore from an unknown object
     */
    static fromObject(obj: unknown): Keystore;
    /**
     * Parse a keystore from a JSON string
     */
    static parse(str: string): Keystore;
    /**
     * Decrypt a keystore, returns the secret key or throws on invalid password
     */
    decrypt(password: string | Uint8Array): Promise<Buffer>;
    /**
     * Verify the password as correct or not
     */
    verifyPassword(password: string | Uint8Array): Promise<boolean>;
    /**
     * Return the keystore as a plain object
     */
    toObject(): IKeystore;
    /**
     * Return the keystore as stringified JSON
     */
    stringify(): string;
}
