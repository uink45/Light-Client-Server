import { ContainerType } from "@chainsafe/ssz";
import { ts as phase0 } from "../phase0";
import { ts as altair } from "../altair";
import { ts as merge } from "../merge";
export declare type BeaconBlockBody = phase0.BeaconBlockBody | altair.BeaconBlockBody | merge.BeaconBlockBody;
export declare type BeaconBlock = phase0.BeaconBlock | altair.BeaconBlock | merge.BeaconBlock;
export declare type SignedBeaconBlock = phase0.SignedBeaconBlock | altair.SignedBeaconBlock | merge.SignedBeaconBlock;
export declare type BeaconState = phase0.BeaconState | altair.BeaconState | merge.BeaconState;
export declare type Metadata = phase0.Metadata | altair.Metadata;
/**
 * Types known to change between forks
 */
export declare type AllForksTypes = {
    BeaconBlockBody: BeaconBlockBody;
    BeaconBlock: BeaconBlock;
    SignedBeaconBlock: SignedBeaconBlock;
    BeaconState: BeaconState;
    Metadata: Metadata;
};
/**
 * SSZ Types known to change between forks
 */
export declare type AllForksSSZTypes = {
    BeaconBlockBody: ContainerType<BeaconBlockBody>;
    BeaconBlock: ContainerType<BeaconBlock>;
    SignedBeaconBlock: ContainerType<SignedBeaconBlock>;
    BeaconState: ContainerType<BeaconState>;
    Metadata: ContainerType<Metadata>;
};
//# sourceMappingURL=types.d.ts.map