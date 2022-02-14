"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransientVector = exports.PersistentVector = void 0;
const BIT_WIDTH = 5;
const BIT_MASK = 0b11111;
const BRANCH_SIZE = 1 << BIT_WIDTH;
const DEFAULT_LEVEL_SHIFT = 5;
function isFullBranch(length) {
    return (
    // initially we initialize Vector with an empty branch (DEFAULT_LEVEL_SHIFT)
    // length === 1 << 5 ||
    length === 1 << 10 || length === 1 << 15 || length === 1 << 20 || length === 1 << 25 || length === 1 << 30);
}
function emptyNode(edit = { ref: false }) {
    return { edit, array: Array(BRANCH_SIZE).fill(undefined) };
}
function copyNode(node) {
    return { edit: node.edit, array: [...node.array] };
}
function ensureEditable(node, edit) {
    if (node.edit === edit)
        return node;
    else
        return { edit, array: [...node.array] };
}
/**
 * A PersistentVector is a collection of values indexed by contiguous integers.
 * PersistentVectors support access to items by index in log32N hops.
 */
class PersistentVector {
    constructor(root, shift, tail, length) {
        this.root = root;
        this.shift = shift;
        this.tail = tail;
        this.length = length;
    }
    /**
     * Create a new vector containing certain elements.
     *
     * @param values the values that this vector will contain
     */
    static from(values) {
        let acc = PersistentVector.empty.asTransient();
        for (const v of values)
            acc = acc.push(v);
        return acc.persistent();
    }
    asTransient() {
        return new TransientVector(ensureEditable(this.root, { ref: true }), this.shift, [...this.tail], this.length);
    }
    /**
     * O(log_32(N)) Return the value at a certain index, if it exists.
     *
     * Returns `undefined` if the index is out of the vector's bounds.
     *
     * @param index the index to look up
     */
    get(index) {
        if (index < 0 || index >= this.length)
            return undefined;
        let array;
        if (index >= this.getTailOffset()) {
            array = this.tail;
        }
        else {
            let cursor = this.root;
            for (let level = this.shift; level > 0; level -= BIT_WIDTH) {
                // This cast is fine because we checked the length prior
                cursor = cursor.array[(index >>> level) & BIT_MASK];
            }
            array = cursor.array;
        }
        return array[index & BIT_MASK];
    }
    /**
     * O(log_32(N)) Return a new vector with an element set to a new value.
     *
     * This will do nothing if the index is negative, or out of the bounds of the vector.
     *
     * @param index the index to set
     * @param value the value to set at that index
     */
    set(index, value) {
        if (index < 0 || index >= this.length)
            return this;
        if (index >= this.getTailOffset()) {
            const newTail = [...this.tail];
            newTail[index & BIT_MASK] = value;
            // The element is updated in the tail
            // The root is not changed
            return new PersistentVector(this.root, this.shift, newTail, this.length);
        }
        const base = copyNode(this.root);
        let cursor = base;
        for (let level = this.shift; level > 0; level -= BIT_WIDTH) {
            const subIndex = (index >>> level) & BIT_MASK;
            // This cast is fine because we checked the length prior
            const next = copyNode(cursor.array[subIndex]);
            cursor.array[subIndex] = next;
            cursor = next;
        }
        cursor.array[index & BIT_MASK] = value;
        // tail is not changed
        return new PersistentVector(base, this.shift, this.tail, this.length);
    }
    /**
     * O(log_32(N)) Append a value to the end of this vector.
     *
     * This is useful for building up a vector from values.
     *
     * @param value the value to push to the end of the vector
     */
    push(value) {
        if (this.getTailLength() < BRANCH_SIZE) {
            // has space in tail
            const newTail = [...this.tail];
            newTail[this.length % BRANCH_SIZE] = value;
            // The element is added to the tail
            // The root is not changed
            return new PersistentVector(this.root, this.shift, newTail, this.length + 1);
        }
        // There's not enough space in the tail
        let base;
        let levelShift = this.shift;
        if (isFullBranch(this.length - BRANCH_SIZE)) {
            base = emptyNode();
            base.array[0] = this.root;
            levelShift += BIT_WIDTH;
        }
        else {
            base = copyNode(this.root);
        }
        // getTailOffset is actually the 1st item in tail
        // we now move it to the tree
        const index = this.getTailOffset();
        let cursor = base;
        for (let level = levelShift; level > 0; level -= BIT_WIDTH) {
            const subIndex = (index >>> level) & BIT_MASK;
            let next = cursor.array[subIndex];
            if (!next) {
                next = emptyNode();
            }
            else {
                next = copyNode(next);
            }
            cursor.array[subIndex] = next;
            cursor = next;
        }
        // it's safe to update cursor bc "next" is a new instance anyway
        cursor.array = [...this.tail];
        return new PersistentVector(base, levelShift, [value, ...Array(BRANCH_SIZE - 1).fill(undefined)], this.length + 1);
    }
    /**
     * Return a new Vector with the last element removed.
     *
     * This does nothing if the Vector contains no elements.
     */
    pop() {
        if (this.length === 0)
            return this;
        // we always have a non-empty tail
        const tailLength = this.getTailLength();
        if (tailLength >= 2) {
            // ignore the last item
            const newTailLength = (this.length - 1) % BRANCH_SIZE;
            const newTail = [
                ...this.tail.slice(0, newTailLength),
                ...Array(BRANCH_SIZE - newTailLength).fill(undefined),
            ];
            return new PersistentVector(this.root, this.shift, newTail, this.length - 1);
        }
        // tail has exactly 1 item, promote the right most leaf node as tail
        const lastItemIndexInTree = this.getTailOffset() - 1;
        // Tree has no item
        if (lastItemIndexInTree < 0) {
            return PersistentVector.empty;
        }
        const base = copyNode(this.root);
        let cursor = base;
        // we always have a parent bc we create an empty branch initially
        let parent = undefined;
        let subIndex;
        for (let level = this.shift; level > 0; level -= BIT_WIDTH) {
            subIndex = (lastItemIndexInTree >>> level) & BIT_MASK;
            // This cast is fine because we checked the length prior
            const next = copyNode(cursor.array[subIndex]);
            cursor.array[subIndex] = next;
            parent = cursor;
            cursor = next;
        }
        const newTail = [...cursor.array];
        parent.array[subIndex] = emptyNode();
        let newLevelShift = this.shift;
        let newRoot = base;
        if (isFullBranch(this.length - 1 - BRANCH_SIZE)) {
            newRoot = base.array[0];
            newLevelShift -= BIT_WIDTH;
        }
        return new PersistentVector(copyNode(newRoot), newLevelShift, newTail, this.length - 1);
    }
    *keys() {
        yield* Array.from({ length: this.length }, (_, i) => i);
    }
    *values() {
        function* iterateNodeValues(node, level) {
            if (level <= 0) {
                yield* node.array.filter((i) => i != null);
            }
            else {
                for (const child of node.array.filter((i) => i != null)) {
                    yield* iterateNodeValues(child, level - BIT_WIDTH);
                }
            }
        }
        yield* iterateNodeValues(this.root, this.shift);
        yield* this.tail.slice(0, this.getTailLength());
    }
    /**
     * Implement Iterable interface.
     */
    *[Symbol.iterator]() {
        yield* this.toArray();
    }
    /**
     */
    forEach(func) {
        this.toArray().forEach(func);
    }
    /**
     * Map to an array of T2.
     */
    map(func) {
        return this.toArray().map(func);
    }
    /**
     * Convert to regular typescript array
     */
    toArray() {
        const values = [];
        iterateNodeValues(this.root, this.shift, values);
        values.push(...this.tail.slice(0, this.getTailLength()));
        return values;
    }
    /**
     * Clone to a new vector.
     */
    clone() {
        return new PersistentVector(this.root, this.shift, this.tail, this.length);
    }
    getTailLength() {
        return this.length - this.getTailOffset();
    }
    /**
     * Returns the first index of the tail, also the number of the leaf elements in the tree
     */
    getTailOffset() {
        return this.length < BRANCH_SIZE ? 0 : ((this.length - 1) >>> BIT_WIDTH) << BIT_WIDTH;
    }
}
exports.PersistentVector = PersistentVector;
/**
 * The empty vector
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
PersistentVector.empty = new PersistentVector(emptyNode(), DEFAULT_LEVEL_SHIFT, Array(BRANCH_SIZE).fill(undefined), 0);
/**
 * A TransientVector is a collection of values indexed by contiguous integers.
 * TransientVectors support access to items by index in log32N hops.
 */
class TransientVector {
    constructor(root, shift, tail, length) {
        this.root = root;
        this.shift = shift;
        this.tail = tail;
        this.length = length;
    }
    /**
     * The empty vector
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static empty() {
        return new TransientVector(emptyNode({ ref: true }), DEFAULT_LEVEL_SHIFT, Array(BRANCH_SIZE).fill(undefined), 0);
    }
    /**
     * Create a new vector containing certain elements.
     *
     * @param values the values that this vector will contain
     */
    static from(values) {
        let acc = TransientVector.empty();
        for (const v of values)
            acc = acc.push(v);
        return acc;
    }
    ensureEditable() {
        if (!this.root.edit.ref) {
            throw new Error("Transient used after persistent call");
        }
    }
    persistent() {
        this.ensureEditable();
        this.root.edit.ref = false;
        const trimmedTail = this.tail.slice(0, this.getTailLength());
        return new PersistentVector(this.root, this.shift, trimmedTail, this.length);
    }
    /**
     * O(log_32(N)) Return the value at a certain index, if it exists.
     *
     * Returns `undefined` if the index is out of the vector's bounds.
     *
     * @param index the index to look up
     */
    get(index) {
        if (index < 0 || index >= this.length)
            return undefined;
        let array;
        if (index >= this.getTailOffset()) {
            array = this.tail;
        }
        else {
            let cursor = this.root;
            for (let level = this.shift; level > 0; level -= BIT_WIDTH) {
                // This cast is fine because we checked the length prior
                cursor = cursor.array[(index >>> level) & BIT_MASK];
            }
            array = cursor.array;
        }
        return array[index & BIT_MASK];
    }
    /**
     * O(log_32(N)) Return a new vector with an element set to a new value.
     *
     * This will do nothing if the index is negative, or out of the bounds of the vector.
     *
     * @param index the index to set
     * @param value the value to set at that index
     */
    set(index, value) {
        this.ensureEditable();
        if (index < 0 || index >= this.length)
            return this;
        if (index >= this.getTailOffset()) {
            this.tail[index & BIT_MASK] = value;
            // The element is updated in the tail
            // The root is not changed
            return this;
        }
        let cursor = this.root;
        for (let level = this.shift; level > 0; level -= BIT_WIDTH) {
            const subIndex = (index >>> level) & BIT_MASK;
            // This cast is fine because we checked the length prior
            const next = ensureEditable(cursor.array[subIndex], this.root.edit);
            cursor.array[subIndex] = next;
            cursor = next;
        }
        cursor.array[index & BIT_MASK] = value;
        // tail is not changed
        return this;
    }
    /**
     * O(log_32(N)) Append a value to the end of this vector.
     *
     * This is useful for building up a vector from values.
     *
     * @param value the value to push to the end of the vector
     */
    push(value) {
        this.ensureEditable();
        if (this.getTailLength() < BRANCH_SIZE) {
            // has space in tail
            this.tail[this.length % BRANCH_SIZE] = value;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.length += 1;
            // The element is added to the tail
            // The root is not changed
            return this;
        }
        // There's not enough space in the tail
        if (isFullBranch(this.length - BRANCH_SIZE)) {
            const base = emptyNode(this.root.edit);
            base.array[0] = this.root;
            this.shift += BIT_WIDTH;
            this.root = base;
        }
        // getTailOffset is actually the 1st item in tail
        // we now move it to the tree
        const index = this.getTailOffset();
        let cursor = this.root;
        for (let level = this.shift; level > 0; level -= BIT_WIDTH) {
            const subIndex = (index >>> level) & BIT_MASK;
            let next = cursor.array[subIndex];
            if (!next) {
                next = emptyNode(this.root.edit);
            }
            else {
                next = ensureEditable(next, this.root.edit);
            }
            cursor.array[subIndex] = next;
            cursor = next;
        }
        // it's safe to update cursor bc "next" is a new instance anyway
        cursor.array = this.tail;
        this.tail = [value, ...Array(BRANCH_SIZE - 1).fill(undefined)];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.length += 1;
        return this;
    }
    /**
     * Return a new Vector with the last element removed.
     *
     * This does nothing if the Vector contains no elements.
     */
    pop() {
        this.ensureEditable();
        if (this.length === 0)
            return this;
        // we always have a non-empty tail
        const tailLength = this.getTailLength();
        if (tailLength >= 2) {
            delete this.tail[tailLength - 1];
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.length -= 1;
            return this;
        }
        // tail has exactly 1 item, promote the right most leaf node as tail
        const lastItemIndexInTree = this.getTailOffset() - 1;
        // Tree has no item
        if (lastItemIndexInTree < 0) {
            return TransientVector.empty();
        }
        let cursor = this.root;
        // we always have a parent bc we create an empty branch initially
        let parent = undefined;
        let subIndex;
        for (let level = this.shift; level > 0; level -= BIT_WIDTH) {
            subIndex = (lastItemIndexInTree >>> level) & BIT_MASK;
            // This cast is fine because we checked the length prior
            const next = ensureEditable(cursor.array[subIndex], this.root.edit);
            cursor.array[subIndex] = next;
            parent = cursor;
            cursor = next;
        }
        this.tail = cursor.array;
        parent.array[subIndex] = emptyNode(this.root.edit);
        if (isFullBranch(this.length - 1 - BRANCH_SIZE)) {
            this.root = this.root.array[0];
            this.shift -= BIT_WIDTH;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.length -= 1;
        return this;
    }
    *keys() {
        yield* Array.from({ length: this.length }, (_, i) => i);
    }
    *values() {
        function* iterateNodeValues(node, level) {
            if (level <= 0) {
                yield* node.array.filter((i) => i != null);
            }
            else {
                for (const child of node.array.filter((i) => i != null)) {
                    yield* iterateNodeValues(child, level - BIT_WIDTH);
                }
            }
        }
        yield* iterateNodeValues(this.root, this.shift);
        yield* this.tail.slice(0, this.getTailLength());
    }
    /**
     * Implement Iterable interface.
     */
    *[Symbol.iterator]() {
        yield* this.toArray();
    }
    /**
     */
    forEach(func) {
        this.toArray().forEach(func);
    }
    /**
     * Map to an array of T2.
     */
    map(func) {
        return this.toArray().map(func);
    }
    /**
     * Convert to regular typescript array
     */
    toArray() {
        const values = [];
        iterateNodeValues(this.root, this.shift, values);
        values.push(...this.tail.slice(0, this.getTailLength()));
        return values;
    }
    /**
     * Clone to a new vector.
     */
    clone() {
        return new TransientVector(this.root, this.shift, this.tail, this.length);
    }
    getTailLength() {
        return this.length - this.getTailOffset();
    }
    /**
     * Returns the first index of the tail, also the number of the leaf elements in the tree
     */
    getTailOffset() {
        return this.length < BRANCH_SIZE ? 0 : ((this.length - 1) >>> BIT_WIDTH) << BIT_WIDTH;
    }
}
exports.TransientVector = TransientVector;
/**
 * Recursively loop through the nodes and push node to values array.
 */
function iterateNodeValues(node, level, values) {
    if (!node) {
        return;
    }
    if (level <= 0) {
        for (const t of node.array) {
            if (t != null) {
                values.push(t);
            }
        }
    }
    else {
        for (const child of node.array) {
            if (child !== null) {
                iterateNodeValues(child, level - BIT_WIDTH, values);
            }
        }
    }
}
