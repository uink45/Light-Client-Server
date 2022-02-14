import { allForks, phase0 } from "@chainsafe/lodestar-types";
import { CachedBeaconState } from "../../allForks/util";
/**
 * Process an Attestation operation. Validates an attestation and appends it to state.currentEpochAttestations or
 * state.previousEpochAttestations to be processed in bulk at the epoch transition.
 *
 * PERF: Work depends on number of Attestation per block. On mainnet the average is 89.7 / block, with 87.8 participant
 * true bits on average. See `packages/beacon-state-transition/test/perf/analyzeBlocks.ts`
 */
export declare function processAttestation(state: CachedBeaconState<phase0.BeaconState>, attestation: phase0.Attestation, verifySignature?: boolean): void;
export declare function validateAttestation(state: CachedBeaconState<allForks.BeaconState>, attestation: phase0.Attestation): void;
export declare function checkpointToStr(checkpoint: phase0.Checkpoint): string;
//# sourceMappingURL=processAttestation.d.ts.map