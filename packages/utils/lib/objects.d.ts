export declare function isPlainObject(o: unknown): boolean;
/**
 * Creates an object with the same keys as object and values generated by running each own enumerable
 * string keyed property of object thru iteratee.
 *
 * Inspired on lodash.mapValues, see https://lodash.com/docs/4.17.15#mapValues
 */
export declare function mapValues<T extends {
    [K: string]: any;
}, R>(obj: T, iteratee: (value: T[keyof T], key: keyof T) => R): {
    [K in keyof T]: R;
};
export declare function objectToExpectedCase<T extends Record<string, unknown> | Record<string, unknown>[]>(obj: T, expectedCase?: "snake" | "constant" | "camel" | "param" | "header" | "pascal" | "dot" | "notransform"): T;
//# sourceMappingURL=objects.d.ts.map