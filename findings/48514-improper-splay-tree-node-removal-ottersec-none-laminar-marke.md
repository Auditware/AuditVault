---
tags:
  - lang/move
  - platform/ottersec
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/locked-funds
  - sector/perpetuals
protocol: "[[Laminar Markets]]"
auditors:
  - "[[Robert Chen]]"
report: "https://laminar.markets/"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[locked-funds]]"
  - "[[dos-resistance]]"
---
# Improper Splay Tree Node Removal

- id: 48514
- impact: HIGH
- protocol: [[Laminar Markets]]
- reporter: Robert Chen (OtterSec)
- source: https://laminar.markets/

## Summary


The report discusses a bug in the splay_tree::remove_node function that occurs when trying to remove the root node of a tree that has a right child to the minimum node of the right sub-tree. This can cause the right child to lose its reference, potentially resulting in the loss of funds for users if their orders become inaccessible. A proof of concept and patch have been provided to address this issue.

## Details

## Splay Tree Remove Node Issue

In the `splay_tree::remove_node` function, there is an issue while removing the root node of the tree that has a right child to the minimum node of the right sub-tree. This scenario leads to the de-referencing of the right child. This is because the left of its parent is set to sentinel without considering the right child of the minimum node in the right sub-tree. This causes the child to lose its reference.

### Affected Code

```rust
// flow/sources/splay_tree.move
fun remove_node<V: store + drop>(tree, idx, parent_idx) {
    [...]
    else {
        [...]
        let right_leftmost_parent_node = get_mut_node_by_index(tree, /* right_leftmost_parent */);
        right_leftmost_parent_node.left = guarded_idx::sentinel();
    };
}
```

Users could lose funds if their orders become inaccessible.

## Proof of Concept

See Splay Tree Remove POC.

## Remediation

Instead of directly assigning `right_leftmost_parent_node.left` to sentinel, check and add the right child.

## Patch

```rust
let old_right = right_leftmost_node.right;
right_leftmost_parent_node.left = old_right;
```

Patch was added in commit `09e3dd46`.

© 2022 OtterSec LLC. All Rights Reserved. 8 / 22
