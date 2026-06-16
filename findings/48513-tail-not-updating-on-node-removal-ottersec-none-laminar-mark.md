---
tags:
  - lang/move
  - platform/ottersec
  - has/poc
  - severity/high
  - sector/lending
  - sector/options
protocol: "[[Laminar Markets]]"
auditors:
  - "[[Robert Chen]]"
report: "https://laminar.markets/"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Tail Not Updating on Node Removal

- id: 48513
- impact: HIGH
- protocol: [[Laminar Markets]]
- reporter: Robert Chen (OtterSec)
- source: https://laminar.markets/

## Summary

The bug report discusses an issue with the queue::remove function in the RUST programming language. The problem is that the tail node is not being updated when a lone root node or tail node is removed. This can lead to incorrect procedures and cause transaction failures when using the tail node for operations such as iteration. The report includes a proof of concept and a suggested patch to fix the issue.

## Details

## Issue with Queue Remove Function

In the `queue::remove` function, the tail node is never updated. This means that whenever a lone root node or a tail node is removed, any subsequent procedures involving the tail node will be incorrect because the tail is not getting updated by this function.

## Code Snippet

```rust
public fun remove<V: store + drop>(queue: &mut Queue<V>, index_to_remove: u64, prev_index: Option<u64>) {
    vector::push_back(&mut queue.free_indices, index_to_remove);
    if (option::is_none(&prev_index)) {
        let node = vector::borrow(&mut queue.nodes, index_to_remove);
        queue.head = node.next;
    } else {
        let next = {
            let node = vector::borrow(&mut queue.nodes, index_to_remove);
            node.next
        };
        let prev_node = vector::borrow_mut(&mut queue.nodes, *option::borrow(&prev_index));
        prev_node.next = next;
    };
    let node = vector::borrow_mut(&mut queue.nodes, index_to_remove);
    node.next = guarded_idx::sentinel();
}
```

The iterator or any other operation that makes use of the tail node will not perform correctly (i.e., cause a transaction failure) as the tail is erroneously pointing to a different node. This would make the tail pointing to a deleted order, thus causing the order book to malfunction.

## Proof of Concept

See **Queue Remove POC**.

## Remediation

To remediate this issue, update the tail when removing the head or tail nodes in a queue.

## Patch

Patch added in commit `0cebfa36`.

© 2022 OtterSec LLC. All Rights Reserved. 7 / 22
