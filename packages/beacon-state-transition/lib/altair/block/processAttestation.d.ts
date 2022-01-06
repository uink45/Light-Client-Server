import { allForks, altair, Epoch, phase0, Root, Slot } from "@chainsafe/lodestar-types";
import { CachedBeaconState, EpochContext } from "../../allForks/util";
import { CachedEpochParticipation, IParticipationStatus } from "../../allForks/util/cachedEpochParticipation";
export declare function processAttestations(state: CachedBeaconState<altair.BeaconState>, attestations: phase0.Attestation[], verifySignature?: boolean): void;
/**
 * https://github.com/ethereum/eth2.0-specs/blob/v1.1.0-alpha.4/specs/altair/beacon-chain.md#get_attestation_participation_flag_indices
 */
export declare function getAttestationParticipationStatus(data: phase0.AttestationData, inclusionDelay: number, rootCache: RootCache, epochCtx: EpochContext): IParticipationStatus;
/**
 * Cache to prevent accessing the state tree to fetch block roots repeteadly.
 * In normal network conditions the same root is read multiple times, specially the target.
 */
export declare class RootCache {
    private readonly state;
    readonly currentJustifiedCheckpoint: phase0.Checkpoint;
    readonly previousJustifiedCheckpoint: phase0.Checkpoint;
    private readonly blockRootEpochCache;
    private readonly blockRootSlotCache;
    constructor(state: CachedBeaconState<allForks.BeaconState>);
    getBlockRoot(epoch: Epoch): Root;
    getBlockRootAtSlot(slot: Slot): Root;
}
export declare function updateEpochParticipants(epochStatuses: Map<number, IParticipationStatus>, epochParticipation: CachedEpochParticipation, numActiveValidators: number): void;
//# sourceMappingURL=processAttestation.d.ts.map