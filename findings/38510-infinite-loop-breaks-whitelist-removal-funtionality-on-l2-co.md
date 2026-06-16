---
tags:
  - blockchain/starknet
  - lang/cairo
  - platform/codehawks
  - has/github
  - has/poc
  - severity/high
  - sector/bridge
  - sector/nft
protocol: "[[ArkProject NFT Bridge]]"
auditors:
  - "[[0xAsen]]"
genome:
  - "[[unbounded-loop]]"
  - "[[permanent]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
---
# Infinite loop breaks whitelist removal funtionality on L2

- id: 38510
- impact: HIGH
- protocol: [[ArkProject NFT Bridge]]
- reporter: 0xAsen (Codehawks)
- source: N/A

## Summary


Summary:

The report discusses a bug in a code that causes an infinite loop when trying to remove a collection from a whitelist. The loop does not update the previous element to the next one, causing it to continuously evaluate the same element and preventing the removal operation from completing. The bug can be reproduced by changing a line of code and running a test. The impact of this bug is that only the first and second collections can be removed from the whitelist. The recommended solution is to add a line of code to update the previous element at the end of the loop. The tools used for this report are vscode and starknet-foundry. 

## Details

## Summary

The [loop](https://github.com/Cyfrin/2024-07-ark-project/blob/main/apps/blockchain/starknet/src/bridge.cairo#L524-L538) in `bridge#_white_list_collection` function does not update `pre` to `next`, results in an infinite loop when attempting to remove a collection from the whitelist.

## Vulnerability Details

The function [iterates through](https://github.com/Cyfrin/2024-07-ark-project/blob/main/apps/blockchain/starknet/src/bridge.cairo#L524-L538) [`self.white_listed_list`](https://github.com/Cyfrin/2024-07-ark-project/blob/main/apps/blockchain/starknet/src/bridge.cairo#L524-L538) to locate the target `collection`. However, after each iteration, `prev` is not updated to `next`. This causes the loop to continuously re-evaluate the same element, preventing the removal operation from completing.

For example, given the `white_listed_list` structured as `collection01 -> collection02 -> collection03 -> collection04`, removes `collection03`:

1. Iteration 1: `prev` => collection01, `next` => collection02. Condition `next == collection` is false, loop continues.
2. Iteration 2: `prev` => collection01, `next` => collection02. Condition `next == collection` is false, loop continues.
3. This pattern repeats, causing an infinite loop and preventing the function from progressing past the first element.

```Rust
File: bridge.cairo
523:                 // removed element from linked list
524:                 loop {
525:                     let (active, next) = self.white_listed_list.read(prev);
526:                     if next.is_zero() {
527:                         // end of list
528:                         break;
529:                     }
530:                     if !active {
531:                         break;
532:                     }
533:                     if next == collection {
534:                         let (_, target) = self.white_listed_list.read(collection);
535:                         self.white_listed_list.write(prev, (active, target));
536:                         break;
537:>>                 }// <-- missing `prev = next`
538:                 };
```

## PoC

Change below line for starknet/src/tests/bridge\_t.cairo

```diff
@@ -711,7 +711,7 @@ mod tests {
         assert!(bridge.is_white_listed(collection3), "Collection1 should be whitelisted");

         start_prank(CheatTarget::One(bridge_address), BRIDGE_ADMIN);
-        bridge.white_list_collection(collection2, false);
+        bridge.white_list_collection(collection3, false);
```

Run `snforge test`:

```sh
[FAIL] starklane::tests::bridge_t::tests::whitelist_collection_is_updated_when_collection_is_removed

Failure data:
    Got an exception while executing a hint: Hint Error: Error in the called contract (0x03b24bdfb3983f3361a7f81e871041cc45f3e1c21bfe3f1cbcaf7bec224627d5):
Error at pc=0:17590:
Could not reach the end of the program. RunResources has no remaining steps.
```

## Impact

Besides the first and second collection, unable to remove other collections from whitelist.

## Tools Used

vscode, starknet-foundry

## Recommendations

Add `prev = next` at the end of loop.
