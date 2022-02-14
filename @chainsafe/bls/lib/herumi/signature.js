"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bls_eth_wasm_1 = require("bls-eth-wasm");
const context_1 = require("./context");
const helpers_1 = require("../helpers");
const interface_1 = require("../interface");
const errors_1 = require("../errors");
const constants_1 = require("../constants");
class Signature {
    constructor(value) {
        if (!value.isValidOrder()) {
            throw new errors_1.InvalidOrderError();
        }
        this.value = value;
    }
    /**
     * @param type Does not affect `herumi` implementation, always de-serializes to `jacobian`
     * @param validate With `herumi` implementation signature validation is always on regardless of this flag.
     */
    static fromBytes(bytes, _type, _validate = true) {
        const context = context_1.getContext();
        const signature = new context.Signature();
        if (!helpers_1.isZeroUint8Array(bytes)) {
            if (bytes.length === constants_1.SIGNATURE_LENGTH_COMPRESSED) {
                signature.deserialize(bytes);
            }
            else if (bytes.length === constants_1.SIGNATURE_LENGTH_UNCOMPRESSED) {
                signature.deserializeUncompressed(bytes);
            }
            else {
                throw new errors_1.InvalidLengthError("Signature", bytes.length);
            }
            signature.deserialize(bytes);
        }
        return new Signature(signature);
    }
    static fromHex(hex) {
        return this.fromBytes(helpers_1.hexToBytes(hex));
    }
    static aggregate(signatures) {
        if (signatures.length === 0) {
            throw new errors_1.EmptyAggregateError();
        }
        const context = context_1.getContext();
        const signature = new context.Signature();
        signature.aggregate(signatures.map((sig) => sig.value));
        return new Signature(signature);
    }
    static verifyMultipleSignatures(sets) {
        return bls_eth_wasm_1.multiVerify(sets.map((s) => s.publicKey.value), sets.map((s) => s.signature.value), sets.map((s) => s.message));
    }
    verify(publicKey, message) {
        return publicKey.value.verify(this.value, message);
    }
    verifyAggregate(publicKeys, message) {
        return this.value.fastAggregateVerify(publicKeys.map((key) => key.value), message);
    }
    verifyMultiple(publicKeys, messages) {
        return this.value.aggregateVerifyNoCheck(publicKeys.map((key) => key.value), helpers_1.concatUint8Arrays(messages));
    }
    toBytes(format) {
        if (format === interface_1.PointFormat.uncompressed) {
            return this.value.serializeUncompressed();
        }
        else {
            return this.value.serialize();
        }
    }
    toHex(format) {
        return helpers_1.bytesToHex(this.toBytes(format));
    }
}
exports.Signature = Signature;
