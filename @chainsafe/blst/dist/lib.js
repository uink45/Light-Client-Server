"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyMultipleAggregateSignatures = exports.aggregateVerify = exports.fastAggregateVerify = exports.verify = exports.aggregateSignatures = exports.aggregatePubkeys = exports.Signature = exports.PublicKey = exports.SecretKey = exports.CoordType = exports.ErrorBLST = exports.BLST_ERROR = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bindings_1 = require("./bindings");
Object.defineProperty(exports, "BLST_ERROR", { enumerable: true, get: function () { return bindings_1.BLST_ERROR; } });
const HASH_OR_ENCODE = true;
const DST = "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_POP_";
const RAND_BYTES = 8;
const SECRET_KEY_LENGTH = 32;
const PUBLIC_KEY_LENGTH_COMPRESSED = 48;
const PUBLIC_KEY_LENGTH_UNCOMPRESSED = 48 * 2;
const SIGNATURE_LENGTH_COMPRESSED = 96;
const SIGNATURE_LENGTH_UNCOMPRESSED = 96 * 2;
class ErrorBLST extends Error {
    constructor(blstError) {
        super(bindings_1.BLST_ERROR[blstError]);
    }
}
exports.ErrorBLST = ErrorBLST;
const SkConstructor = bindings_1.blst.SecretKey;
const PkConstructor = bindings_1.blst.P1;
const SigConstructor = bindings_1.blst.P2;
const PkAffineConstructor = bindings_1.blst.P1_Affine;
const SigAffineConstructor = bindings_1.blst.P2_Affine;
/**
 * Points are represented in two ways in BLST:
 * - affine coordinates (x,y)
 * - jacobian coordinates (x,y,z)
 *
 * The jacobian coordinates allow to aggregate points more efficiently,
 * so if P1 points are aggregated often (Eth2.0) you want to keep the point
 * cached in jacobian coordinates.
 */
var CoordType;
(function (CoordType) {
    CoordType[CoordType["affine"] = 0] = "affine";
    CoordType[CoordType["jacobian"] = 1] = "jacobian";
})(CoordType = exports.CoordType || (exports.CoordType = {}));
class SecretKey {
    constructor(value) {
        this.value = value;
    }
    /// Deterministically generate a secret key from input key material
    static fromKeygen(ikm) {
        if (ikm.length < SECRET_KEY_LENGTH) {
            throw new ErrorBLST(bindings_1.BLST_ERROR.BLST_BAD_ENCODING);
        }
        const sk = new SkConstructor();
        sk.keygen(ikm);
        return new SecretKey(sk);
    }
    static fromBytes(skBytes) {
        if (skBytes.length !== SECRET_KEY_LENGTH) {
            throw new ErrorBLST(bindings_1.BLST_ERROR.BLST_INVALID_SIZE);
        }
        const sk = new SkConstructor();
        sk.from_bendian(skBytes);
        return new SecretKey(sk);
    }
    toPublicKey() {
        const pk = new PkConstructor(this.value);
        return new PublicKey(pk); // Store as jacobian
    }
    sign(msg) {
        const sig = new SigConstructor();
        sig.hash_to(msg, DST).sign_with(this.value);
        return new Signature(sig); // Store as jacobian
    }
    toBytes() {
        return this.value.to_bendian();
    }
}
exports.SecretKey = SecretKey;
/**
 * Wrapper for P1 points. Internal point may be represented
 * in affine or jacobian coordinates, @see CoordType
 * This approach allows to use this wrapper very flexibly while
 * minimizing the coordinate conversions if used properly.
 *
 * To force a instance of PublicKey to permanently switch its coordType
 * ```ts
 * const pkAsAffine = new PublicKey(pk.affine)
 * ```
 */
class PublicKey {
    constructor(value) {
        this.value = value;
    }
    /** Accepts both compressed and serialized */
    static fromBytes(pkBytes, type = CoordType.jacobian) {
        if (pkBytes.length !== PUBLIC_KEY_LENGTH_COMPRESSED && pkBytes.length !== PUBLIC_KEY_LENGTH_UNCOMPRESSED) {
            throw new ErrorBLST(bindings_1.BLST_ERROR.BLST_INVALID_SIZE);
        }
        if (type === CoordType.affine) {
            return new PublicKey(new PkAffineConstructor(pkBytes));
        }
        else {
            return new PublicKey(new PkConstructor(pkBytes));
        }
    }
    get affine() {
        return typeof this.value.to_affine === "function"
            ? this.value.to_affine()
            : this.value;
    }
    get jacobian() {
        return typeof this.value.to_jacobian === "function"
            ? this.value.to_jacobian()
            : this.value;
    }
    compress() {
        return this.value.compress();
    }
    serialize() {
        return this.value.serialize();
    }
    toBytes() {
        return this.compress();
    }
    /** Validate pubkey is not infinity and is in group */
    keyValidate() {
        if (this.value.is_inf()) {
            throw new ErrorBLST(bindings_1.BLST_ERROR.BLST_PK_IS_INFINITY);
        }
        if (!this.value.in_group()) {
            throw new ErrorBLST(bindings_1.BLST_ERROR.BLST_POINT_NOT_IN_GROUP);
        }
    }
}
exports.PublicKey = PublicKey;
/**
 * Wrapper for P2 points. @see PublicKey
 */
class Signature {
    constructor(value) {
        this.value = value;
    }
    /** Accepts both compressed and serialized */
    static fromBytes(sigBytes, type = CoordType.affine) {
        /** P2 compressed is 96 bytes else 192 bytes */
        if (sigBytes.length !== SIGNATURE_LENGTH_COMPRESSED && sigBytes.length !== SIGNATURE_LENGTH_UNCOMPRESSED) {
            throw new ErrorBLST(bindings_1.BLST_ERROR.BLST_INVALID_SIZE);
        }
        if (type === CoordType.affine) {
            return new Signature(new SigAffineConstructor(sigBytes));
        }
        else {
            return new Signature(new SigConstructor(sigBytes));
        }
    }
    get affine() {
        return typeof this.value.to_affine === "function"
            ? this.value.to_affine()
            : this.value;
    }
    get jacobian() {
        return typeof this.value.to_jacobian === "function"
            ? this.value.to_jacobian()
            : this.value;
    }
    compress() {
        return this.value.compress();
    }
    serialize() {
        return this.value.serialize();
    }
    toBytes() {
        return this.compress();
    }
    /** Validate sig is in group */
    sigValidate() {
        if (!this.value.in_group()) {
            throw new ErrorBLST(bindings_1.BLST_ERROR.BLST_POINT_NOT_IN_GROUP);
        }
    }
}
exports.Signature = Signature;
/**
 * Aggregates all `pks` and returns a PublicKey containing a jacobian point
 */
function aggregatePubkeys(pks) {
    if (pks.length === 0) {
        throw new ErrorBLST(bindings_1.BLST_ERROR.EMPTY_AGGREGATE_ARRAY);
    }
    const agg = new PkConstructor(); // Faster than using .dup()
    for (const pk of pks)
        agg.add(pk.jacobian);
    return new PublicKey(agg);
}
exports.aggregatePubkeys = aggregatePubkeys;
/**
 * Aggregates all `sigs` and returns a Signature containing a jacobian point
 */
function aggregateSignatures(sigs) {
    if (sigs.length === 0) {
        throw new ErrorBLST(bindings_1.BLST_ERROR.EMPTY_AGGREGATE_ARRAY);
    }
    const agg = new SigConstructor(); // Faster than using .dup()
    for (const pk of sigs)
        agg.add(pk.jacobian);
    return new Signature(agg);
}
exports.aggregateSignatures = aggregateSignatures;
/**
 * Verify a single message from a single pubkey
 */
function verify(msg, pk, sig) {
    return aggregateVerify([msg], [pk], sig);
}
exports.verify = verify;
/**
 * Verify a single message from multiple pubkeys
 */
function fastAggregateVerify(msg, pks, sig) {
    const aggPk = aggregatePubkeys(pks);
    return aggregateVerify([msg], [aggPk], sig);
}
exports.fastAggregateVerify = fastAggregateVerify;
/**
 * Verify multiple messages from multiple pubkeys
 */
function aggregateVerify(msgs, pks, sig) {
    const n_elems = pks.length;
    if (msgs.length !== n_elems) {
        throw new ErrorBLST(bindings_1.BLST_ERROR.BLST_VERIFY_FAIL);
    }
    if (n_elems === 0) {
        throw new ErrorBLST(bindings_1.BLST_ERROR.EMPTY_AGGREGATE_ARRAY);
    }
    const sigAff = sig.affine;
    const ctx = new bindings_1.blst.Pairing(HASH_OR_ENCODE, DST);
    for (let i = 0; i < n_elems; i++) {
        const result = ctx.aggregate(pks[i].affine, sigAff, msgs[i]);
        if (result !== bindings_1.BLST_ERROR.BLST_SUCCESS) {
            throw new ErrorBLST(result);
        }
    }
    ctx.commit();
    // PT constructor calls `blst_aggregated`
    const gtsig = new bindings_1.blst.PT(sigAff);
    return ctx.finalverify(gtsig);
}
exports.aggregateVerify = aggregateVerify;
/**
 * Batch verify groups of {msg, pk, sig}[]
 * https://ethresear.ch/t/fast-verification-of-multiple-bls-signatures/5407
 */
function verifyMultipleAggregateSignatures(signatureSets) {
    const ctx = new bindings_1.blst.Pairing(HASH_OR_ENCODE, DST);
    for (const { msg, pk, sig } of signatureSets) {
        const rand = randomBytesNonZero(RAND_BYTES);
        const result = ctx.mul_n_aggregate(pk.affine, sig.affine, rand, msg);
        if (result !== bindings_1.BLST_ERROR.BLST_SUCCESS) {
            throw new ErrorBLST(result);
        }
    }
    ctx.commit();
    return ctx.finalverify();
}
exports.verifyMultipleAggregateSignatures = verifyMultipleAggregateSignatures;
/**
 * `rand` must not be exactly zero. Otherwise it would allow the verification of invalid signatures
 * See https://github.com/ChainSafe/blst-ts/issues/45
 */
function randomBytesNonZero(BYTES_COUNT) {
    const rand = crypto_1.default.randomBytes(BYTES_COUNT);
    for (let i = 0; i < BYTES_COUNT; i++) {
        if (rand[0] !== 0)
            return rand;
    }
    rand[0] = 1;
    return rand;
}
//# sourceMappingURL=lib.js.map