import { phase0 } from "@chainsafe/lodestar-types";
import { CachedBeaconState } from "../../allForks/util";
/**
 * PERF: Should have zero cost. It just moves a rootNode from one key to another. Then it creates an empty tree on the
 * previous key
 */
export declare function processParticipationRecordUpdates(state: CachedBeaconState<phase0.BeaconState>): void;
//# sourceMappingURL=processParticipationRecordUpdates.d.ts.map