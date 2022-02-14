import * as blst from "@chainsafe/blst";
import { PointFormat, Signature as ISignature } from "../interface";
import { PublicKey } from "./publicKey";
export declare class Signature extends blst.Signature implements ISignature {
    constructor(value: ConstructorParameters<typeof blst.Signature>[0]);
    /** @param type Defaults to `CoordType.affine` */
    static fromBytes(bytes: Uint8Array, type?: blst.CoordType, validate?: boolean): Signature;
    static fromHex(hex: string): Signature;
    static aggregate(signatures: Signature[]): Signature;
    static verifyMultipleSignatures(sets: {
        publicKey: PublicKey;
        message: Uint8Array;
        signature: Signature;
    }[]): boolean;
    verify(publicKey: PublicKey, message: Uint8Array): boolean;
    verifyAggregate(publicKeys: PublicKey[], message: Uint8Array): boolean;
    verifyMultiple(publicKeys: PublicKey[], messages: Uint8Array[]): boolean;
    toBytes(format?: PointFormat): Uint8Array;
    toHex(format?: PointFormat): string;
    private aggregateVerify;
}
