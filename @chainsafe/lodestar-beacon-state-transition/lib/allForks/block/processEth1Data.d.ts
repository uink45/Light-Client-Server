import { allForks, phase0 } from "@chainsafe/lodestar-types";
import { CachedBeaconState } from "../util";
/**
 * Store vote counts for every eth1 block that has votes; if any eth1 block wins majority support within a 1024-slot
 * voting period, formally accept that eth1 block and set it as the official "latest known eth1 block" in the eth2 state.
 *
 * PERF: Processing cost depends on the current amount of votes.
 * - Best case: Vote is already decided, zero work. See getNewEth1Data conditions
 * - Worst case: 1023 votes and no majority vote yet.
 */
export declare function processEth1Data(state: CachedBeaconState<allForks.BeaconState>, body: allForks.BeaconBlockBody): void;
/**
 * Returns `newEth1Data` if adding the given `eth1Data` to `state.eth1DataVotes` would
 * result in a change to `state.eth1Data`.
 */
export declare function getNewEth1Data(state: CachedBeaconState<allForks.BeaconState>, newEth1Data: phase0.Eth1Data): phase0.Eth1Data | null;
//# sourceMappingURL=processEth1Data.d.ts.map