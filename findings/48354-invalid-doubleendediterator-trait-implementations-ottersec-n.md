---
tags:
  - lang/solidity
  - platform/ottersec
  - severity/high
  - sector/nft
protocol: "[[Ellipsis]]"
auditors:
  - "[[Robert Chen]]"
report: "https://ellipsislabs.xyz/"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[cross-contract-state-consistency]]"
---
# Invalid DoubleEndedIterator Trait Implementations

- id: 48354
- impact: HIGH
- protocol: [[Ellipsis]]
- reporter: Robert Chen (OtterSec)
- source: https://ellipsislabs.xyz/

## Summary


The bug report mentions that the critbit, AVL tree, and red-black tree do not correctly implement Rust's DoubleEndedIterator trait. This means that the next and next_back methods for these trees do not follow the specification and can even be unsafe. The report includes a code example that shows how using the iter_mut method can result in obtaining multiple mutable references to the same value. The suggested solution is to rewrite the next and next_back methods or remove the implementations of DoubleEndedIterator altogether. The bug has been resolved in a specific patch.

## Details

## Ineffectiveness of Iterator Implementations

The critbit, AVL tree, and red-black tree do not correctly implement Rust’s `DoubleEndedIterator` trait, which is described here.

## Issue with Red-Black Tree

For instance, the red-black tree iterator’s `next` and `next_back` methods will cross each other, “double-counting” each element. This does not follow the spec and can even be unsafe: when using `iter_mut`, one can obtain multiple mutable references to the same value.

### Example Code

```rust
let mut rbtree = RedBlackTree::<u64, u64, 100>::new();
rbtree.insert(0, 0);
rbtree.insert(1, 0);
let mut iter = rbtree.iter_mut();
let x: &mut u64 = iter.next().unwrap().1;
let y: &mut u64 = iter.next().unwrap().1;
*x = 1337;
assert_eq!(*y, 1337);
```

## Remediation

Rewrite `next` and `next_back` so that they do not cross each other, or remove the implementations of `DoubleEndedIterator` altogether.

## Patch

Resolved in #11.
