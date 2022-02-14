import { Json } from "@chainsafe/ssz";
export declare const CIRCULAR_REFERENCE_TAG = "CIRCULAR_REFERENCE";
export declare function toJson(arg: unknown, refs?: WeakMap<object, any>): Json;
export declare function toString(json: Json, nested?: boolean): string;
//# sourceMappingURL=json.d.ts.map