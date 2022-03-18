import Gossipsub from "libp2p-gossipsub";
import { InMessage } from "libp2p-interfaces/src/pubsub";
import Libp2p from "libp2p";
import { AbortSignal } from "@chainsafe/abort-controller";
import { IBeaconConfig } from "@chainsafe/lodestar-config";
import { allForks, altair, phase0 } from "@chainsafe/lodestar-types";
import { ILogger } from "@chainsafe/lodestar-utils";
import { IMetrics } from "../../metrics";
import { GossipJobQueues, GossipTopic, GossipTopicMap, GossipType, GossipTypeMap, GossipHandlers, Eth2InMessage } from "./interface";
import PeerStreams from "libp2p-interfaces/src/pubsub/peer-streams";
import { RPC } from "libp2p-gossipsub/src/message/rpc";
import { Eth2Context } from "../../chain";
export interface IGossipsubModules {
    config: IBeaconConfig;
    libp2p: Libp2p;
    logger: ILogger;
    metrics: IMetrics | null;
    signal: AbortSignal;
    eth2Context: Eth2Context;
    gossipHandlers: GossipHandlers;
}
/**
 * Wrapper around js-libp2p-gossipsub with the following extensions:
 * - Eth2 message id
 * - Emits `GossipObject`, not `InMessage`
 * - Provides convenience interface:
 *   - `publishObject`
 *   - `subscribeTopic`
 *   - `unsubscribeTopic`
 *   - `handleTopic`
 *   - `unhandleTopic`
 *
 * See https://github.com/ethereum/consensus-specs/blob/v1.1.10/specs/phase0/p2p-interface.md#the-gossip-domain-gossipsub
 */
export declare class Eth2Gossipsub extends Gossipsub {
    readonly jobQueues: GossipJobQueues;
    private readonly config;
    private readonly logger;
    private readonly gossipTopicCache;
    private readonly validatorFnsByType;
    constructor(modules: IGossipsubModules);
    start(): Promise<void>;
    stop(): Promise<void>;
    /**
     * @override Use eth2 msg id and cache results to the msg
     * The cached msgId inside the message will be ignored when we send messages to other peers
     * since we don't have this field in protobuf.
     */
    getMsgId(msg: Eth2InMessage): Uint8Array;
    /**
     * Get cached message id string if we have it.
     */
    getCachedMsgIdStr(msg: Eth2InMessage): string | undefined;
    _processRpc(idB58Str: string, peerStreams: PeerStreams, rpc: RPC): Promise<boolean>;
    /**
     * Similar to gossipsub 0.13.0 except that no await
     * TODO: override getMsgIdIfNotSeen and add metric
     * See https://github.com/ChainSafe/js-libp2p-gossipsub/pull/187/files
     */
    _processRpcMessage(msg: InMessage): Promise<void>;
    /**
     * @override https://github.com/ChainSafe/js-libp2p-gossipsub/blob/3c3c46595f65823fcd7900ed716f43f76c6b355c/ts/index.ts#L436
     * @override https://github.com/libp2p/js-libp2p-interfaces/blob/ff3bd10704a4c166ce63135747e3736915b0be8d/src/pubsub/index.js#L513
     * Note: this does not call super. All logic is re-implemented below
     */
    validate(message: Eth2InMessage): Promise<void>;
    /**
     * @override
     * See https://github.com/libp2p/js-libp2p-interfaces/blob/v0.5.2/src/pubsub/index.js#L428
     *
     * Our handlers are attached on the validator functions, so no need to emit the objects internally.
     */
    _emitMessage(): void;
    /**
     * @override
     * Differs from upstream `unsubscribe` by _always_ unsubscribing,
     * instead of unsubsribing only when no handlers are attached to the topic
     *
     * See https://github.com/libp2p/js-libp2p-interfaces/blob/v0.8.3/src/pubsub/index.js#L720
     */
    unsubscribe(topicStr: string): void;
    /**
     * Publish a `GossipObject` on a `GossipTopic`
     */
    publishObject<K extends GossipType>(topic: GossipTopicMap[K], object: GossipTypeMap[K]): Promise<void>;
    /**
     * Subscribe to a `GossipTopic`
     */
    subscribeTopic(topic: GossipTopic): void;
    /**
     * Unsubscribe to a `GossipTopic`
     */
    unsubscribeTopic(topic: GossipTopic): void;
    publishBeaconBlock(signedBlock: allForks.SignedBeaconBlock): Promise<void>;
    publishBeaconAggregateAndProof(aggregateAndProof: phase0.SignedAggregateAndProof): Promise<void>;
    publishBeaconAttestation(attestation: phase0.Attestation, subnet: number): Promise<void>;
    publishVoluntaryExit(voluntaryExit: phase0.SignedVoluntaryExit): Promise<void>;
    publishProposerSlashing(proposerSlashing: phase0.ProposerSlashing): Promise<void>;
    publishAttesterSlashing(attesterSlashing: phase0.AttesterSlashing): Promise<void>;
    publishSyncCommitteeSignature(signature: altair.SyncCommitteeMessage, subnet: number): Promise<void>;
    publishContributionAndProof(contributionAndProof: altair.SignedContributionAndProof): Promise<void>;
    private getGossipTopicString;
    private onScrapeMetrics;
}
//# sourceMappingURL=gossipsub.d.ts.map