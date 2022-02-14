/// <reference types="node" />
import { EventEmitter } from "events";
import StrictEventEmitter from "strict-event-emitter-types";
import { ENR, NodeId } from "../enr";
export interface IBucketEvents {
    /**
     * The least-recently connected enr that is currently considered disconnected and whose corresponding peer
     * should be checked for connectivity in order to prevent it from being evicted.
     *
     * If connectivity to the peer is re-established the corresponding entry should be updated with EntryStatus.Connected
     *
     * If this entry's status is not updated after some timeout, it will be evicted
     */
    pendingEviction: (enr: ENR) => void;
    /**
     * The result of applying a pending node to a bucket, possibly (most likely) replacing an existing node
     */
    appliedEviction: (inserted: ENR, evicted?: ENR) => void;
}
export declare type BucketEventEmitter = StrictEventEmitter<EventEmitter, IBucketEvents>;
/** The result of inserting an entry into a bucket. */
export declare enum InsertResult {
    /** The entry has been sucessfully inserted */
    Inserted = 0,
    /**
     * The entry is pending insertion because the relevant bucket is currently full.
     *
     * The entry is inserted after a timeout elapsed, if the status of the least-recently connected
     * (and currently disconnected) node in the bucket is not updated before the timeout expires.
     */
    Pending = 1,
    /** The node existed and the status was updated */
    StatusUpdated = 2,
    /** The node existed and the status was updated and the node was promoted to a connected state */
    StatusUpdatedAndPromoted = 3,
    /** The node existed and the value was updated. */
    ValueUpdated = 4,
    /** Both the status and value were updated. */
    Updated = 5,
    /** Both the status and value were promoted and the node was promoted to a connected state */
    UpdatedAndPromoted = 6,
    /** The pending slot was updated. */
    UpdatedPending = 7,
    /** The entry was not inserted because the relevant bucket is full. */
    FailedBucketFull = 8,
    /** Cannot update self */
    FailedInvalidSelfUpdate = 9,
    /** The entry already exists. */
    NodeExists = 10
}
/** The result of performing an update on a bucket. */
export declare enum UpdateResult {
    /** The node was updated successfully */
    Updated = 0,
    /** The update promited the node to a connected state from a disconnected state. */
    UpdatedAndPromoted = 1,
    /** The pending entry was updated. */
    UpdatedPending = 2,
    /** The update removed the node. The node didn't exist. */
    FailedKeyNonExistant = 3,
    /** The update removed the node. The bucket was full. */
    FailedBucketFull = 4,
    /** There were no changes made to the value of the node. */
    NotModified = 5
}
export declare enum EntryStatus {
    Connected = 0,
    Disconnected = 1
}
export interface IEntry<T> {
    status: EntryStatus;
    value: T;
}
export interface IEntryFull<T> {
    status: EntryStatus;
    pending: boolean;
    value: T;
}
export interface ILookupConfig {
    /**
     * Allowed level of parallelism.
     *
     * The alpha parameter in the kademlia paper. The maximum number of peers that a query
     * is allowed to wait for in parallel while iterating towards the closes nodes to a target.
     *
     * Default is 3
     */
    lookupParallelism: number;
    /**
     * Amount of distances requested in a single Findnode message for a lookup or query
     */
    lookupRequestLimit: number;
    /**
     * Number of results to produce.
     *
     * The number of closest peers that a query must obtain successful results for before it terminates.
     * Defaults to the maximum number of entries in a single kbucket.
     */
    lookupNumResults: number;
    /**
     * Maximum amount of time to spend on a single lookup
     *
     * Declared in milliseconds
     */
    lookupTimeout: number;
}
export interface ILookupEvents {
    peer: (peer: NodeId) => void;
    finished: (closest: NodeId[]) => void;
}
export declare type LookupEventEmitter = StrictEventEmitter<EventEmitter, ILookupEvents>;
export declare enum LookupState {
    /**
     * The query is making progress by iterating towards `numResults` closest peers
     * to the target with a maximum of `parallelism` peers at a time
     */
    Iterating = 0,
    /**
     * A query is stalled when it did not make progress after `parallelism` consecutive
     * successful results.
     *
     * While the query is stalled, the maximum allowed parallelism for pending results
     * is increased to numResults in an attempt to finish the query.
     * If the query can make progress again upon receiving the remaining results,
     * it switches back to `Iterating`. Otherwise it will be finished.
     */
    Stalled = 1,
    /**
     * The query is finished.
     *
     * A query finishes either when it has collected `numResults` results from the
     * closes peers (not counting those that failed or are unresponsive)
     * or because the query ran out of peers that have not yet delivered results (or failed).
     */
    Finished = 2
}
export interface ILookupPeer {
    /**
     * The kbucket key used to identify the peer
     */
    nodeId: NodeId;
    /**
     * The number of peers that have  been returned by this peer
     */
    peersReturned: number;
    /**
     * The current lookup state of this peer
     */
    state: LookupPeerState;
}
export declare enum LookupPeerState {
    /**
     * The peer has not yet been contacted
     *
     * This is the starting state for every peer known or discovered by a lookup
     */
    NotContacted = 0,
    /**
     * The lookup is waiting for a result from the peer
     */
    Waiting = 1,
    /**
     * Obtaining a result from the peer has failed
     */
    Failed = 2,
    /**
     * A successful result from the peer has been delivered
     */
    Succeeded = 3
}
