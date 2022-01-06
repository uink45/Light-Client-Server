import { ParticipationFlags } from "@chainsafe/lodestar-types";
export declare function addFlag(flags: ParticipationFlags, flagIndex: number): ParticipationFlags;
export declare function hasFlag(flags: ParticipationFlags, flagIndex: number): boolean;
/**
 * Before we manage bigIntSqrt(totalActiveStake) as BigInt and return BigInt.
 * bigIntSqrt(totalActiveStake) should fit a number (2 ** 53 -1 max)
 **/
export declare function computeBaseRewardPerIncrement(totalActiveStakeByIncrement: number): number;
//# sourceMappingURL=misc.d.ts.map