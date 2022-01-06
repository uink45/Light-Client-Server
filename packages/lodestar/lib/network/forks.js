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
 */
exports.FORK_EPOCH_LOOKAHEAD = 2;
/**
 * Return the list of `ForkName`s meant to be active at `epoch`
 */
function getActiveForks(config, epoch) {
    // Compute prev and next fork shifted, so next fork is still next at forkEpoch + FORK_EPOCH_LOOKAHEAD
    const forks = getCurrentAndNextFork(config, epoch - exports.FORK_EPOCH_LOOKAHEAD - 1);
    // Before fork is scheduled
    if (!forks.nextFork) {
        return [forks.currentFork.name];
    }
    const prevFork = forks.currentFork.name;
    const nextFork = forks.nextFork.name;
    const forkEpoch = forks.nextFork.epoch;
    // Way before fork
    if (epoch < forkEpoch - exports.FORK_EPOCH_LOOKAHEAD)
        return [prevFork];
    // Way after fork
    if (epoch > forkEpoch + exports.FORK_EPOCH_LOOKAHEAD)
        return [nextFork];
    // During fork transition
    return [prevFork, nextFork];
}
exports.getActiveForks = getActiveForks;
/**
 * Return the currentFork and nextFork given a fork schedule and `epoch`
 */
function getCurrentAndNextFork(config, epoch) {
    if (epoch < 0)
        epoch = 0;
    // NOTE: forks are sorted by ascending epoch, phase0 first
    const forks = Object.values(config.forks);
    let currentForkIdx = -1;
    // findLastIndex
    for (let i = 0; i < forks.length; i++) {
        if (epoch >= forks[i].epoch)
            currentForkIdx = i;
    }
    const nextForkIdx = currentForkIdx + 1;
    const hasNextFork = forks[nextForkIdx] !== undefined && forks[nextForkIdx].epoch !== Infinity;
    return {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        currentFork: forks[currentForkIdx] || forks[0],
        nextFork: hasNextFork ? forks[nextForkIdx] : undefined,
    };
}
exports.getCurrentAndNextFork = getCurrentAndNextFork;
//# sourceMappingURL=forks.js.map