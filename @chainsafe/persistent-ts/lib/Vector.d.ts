interface ILeaf<T> {
    edit: {
        ref: boolean;
    };
    array: T[];
}
interface IBranch<T> {
    edit: {
        ref: boolean;
    };
    array: (INode<T> | undefined)[];
}
declare type INode<T> = ILeaf<T> | IBranch<T>;
/**
 * A PersistentVector is a collection of values indexed by contiguous integers.
 * PersistentVectors support access to items by index in log32N hops.
 */
export declare class PersistentVector<T> implements Iterable<T> {
    private readonly root;
    private readonly shift;
    private readonly tail;
    readonly length: number;
    /**
     * The empty vector
     */
    static empty: PersistentVector<any>;
    constructor(root: INode<T>, shift: number, tail: T[], length: number);
    /**
     * Create a new vector containing certain elements.
     *
     * @param values the values that this vector will contain
     */
    static from<T>(values: Iterable<T>): PersistentVector<T>;
    asTransient(): TransientVector<T>;
    /**
     * O(log_32(N)) Return the value at a certain index, if it exists.
     *
     * Returns `undefined` if the index is out of the vector's bounds.
     *
     * @param index the index to look up
     */
    get(index: number): T | undefined;
    /**
     * O(log_32(N)) Return a new vector with an element set to a new value.
     *
     * This will do nothing if the index is negative, or out of the bounds of the vector.
     *
     * @param index the index to set
     * @param value the value to set at that index
     */
    set(index: number, value: T): PersistentVector<T>;
    /**
     * O(log_32(N)) Append a value to the end of this vector.
     *
     * This is useful for building up a vector from values.
     *
     * @param value the value to push to the end of the vector
     */
    push(value: T): PersistentVector<T>;
    /**
     * Return a new Vector with the last element removed.
     *
     * This does nothing if the Vector contains no elements.
     */
    pop(): PersistentVector<T>;
    keys(): IterableIterator<number>;
    values(): IterableIterator<T>;
    /**
     * Implement Iterable interface.
     */
    [Symbol.iterator](): IterableIterator<T>;
    /**
     */
    forEach(func: (t: T, i: number) => void): void;
    /**
     * Map to an array of T2.
     */
    map<T2>(func: (t: T, i: number) => T2): T2[];
    /**
     * Convert to regular typescript array
     */
    toArray(): T[];
    /**
     * Clone to a new vector.
     */
    clone(): PersistentVector<T>;
    private getTailLength;
    /**
     * Returns the first index of the tail, also the number of the leaf elements in the tree
     */
    private getTailOffset;
}
/**
 * A TransientVector is a collection of values indexed by contiguous integers.
 * TransientVectors support access to items by index in log32N hops.
 */
export declare class TransientVector<T> implements Iterable<T> {
    private root;
    private shift;
    private tail;
    readonly length: number;
    constructor(root: INode<T>, shift: number, tail: T[], length: number);
    /**
     * The empty vector
     */
    static empty<T>(): TransientVector<T>;
    /**
     * Create a new vector containing certain elements.
     *
     * @param values the values that this vector will contain
     */
    static from<T>(values: Iterable<T>): TransientVector<T>;
    ensureEditable(): void;
    persistent(): PersistentVector<T>;
    /**
     * O(log_32(N)) Return the value at a certain index, if it exists.
     *
     * Returns `undefined` if the index is out of the vector's bounds.
     *
     * @param index the index to look up
     */
    get(index: number): T | undefined;
    /**
     * O(log_32(N)) Return a new vector with an element set to a new value.
     *
     * This will do nothing if the index is negative, or out of the bounds of the vector.
     *
     * @param index the index to set
     * @param value the value to set at that index
     */
    set(index: number, value: T): TransientVector<T>;
    /**
     * O(log_32(N)) Append a value to the end of this vector.
     *
     * This is useful for building up a vector from values.
     *
     * @param value the value to push to the end of the vector
     */
    push(value: T): TransientVector<T>;
    /**
     * Return a new Vector with the last element removed.
     *
     * This does nothing if the Vector contains no elements.
     */
    pop(): TransientVector<T>;
    keys(): IterableIterator<number>;
    values(): IterableIterator<T>;
    /**
     * Implement Iterable interface.
     */
    [Symbol.iterator](): IterableIterator<T>;
    /**
     */
    forEach(func: (t: T, i: number) => void): void;
    /**
     * Map to an array of T2.
     */
    map<T2>(func: (t: T, i: number) => T2): T2[];
    /**
     * Convert to regular typescript array
     */
    toArray(): T[];
    /**
     * Clone to a new vector.
     */
    clone(): TransientVector<T>;
    private getTailLength;
    /**
     * Returns the first index of the tail, also the number of the leaf elements in the tree
     */
    private getTailOffset;
}
export {};
//# sourceMappingURL=Vector.d.ts.map