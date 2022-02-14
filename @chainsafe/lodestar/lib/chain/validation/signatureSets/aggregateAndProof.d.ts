import { Epoch, phase0 } from "@chainsafe/lodestar-types";
import { PublicKey } from "@chainsafe/bls";
import { allForks, ISignatureSet } from "@chainsafe/lodestar-beacon-state-transition";
export declare function getAggregateAndProofSignatureSet(state: allForks.CachedBeaconState<allForks.BeaconState>, epoch: Epoch, aggregator: PublicKey, aggregateAndProof: phase0.SignedAggregateAndProof): ISignatureSet;
//# sourceMappingURL=aggregateAndProof.d.ts.map