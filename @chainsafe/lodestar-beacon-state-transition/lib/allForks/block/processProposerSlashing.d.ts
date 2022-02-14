import { allForks, phase0 } from "@chainsafe/lodestar-types";
import { ForkName } from "@chainsafe/lodestar-params";
import { CachedBeaconState } from "../../allForks/util";
/**
 * Process a ProposerSlashing operation. Initiates the exit of a validator, decreases the balance of the slashed
 * validator and increases the block proposer balance.
 *
 * PERF: Work depends on number of ProposerSlashing per block. On regular networks the average is 0 / block.
 */
export declare function processProposerSlashing(fork: ForkName, state: CachedBeaconState<allForks.BeaconState>, proposerSlashing: phase0.ProposerSlashing, verifySignatures?: boolean): void;
export declare function assertValidProposerSlashing(state: CachedBeaconState<allForks.BeaconState>, proposerSlashing: phase0.ProposerSlashing, verifySignatures?: boolean): void;
//# sourceMappingURL=processProposerSlashing.d.ts.map