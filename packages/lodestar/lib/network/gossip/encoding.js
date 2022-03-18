"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeMsgIdAltair = exports.computeMsgIdPhase0 = exports.computeMsgId = exports.encodeMessageData = exports.getUncompressedData = void 0;
const snappyjs_1 = require("snappyjs");
const lodestar_utils_1 = require("@chainsafe/lodestar-utils");
const ssz_1 = require("@chainsafe/ssz");
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const constants_1 = require("./constants");
const interface_1 = require("./interface");
/**
 * Uncompressed data is used to
 * - compute message id
 * - if message is not seen then we use it to deserialize to gossip object
 *
 * We cache uncompressed data in InMessage to prevent uncompressing multiple times.
 */
function getUncompressedData(msg) {
    if (!msg.uncompressedData) {
        msg.uncompressedData = (0, snappyjs_1.uncompress)(msg.data);
    }
    return msg.uncompressedData;
}
exports.getUncompressedData = getUncompressedData;
function encodeMessageData(encoding, msgData) {
    switch (encoding) {
        case interface_1.GossipEncoding.ssz_snappy:
            return (0, snappyjs_1.compress)(msgData);
        default:
            throw new Error(`Unsupported encoding ${encoding}`);
    }
}
exports.encodeMessageData = encodeMessageData;
/**
 * Function to compute message id for all forks.
 */
function computeMsgId(topic, topicStr, msg) {
    switch (topic.fork) {
        case lodestar_params_1.ForkName.phase0:
            return computeMsgIdPhase0(topic, msg);
        case lodestar_params_1.ForkName.altair:
        case lodestar_params_1.ForkName.bellatrix:
            return computeMsgIdAltair(topic, topicStr, msg);
    }
}
exports.computeMsgId = computeMsgId;
/**
 * Function to compute message id for phase0.
 * ```
 * SHA256(MESSAGE_DOMAIN_VALID_SNAPPY + snappy_decompress(message.data))[:20]
 * ```
 */
function computeMsgIdPhase0(topic, msg) {
    var _a;
    switch ((_a = topic.encoding) !== null && _a !== void 0 ? _a : constants_1.DEFAULT_ENCODING) {
        case interface_1.GossipEncoding.ssz_snappy:
            try {
                const uncompressed = getUncompressedData(msg);
                return hashGossipMsgData(constants_1.MESSAGE_DOMAIN_VALID_SNAPPY, uncompressed);
            }
            catch (e) {
                return hashGossipMsgData(constants_1.MESSAGE_DOMAIN_INVALID_SNAPPY, msg.data);
            }
    }
}
exports.computeMsgIdPhase0 = computeMsgIdPhase0;
/**
 * Function to compute message id for altair.
 *
 * ```
 * SHA256(
 *   MESSAGE_DOMAIN_VALID_SNAPPY +
 *   uint_to_bytes(uint64(len(message.topic))) +
 *   message.topic +
 *   snappy_decompress(message.data)
 * )[:20]
 * ```
 * https://github.com/ethereum/consensus-specs/blob/v1.1.10/specs/altair/p2p-interface.md#topics-and-messages
 */
function computeMsgIdAltair(topic, topicStr, msg) {
    var _a;
    switch ((_a = topic.encoding) !== null && _a !== void 0 ? _a : constants_1.DEFAULT_ENCODING) {
        case interface_1.GossipEncoding.ssz_snappy:
            try {
                const uncompressed = getUncompressedData(msg);
                return hashGossipMsgData(constants_1.MESSAGE_DOMAIN_VALID_SNAPPY, (0, lodestar_utils_1.intToBytes)(topicStr.length, 8), Buffer.from(topicStr), uncompressed);
            }
            catch (e) {
                return hashGossipMsgData(constants_1.MESSAGE_DOMAIN_INVALID_SNAPPY, (0, lodestar_utils_1.intToBytes)(topicStr.length, 8), Buffer.from(topicStr), msg.data);
            }
    }
}
exports.computeMsgIdAltair = computeMsgIdAltair;
function hashGossipMsgData(...dataArrToHash) {
    return (0, ssz_1.hash)(Buffer.concat(dataArrToHash)).slice(0, constants_1.GOSSIP_MSGID_LENGTH);
}
//# sourceMappingURL=encoding.js.map