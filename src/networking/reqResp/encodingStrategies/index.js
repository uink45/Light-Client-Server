const { Encoding } = require("../types");
const { readSszSnappyPayload } = require("./sszSnappy/decode");

/**
 * Consumes a stream source to read encoded header and payload as defined in the spec:
 * ```
 * <encoding-dependent-header> | <encoded-payload>
 * ```
 */
async function readEncodedPayload(bufferedSource, encoding, type, options) {
    switch (encoding) {
        case Encoding.SSZ_SNAPPY:
            return await readSszSnappyPayload(bufferedSource, type, options);
        default:
            throw Error("Unsupported encoding");
    }
}
exports.readEncodedPayload = readEncodedPayload;
