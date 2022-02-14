/// <reference types="node" />
import { IKdfModule, IPbkdf2KdfModule, IScryptKdfModule } from "./types";
export declare function defaultPbkdfModule(): Pick<IPbkdf2KdfModule, "function" | "params">;
export declare function defaultScryptModule(): Pick<IScryptKdfModule, "function" | "params">;
export declare function kdf(mod: IKdfModule, password: Buffer): Promise<Buffer>;
