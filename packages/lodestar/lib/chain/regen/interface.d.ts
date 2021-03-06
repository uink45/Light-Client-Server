import { allForks, phase0, Slot, RootHex } from "@chainsafe/lodestar-types";
import { CachedBeaconStateAllForks } from "@chainsafe/lodestar-beacon-state-transition";
export declare enum RegenCaller {
    getDuties = "getDuties",
    produceBlock = "produceBlock",
    validateGossipBlock = "validateGossipBlock",
    precomputeEpoch = "precomputeEpoch",
    produceAttestationData = "produceAttestationData",
    processBlocksInEpoch = "processBlocksInEpoch",
    validateGossipAggregateAndProof = "validateGossipAggregateAndProof",
    validateGossipAttestation = "validateGossipAttestation",
    onForkChoiceFinalized = "onForkChoiceFinalized"
}
export declare enum RegenFnName {
    getBlockSlotState = "getBlockSlotState",
    getState = "getState",
    getPreState = "getPreState",
    getCheckpointState = "getCheckpointState"
}
/**
 * Regenerates states that have already been processed by the fork choice
 */
export interface IStateRegenerator {
    /**
     * Return a valid pre-state for a beacon block
     * This will always return a state in the latest viable epoch
     */
    getPreState(block: allForks.BeaconBlock, rCaller: RegenCaller): Promise<CachedBeaconStateAllForks>;
    /**
     * Return a valid checkpoint state
     * This will always return a state with `state.slot % SLOTS_PER_EPOCH === 0`
     */
    getCheckpointState(cp: phase0.Checkpoint, rCaller: RegenCaller): Promise<CachedBeaconStateAllForks>;
    /**
     * Return the state of `blockRoot` processed to slot `slot`
     */
    getBlockSlotState(blockRoot: RootHex, slot: Slot, rCaller: RegenCaller): Promise<CachedBeaconStateAllForks>;
    /**
     * Return the exact state with `stateRoot`
     */
    getState(stateRoot: RootHex, rCaller: RegenCaller): Promise<CachedBeaconStateAllForks>;
}
//# sourceMappingURL=interface.d.ts.map