import { IBls } from "./interface";
export declare function functionalInterfaceFactory({ SecretKey, PublicKey, Signature, }: Pick<IBls, "SecretKey" | "PublicKey" | "Signature">): {
    sign: (secretKey: Uint8Array, message: Uint8Array) => Uint8Array;
    aggregateSignatures: (signatures: Uint8Array[]) => Uint8Array;
    aggregatePublicKeys: (publicKeys: Uint8Array[]) => Uint8Array;
    verify: (publicKey: Uint8Array, message: Uint8Array, signature: Uint8Array) => boolean;
    verifyAggregate: (publicKeys: Uint8Array[], message: Uint8Array, signature: Uint8Array) => boolean;
    verifyMultiple: (publicKeys: Uint8Array[], messages: Uint8Array[], signature: Uint8Array) => boolean;
    verifyMultipleSignatures: (sets: {
        publicKey: Uint8Array;
        message: Uint8Array;
        signature: Uint8Array;
    }[]) => boolean;
    secretKeyToPublicKey: (secretKey: Uint8Array) => Uint8Array;
};
