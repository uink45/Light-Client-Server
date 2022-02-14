import { PersistentVector, TransientVector } from "./Vector";
/**
 * A mutable reference to a PersistentVector or TransientVector
 */
export declare class MutableVector<T> implements Iterable<T> {
    vector: PersistentVector<T> | TransientVector<T>;
    private constructor();
    static empty<T>(): MutableVector<T>;
    static from<T>(values: Iterable<T>): MutableVector<T>;
    asTransient(): this;
    asPersistent(): this;
    get length(): number;
    get(index: number): T | undefined;
    set(index: number, value: T): void;
    update(index: number, value: Partial<T>): T;
    push(value: T): void;
    pop(): T | undefined;
    [Symbol.iterator](): IterableIterator<T>;
    forEach(func: (t: T, i: number) => void): void;
    map<T2>(func: (t: T, i: number) => T2): T2[];
    clone(): MutableVector<T>;
    toArray(): T[];
}
//# sourceMappingURL=MutableVector.d.ts.map