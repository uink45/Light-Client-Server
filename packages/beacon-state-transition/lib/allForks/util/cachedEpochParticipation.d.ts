import { BasicListType, List } from "@chainsafe/ssz";
import { ParticipationFlags, Uint8 } from "@chainsafe/lodestar-types";
import { MutableVector, PersistentVector, TransientVector } from "@chainsafe/persistent-ts";
import { Tree } from "@chainsafe/persistent-merkle-tree";
export interface IParticipationStatus {
    timelyHead: boolean;
    timelyTarget: boolean;
    timelySource: boolean;
}
export declare function toParticipationFlags(data: IParticipationStatus): ParticipationFlags;
export declare function fromParticipationFlags(flags: ParticipationFlags): IParticipationStatus;
interface ICachedEpochParticipationOpts {
    type?: BasicListType<List<Uint8>>;
    tree?: Tree;
    persistent: MutableVector<IParticipationStatus>;
}
export declare class CachedEpochParticipation implements List<ParticipationFlags> {
    [index: number]: ParticipationFlags;
    type?: BasicListType<List<Uint8>>;
    tree?: Tree;
    persistent: MutableVector<IParticipationStatus>;
    constructor(opts: ICachedEpochParticipationOpts);
    get length(): number;
    get(index: number): ParticipationFlags | undefined;
    set(index: number, value: ParticipationFlags): void;
    getStatus(index: number): IParticipationStatus | undefined;
    setStatus(index: number, data: IParticipationStatus): void;
    updateAllStatus(data: PersistentVector<IParticipationStatus> | TransientVector<IParticipationStatus>): void;
    pushStatus(data: IParticipationStatus): void;
    push(value: ParticipationFlags): number;
    pop(): ParticipationFlags;
    [Symbol.iterator](): Iterator<ParticipationFlags>;
    iterateStatus(): IterableIterator<IParticipationStatus>;
    find(fn: (value: ParticipationFlags, index: number, list: this) => boolean): ParticipationFlags | undefined;
    findIndex(fn: (value: ParticipationFlags, index: number, list: this) => boolean): number;
    forEach(fn: (value: ParticipationFlags, index: number, list: this) => void): void;
    map<T>(fn: (value: ParticipationFlags, index: number) => T): T[];
    forEachStatus(fn: (value: IParticipationStatus, index: number, list: this) => void): void;
    mapStatus<T>(fn: (value: IParticipationStatus, index: number) => T): T[];
}
export declare const CachedEpochParticipationProxyHandler: ProxyHandler<CachedEpochParticipation>;
export {};
//# sourceMappingURL=cachedEpochParticipation.d.ts.map