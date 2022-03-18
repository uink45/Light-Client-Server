import { ILogger } from "@chainsafe/lodestar-utils";
/**
 * As of libp2p v0.36.0 (https://github.com/libp2p/js-libp2p/commit/978eb3676fad5d5d50ddb28d1a7868f448cbb20b)
 * the peerstore format has changed in a breaking way.
 *
 * Because of that, we need to wipe the old peerstore if it exists.
 */
export declare function deleteOldPeerstorePreV036(peerStoreDir: string, logger: ILogger): Promise<void>;
//# sourceMappingURL=deleteOldPeerstore.d.ts.map