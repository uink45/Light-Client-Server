import * as blst from "@chainsafe/blst";
import { PointFormat, PublicKey as IPublicKey } from "../interface";
export declare class PublicKey extends blst.PublicKey implements IPublicKey {
    constructor(value: ConstructorParameters<typeof blst.PublicKey>[0]);
    /** @param type Defaults to `CoordType.jacobian` */
    static fromBytes(bytes: Uint8Array, type?: blst.CoordType, validate?: boolean): PublicKey;
    static fromHex(hex: string): PublicKey;
    static aggregate(publicKeys: PublicKey[]): PublicKey;
    toBytes(format?: PointFormat): Uint8Array;
    toHex(format?: PointFormat): string;
}
