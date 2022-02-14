import { ContainerType, ITreeBacked, List, TreeBacked } from "@chainsafe/ssz";
import { allForks, Number64, ParticipationFlags } from "@chainsafe/lodestar-types";
import { IBeaconConfig, IChainForkConfig } from "@chainsafe/lodestar-config";
import { Tree } from "@chainsafe/persistent-merkle-tree";
import { MutableVector } from "@chainsafe/persistent-ts";
import { EpochContext, EpochContextOpts } from "./epochContext";
import { BalanceList } from "./balanceList";
import { CachedEpochParticipation, IParticipationStatus } from "./cachedEpochParticipation";
import { IndexedSyncCommittee } from "./indexedSyncCommittee";
import { CachedInactivityScoreList } from "./cachedInactivityScoreList";
/**
 * `BeaconState` with various caches
 *
 * Currently contains the following:
 * - The full list of network params, ssz types, and fork schedule
 * - The ssz type for the state
 * - The full merkle tree representation of the state
 * - A cache of shufflings, committees, proposers, expanded pubkeys
 * - A flat copy of validators (for fast access/iteration)
 *
 * ### BeaconState data representation tradeoffs:
 *
 * Requirements of a BeaconState:
 * - Block processing and epoch processing be performant to not block the node. This functions requires to iterate over
 *   very large arrays fast, while doing random mutations or big mutations. After them the state must be hashed.
 *   Processing times: (ideal / current / maximum)
 *   - block processing: 20ms / 200ms / 500ms
 *   - epoch processing: 200ms / 2s / 4s
 *
 * - BeaconState must be memory efficient. Data should only be represented once in a succint manner. Uint8Arrays are
 *   expensive, native types are not.
 * - BeaconState must be hashed efficiently. Data must be merkelized before hashing so the conversion to merkelized
 *   must be fast or be done already. It must must persist a hashing cache that should be structurally shared between
 *   states for memory efficiency.
 * - BeaconState raw data changes sparsingly, so it should be structurally shared between states for memory efficiency
 *
 * Summary of goals:
 * - Structurally share data + hashing cache
 * - Very fast read and iteration over large arrays
 * - Fast bulk writes and somewhat fast single writes
 * - Fast merkelization of data for hashing
 *
 * #### state.validators
 *
 * 91% of all memory merkelized is state.validators. In normal network conditions state.validators changes rarely.
 * However for epoch processing the entire array must be iterated and read. So we need fast reads and slow writes.
 * Tradeoffs to achieve that:
 * - Represent leaf data with native JS types (deserialized form)
 * - Use a single Tree for structurally sharing leaf data + hashing cache
 * - Keep only the root cached on leaf nodes
 * - Micro-optimizations (TODO):
 *   - Keep also the root of the node above pubkey and withdrawal creds. Will never change
 *   - Keep pubkey + withdrawal creds in the same Uint8Array
 *   - Have a global pubkey + withdrawal creds Uint8Array global cache, like with the index2pubkey cache
 */
export declare type CachedBeaconState<T extends allForks.BeaconState> = BeaconStateContext<T> & EpochContext & ITreeBacked<T> & T;
export declare function createCachedBeaconState<T extends allForks.BeaconState>(chainForkConfig: IChainForkConfig, state: TreeBacked<T>, opts?: EpochContextOpts): CachedBeaconState<T>;
/**
 * Cache useful data associated to a specific state.
 * Optimize processing speed of block processing + gossip validation while having a low memory cost.
 *
 * Previously BeaconStateContext included:
 * ```ts
 * validators: CachedValidatorList & T["validators"];
 * balances: CachedBalanceList & T["balances"];
 * inactivityScores: CachedInactivityScoreList & List<Number64>;
 * ```
 *
 * Those caches where removed since they are no strictly necessary to make the epoch transition faster,
 * but have a high memory cost. Note that all data was duplicated between the Tree and MutableVector.
 * 1. TreeBacked, for efficient hashing
 * 2. MutableVector (persistent-ts) with StructBacked validator objects for fast accessing and iteration
 *
 * ### validators
 * state.validators is the heaviest data structure in the state. As TreeBacked, the leafs account for 91% with
 * 200_000 validators. It requires ~ 2_000_000 Uint8Array instances with total memory of ~ 400MB.
 * However its contents don't change very often. Validators only change when;
 * - they first deposit
 * - they dip from 32 effective balance to 31 (pretty much only when inactive for very long, or slashed)
 * - they activate (once)
 * - they exit (once)
 * - they get slashed (max once)
 *
 * ### balances
 * The balances array completely changes at the epoch boundary, where almost all the validator balances
 * are updated. However it may have tiny changes during block processing if:
 * - On a valid deposit
 * - Validator gets slashed
 * - On altair, the block proposer. Optimized to only happen once per block
 *
 * ### inactivityScores
 * inactivityScores can be changed only:
 * - At the epoch transition. It only changes when a validator is offline. So it may change a bit but not
 *   a lot on normal network conditions.
 * - During block processing, when a validator joins a new 0 entry is pushed
 *
 * RESULT: Don't keep a duplicated structure around always. During block processing just push to the tree. During
 * epoch processing some temporary flat structures are computed but dropped after processing the epoch.
 */
export declare class BeaconStateContext<T extends allForks.BeaconState> {
    config: IBeaconConfig;
    /**
     * Epoch cache: Caches constant data through the epoch: @see EpochContext
     * - Proposer indexes: 32 x Number
     * - Shufflings: 3 x $VALIDATOR_COUNT x Number
     */
    epochCtx: EpochContext;
    /** The BeaconState ssz type */
    type: ContainerType<T>;
    /** The original BeaconState as a Tree */
    tree: Tree;
    /**
     * Returns a BalanceList instance with some convenient methods to work with Tree more efficiently.
     * Notice that we want to work with state.balanceList instead of state.balances.
     *
     * The balances array completely changes at the epoch boundary, where almost all the validator balances
     * are updated. However it may have tiny changes during block processing if:
     * - On a valid deposit
     * - Validator gets slashed?
     * - On altair, the block proposer
     *
     */
    balanceList: BalanceList;
    /**
     * Returns a Proxy to CachedEpochParticipation
     *
     * Stores state<altair>.previousEpochParticipation in two duplicated forms (both structures are structurally shared):
     * 1. TreeBacked, for efficient hashing
     * 2. MutableVector (persistent-ts) with each validator participation flags (uint8) in object form
     *
     * epochParticipation changes continuously through the epoch for each partipation bit of each valid attestation in the state.
     * The entire structure is dropped after two epochs.
     *
     * TODO: Consider representing participation as a uint8 always, and have a fast transformation fuction with precomputed values.
     * Here using a Uint8Array is probably the most efficient way of representing this structure. Then we only need a way to get
     * and set the values fast to the tree. Maybe batching?
     */
    previousEpochParticipation: CachedEpochParticipation & List<ParticipationFlags>;
    /** Same as previousEpochParticipation */
    currentEpochParticipation: CachedEpochParticipation & List<ParticipationFlags>;
    /**
     * Returns a Proxy to IndexedSyncCommittee (Note: phase0 has no sync committee)
     *
     * Stores state<altair>.currentSyncCommittee in two duplicated forms (not structurally shared):
     * 1. TreeBacked, for efficient hashing
     * 2. Indexed data structures
     *   - pubkeys vector (of the committee members)
     *   - aggregatePubkey
     *   - validatorIndices (of the committee members)
     *   - validatorIndexMap: Map of ValidatorIndex -> syncCommitteeIndexes
     *
     * The syncCommittee is immutable and changes as a whole every ~ 27h.
     * It contains fixed 512 members so it's rather small.
     */
    currentSyncCommittee: IndexedSyncCommittee;
    /** Same as currentSyncCommittee */
    nextSyncCommittee: IndexedSyncCommittee;
    /**
     * Returns a Proxy to CachedInactivityScoreList
     *
     * Stores state<altair>.inactivityScores in two duplicated forms (both structures are structurally shared):
     * 1. TreeBacked, for efficient hashing
     * 2. MutableVector (persistent-ts) with a uint64 for each validator
     *
     * inactivityScores can be changed only:
     * - At the epoch transition. It only changes when a validator is offline. So it may change a bit but not
     *   a lot on normal network conditions.
     * - During block processing, when a validator joins a new 0 entry is pushed
     *
     * TODO: Don't keep a duplicated structure around always. During block processing just push to the tree,
     * and maybe batch the changes. Then on process_inactivity_updates() compute the total deltas, and depending
     * on the number of changes convert tree to array, apply diff, write to tree again. Or if there are just a few
     * changes update the tree directly.
     */
    inactivityScores: CachedInactivityScoreList & List<Number64>;
    constructor(type: ContainerType<T>, tree: Tree, previousEpochParticipationCache: MutableVector<IParticipationStatus>, currentEpochParticipationCache: MutableVector<IParticipationStatus>, currentSyncCommittee: IndexedSyncCommittee, nextSyncCommittee: IndexedSyncCommittee, inactivityScoresCache: MutableVector<Number64>, epochCtx: EpochContext);
    clone(): CachedBeaconState<T>;
    rotateSyncCommittee(): void;
    /**
     * Toggle all `MutableVector` caches to use `TransientVector`
     */
    setStateCachesAsTransient(): void;
    /**
     * Toggle all `MutableVector` caches to use `PersistentVector`
     */
    setStateCachesAsPersistent(): void;
}
export declare const CachedBeaconStateProxyHandler: ProxyHandler<CachedBeaconState<allForks.BeaconState>>;
//# sourceMappingURL=cachedBeaconState.d.ts.map