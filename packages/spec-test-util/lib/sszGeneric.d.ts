import { Type } from "@chainsafe/ssz";
export interface IValidTestcase<T> {
    path: string;
    root: Uint8Array;
    serialized: Uint8Array;
    value: T;
}
export interface IInvalidTestcase {
    path: string;
    serialized: Uint8Array;
}
export declare function parseValidTestcase<T>(path: string, type: Type<T>): IValidTestcase<T>;
export declare function parseInvalidTestcase(path: string): IInvalidTestcase;
export declare function getValidTestcases<T>(path: string, prefix: string, type: Type<T>): IValidTestcase<T>[];
export declare function getInvalidTestcases(path: string, prefix: string): IInvalidTestcase[];
//# sourceMappingURL=sszGeneric.d.ts.map