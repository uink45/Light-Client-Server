"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtoArray = exports.DEFAULT_PRUNE_THRESHOLD = void 0;
const interface_1 = require("./interface");
const errors_1 = require("./errors");
exports.DEFAULT_PRUNE_THRESHOLD = 0;
class ProtoArray {
    constructor({ pruneThreshold, justifiedEpoch, justifiedRoot, finalizedEpoch, finalizedRoot, }) {
        this.pruneThreshold = pruneThreshold;
        this.justifiedEpoch = justifiedEpoch;
        this.justifiedRoot = justifiedRoot;
        this.finalizedEpoch = finalizedEpoch;
        this.finalizedRoot = finalizedRoot;
        this.nodes = [];
        this.indices = new Map();
    }
    static initialize(block) {
        const protoArray = new ProtoArray({
            pruneThreshold: exports.DEFAULT_PRUNE_THRESHOLD,
            justifiedEpoch: block.justifiedEpoch,
            justifiedRoot: block.justifiedRoot,
            finalizedEpoch: block.finalizedEpoch,
            finalizedRoot: block.finalizedRoot,
        });
        protoArray.onBlock({
            ...block,
            // We are using the blockROot as the targetRoot, since it always lies on an epoch boundary
            targetRoot: block.blockRoot,
        });
        return protoArray;
    }
    /**
     * Iterate backwards through the array, touching all nodes and their parents and potentially
     * the best-child of each parent.
     *
     * The structure of the `self.nodes` array ensures that the child of each node is always
     * touched before its parent.
     *
     * For each node, the following is done:
     *
     * - Update the node's weight with the corresponding delta.
     * - Back-propagate each node's delta to its parents delta.
     * - Compare the current node with the parents best-child, updating it if the current node
     * should become the best child.
     * - If required, update the parents best-descendant with the current node or its best-descendant.
     */
    applyScoreChanges({ deltas, justifiedEpoch, justifiedRoot, finalizedEpoch, finalizedRoot, }) {
        if (deltas.length !== this.indices.size) {
            throw new errors_1.ProtoArrayError({
                code: errors_1.ProtoArrayErrorCode.INVALID_DELTA_LEN,
                deltas: deltas.length,
                indices: this.indices.size,
            });
        }
        if (justifiedEpoch !== this.justifiedEpoch ||
            finalizedEpoch !== this.finalizedEpoch ||
            justifiedRoot !== this.justifiedRoot ||
            finalizedRoot !== this.finalizedRoot) {
            this.justifiedEpoch = justifiedEpoch;
            this.finalizedEpoch = finalizedEpoch;
            this.justifiedRoot = justifiedRoot;
            this.finalizedRoot = finalizedRoot;
        }
        // Iterate backwards through all indices in this.nodes
        for (let nodeIndex = this.nodes.length - 1; nodeIndex >= 0; nodeIndex--) {
            const node = this.nodes[nodeIndex];
            if (node === undefined) {
                throw new errors_1.ProtoArrayError({
                    code: errors_1.ProtoArrayErrorCode.INVALID_NODE_INDEX,
                    index: nodeIndex,
                });
            }
            // There is no need to adjust the balances or manage parent of the zero hash since it
            // is an alias to the genesis block. The weight applied to the genesis block is
            // irrelevant as we _always_ choose it and it's impossible for it to have a parent.
            if (node.blockRoot === interface_1.HEX_ZERO_HASH) {
                continue;
            }
            const nodeDelta = deltas[nodeIndex];
            if (nodeDelta === undefined) {
                throw new errors_1.ProtoArrayError({
                    code: errors_1.ProtoArrayErrorCode.INVALID_NODE_DELTA,
                    index: nodeIndex,
                });
            }
            // Apply the delta to the node
            node.weight += nodeDelta;
            // If the node has a parent, try to update its best-child and best-descendant
            const parentIndex = node.parent;
            if (parentIndex !== undefined) {
                const parentDelta = deltas[parentIndex];
                if (parentDelta === undefined) {
                    throw new errors_1.ProtoArrayError({
                        code: errors_1.ProtoArrayErrorCode.INVALID_PARENT_DELTA,
                        index: parentIndex,
                    });
                }
                // back-propagate the nodes delta to its parent
                deltas[parentIndex] += nodeDelta;
                this.maybeUpdateBestChildAndDescendant(parentIndex, nodeIndex);
            }
        }
    }
    /**
     * Register a block with the fork choice.
     *
     * It is only sane to supply an undefined parent for the genesis block
     */
    onBlock(block) {
        // If the block is already known, simply ignore it
        if (this.indices.has(block.blockRoot)) {
            return;
        }
        const node = {
            ...block,
            parent: this.indices.get(block.parentRoot),
            weight: 0,
            bestChild: undefined,
            bestDescendant: undefined,
        };
        let nodeIndex = this.nodes.length;
        this.indices.set(node.blockRoot, nodeIndex);
        this.nodes.push(node);
        let parentIndex = node.parent;
        let n = node;
        while (parentIndex !== undefined) {
            this.maybeUpdateBestChildAndDescendant(parentIndex, nodeIndex);
            nodeIndex = parentIndex;
            n = this.getNodeByIndex(nodeIndex);
            parentIndex = n === null || n === void 0 ? void 0 : n.parent;
        }
    }
    /**
     * Follows the best-descendant links to find the best-block (i.e., head-block).
     */
    findHead(justifiedRoot) {
        var _a;
        const justifiedIndex = this.indices.get(justifiedRoot);
        if (justifiedIndex === undefined) {
            throw new errors_1.ProtoArrayError({
                code: errors_1.ProtoArrayErrorCode.JUSTIFIED_NODE_UNKNOWN,
                root: justifiedRoot,
            });
        }
        const justifiedNode = this.nodes[justifiedIndex];
        if (justifiedNode === undefined) {
            throw new errors_1.ProtoArrayError({
                code: errors_1.ProtoArrayErrorCode.INVALID_JUSTIFIED_INDEX,
                index: justifiedIndex,
            });
        }
        const bestDescendantIndex = (_a = justifiedNode.bestDescendant) !== null && _a !== void 0 ? _a : justifiedIndex;
        const bestNode = this.nodes[bestDescendantIndex];
        if (bestNode === undefined) {
            throw new errors_1.ProtoArrayError({
                code: errors_1.ProtoArrayErrorCode.INVALID_BEST_DESCENDANT_INDEX,
                index: bestDescendantIndex,
            });
        }
        /**
         * Perform a sanity check that the node is indeed valid to be the head
         * The justified node is always considered viable for head per spec:
         * def get_head(store: Store) -> Root:
         * blocks = get_filtered_block_tree(store)
         * head = store.justified_checkpoint.root
         */
        if (bestDescendantIndex !== justifiedIndex && !this.nodeIsViableForHead(bestNode)) {
            throw new errors_1.ProtoArrayError({
                code: errors_1.ProtoArrayErrorCode.INVALID_BEST_NODE,
                startRoot: justifiedRoot,
                justifiedEpoch: this.justifiedEpoch,
                finalizedEpoch: this.finalizedEpoch,
                headRoot: justifiedNode.blockRoot,
                headJustifiedEpoch: justifiedNode.justifiedEpoch,
                headFinalizedEpoch: justifiedNode.finalizedEpoch,
            });
        }
        return bestNode.blockRoot;
    }
    /**
     * Update the tree with new finalization information. The tree is only actually pruned if both
     * of the two following criteria are met:
     *
     * - The supplied finalized epoch and root are different to the current values.
     * - The number of nodes in `self` is at least `self.prune_threshold`.
     *
     * # Errors
     *
     * Returns errors if:
     *
     * - The finalized epoch is less than the current one.
     * - The finalized epoch is equal to the current one, but the finalized root is different.
     * - There is some internal error relating to invalid indices inside `this`.
     */
    maybePrune(finalizedRoot) {
        const finalizedIndex = this.indices.get(finalizedRoot);
        if (finalizedIndex === undefined) {
            throw new errors_1.ProtoArrayError({
                code: errors_1.ProtoArrayErrorCode.FINALIZED_NODE_UNKNOWN,
                root: finalizedRoot,
            });
        }
        if (finalizedIndex < this.pruneThreshold) {
            // Pruning at small numbers incurs more cost than benefit
            return [];
        }
        // Remove the this.indices key/values for all the to-be-deleted nodes
        for (let nodeIndex = 0; nodeIndex < finalizedIndex; nodeIndex++) {
            const node = this.nodes[nodeIndex];
            if (node === undefined) {
                throw new errors_1.ProtoArrayError({ code: errors_1.ProtoArrayErrorCode.INVALID_NODE_INDEX, index: nodeIndex });
            }
            this.indices.delete(node.blockRoot);
        }
        // Store nodes prior to finalization
        const removed = this.nodes.slice(0, finalizedIndex);
        // Drop all the nodes prior to finalization
        this.nodes = this.nodes.slice(finalizedIndex);
        // Adjust the indices map
        for (const [key, value] of this.indices.entries()) {
            if (value < finalizedIndex) {
                throw new errors_1.ProtoArrayError({
                    code: errors_1.ProtoArrayErrorCode.INDEX_OVERFLOW,
                    value: "indices",
                });
            }
            this.indices.set(key, value - finalizedIndex);
        }
        // Iterate through all the existing nodes and adjust their indices to match the new layout of this.nodes
        for (let i = 0, len = this.nodes.length; i < len; i++) {
            const node = this.nodes[i];
            const parentIndex = node.parent;
            if (parentIndex !== undefined) {
                // If node.parent is less than finalizedIndex, set it to undefined
                node.parent = parentIndex < finalizedIndex ? undefined : parentIndex - finalizedIndex;
            }
            const bestChild = node.bestChild;
            if (bestChild !== undefined) {
                if (bestChild < finalizedIndex) {
                    throw new errors_1.ProtoArrayError({
                        code: errors_1.ProtoArrayErrorCode.INDEX_OVERFLOW,
                        value: "bestChild",
                    });
                }
                node.bestChild = bestChild - finalizedIndex;
            }
            const bestDescendant = node.bestDescendant;
            if (bestDescendant !== undefined) {
                if (bestDescendant < finalizedIndex) {
                    throw new errors_1.ProtoArrayError({
                        code: errors_1.ProtoArrayErrorCode.INDEX_OVERFLOW,
                        value: "bestDescendant",
                    });
                }
                node.bestDescendant = bestDescendant - finalizedIndex;
            }
        }
        return removed;
    }
    /**
     * Observe the parent at `parent_index` with respect to the child at `child_index` and
     * potentially modify the `parent.best_child` and `parent.best_descendant` values.
     *
     * ## Detail
     *
     * There are four outcomes:
     *
     * - The child is already the best child but it's now invalid due to a FFG change and should be removed.
     * - The child is already the best child and the parent is updated with the new
     * best-descendant.
     * - The child is not the best child but becomes the best child.
     * - The child is not the best child and does not become the best child.
     */
    maybeUpdateBestChildAndDescendant(parentIndex, childIndex) {
        var _a;
        const childNode = this.nodes[childIndex];
        if (childNode === undefined) {
            throw new errors_1.ProtoArrayError({
                code: errors_1.ProtoArrayErrorCode.INVALID_NODE_INDEX,
                index: childIndex,
            });
        }
        const parentNode = this.nodes[parentIndex];
        if (parentNode === undefined) {
            throw new errors_1.ProtoArrayError({
                code: errors_1.ProtoArrayErrorCode.INVALID_NODE_INDEX,
                index: parentIndex,
            });
        }
        const childLeadsToViableHead = this.nodeLeadsToViableHead(childNode);
        const changeToNull = [undefined, undefined];
        const changeToChild = [childIndex, (_a = childNode.bestDescendant) !== null && _a !== void 0 ? _a : childIndex];
        const noChange = [parentNode.bestChild, parentNode.bestDescendant];
        let newChildAndDescendant;
        const bestChildIndex = parentNode.bestChild;
        if (bestChildIndex !== undefined) {
            if (bestChildIndex === childIndex && !childLeadsToViableHead) {
                // the child is already the best-child of the parent but its not viable for the head
                // so remove it
                newChildAndDescendant = changeToNull;
            }
            else if (bestChildIndex === childIndex) {
                // the child is the best-child already
                // set it again to ensure that the best-descendent of the parent is updated
                newChildAndDescendant = changeToChild;
            }
            else {
                const bestChildNode = this.nodes[bestChildIndex];
                if (bestChildNode === undefined) {
                    throw new errors_1.ProtoArrayError({
                        code: errors_1.ProtoArrayErrorCode.INVALID_BEST_CHILD_INDEX,
                        index: bestChildIndex,
                    });
                }
                const bestChildLeadsToViableHead = this.nodeLeadsToViableHead(bestChildNode);
                if (childLeadsToViableHead && !bestChildLeadsToViableHead) {
                    // the child leads to a viable head, but the current best-child doesn't
                    newChildAndDescendant = changeToChild;
                }
                else if (!childLeadsToViableHead && bestChildLeadsToViableHead) {
                    // the best child leads to a viable head but the child doesn't
                    newChildAndDescendant = noChange;
                }
                else if (childNode.weight === bestChildNode.weight) {
                    // tie-breaker of equal weights by root
                    if (childNode.blockRoot >= bestChildNode.blockRoot) {
                        newChildAndDescendant = changeToChild;
                    }
                    else {
                        newChildAndDescendant = noChange;
                    }
                }
                else {
                    // choose the winner by weight
                    if (childNode.weight >= bestChildNode.weight) {
                        newChildAndDescendant = changeToChild;
                    }
                    else {
                        newChildAndDescendant = noChange;
                    }
                }
            }
        }
        else if (childLeadsToViableHead) {
            // There is no current best-child and the child is viable.
            newChildAndDescendant = changeToChild;
        }
        else {
            // There is no current best-child but the child is not viable.
            newChildAndDescendant = noChange;
        }
        parentNode.bestChild = newChildAndDescendant[0];
        parentNode.bestDescendant = newChildAndDescendant[1];
    }
    /**
     * Indicates if the node itself is viable for the head, or if it's best descendant is viable
     * for the head.
     */
    nodeLeadsToViableHead(node) {
        let bestDescendantIsViableForHead;
        const bestDescendantIndex = node.bestDescendant;
        if (bestDescendantIndex !== undefined) {
            const bestDescendantNode = this.nodes[bestDescendantIndex];
            if (bestDescendantNode === undefined) {
                throw new errors_1.ProtoArrayError({
                    code: errors_1.ProtoArrayErrorCode.INVALID_BEST_DESCENDANT_INDEX,
                    index: bestDescendantIndex,
                });
            }
            bestDescendantIsViableForHead = this.nodeIsViableForHead(bestDescendantNode);
        }
        else {
            bestDescendantIsViableForHead = false;
        }
        return bestDescendantIsViableForHead || this.nodeIsViableForHead(node);
    }
    /**
     * This is the equivalent to the `filter_block_tree` function in the eth2 spec:
     *
     * https://github.com/ethereum/eth2.0-specs/blob/v1.0.1/specs/phase0/fork-choice.md#filter_block_tree
     *
     * Any node that has a different finalized or justified epoch should not be viable for the
     * head.
     */
    nodeIsViableForHead(node) {
        const correctJustified = (node.justifiedEpoch === this.justifiedEpoch && node.justifiedRoot === this.justifiedRoot) ||
            this.justifiedEpoch === 0;
        const correctFinalized = (node.finalizedEpoch === this.finalizedEpoch && node.finalizedRoot === this.finalizedRoot) ||
            this.finalizedEpoch === 0;
        return correctJustified && correctFinalized;
    }
    /**
     * Iterate from a block root backwards over nodes
     */
    *iterateAncestorNodes(blockRoot) {
        const startIndex = this.indices.get(blockRoot);
        if (startIndex === undefined) {
            return;
        }
        const node = this.nodes[startIndex];
        if (node === undefined) {
            throw new errors_1.ProtoArrayError({
                code: errors_1.ProtoArrayErrorCode.INVALID_NODE_INDEX,
                index: startIndex,
            });
        }
        yield* this.iterateAncestorNodesFromNode(node);
    }
    /**
     * Iterate from a block root backwards over nodes
     */
    *iterateAncestorNodesFromNode(node) {
        while (node.parent !== undefined) {
            node = this.getNodeFromIndex(node.parent);
            yield node;
        }
    }
    /**
     * Get all nodes from a block root backwards
     */
    getAllAncestorNodes(blockRoot) {
        const startIndex = this.indices.get(blockRoot);
        if (startIndex === undefined) {
            return [];
        }
        let node = this.nodes[startIndex];
        if (node === undefined) {
            throw new errors_1.ProtoArrayError({
                code: errors_1.ProtoArrayErrorCode.INVALID_NODE_INDEX,
                index: startIndex,
            });
        }
        const nodes = [node];
        while (node.parent !== undefined) {
            node = this.getNodeFromIndex(node.parent);
            nodes.push(node);
        }
        return nodes;
    }
    /**
     * The opposite of iterateNodes.
     * iterateNodes is to find ancestor nodes of a blockRoot.
     * this is to find non-ancestor nodes of a blockRoot.
     */
    getAllNonAncestorNodes(blockRoot) {
        const startIndex = this.indices.get(blockRoot);
        if (startIndex === undefined) {
            return [];
        }
        let node = this.nodes[startIndex];
        if (node === undefined) {
            throw new errors_1.ProtoArrayError({
                code: errors_1.ProtoArrayErrorCode.INVALID_NODE_INDEX,
                index: startIndex,
            });
        }
        const result = [];
        let nodeIndex = startIndex;
        while (node.parent !== undefined) {
            const parentIndex = node.parent;
            node = this.getNodeFromIndex(parentIndex);
            // nodes between nodeIndex and parentIndex means non-ancestor nodes
            result.push(...this.getNodesBetween(nodeIndex, parentIndex));
            nodeIndex = parentIndex;
        }
        result.push(...this.getNodesBetween(nodeIndex, 0));
        return result;
    }
    hasBlock(blockRoot) {
        return this.indices.has(blockRoot);
    }
    getNode(blockRoot) {
        const blockIndex = this.indices.get(blockRoot);
        if (blockIndex === undefined) {
            return undefined;
        }
        return this.getNodeByIndex(blockIndex);
    }
    getBlock(blockRoot) {
        const node = this.getNode(blockRoot);
        if (!node) {
            return undefined;
        }
        return {
            ...node,
        };
    }
    /**
     * Returns `true` if the `descendantRoot` has an ancestor with `ancestorRoot`.
     * Always returns `false` if either input roots are unknown.
     * Still returns `true` if `ancestorRoot` === `descendantRoot` (and the roots are known)
     */
    isDescendant(ancestorRoot, descendantRoot) {
        const ancestorNode = this.getNode(ancestorRoot);
        if (!ancestorNode) {
            return false;
        }
        if (ancestorRoot === descendantRoot) {
            return true;
        }
        for (const node of this.iterateAncestorNodes(descendantRoot)) {
            if (node.slot < ancestorNode.slot) {
                return false;
            }
            if (node.blockRoot === ancestorNode.blockRoot) {
                return true;
            }
        }
        return false;
    }
    /**
     * Returns a common ancestor for nodeA or nodeB or null if there's none
     */
    getCommonAncestor(nodeA, nodeB) {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            // If nodeA is higher than nodeB walk up nodeA tree
            if (nodeA.slot > nodeB.slot) {
                if (nodeA.parent === undefined) {
                    return null;
                }
                nodeA = this.getNodeFromIndex(nodeA.parent);
            }
            // If nodeB is higher than nodeA walk up nodeB tree
            else if (nodeA.slot < nodeB.slot) {
                if (nodeB.parent === undefined) {
                    return null;
                }
                nodeB = this.getNodeFromIndex(nodeB.parent);
            }
            // If both node trees are at the same height, if same root == common ancestor.
            // Otherwise, keep walking up until there's a match or no parent.
            else {
                if (nodeA.blockRoot === nodeB.blockRoot) {
                    return nodeA;
                }
                if (nodeA.parent === undefined || nodeB.parent === undefined) {
                    return null;
                }
                nodeA = this.getNodeFromIndex(nodeA.parent);
                nodeB = this.getNodeFromIndex(nodeB.parent);
            }
        }
    }
    length() {
        return this.indices.size;
    }
    getNodeFromIndex(index) {
        const node = this.nodes[index];
        if (node === undefined) {
            throw new errors_1.ProtoArrayError({ code: errors_1.ProtoArrayErrorCode.INVALID_NODE_INDEX, index });
        }
        return node;
    }
    getNodeByIndex(blockIndex) {
        const node = this.nodes[blockIndex];
        if (node === undefined) {
            return undefined;
        }
        return node;
    }
    getNodesBetween(upperIndex, lowerIndex) {
        const result = [];
        for (let index = upperIndex - 1; index > lowerIndex; index--) {
            const node = this.nodes[index];
            if (node === undefined) {
                throw new errors_1.ProtoArrayError({
                    code: errors_1.ProtoArrayErrorCode.INVALID_NODE_INDEX,
                    index,
                });
            }
            result.push(node);
        }
        return result;
    }
}
exports.ProtoArray = ProtoArray;
//# sourceMappingURL=protoArray.js.map