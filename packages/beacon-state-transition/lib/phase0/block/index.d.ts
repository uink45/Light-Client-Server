import { phase0 } from "@chainsafe/lodestar-types";
import { CachedBeaconState } from "../../allForks/util";
import { processOperations } from "./processOperations";
import { processAttestation, validateAttestation } from "./processAttestation";
import { processDeposit } from "./processDeposit";
import { processAttesterSlashing } from "./processAttesterSlashing";
import { processProposerSlashing } from "./processProposerSlashing";
import { processVoluntaryExit } from "./processVoluntaryExit";
export { isValidIndexedAttestation } from "../../allForks/block";
export { processOperations, validateAttestation, processAttestation, processDeposit, processAttesterSlashing, processProposerSlashing, processVoluntaryExit, };
export declare function processBlock(state: CachedBeaconState<phase0.BeaconState>, block: phase0.BeaconBlock, verifySignatures?: boolean): void;
//# sourceMappingURL=index.d.ts.map