import { LodestarError } from "@chainsafe/lodestar-utils";
export declare enum GossipAction {
    IGNORE = "IGNORE",
    REJECT = "REJECT"
}
export declare class GossipActionError<T extends {
    code: string;
}> extends LodestarError<T> {
    action: GossipAction;
    constructor(action: GossipAction, type: T);
}
//# sourceMappingURL=gossipValidation.d.ts.map