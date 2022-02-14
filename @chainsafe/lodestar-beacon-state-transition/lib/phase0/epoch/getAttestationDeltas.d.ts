import { phase0 } from "@chainsafe/lodestar-types";
import { IEpochProcess, CachedBeaconState } from "../../allForks/util";
/**
 * Return attestation reward/penalty deltas for each validator.
 *
 * - On normal mainnet conditions
 *   - prevSourceAttester: 98%
 *   - prevTargetAttester: 96%
 *   - prevHeadAttester:   93%
 *   - currSourceAttester: 95%
 *   - currTargetAttester: 93%
 *   - currHeadAttester:   91%
 *   - unslashed:          100%
 *   - eligibleAttester:   98%
 */
export declare function getAttestationDeltas(state: CachedBeaconState<phase0.BeaconState>, epochProcess: IEpochProcess): [number[], number[]];
//# sourceMappingURL=getAttestationDeltas.d.ts.map