---
tags:
  - blockchain/starknet
  - lang/cairo
  - lang/solidity
  - platform/code4rena
  - has/github
  - severity/high
  - sector/zk
protocol: "[[Kakarot]]"
auditors:
  - "[[g_x_w]]"
report: "https://code4rena.com/reports/2024-09-kakarot"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[initializer-auth]]"
  - "[[circuit-constraint-completeness]]"
  - "[[circuit-input-range-check]]"
---
# [H-03] Missing constraint in `default_dict_copy`

- id: 45170
- impact: HIGH
- protocol: [[Kakarot]]
- reporter: g\_x\_w (Code4rena)
- source: https://code4rena.com/reports/2024-09-kakarot

## Summary


This report discusses a vulnerability in the CairoZero software, specifically in the handling of `transient_storage`, `storage` and `valid_jumpdests`. These objects must be initialized and finalized correctly to prevent malicious manipulation. However, the constraint for finalization is missing in these cases, leading to potential vulnerabilities when executing smart contracts. A proof of concept (POC) was provided to demonstrate how a malicious prover could manipulate the values in these objects and potentially access funds or manipulate contract state. The severity of this vulnerability was confirmed to be high and a fix has been implemented to mitigate the issue. 

## Details


<https://github.com/kkrt-labs/kakarot/blob/7411a5520e8a00be6f5243a50c160e66ad285563/src/kakarot/account.cairo#L83>

<https://github.com/kkrt-labs/kakarot/blob/7411a5520e8a00be6f5243a50c160e66ad285563/src/utils/dict.cairo#L83>

### Vulnerability details

In CairoZero, the correct usage of dict objects created via `default_dict_new` must be paired with a call to `default_dict_finalize` to ensure the integrity and prevent malicious prover's manipulation of its contents. However, this constraint is missing in the handling of `transient_storage`, `storage` and `valid_jumpdests`, leading to severe vulnerabilities when executing smart contracts.

### Description of the Issue

According to CairoZero's documentation ([link to `default_dict`](https://docs.cairo-lang.org/reference/common_library.html#default-dict)), a proper workflow involving `default_dict_new` includes a finalization step using `default_dict_finalize`. This ensures the correct initialization of dictionary elements and prevents malicious provers from manipulating dictionary values through hints. Specifically, `default_dict_finalize` enforces the constraint that the initial value of the first element's `prev_value` in the dictionary must equal to the `default_value`.

However, in the case of `transient_storage`, `storage` and `valid_jumpdests`, this crucial constraint is missing. I will illustrate this issue using `transient_storage`. First, `transient_storage` is initialized in `Account.init()` as follows:

```rust
let (transient_storage_start) = default_dict_new(0);
```

However, there is no subsequent call to `default_dict_finalize(transient_storage_start, transient_storage, 0)` to finalize the storage. Instead, the function `default_dict_copy()` is called on `transient_storage` multiple times during a transaction through the `Account.copy()` function:

```rust
let (transient_storage_start, transient_storage) = default_dict_copy(
    self.transient_storage_start, self.transient_storage
);
```

This copy operation starts by calling `dict_squash` on the original `transient_storage`:

```rust
func default_dict_copy{range_check_ptr}(start: DictAccess*, end: DictAccess*) -> (
    DictAccess*, DictAccess*
) {
    alloc_locals;
    let (squashed_start, squashed_end) = dict_squash(start, end);
    local range_check_ptr = range_check_ptr;
    let dict_len = squashed_end - squashed_start;

    local default_value;
    if (dict_len == 0) {
        assert default_value = 0;
    } else {
        assert default_value = squashed_start.prev_value;
    }

    let (local new_start) = default_dict_new(default_value);
    ...
```

`dict_squash` itself does not assert the `prev_value` of the first element in the dictionary.
As a result, the subsequent copied `transient_storage`'s initial value is also under the malicious prover's control.

```
    let (local new_start) = default_dict_new(default_value);
```

If we look at the source code of `default_dict_finalize`, we will notice an extra constraint in the `default_dict_finalize_inner` function:

```rust
func default_dict_finalize{range_check_ptr}(
    dict_accesses_start: DictAccess*, dict_accesses_end: DictAccess*, default_value: felt
) -> (squashed_dict_start: DictAccess*, squashed_dict_end: DictAccess*) {
    alloc_locals;
    let (local squashed_dict_start, local squashed_dict_end) = dict_squash(
        dict_accesses_start, dict_accesses_end
    );
    local range_check_ptr = range_check_ptr;

    default_dict_finalize_inner(
        dict_accesses_start=squashed_dict_start,
        n_accesses=(squashed_dict_end - squashed_dict_start) / DictAccess.SIZE,
        default_value=default_value,
    );
    return (squashed_dict_start=squashed_dict_start, squashed_dict_end=squashed_dict_end);
}

func default_dict_finalize_inner(
    dict_accesses_start: DictAccess*, n_accesses: felt, default_value: felt
) {
    ...
    assert dict_accesses_start.prev_value = default_value;
    ...
}
```

As shown above, the additional check besides `dict_squash` is:

```rust
assert dict_accesses_start.prev_value = default_value;
```

This constraint ensures that any uninitialized read from the dictionary returns the correct default value (`0` in this case). However, in `default_dict_copy`, this constraint is absent; meaning the `prev_value` for the first dictionary entry of `transient_storage` is not guaranteed to match the expected default value.

### Impact

A malicious prover could manipulate the value read from `transient_storage`, `storage` and `valid_jumpdests`. Specifically, they could fabricate a proof where uninitialized keys in the dictionary return values other than the intended default (`0`). This could lead to unintended or unauthorized access to funds, manipulation of contract state, or other security breaches depending on the logic in the upper-level EVM contract.

### Assessed type

Invalid Validation

**[ClementWalter (Kakarot) confirmed and commented](https://github.com/code-423n4/2024-09-kakarot-findings/issues/91#issuecomment-2451968985):**
 > Severity: High

**[ClementWalter (Kakarot) commented](https://github.com/code-423n4/2024-09-kakarot-findings/issues/91#issuecomment-2490982941):**
 > After another round of review from Zellic, it appears that this is invalid (went to fast in the validation of the finding) as the `default_value` is asserted below in the loop
> 
> https://github.com/kkrt-labs/kakarot/commit/474951c7babbd57f06d074aa15ba7a2f1911af21#diff-18450849ea8d97868875c0b5eeb0934a496dbf959c60a5bcf9273ff5f2bbc298L117
> 
> 1. We pick as default value the first `prev_value`.
> 2. We consider that it's the default value for the whole dict.
> 3. We squash and copy the squashed dict into a new `default_dict` with the given `default_value`.
> 4. In the loop, we assert that the `squashed.prev_value == default_value`.

**[EV_om (Zenith) commented](https://github.com/code-423n4/2024-09-kakarot-findings/issues/91#issuecomment-2491042945):**
> @ClementWalter, we picked a long time at this finding and were under the impression that it was valid. It would be great to get your take on the below POC which we believe would work:
>
> - Construct a transaction the attempts to copy a dictionary with no subsequent reads from the same key.
> - Modify all `.prev_value`s so the dictionary can be successfully squashed (the prover has the ability to do this).
> - `default_value` of the new dict is set to our modified `prev_value`.
> - The check on L117 always passes.
> - In the next call stack, reads will return the modified value.

**[ClementWalter (Kakarot) commented](https://github.com/code-423n4/2024-09-kakarot-findings/issues/91#issuecomment-2491079520):**
> I don't get the first part:
>
>> - Construct a transaction the attempts to copy a dictionary with no subsequent reads from the same key
>> - Modify all `.prev_values` so the dictionary can be successfully squashed (the prover has the ability to do this)
>
> What dict squashing does is that it enforces the fact that the sequence of `DictAccess*` (filled by the prover at their will) is actually a valid sequence of dict read and write.
>
> So the `dict_squash` part is fine and after it, it's guaranteed that the dict was correctly used, but not yet that it was a default dict with a given value.
>
> Then we pick the first prev as `default_value` and we copy the squash dict into a new dict, asserting in the mean time that all the `prev_values` are actually equal to the one picked.
> 
> Eventually, it means that
> 1. The `DictAccess*` was a legit dict.
> 2. All the `prev_values` were equal to the same value.
>
> Maybe you can try to craft a failing test case?

**[EV_om (Zenith) commented](https://github.com/code-423n4/2024-09-kakarot-findings/issues/91#issuecomment-2491176061):**
> @ClementWalter, a full POC would take a bit of time, but maybe @3docSec has something lying around.
>
>> I don't get the first part
>> - Construct a transaction the attempts to copy a dictionary with no subsequent reads from the same key.
>
> You're right, this may not be necessary. Squashing prevents modifying the `prev_value` of an arbitrary entry if there are writes after a read (since it could be constrained to a previously written value), but it should still be possible to modify the default `prev_value`.
> 
> Otherwise, as the finding claims:
>
>> Specifically, `default_dict_finalize` enforces the constraint that the initial value of the first element's `prev_value` in the dictionary must equal to the `default_value`.
>
> This was never enforced in the code in scope. So we did have that:
>> 1. The `DictAccess*` was a valid sequence of dict read and write.
>> 2. All the prev_values were equal to the same value.
> 
> But it was not verified that:
> 
> 3. All the `prev_values` were equal to the original dictionary's default value, as they should be after squashing.

**[3docSec (Zenith) commented](https://github.com/code-423n4/2024-09-kakarot-findings/issues/91#issuecomment-2491449180):**
> Just adding that if we look at the code:
>
>```cairo
>    if (dict_len == 0) {
>        assert default_value = 0;
>    } else {
>        assert default_value = squashed_start.prev_value;
>    }
>```
>
> In the `else` branch, `squashed_start.prev_value` is the free bird that is never validated: if it was asserted to be `0` in any place, the code would've been safe.

**[ClementWalter (Kakarot) commented](https://github.com/code-423n4/2024-09-kakarot-findings/issues/91#issuecomment-2491828050):**
> There is a list of`DictAccess*`, filled initially at the prover's will (prover can put any values in these slots in `dict_read` and `dict_write`.
>
> Now squashing enforces that this "random" list is actually a valid list of `DictAccess*`, properly logging read and write of a regular dict (precisely that prev value is always sound with current value).
>
> The "default" part of the dict is ignored in the initial `squash_dict` where the prover could still have populated the dict with any initial values (possibly all different).
> 
> From this squash dict, the code pick the first `prev_value` (whatever it is is up to the prover).
>
> Then, it enforces that all the prev_keys are actually of this same prev_value, making it actually a `default_dict(prev_value)`.
> 
> At this point the `prev_value` is up to the prover, but it's guaranteed that it's still a `default_dict`.
>
> Note that this function is `default_dict_*copy*_`, so the purpose is only to copy a dict with the same default value, not to finalize it. At other places in the code we do use `default_dict_finalize(0)` to actually enforce the default values are 0.
> 
> Now, the issue may still be relevant if at some places, we don't call this `default_dict_finalize`, which actually happens (!) for the account's storage and `valid_jumpdest`.
> 
> So I guess that the issue is valid, not because the method itself, but because of missing `default_dict_finalize` for the account's dict.

**Kakarot mitigated:**
> [PR](https://github.com/kkrt-labs/kakarot/pull/1592) fix: `default_dict_copy` finalize with default value `0`. 

**Status:** Mitigation confirmed.

***
