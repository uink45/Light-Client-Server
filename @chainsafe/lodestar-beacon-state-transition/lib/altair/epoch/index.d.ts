import { altair } from "@chainsafe/lodestar-types";
import { CachedBeaconState, IEpochProcess } from "../../allForks/util";
import { processRewardsAndPenalties } from "./processRewardsAndPenalties";
import { processSlashings } from "./processSlashings";
import { processParticipationFlagUpdates } from "./processParticipationFlagUpdates";
import { processInactivityUpdates } from "./processInactivityUpdates";
import { processSyncCommitteeUpdates } from "./processSyncCommitteeUpdates";
export { getRewardsPenaltiesDeltas } from "./balance";
export { processInactivityUpdates, processRewardsAndPenalties, processSlashings, processSyncCommitteeUpdates, processParticipationFlagUpdates, };
export declare function processEpoch(state: CachedBeaconState<altair.BeaconState>, epochProcess: IEpochProcess): void;
//# sourceMappingURL=index.d.ts.map