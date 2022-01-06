import { CachedBeaconState, IEpochProcess } from "../../allForks/util";
import { processRewardsAndPenalties } from "./processRewardsAndPenalties";
import { processSlashings } from "./processSlashings";
import { getAttestationDeltas } from "./getAttestationDeltas";
import { phase0 } from "@chainsafe/lodestar-types";
export { processRewardsAndPenalties, processSlashings, getAttestationDeltas };
export declare function processEpoch(state: CachedBeaconState<phase0.BeaconState>, epochProcess: IEpochProcess): void;
//# sourceMappingURL=index.d.ts.map