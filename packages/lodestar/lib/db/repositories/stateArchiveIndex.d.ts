/// <reference types="node" />
import { Db } from "@chainsafe/lodestar-db";
import { Root, Slot } from "@chainsafe/lodestar-types";
export declare function storeRootIndex(db: Db, slot: Slot, stateRoot: Root): Promise<void>;
export declare function getRootIndexKey(root: Root): Buffer;
//# sourceMappingURL=stateArchiveIndex.d.ts.map