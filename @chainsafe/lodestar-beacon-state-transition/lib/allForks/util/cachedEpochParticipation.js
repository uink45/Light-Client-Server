"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedEpochParticipationProxyHandler = exports.CachedEpochParticipation = exports.fromParticipationFlags = exports.toParticipationFlags = void 0;
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const unsafeUint8ArrayToTree_1 = require("./unsafeUint8ArrayToTree");
/** Same to https://github.com/ethereum/eth2.0-specs/blob/v1.1.0-alpha.5/specs/altair/beacon-chain.md#has_flag */
const TIMELY_SOURCE = 1 << lodestar_params_1.TIMELY_SOURCE_FLAG_INDEX;
const TIMELY_TARGET = 1 << lodestar_params_1.TIMELY_TARGET_FLAG_INDEX;
const TIMELY_HEAD = 1 << lodestar_params_1.TIMELY_HEAD_FLAG_INDEX;
// TODO: No need to do math! All these operations can be cached before hand in a giant if
function toParticipationFlags(data) {
    return ((data.timelySource && TIMELY_SOURCE) |
        (data.timelyHead && TIMELY_HEAD) |
        (data.timelyTarget && TIMELY_TARGET));
}
exports.toParticipationFlags = toParticipationFlags;
function fromParticipationFlags(flags) {
    return {
        timelySource: (TIMELY_SOURCE & flags) === TIMELY_SOURCE,
        timelyTarget: (TIMELY_TARGET & flags) === TIMELY_TARGET,
        timelyHead: (TIMELY_HEAD & flags) === TIMELY_HEAD,
    };
}
exports.fromParticipationFlags = fromParticipationFlags;
class CachedEpochParticipation {
    constructor(opts) {
        this.type = opts.type;
        this.tree = opts.tree;
        this.persistent = opts.persistent;
    }
    get length() {
        return this.persistent.length;
    }
    get(index) {
        const inclusionData = this.getStatus(index);
        if (!inclusionData)
            return undefined;
        return toParticipationFlags(inclusionData);
    }
    set(index, value) {
        this.persistent.set(index, fromParticipationFlags(value));
        if (this.type && this.tree)
            this.type.tree_setProperty(this.tree, index, value);
    }
    getStatus(index) {
        var _a;
        return (_a = this.persistent.get(index)) !== null && _a !== void 0 ? _a : undefined;
    }
    setStatus(index, data) {
        if (this.type && this.tree)
            this.type.tree_setProperty(this.tree, index, toParticipationFlags(data));
        return this.persistent.set(index, data);
    }
    updateAllStatus(data) {
        this.persistent.vector = data;
        if (this.type && this.tree) {
            const packedData = new Uint8Array(data.length);
            data.forEach((d, i) => (packedData[i] = toParticipationFlags(d)));
            this.tree.rootNode = (0, unsafeUint8ArrayToTree_1.unsafeUint8ArrayToTree)(packedData, this.type.getChunkDepth());
            this.type.tree_setLength(this.tree, data.length);
        }
    }
    pushStatus(data) {
        this.persistent.push(data);
        if (this.type && this.tree)
            this.type.tree_push(this.tree, toParticipationFlags(data));
    }
    push(value) {
        this.pushStatus(fromParticipationFlags(value));
        return this.persistent.length;
    }
    pop() {
        const popped = this.persistent.pop();
        if (this.type && this.tree)
            this.type.tree_pop(this.tree);
        if (!popped)
            return undefined;
        return toParticipationFlags(popped);
    }
    *[Symbol.iterator]() {
        for (const data of this.persistent) {
            yield toParticipationFlags(data);
        }
    }
    *iterateStatus() {
        yield* this.persistent[Symbol.iterator]();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    find(fn) {
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    findIndex(fn) {
        return -1;
    }
    forEach(fn) {
        this.persistent.forEach((value, index) => fn(toParticipationFlags(value), index));
    }
    map(fn) {
        return this.persistent.map((value, index) => fn(toParticipationFlags(value), index));
    }
    forEachStatus(fn) {
        this.persistent.forEach(fn);
    }
    mapStatus(fn) {
        return this.persistent.map((value, index) => fn(value, index));
    }
}
exports.CachedEpochParticipation = CachedEpochParticipation;
// eslint-disable-next-line @typescript-eslint/naming-convention
exports.CachedEpochParticipationProxyHandler = {
    get(target, key) {
        if (!Number.isNaN(Number(String(key)))) {
            return target.get(key);
        }
        else if (target[key] !== undefined) {
            return target[key];
        }
        else {
            if (target.type && target.tree) {
                const treeBacked = target.type.createTreeBacked(target.tree);
                if (key in treeBacked) {
                    return treeBacked[key];
                }
            }
            return undefined;
        }
    },
    set(target, key, value) {
        if (!Number.isNaN(Number(key))) {
            target.set(key, value);
            return true;
        }
        return false;
    },
};
//# sourceMappingURL=cachedEpochParticipation.js.map