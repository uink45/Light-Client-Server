/**
 * List<T> represents an immutable list containing values of type T.
 *
 * This class is implemented as a singly linked-list, with all the caveats involved.
 *
 * This class is best used when many values need to be stored and then consumed
 * linearly in a first-in-last-out fashion. If direct indexing or quick storing
 * at the front and back is needed, then a list isn't the best choice.
 *
 * Because a List is Iterable, you can loop over it using `for of` and use the spread operator.
 */
export declare class List<T> implements Iterable<T> {
    private readonly _node;
    private constructor();
    /**
     * O(1) Create a new empty list.
     */
    static empty<T>(): List<T>;
    /**
     * O(N) Create a list from an array of values.
     *
     * @param values an array of values the list will contain, in the same order
     */
    static of<T>(...values: T[]): List<T>;
    /**
     * Check whether or not a list is empty.
     *
     * This is equivalent to checking if a list has no elements.
     */
    isEmpty(): boolean;
    /**
     * O(1) Add a new value to the front of the list.
     *
     * @param value the value to add to the front of the list
     */
    prepend(value: T): List<T>;
    /**
     * O(1) Get the value at the front of the list, if it exists.
     *
     * This function will return null if `isEmpty()` returns
     * true, or if the value at the front of the list happens to be
     * `null`. Because of this, be careful when storing values that might
     * be `null` inside the list, because this function may return `null`
     * even if the list isn't empty.
     */
    head(): T | null;
    /**
     * O(1) Return a list containing the values past the head of the list.
     *
     * For example: `List.of(1, 2).tail()` gives `List.of(2)`.
     *
     * If the list is empty, this method returns an empty list.
     *
     * `l.tail().prepend(l.head())` will always be `l` for any non-empty list `l`.
     */
    tail(): List<T>;
    /**
     * O(amount) Take a certain number of elements from the front of a List.
     *
     * If the amount is 0, and empty list is returned. Negative numbers are treated
     * the same way.
     *
     * If the list has less than the amount taken, the entire list is taken.
     *
     * @param amount the number of elements to take from the front of the list
     */
    take(amount: number): List<T>;
    /**
     * O(amount) Return a list with `amount` elements removed from the front.
     *
     * If `amount` is greater than or equal to the size of the list,
     * an empty list is returned.
     *
     * If `amount` is less than or equal to 0, the list is returned without modification.
     *
     * `l.drop(1)` is always equal to `l.tail()`.
     *
     * @param amount the number of elements to drop
     */
    drop(amount: number): List<T>;
    /**
     * O(Nthis) Concatenate this list and another.
     *
     * This returns a list containing all the elements in `this` followed
     * by all the elements in `that`.
     *
     * This could be done via `List.of(...this, ...that)` but this would
     * copy the elements of both lists, whereas this implementation only
     * needs to copy elements from the first list.
     *
     * @param that the list to append to this list
     */
    concat(that: List<T>): List<T>;
    [Symbol.iterator](): Iterator<T>;
    /**
     * O(N) Test whether or not a list is logically equal to another.
     *
     * This returns true if the lists have the same size, and each element in a given
     * position is `===` to the element in the same position in the other list.
     *
     * @param that the list to compare for equality with this one.
     */
    equals(that: List<T>): boolean;
}
//# sourceMappingURL=List.d.ts.map