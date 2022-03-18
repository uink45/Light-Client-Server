import { Eth2InMessage, GossipEncoding, GossipTopic } from "./interface";
/**
 * Uncompressed data is used to
 * - compute message id
 * - if message is not seen then we use it to deserialize to gossip object
 *
 * We cache uncompressed data in InMessage to prevent uncompressing multiple times.
 */
export declare function getUncompressedData(msg: Eth2InMessage): Uint8Array;
export declare function encodeMessageData(encoding: GossipEncoding, msgData: Uint8Array): Uint8Array;
/**
 * Function to compute message id for all forks.
 */
export declare function computeMsgId(topic: GossipTopic, topicStr: string, msg: Eth2InMessage): Uint8Array;
/**
 * Function to compute message id for phase0.
 * ```
 * SHA256(MESSAGE_DOMAIN_VALID_SNAPPY + snappy_decompress(message.data))[:20]
 * ```
 */
export declare function computeMsgIdPhase0(topic: GossipTopic, msg: Eth2InMessage): Uint8Array;
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
export declare function computeMsgIdAltair(topic: GossipTopic, topicStr: string, msg: Eth2InMessage): Uint8Array;
//# sourceMappingURL=encoding.d.ts.map