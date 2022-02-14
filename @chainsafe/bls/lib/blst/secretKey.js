"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const blst = __importStar(require("@chainsafe/blst"));
const helpers_1 = require("../helpers");
const constants_1 = require("../constants");
const publicKey_1 = require("./publicKey");
const signature_1 = require("./signature");
const errors_1 = require("../errors");
class SecretKey {
    constructor(value) {
        this.value = value;
    }
    static fromBytes(bytes) {
        // draft-irtf-cfrg-bls-signature-04 does not allow SK == 0
        if (helpers_1.isZeroUint8Array(bytes)) {
            throw new errors_1.ZeroSecretKeyError();
        }
        const sk = blst.SecretKey.fromBytes(bytes);
        return new SecretKey(sk);
    }
    static fromHex(hex) {
        return this.fromBytes(helpers_1.hexToBytes(hex));
    }
    static fromKeygen(entropy) {
        const sk = blst.SecretKey.fromKeygen(entropy || helpers_1.randomBytes(constants_1.SECRET_KEY_LENGTH));
        return new SecretKey(sk);
    }
    sign(message) {
        return new signature_1.Signature(this.value.sign(message).value);
    }
    toPublicKey() {
        const pk = this.value.toPublicKey();
        return new publicKey_1.PublicKey(pk.value);
    }
    toBytes() {
        return this.value.toBytes();
    }
    toHex() {
        return helpers_1.bytesToHex(this.toBytes());
    }
}
exports.SecretKey = SecretKey;
