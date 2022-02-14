import { BLSPubkey, Epoch } from "@chainsafe/lodestar-types";
export declare type MinMaxSurroundAttestation = {
    targetEpoch: number;
    sourceEpoch: number;
};
export interface IMinMaxSurround {
    assertNoSurround(pubKey: BLSPubkey, attestation: MinMaxSurroundAttestation): Promise<void>;
    insertAttestation(pubKey: BLSPubkey, attestation: MinMaxSurroundAttestation): Promise<void>;
}
export interface IDistanceEntry {
    source: Epoch;
    distance: Epoch;
}
export declare type IDistanceStore = {
    [P in "minSpan" | "maxSpan"]: {
        get(pubKey: BLSPubkey, epoch: Epoch): Promise<Epoch | null>;
        setBatch(pubKey: BLSPubkey, values: IDistanceEntry[]): Promise<void>;
    };
};
//# sourceMappingURL=interface.d.ts.map