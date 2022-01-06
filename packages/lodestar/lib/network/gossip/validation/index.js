"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProcessRpcMessageFnsByType = exports.createValidatorFnsByType = void 0;
const constants_1 = require("libp2p-gossipsub/src/constants");
const lodestar_utils_1 = require("@chainsafe/lodestar-utils");
const topic_1 = require("../topic");
const interface_1 = require("../interface");
const errors_1 = require("../errors");
const errors_2 = require("../../../chain/errors");
const encoding_1 = require("../encoding");
const constants_2 = require("../constants");
const onAccept_1 = require("./onAccept");
const queue_1 = require("./queue");
/**
 * Returns GossipValidatorFn for each GossipType, given GossipHandlerFn indexed by type.
 *
 * @see getGossipHandlers for reasoning on why GossipHandlerFn are used for gossip validation.
 */
function createValidatorFnsByType(gossipHandlers, modules) {
    return (0, lodestar_utils_1.mapValues)(gossipHandlers, (gossipHandler, type) => {
        return getGossipValidatorFn(gossipHandler, type, modules);
    });
}
exports.createValidatorFnsByType = createValidatorFnsByType;
/**
 * Return ProcessRpcMessageFnsByType for each GossipType, this wraps the parent processRpcMsgFn()
 * (in js-libp2p-gossipsub) in a queue so that we only uncompress, compute message id, deserialize
 * messages when we execute them.
 */
function createProcessRpcMessageFnsByType(processRpcMsgFn, signal, metrics) {
    const jobQueues = (0, queue_1.createProcessRpcMessageQueues)(processRpcMsgFn, signal, metrics);
    const processRpcMessagesFnByType = (0, lodestar_utils_1.mapValues)(jobQueues, (jobQueue) => {
        return async function processRpcMessageFnWithQueue(topic, message) {
            await jobQueue.push(topic, message);
        };
    });
    return { processRpcMessagesFnByType, jobQueues };
}
exports.createProcessRpcMessageFnsByType = createProcessRpcMessageFnsByType;
/**
 * Returns a GossipSub validator function from a GossipHandlerFn. GossipHandlerFn may throw GossipActionError if one
 * or more validation conditions from the eth2.0-specs#p2p-interface are not satisfied.
 *
 * This function receives a string topic and a binary message `InMessage` and deserializes both using caches.
 * - The topic string should be known in advance and pre-computed
 * - The message.data should already by uncompressed when computing its msgID
 *
 * All logging and metrics associated with gossip object validation should happen in this function. We want to know
 * - In debug logs what objects are we processing, the result and some succint metadata
 * - In metrics what's the throughput and ratio of accept/ignore/reject per type
 *
 * @see getGossipHandlers for reasoning on why GossipHandlerFn are used for gossip validation.
 */
function getGossipValidatorFn(gossipHandler, type, modules) {
    const { config, logger, metrics, uncompressCache } = modules;
    const getGossipObjectAcceptMetadata = onAccept_1.getGossipAcceptMetadataByType[type];
    return async function gossipValidatorFn(topic, gossipMsg, seenTimestampSec) {
        var _a;
        // Define in scope above try {} to be used in catch {} if object was parsed
        let gossipObject;
        try {
            const encoding = (_a = topic.encoding) !== null && _a !== void 0 ? _a : constants_2.DEFAULT_ENCODING;
            // Deserialize object from bytes ONLY after being picked up from the validation queue
            try {
                const sszType = (0, topic_1.getGossipSSZType)(topic);
                const messageData = (0, encoding_1.decodeMessageData)(encoding, gossipMsg.data, uncompressCache);
                gossipObject =
                    // TODO: Review if it's really necessary to deserialize this as TreeBacked
                    topic.type === interface_1.GossipType.beacon_block || topic.type === interface_1.GossipType.beacon_aggregate_and_proof
                        ? sszType.createTreeBackedFromBytes(messageData)
                        : sszType.deserialize(messageData);
            }
            catch (e) {
                // TODO: Log the error or do something better with it
                throw new errors_2.GossipActionError(errors_2.GossipAction.REJECT, { code: e.message });
            }
            await gossipHandler(gossipObject, topic, gossipMsg.receivedFrom, seenTimestampSec);
            const metadata = getGossipObjectAcceptMetadata(config, gossipObject, topic);
            logger.debug(`gossip - ${type} - accept`, metadata);
            metrics === null || metrics === void 0 ? void 0 : metrics.gossipValidationAccept.inc({ topic: type });
        }
        catch (e) {
            if (!(e instanceof errors_2.GossipActionError)) {
                logger.error(`Gossip validation ${type} threw a non-GossipActionError`, {}, e);
                throw new errors_1.GossipValidationError(constants_1.ERR_TOPIC_VALIDATOR_IGNORE, e.message);
            }
            // If the gossipObject was deserialized include its short metadata with the error data
            const metadata = gossipObject && getGossipObjectAcceptMetadata(config, gossipObject, topic);
            const errorData = (typeof e.type === "object" && metadata ? { ...metadata, ...e.type } : e.type);
            switch (e.action) {
                case errors_2.GossipAction.IGNORE:
                    logger.debug(`gossip - ${type} - ignore`, errorData);
                    metrics === null || metrics === void 0 ? void 0 : metrics.gossipValidationIgnore.inc({ topic: type });
                    throw new errors_1.GossipValidationError(constants_1.ERR_TOPIC_VALIDATOR_IGNORE, e.message);
                case errors_2.GossipAction.REJECT:
                    logger.debug(`gossip - ${type} - reject`, errorData);
                    metrics === null || metrics === void 0 ? void 0 : metrics.gossipValidationReject.inc({ topic: type });
                    throw new errors_1.GossipValidationError(constants_1.ERR_TOPIC_VALIDATOR_REJECT, e.message);
            }
        }
    };
}
//# sourceMappingURL=index.js.map