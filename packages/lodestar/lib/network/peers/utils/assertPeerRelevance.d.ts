import { ForkDigest, Root, phase0 } from "@chainsafe/lodestar-types";
import { LodestarError } from "@chainsafe/lodestar-utils";
import { IBeaconChain } from "../../../chain";
export declare enum IrrelevantPeerErrorCode {
    INCOMPATIBLE_FORKS = "IRRELEVANT_PEER_INCOMPATIBLE_FORKS",
    DIFFERENT_CLOCKS = "IRRELEVANT_PEER_DIFFERENT_CLOCKS",
    GENESIS_NONZERO = "IRRELEVANT_PEER_GENESIS_NONZERO",
    DIFFERENT_FINALIZED = "IRRELEVANT_PEER_DIFFERENT_FINALIZED"
}
declare type IrrelevantPeerErrorType = {
    code: IrrelevantPeerErrorCode.INCOMPATIBLE_FORKS;
    ours: ForkDigest;
    theirs: ForkDigest;
} | {
    code: IrrelevantPeerErrorCode.DIFFERENT_CLOCKS;
    slotDiff: number;
} | {
    code: IrrelevantPeerErrorCode.GENESIS_NONZERO;
    root: string;
} | {
    code: IrrelevantPeerErrorCode.DIFFERENT_FINALIZED;
    expectedRoot: string;
    remoteRoot: string;
};
export declare class IrrelevantPeerError extends LodestarError<IrrelevantPeerErrorType> {
}
/**
 * Process a `Status` message to determine if a peer is relevant to us. If the peer is
 * irrelevant the reason is returned.
 */
export declare function assertPeerRelevance(remote: phase0.Status, chain: IBeaconChain): void;
export declare function isZeroRoot(root: Root): boolean;
export {};
//# sourceMappingURL=assertPeerRelevance.d.ts.map