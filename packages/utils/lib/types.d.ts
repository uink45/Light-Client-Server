/**
 * Recursively make all properties optional
 * From https://stackoverflow.com/questions/45372227/how-to-implement-typescript-deep-partial-mapped-type-not-breaking-array-properti/49936686#49936686
 */
export declare type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends Readonly<infer U>[] ? Readonly<RecursivePartial<U>>[] : RecursivePartial<T[P]>;
};
//# sourceMappingURL=types.d.ts.map