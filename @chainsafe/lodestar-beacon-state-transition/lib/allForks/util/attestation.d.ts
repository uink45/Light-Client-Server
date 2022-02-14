import { phase0 } from "@chainsafe/lodestar-types";
import { EpochContext } from "./epochContext";
/**
 * Compute the correct subnet for an attestation
 */
export declare function computeSubnetForAttestation(epochCtx: EpochContext, attestation: phase0.Attestation): number;
/**
 * Compute the correct subnet for a slot/committee index
 */
export declare function computeSubnetForSlot(epochCtx: EpochContext, slot: number, committeeIndex: number): number;
//# sourceMappingURL=attestation.d.ts.map