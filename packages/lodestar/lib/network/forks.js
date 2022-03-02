"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentAndNextFork = exports.getActiveForks = exports.FORK_EPOCH_LOOKAHEAD = void 0;
/**
 * Subscribe topics to the new fork N epochs before the fork. Remove all subscriptions N epochs after the fork
 *
 * This lookahead ensures a smooth fork transition. During `FORK_EPOCH_LOOKAHEAD` both forks will be active.
 *
 * ```
 *    phase0     phase0     phase0       -
 *      -        altair     altair     altair
 * |----------|----------|----------|----------|
 * 0        fork-2      fork      fork+2       oo
 * ```
 *
 * It the fork epochs are very close to each other there may more than two active at once
 *
 * ```
 *   f0    f0   f0    f0   f0    -
 *   -     fa   fa    fa   fa    fa   -
 *   -     -    fb    fb   fb    fb   fb
 *
 *     forka-2    forka      forka+2
 * |     |          |          |
 * |----------|----------|----------|----------|
 * 0        forkb-2    forkb      forkb+2      oo
 * ```
 */
exports.FORK_EPOCH_LOOKAHEAD = 2;
/**
 * Return the list of `ForkName`s meant to be active at `epoch`
 * @see FORK_EPOCH_LOOKAHEAD for details on when forks are considered 'active'
 */
function getActiveForks(config, epoch) {
    const activeForks = [];
    const forks = config.forksAscendingEpochOrder;
    for (let i = 0; i < forks.length; i++) {
        const currForkEpoch = forks[i].epoch;
        const nextForkEpoch = i >= forks.length - 1 ? Infinity : forks[i + 1].epoch;
        // Edge case: If multiple forks start at the same epoch, only consider the latest one
        if (currForkEpoch === nextForkEpoch) {
            continue;
        }
        if (epoch >= currForkEpoch - exports.FORK_EPOCH_LOOKAHEAD && epoch <= nextForkEpoch + exports.FORK_EPOCH_LOOKAHEAD) {
            activeForks.push(forks[i].name);
        }
    }
    return activeForks;
}
exports.getActiveForks = getActiveForks;
/**
 * Return the currentFork and nextFork given a fork schedule and `epoch`
 */
function getCurrentAndNextFork(config, epoch) {
    if (epoch < 0) {
        epoch = 0;
    }
    // NOTE: forks are sorted by ascending epoch, phase0 first
    const forks = config.forksAscendingEpochOrder;
    let currentForkIdx = -1;
    // findLastIndex
    for (let i = 0; i < forks.length; i++) {
        if (epoch >= forks[i].epoch)
            currentForkIdx = i;
    }
    let nextForkIdx = currentForkIdx + 1;
    const hasNextFork = forks[nextForkIdx] !== undefined && forks[nextForkIdx].epoch !== Infinity;
    // Keep moving the needle of nextForkIdx if there the higher fork also exists on same epoch
    // for e.g. altair and bellatrix are on same epoch 6, next fork should be bellatrix
    if (hasNextFork) {
        for (let i = nextForkIdx + 1; i < forks.length; i++) {
            // If the fork's epoch is same as nextForkIdx (which is not equal to infinity),
            // update nextForkIdx to the same
            if (forks[i].epoch === forks[nextForkIdx].epoch)
                nextForkIdx = i;
        }
    }
    return {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        currentFork: forks[currentForkIdx] || forks[0],
        nextFork: hasNextFork ? forks[nextForkIdx] : undefined,
    };
}
exports.getCurrentAndNextFork = getCurrentAndNextFork;
//# sourceMappingURL=forks.js.map