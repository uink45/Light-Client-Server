import { allForks, ValidatorIndex } from "@chainsafe/lodestar-types";
import { ForkName } from "@chainsafe/lodestar-params";
import { CachedBeaconState } from "../util";
export declare function slashValidatorAllForks(fork: ForkName, state: CachedBeaconState<allForks.BeaconState>, slashedIndex: ValidatorIndex, whistleblowerIndex?: ValidatorIndex): void;
//# sourceMappingURL=slashValidator.d.ts.map