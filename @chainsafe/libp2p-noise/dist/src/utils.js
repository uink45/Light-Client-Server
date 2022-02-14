"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPublicKey = exports.getHkdf = exports.verifySignedPayload = exports.getHandshakePayload = exports.decodePayload = exports.getPeerIdFromPayload = exports.signPayload = exports.createHandshakePayload = exports.getPayload = exports.generateKeypair = void 0;
const hkdf_1 = require("@stablelib/hkdf");
const sha256_1 = require("@stablelib/sha256");
const x25519 = __importStar(require("@stablelib/x25519"));
const buffer_1 = require("buffer");
const peer_id_1 = __importDefault(require("peer-id"));
const payload_1 = require("./proto/payload");
const equals_1 = require("uint8arrays/equals");
const NoiseHandshakePayloadProto = payload_1.pb.NoiseHandshakePayload;
function generateKeypair() {
    const keypair = x25519.generateKeyPair();
    return {
        publicKey: buffer_1.Buffer.from(keypair.publicKey.buffer, keypair.publicKey.byteOffset, keypair.publicKey.length),
        privateKey: buffer_1.Buffer.from(keypair.secretKey.buffer, keypair.secretKey.byteOffset, keypair.secretKey.length)
    };
}
exports.generateKeypair = generateKeypair;
async function getPayload(localPeer, staticPublicKey, earlyData) {
    const signedPayload = await signPayload(localPeer, getHandshakePayload(staticPublicKey));
    const earlyDataPayload = earlyData !== null && earlyData !== void 0 ? earlyData : buffer_1.Buffer.alloc(0);
    return createHandshakePayload(localPeer.marshalPubKey(), signedPayload, earlyDataPayload);
}
exports.getPayload = getPayload;
function createHandshakePayload(libp2pPublicKey, signedPayload, earlyData) {
    const payloadInit = NoiseHandshakePayloadProto.create({
        identityKey: buffer_1.Buffer.from(libp2pPublicKey),
        identitySig: signedPayload,
        data: earlyData !== null && earlyData !== void 0 ? earlyData : null
    });
    return buffer_1.Buffer.from(NoiseHandshakePayloadProto.encode(payloadInit).finish());
}
exports.createHandshakePayload = createHandshakePayload;
async function signPayload(peerId, payload) {
    return buffer_1.Buffer.from(await peerId.privKey.sign(payload));
}
exports.signPayload = signPayload;
async function getPeerIdFromPayload(payload) {
    return await peer_id_1.default.createFromPubKey(buffer_1.Buffer.from(payload.identityKey));
}
exports.getPeerIdFromPayload = getPeerIdFromPayload;
function decodePayload(payload) {
    return NoiseHandshakePayloadProto.toObject(NoiseHandshakePayloadProto.decode(buffer_1.Buffer.from(payload)));
}
exports.decodePayload = decodePayload;
function getHandshakePayload(publicKey) {
    return buffer_1.Buffer.concat([buffer_1.Buffer.from('noise-libp2p-static-key:'), publicKey]);
}
exports.getHandshakePayload = getHandshakePayload;
async function isValidPeerId(peerId, publicKeyProtobuf) {
    const generatedPeerId = await peer_id_1.default.createFromPubKey(publicKeyProtobuf);
    return equals_1.equals(generatedPeerId.id, peerId);
}
/**
 * Verifies signed payload, throws on any irregularities.
 *
 * @param {bytes} noiseStaticKey - owner's noise static key
 * @param {bytes} payload - decoded payload
 * @param {PeerId} remotePeer - owner's libp2p peer ID
 * @returns {Promise<PeerId>} - peer ID of payload owner
 */
async function verifySignedPayload(noiseStaticKey, payload, remotePeer) {
    const identityKey = buffer_1.Buffer.from(payload.identityKey);
    if (!(await isValidPeerId(remotePeer.id, identityKey))) {
        throw new Error("Peer ID doesn't match libp2p public key.");
    }
    const generatedPayload = getHandshakePayload(noiseStaticKey);
    // Unmarshaling from PublicKey protobuf
    const peerId = await peer_id_1.default.createFromPubKey(identityKey);
    // TODO remove this after libp2p-crypto ships proper types
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (!payload.identitySig || !peerId.pubKey.verify(generatedPayload, buffer_1.Buffer.from(payload.identitySig))) {
        throw new Error("Static key doesn't match to peer that signed payload!");
    }
    return peerId;
}
exports.verifySignedPayload = verifySignedPayload;
function getHkdf(ck, ikm) {
    const hkdf = new hkdf_1.HKDF(sha256_1.SHA256, ikm, ck);
    const okmU8Array = hkdf.expand(96);
    const okm = buffer_1.Buffer.from(okmU8Array.buffer, okmU8Array.byteOffset, okmU8Array.length);
    const k1 = okm.slice(0, 32);
    const k2 = okm.slice(32, 64);
    const k3 = okm.slice(64, 96);
    return [k1, k2, k3];
}
exports.getHkdf = getHkdf;
function isValidPublicKey(pk) {
    if (!buffer_1.Buffer.isBuffer(pk)) {
        return false;
    }
    if (pk.length !== 32) {
        return false;
    }
    return true;
}
exports.isValidPublicKey = isValidPublicKey;
//# sourceMappingURL=utils.js.map