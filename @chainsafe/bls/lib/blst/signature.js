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
const interface_1 = require("../interface");
const errors_1 = require("../errors");
class Signature extends blst.Signature {
    constructor(value) {
        super(value);
    }
    /** @param type Defaults to `CoordType.affine` */
    static fromBytes(bytes, type, validate = true) {
        const sig = blst.Signature.fromBytes(bytes, type);
        if (validate)
            sig.sigValidate();
        return new Signature(sig.value);
    }
    static fromHex(hex) {
        return this.fromBytes(helpers_1.hexToBytes(hex));
    }
    static aggregate(signatures) {
        if (signatures.length === 0) {
            throw new errors_1.EmptyAggregateError();
        }
        const agg = blst.aggregateSignatures(signatures);
        return new Signature(agg.value);
    }
    static verifyMultipleSignatures(sets) {
        return blst.verifyMultipleAggregateSignatures(sets.map((s) => ({ msg: s.message, pk: s.publicKey, sig: s.signature })));
    }
    verify(publicKey, message) {
        // Individual infinity signatures are NOT okay. Aggregated signatures MAY be infinity
        if (this.value.is_inf()) {
            throw new errors_1.ZeroSignatureError();
        }
        return blst.verify(message, publicKey, this);
    }
    verifyAggregate(publicKeys, message) {
        return blst.fastAggregateVerify(message, publicKeys, this);
    }
    verifyMultiple(publicKeys, messages) {
        return blst.aggregateVerify(messages, publicKeys, this);
    }
    toBytes(format) {
        if (format === interface_1.PointFormat.uncompressed) {
            return this.value.serialize();
        }
        else {
            return this.value.compress();
        }
    }
    toHex(format) {
        return helpers_1.bytesToHex(this.toBytes(format));
    }
    aggregateVerify(msgs, pks) {
        // If this set is simply an infinity signature and infinity publicKey then skip verification.
        // This has the effect of always declaring that this sig/publicKey combination is valid.
        // for Eth2.0 specs tests
        if (this.value.is_inf() && pks.length === 1 && pks[0].value.is_inf()) {
            return true;
        }
        return blst.aggregateVerify(msgs, pks, this);
    }
}
exports.Signature = Signature;
