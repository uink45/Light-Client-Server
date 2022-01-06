/**
 * @module db/controller/impl
 */
/// <reference types="node" />
import { LevelUp } from "levelup";
import { ILogger } from "@chainsafe/lodestar-utils";
import { IDatabaseController, IDatabaseOptions, IFilterOptions, IKeyValue } from "./interface";
export interface ILevelDBOptions extends IDatabaseOptions {
    db?: LevelUp;
}
/**
 * The LevelDB implementation of DB
 */
export declare class LevelDbController implements IDatabaseController<Uint8Array, Uint8Array> {
    private status;
    private db;
    private opts;
    private logger;
    constructor(opts: ILevelDBOptions, { logger }: {
        logger: ILogger;
    });
    start(): Promise<void>;
    stop(): Promise<void>;
    clear(): Promise<void>;
    get(key: Buffer): Promise<Buffer | null>;
    put(key: Buffer, value: Buffer): Promise<void>;
    delete(key: Buffer): Promise<void>;
    batchPut(items: IKeyValue<Buffer, Buffer>[]): Promise<void>;
    batchDelete(keys: Buffer[]): Promise<void>;
    keysStream(opts?: IFilterOptions<Buffer>): AsyncGenerator<Buffer>;
    valuesStream(opts?: IFilterOptions<Buffer>): AsyncGenerator<Buffer>;
    entriesStream(opts?: IFilterOptions<Buffer>): AsyncGenerator<IKeyValue<Buffer, Buffer>>;
    keys(opts?: IFilterOptions<Buffer>): Promise<Buffer[]>;
    values(opts?: IFilterOptions<Buffer>): Promise<Buffer[]>;
    entries(opts?: IFilterOptions<Buffer>): Promise<IKeyValue<Buffer, Buffer>[]>;
    /**
     * Turn an abstract-leveldown iterator into an AsyncGenerator.
     * Replaces https://github.com/Level/iterator-stream
     *
     * How to use:
     * - Entries = { keys: true, values: true }
     * - Keys =    { keys: true, values: false }
     * - Values =  { keys: false, values: true }
     */
    private iterator;
}
//# sourceMappingURL=level.d.ts.map