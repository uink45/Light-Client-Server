import { Slot } from "@chainsafe/lodestar-types";
import { IBeaconChain } from "../../../chain";
import { SyncChain } from "../chain";
/**
 * Checks if a Finalized or Head chain should be removed
 */
export declare function shouldRemoveChain(syncChain: SyncChain, localFinalizedSlot: Slot, chain: IBeaconChain): boolean;
//# sourceMappingURL=shouldRemoveChain.d.ts.map