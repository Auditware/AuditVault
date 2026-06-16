---
tags:
  - lang/circom
  - lang/solidity
  - sector/zk
  - platform/quantstamp
  - severity/high
  - novelty/known-pattern
protocol: "[[Hinkal Protocol]]"
auditors:
  - "[[Shih-Hung Wang]]"
report: "https://certificate.quantstamp.com/full/hinkal-protocol/66b9b783-8b42-4a4e-89ed-3ef2a2df5958/index.html"
genome:
  - "[[underflow]]"
  - "[[wrong-state]]"
  - "[[known-pattern]]"
  - "[[integer-bounds]]"
  - "[[commitment-uniqueness]]"
  - "[[merkle-tree-overflow]]"
---
# Commitments Can Be Overwritten by Overflowing the Tree

- id: 60150
- impact: HIGH
- protocol: [[Hinkal Protocol]]
- reporter: Shih-Hung Wang (Quantstamp)
- source: https://certificate.quantstamp.com/full/hinkal-protocol/66b9b783-8b42-4a4e-89ed-3ef2a2df5958/index.html

## Summary


This bug report discusses an issue with two Merkle Tree implementations, called `Merkle` and `MerkleRemovable`. These implementations inherit from `MerkleBase` and have a maximum number of leaves that can be inserted. However, there is a problem with the `insert()` function that prevents the last leaf from being added and also does not properly check for tree overflow. This can lead to overwriting of previously stored commitments and invalidating them. To replicate this issue, a tree of 5 levels is created and 20 elements are inserted, resulting in the tree growing past its limit. The recommendation is to update the `insert()` function and add a check in the `insertMany()` function to prevent this issue. 

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `d3a45d4e79a8960ef641ee49b16799d3495b3b37`, `b93443b8f0143914208ec050e14169f930b6792c`. The client provided the following explanation:

> Required checks in Merkle were added

**File(s) affected:**`Merkle.sol`, `MerkleBase.sol`, `MerkleRemoveable.sol`

**Description:** There are two Merkle Tree implementations: `Merkle` and `MerkleRemovable`. Both inherit from `MerkleBase` and make sure that no more leaves can be inserted than the maximum number of leaves in a tree of `LEVELS` levels.

The `insert()` function performs the above check with the following guard:

```
require(newIndex != uint256(2) ** LEVELS, "Tree is full.");
```

This has two consequences:

1.   The last leaf can never be added to the tree, as `newIndex == uint256(2) ** LEVELS`.
2.   The guard does not revert for `newIndex > uint256(2) ** LEVELS`.

Once the tree limit is exceeded, a new level of depth under the previous leaves is created to which new leaves are appended. These newly inserted leaves would overwrite their parent node (the previous leaves containing commitments) when propagating the update toward the root.

For example, if the `( 2 ** LEVELS ) + 1` element were to (incorrectly) be inserted into the tree, its parent node would suddenly be the leaf of the first commitment ever inserted, as `( ( 2 ** LEVELS ) + 1 ) / 2 = MINIMUM_INDEX`. This element would get overwritten when calculating root updates, invalidating its potentially un-nullified, previously contained commitment.

Therefore, subsequent insertions via `insertMany()` (and `insert()` once the tree has overflowed) would continue to overwrite leaves and invalidate their stored commitments.

**Exploit Scenario:** This behavior can be replicated as follows:

1.   Create a tree of `5` levels (`16` leaves).
2.   Execute the function `insertMany()` with `20` elements.
3.   Observe that `m_index == 36`.
4.   Execute the function `insert()`.
5.   Observe that `m_index == 37`. The tree can continue to grow past its limit.

**Recommendation:**

1.   Update the check in the functions `insert()` by using `<=` instead of `!=` and making sure that the final leaf can be added.
2.   Adding a check in the function `insertMany()` to make sure that the maximum tree size is not exceeded.
