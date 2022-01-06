import { merge } from "@chainsafe/lodestar-types";
import { CachedBeaconState } from "../../allForks/util";
import { processOperations } from "./processOperations";
import { ExecutionEngine } from "../executionEngine";
import { processAttesterSlashing } from "./processAttesterSlashing";
import { processProposerSlashing } from "./processProposerSlashing";
export { processOperations, processAttesterSlashing, processProposerSlashing };
export declare function processBlock(state: CachedBeaconState<merge.BeaconState>, block: merge.BeaconBlock, verifySignatures: boolean | undefined, executionEngine: ExecutionEngine | null): void;
//# sourceMappingURL=index.d.ts.map