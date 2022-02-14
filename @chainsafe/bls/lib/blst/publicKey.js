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
const errors_1 = require("../errors");
const helpers_1 = require("../helpers");
const interface_1 = require("../interface");
class PublicKey extends blst.PublicKey {
    constructor(value) {
        super(value);
    }
    /** @param type Defaults to `CoordType.jacobian` */
    static fromBytes(bytes, type, validate) {
        const pk = blst.PublicKey.fromBytes(bytes, type);
        if (validate)
            pk.keyValidate();
        return new PublicKey(pk.value);
    }
    static fromHex(hex) {
        return this.fromBytes(helpers_1.hexToBytes(hex));
    }
    static aggregate(publicKeys) {
        if (publicKeys.length === 0) {
            throw new errors_1.EmptyAggregateError();
        }
        const pk = blst.aggregatePubkeys(publicKeys);
        return new PublicKey(pk.value);
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
}
exports.PublicKey = PublicKey;
