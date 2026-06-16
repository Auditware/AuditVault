---
tags:
  - lang/move
  - sector/lending
  - sector/options
  - platform/ottersec
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/locked-funds
protocol: "[[Laminar Markets]]"
auditors:
  - "[[Robert Chen]]"
report: "https://laminar.markets/"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[locked-funds]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Improper Enqueue Implementation in Queue

- id: 48512
- impact: HIGH
- protocol: [[Laminar Markets]]
- reporter: Robert Chen (OtterSec)
- source: https://laminar.markets/

## Summary


The bug report discusses an issue in the code for the queue::enqueue function, which is used to insert a new node in the queue. The problem occurs when nodes are removed from the queue and a new node is inserted afterwards. This causes the new node to be created, but not referenced correctly. The reason for this is that the index of the new node is determined by the size of the queue, which can change after nodes are removed. This results in the new node being pushed to the back of the queue while the reference still points to the removed node. This can lead to the newly-created order being inaccessible and can also create a reference to the deleted order, potentially resulting in the loss of funds. A proof of concept and patch for this issue are also provided in the report.

## Details

## Queue::enqueue Function Issue

In the `queue::enqueue` function, there is an issue when inserting a new node. Attempting this after removing nodes will cause a new node to be created, but referenced incorrectly. This happens because the index of the node is determined by `size(&Q)`. If `size(&Q)` becomes equal to the removed node, it will cause the new node to be pushed back to the queue, while the reference is still pointing to the removed node.

## Relevant Code Snippet

```rust
flow/sources/queue.move RUST

fun size<V: store + drop>(queue: &Queue<V>): u64 {
    vector::length(&queue.nodes) - vector::length(&queue.free_indices)
}

let index = if (vector::length(&queue.free_indices) > 0) {
    vector::pop_back(&mut queue.free_indices) // TOCTOU
} else {
    size(queue)
};

[..]

if (index == size(queue)) { // TOCTOU
    let next_node = create_node(value);
    vector::push_back(&mut queue.nodes, next_node);
} else {
    let to_change = vector::borrow_mut(&mut queue.nodes, index);
    to_change.value = option::some(value)
}
```

This will make the newly-created order inaccessible. It will also create a reference to the deleted order, which could lead to the loss of funds by duplicating the order.

## Proof of Concept

See **Queue Enqueue POC**.

## Remediation

Use `length` instead of `size`.

## Patch

A patch was added in commit `0cebfa36`.

---

© 2022 OtterSec LLC. All Rights Reserved. 6 / 22
