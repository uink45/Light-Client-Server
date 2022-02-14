"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("./context");
const helpers_1 = require("../helpers");
const interface_1 = require("../interface");
const errors_1 = require("../errors");
const constants_1 = require("../constants");
class PublicKey {
    constructor(value) {
        if (value.isZero()) {
            throw new errors_1.ZeroPublicKeyError();
        }
        this.value = value;
    }
    static fromBytes(bytes) {
        const context = context_1.getContext();
        const publicKey = new context.PublicKey();
        if (!helpers_1.isZeroUint8Array(bytes)) {
            if (bytes.length === constants_1.PUBLIC_KEY_LENGTH_COMPRESSED) {
                publicKey.deserialize(bytes);
            }
            else if (bytes.length === constants_1.PUBLIC_KEY_LENGTH_UNCOMPRESSED) {
                publicKey.deserializeUncompressed(bytes);
            }
            else {
                throw new errors_1.InvalidLengthError("PublicKey", bytes.length);
            }
        }
        return new PublicKey(publicKey);
    }
    static fromHex(hex) {
        return this.fromBytes(helpers_1.hexToBytes(hex));
    }
    static aggregate(publicKeys) {
        if (publicKeys.length === 0) {
            throw new errors_1.EmptyAggregateError();
        }
        const agg = new PublicKey(publicKeys[0].value.clone());
        for (const pk of publicKeys.slice(1)) {
            agg.value.add(pk.value);
        }
        return agg;
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
exports.PublicKey = PublicKey;
