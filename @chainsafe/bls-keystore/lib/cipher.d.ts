/// <reference types="node" />
import { ICipherModule } from "./types";
export declare function defaultAes128CtrModule(): Pick<ICipherModule, "function" | "params">;
export declare function cipherEncrypt(mod: ICipherModule, key: Buffer, data: Uint8Array): Promise<Buffer>;
export declare function cipherDecrypt(mod: ICipherModule, key: Buffer): Promise<Buffer>;
