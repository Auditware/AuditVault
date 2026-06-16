---
tags:
  - lang/solidity
  - sector/governance
  - sector/staking
  - platform/spearbit
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Monad]]"
auditors:
  - "[[Haxatron]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[variant]]"
  - "[[reward-accounting]]"
---
# Incorrect update to validator accumulators on syscall_epoch_change

- id: 62887
- impact: HIGH
- protocol: [[Monad]]
- reporter: Haxatron (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf

## Summary


This bug report is about an issue found in the code for updating validators' accumulators at the beginning of a new epoch. The problem is that the code assumes that the first N validators in `valset_execution` are present in `valset_snapshot`, but this may not always be the case. This can result in incorrect accumulator values for some validators. The recommended solution is to iterate through each item in `valset_snapshot` to obtain the correct `val_id`. This bug has been fixed in the latest commit.

## Details

## Severity: High Risk

## Context
(No context files were provided by the reviewer)

## Description
(Issue found in commit hash `1a7f9476081abc734fc6fa359698c3b8f9806576`). 

In `syscall_epoch_change`, we attempt to update all the accumulators of validators present in the snapshot view at the beginning of a new epoch. This is meant to store the accumulator at the beginning for the epoch to calculate rewards for `delta_stake`.

```cpp
uint64_t const num_active_vals = vars._valset_snapshot().length();
for (uint64_t i = 0; i < num_active_vals; i += 1) {
    auto const val_id = vars.valset_execution.get(i).load();
    auto val = vars.val_execution(val_id);
    // TODO: once Maged/quotesingle.ts1s speculative execution is merged, move this
    // into a separate loop.
    {
        auto acc_storage = vars.acc(next_epoch, val_id);
        auto acc = acc_storage.load_checked();
        if (acc.has_value()) {
            acc->value = val.acc().load(); // this is the realtime val.acc
            acc_storage.store(*acc); // store in the next_epoch
        }
    }
    // ...
}
```

The problem with the above code is that we fetch the validators to update by index from `valset_execution`. However, this may not actually correspond to the actual snapshot validators as `valset_execution` may still contain non-snapshot validators. A concrete scenario where this could happen would be the following:

1. Initially, there are 201 validators ordered from index [0, 1, 2 ... 200] in `valset_execution` where `valset_execution[i+1].stake > valset_execution[i].stake` for all `i` (stakes are in ascending order).
2. During `syscall_snapshot`, we place the top 200 validators into the consensus view. Thus the `valset_consensus` will contain the validator [1, 2 ... 200] by index from `valset_execution`. Importantly, validator index 0 in `valset_execution` is not removed as it is not added to the removals array (since `flags == ValidatorFlagsOk`), so `valset_execution` still remains [0, 1, 2 ... 200].

```cpp
uint64_t const num_validators = vars.valset_execution.length();
for (uint64_t i = 0; i < num_validators; i += 1) {
    auto const val_id = vars.valset_execution.get(i).load();
    auto const val_execution = vars.val_execution(val_id);
    // TODO: once Maged/quotesingle.ts1s speculative execution is merged, move this
    // into a separate loop.
    auto const flags = val_execution.get_flags();
    if (MONAD_LIKELY(flags == ValidatorFlagsOk)) {
        uint256_t const stake = val_execution.stake().load().native();
        heap.emplace(val_id, stake);
        if (heap.size() > ACTIVE_VALSET_SIZE) {
            heap.pop(); // smallest element removed
        }
    }
    else {
        removals.push_back(i);
    }
}
```

3. On the next `next_epoch` change, where `valset_consensus` will become `valset_snapshot` after the boundary block, the new accumulators for each validator in the snapshot validator set that has passed through the epoch will need to be computed.

However, referring to the first code snippet, the first 200 active validators of `valset_execution` will have their accumulators updated, meaning that [0, 1, 2 ... 199] present in `valset_execution` will be updated. However, in actual fact, `valset_snapshot` consists of [1, 2 ... 199, 200] present in `valset_execution`, thus not all snapshot validators will have their accumulators updated.

Another scenario would be that if a validator auth address withdraws all its stake while it is active in the current `valset_consensus`. When `syscall_snapshot` is called, this validator would be removed from `valset_execution`. However, since it is currently in `valset_consensus`, it must be retained in `valset_snapshot` after the boundary block. When iterating through `valset_execution` during `syscall_epoch_change`, the validator present in `valset_snapshot` will not be accessible in `valset_execution` and thus its accumulator will not be updated.

## Recommendation
It should not be assumed that the first N validators in `valset_execution` are present in `valset_snapshot`. You need to iterate through each item in `valset_snapshot` to obtain the correct `val_id`.

## Category
Labs: Fixed in commit `fc820c9e`.

## Spearbit
Fix verified.
