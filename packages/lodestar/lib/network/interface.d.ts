/**
 * @module network
 */
import { Connection } from "libp2p";
import { Discv5, ENR } from "@chainsafe/discv5";
import { Multiaddr } from "multiaddr";
import PeerId from "peer-id";
import { INetworkEventBus } from "./events";
import { Eth2Gossipsub } from "./gossip";
import { MetadataController } from "./metadata";
import { PeerAction } from "./peers";
import { IReqResp } from "./reqresp";
import { IAttnetsService, ISubnetsService, CommitteeSubscription } from "./subnets";
export declare type PeerSearchOptions = {
    supportsProtocols?: string[];
    count?: number;
};
export interface INetwork {
    events: INetworkEventBus;
    reqResp: IReqResp;
    attnetsService: IAttnetsService;
    syncnetsService: ISubnetsService;
    gossip: Eth2Gossipsub;
    discv5?: Discv5;
    metadata: MetadataController;
    /** Our network identity */
    peerId: PeerId;
    localMultiaddrs: Multiaddr[];
    getEnr(): ENR | undefined;
    getConnectionsByPeer(): Map<string, Connection[]>;
    getConnectedPeers(): PeerId[];
    hasSomeConnectedPeer(): boolean;
    /** Subscribe, search peers, join long-lived attnets */
    prepareBeaconCommitteeSubnet(subscriptions: CommitteeSubscription[]): void;
    /** Subscribe, search peers, join long-lived syncnets */
    prepareSyncCommitteeSubnets(subscriptions: CommitteeSubscription[]): void;
    reStatusPeers(peers: PeerId[]): void;
    reportPeer(peer: PeerId, action: PeerAction, actionName?: string): void;
    subscribeGossipCoreTopics(): void;
    unsubscribeGossipCoreTopics(): void;
    isSubscribedToGossipCoreTopics(): boolean;
    start(): Promise<void>;
    stop(): Promise<void>;
    close(): void;
    connectToPeer(peer: PeerId, multiaddr: Multiaddr[]): Promise<void>;
    disconnectPeer(peer: PeerId): Promise<void>;
}
export declare type PeerDirection = Connection["stat"]["direction"];
export declare type PeerStatus = Connection["stat"]["status"];
//# sourceMappingURL=interface.d.ts.map