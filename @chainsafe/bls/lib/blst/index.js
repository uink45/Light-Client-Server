"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const secretKey_1 = require("./secretKey");
exports.SecretKey = secretKey_1.SecretKey;
const publicKey_1 = require("./publicKey");
exports.PublicKey = publicKey_1.PublicKey;
const signature_1 = require("./signature");
exports.Signature = signature_1.Signature;
const functional_1 = require("../functional");
__export(require("../constants"));
async function init() {
    // Native bindings require no init() call
}
exports.init = init;
function destroy() {
    // Native bindings require no destroy() call
}
exports.destroy = destroy;
exports.bls = {
    implementation: "blst-native",
    SecretKey: secretKey_1.SecretKey,
    PublicKey: publicKey_1.PublicKey,
    Signature: signature_1.Signature,
    ...functional_1.functionalInterfaceFactory({ SecretKey: secretKey_1.SecretKey, PublicKey: publicKey_1.PublicKey, Signature: signature_1.Signature }),
    init,
    destroy,
};
exports.default = exports.bls;
