import { altair } from "@chainsafe/lodestar-types";
import { CachedBeaconState } from "../../allForks/util";
import { processOperations } from "./processOperations";
import { processAttestations, RootCache } from "./processAttestation";
import { processAttesterSlashing } from "./processAttesterSlashing";
import { processDeposit } from "./processDeposit";
import { processProposerSlashing } from "./processProposerSlashing";
import { processVoluntaryExit } from "./processVoluntaryExit";
import { processSyncAggregate } from "./processSyncCommittee";
export { processOperations, processAttestations, RootCache, processAttesterSlashing, processDeposit, processProposerSlashing, processVoluntaryExit, processSyncAggregate, };
export declare function processBlock(state: CachedBeaconState<altair.BeaconState>, block: altair.BeaconBlock, verifySignatures?: boolean): void;
//# sourceMappingURL=index.d.ts.map