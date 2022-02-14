import { allForks, phase0 } from "@chainsafe/lodestar-types";
import { CachedBeaconState } from "../../allForks/util";
/**
 * Process a VoluntaryExit operation. Initiates the exit of a validator.
 *
 * PERF: Work depends on number of VoluntaryExit per block. On regular networks the average is 0 / block.
 */
export declare function processVoluntaryExitAllForks(state: CachedBeaconState<allForks.BeaconState>, signedVoluntaryExit: phase0.SignedVoluntaryExit, verifySignature?: boolean): void;
export declare function isValidVoluntaryExit(state: CachedBeaconState<allForks.BeaconState>, signedVoluntaryExit: phase0.SignedVoluntaryExit, verifySignature?: boolean): boolean;
//# sourceMappingURL=processVoluntaryExit.d.ts.map