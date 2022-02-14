"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutableVector = void 0;
const Vector_1 = require("./Vector");
/**
 * A mutable reference to a PersistentVector or TransientVector
 */
class MutableVector {
    constructor(vector) {
        this.vector = vector;
    }
    static empty() {
        return new MutableVector(Vector_1.PersistentVector.empty);
    }
    static from(values) {
        return new MutableVector(Vector_1.PersistentVector.from(values));
    }
    asTransient() {
        if (this.vector.asTransient) {
            this.vector = this.vector.asTransient();
        }
        return this;
    }
    asPersistent() {
        if (this.vector.persistent) {
            this.vector = this.vector.persistent();
        }
        return this;
    }
    get length() {
        return this.vector.length;
    }
    get(index) {
        return this.vector.get(index);
    }
    set(index, value) {
        this.vector = this.vector.set(index, value);
    }
    update(index, value) {
        const updated = {
            ...this.vector.get(index),
            ...value,
        };
        this.vector = this.vector.set(index, updated);
        return updated;
    }
    push(value) {
        this.vector = this.vector.push(value);
    }
    pop() {
        const last = this.vector.get(this.vector.length - 1);
        this.vector = this.vector.pop();
        return last !== null && last !== void 0 ? last : undefined;
    }
    *[Symbol.iterator]() {
        yield* this.vector[Symbol.iterator]();
    }
    forEach(func) {
        this.vector.forEach(func);
    }
    map(func) {
        return this.vector.map(func);
    }
    clone() {
        this.asPersistent();
        return new MutableVector(this.vector);
    }
    toArray() {
        return this.vector.toArray();
    }
}
exports.MutableVector = MutableVector;
