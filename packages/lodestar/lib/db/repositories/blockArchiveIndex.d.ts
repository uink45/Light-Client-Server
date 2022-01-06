/// <reference types="node" />
import { Db } from "@chainsafe/lodestar-db";
import { Slot, Root, allForks } from "@chainsafe/lodestar-types";
import { ContainerType } from "@chainsafe/ssz";
export declare function storeRootIndex(db: Db, slot: Slot, blockRoot: Root): Promise<void>;
export declare function storeParentRootIndex(db: Db, slot: Slot, parentRoot: Root): Promise<void>;
export declare function deleteRootIndex(db: Db, blockType: ContainerType<allForks.SignedBeaconBlock>, block: allForks.SignedBeaconBlock): Promise<void>;
export declare function deleteParentRootIndex(db: Db, block: allForks.SignedBeaconBlock): Promise<void>;
export declare function getParentRootIndexKey(parentRoot: Root): Buffer;
export declare function getRootIndexKey(root: Root): Buffer;
//# sourceMappingURL=blockArchiveIndex.d.ts.map