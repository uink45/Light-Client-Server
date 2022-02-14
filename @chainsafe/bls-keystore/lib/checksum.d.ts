/// <reference types="node" />
import { IChecksumModule } from "./types";
export declare function defaultSha256Module(): Pick<IChecksumModule, "function">;
export declare function checksum(mod: IChecksumModule, key: Buffer, ciphertext: Buffer): Promise<Buffer>;
export declare function verifyChecksum(mod: IChecksumModule, key: Buffer, ciphertext: Buffer): Promise<boolean>;
