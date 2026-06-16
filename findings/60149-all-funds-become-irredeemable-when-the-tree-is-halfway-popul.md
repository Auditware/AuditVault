---
tags:
  - lang/circom
  - lang/solidity
  - sector/zk
  - platform/quantstamp
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[Hinkal Protocol]]"
auditors:
  - "[[Shih-Hung Wang]]"
report: "https://certificate.quantstamp.com/full/hinkal-protocol/66b9b783-8b42-4a4e-89ed-3ef2a2df5958/index.html"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[locked-funds]]"
  - "[[merkle-tree-overflow]]"
---
# All Funds Become Irredeemable when the Tree Is Halfway Populated

- id: 60149
- impact: HIGH
- protocol: [[Hinkal Protocol]]
- reporter: Shih-Hung Wang (Quantstamp)
- source: https://certificate.quantstamp.com/full/hinkal-protocol/66b9b783-8b42-4a4e-89ed-3ef2a2df5958/index.html

## Summary


This bug report is about a problem with the `insert()` and `insertMany()` functions in the `Merkle.sol` file. These functions are supposed to update the top root in a Merkle tree, but they fail to do so if the tree is more than half full. This means that users will not be able to prove their funds exist, making them irredeemable. The report recommends updating the functions to fix this issue. To reproduce the problem, a tree with 5 levels and 16 leaves needs to be created and the `insert()` function needs to be executed 10 times or the `insertMany()` function needs to be executed with 10 elements. The report suggests updating the functions to correctly update the tree when it is more than half full.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `cea4d112cdfb5650d199e74b04a7769b9bd4badd`. The client provided the following explanation:

> Updated insert methods to have root update when tree is at least half full

**File(s) affected:**`Merkle.sol`

**Description:** The `insert()` and `insertMany()` functions of `Merkle` fail to update the top root in the Merkle tree if all of the leaves in the left subtree are filled, i.e., the entire tree is half-filled.

For example, `insertOne()` saves gas by caching node values if they are right-side nodes and only writes values to storage for left-side nodes. The implementation can be seen below:

```
function insertOne(
    uint256 currentNodeIndex,
    uint256 twoPower,
    uint256 prevHash
) internal {
    for (uint256 i = 0; i <= twoPower; i++) {
        if (currentNodeIndex % 2 == 0) {
            tree[i] = prevHash; // Left side - value stored
            if (i != twoPower) prevHash = hash(prevHash, 0);
        } else {
            prevHash = hash(tree[i], prevHash); // Right side - value cached
        }
        currentNodeIndex /= 2;
    }
}
```

Once the tree is halfway full, `twoPower` will be large enough such that `currentNodeIndex == 1` for the root. However, a `currentNodeIndex` of `1` will be cached locally to `prevHash` rather than written to storage. The commitment will be accepted from the user, but they will not be able to later prove its existence, making the funds irredeemable.

In fact, funds will eventually become irredeemable for all users. The `tree[twoPower]` value will still be zero, and it will be stored as a valid root in the `root[]` mapping. Once the `root[]` mapping contains nothing but zero roots, all commitments would become un-nullifiable, resulting in all funds being stuck in the protocol.

**Exploit Scenario:** To reproduce the vulnerability:

1.   Create a tree of `5` levels (`16` leaves).
2.   Execute the function `insert()``10` times or the function `insertMany()` with `10` elements (more than half of the leaves).
3.   Observe that `tree[4] == 0` (the root in the tree mapping) and `root[rootIndex-1] == 0` (the most recently added root).

**Recommendation:** Update the functions `insertOne()` and `insertTwo()` such that `tree[twoPower]` is updated with the correct value when the tree has been populated by more than half of the trees.
