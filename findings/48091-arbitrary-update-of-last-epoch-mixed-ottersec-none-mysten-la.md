---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - sector/infra
protocol: "[[Sui]]"
auditors:
  - "[[Cauê Obici]]"
report: "https://mystenlabs.com/"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# Arbitrary Update Of Last Epoch Mixed

- id: 48091
- impact: HIGH
- protocol: [[Mysten Labs Sui]]
- reporter: Cauê Obici (OtterSec)
- source: https://mystenlabs.com/

## Summary


The bug report describes a problem in the suifrens.move and capy_labs.move files, which are written in the programming language Rust. The issue is related to a function called suifren_update_last_epoch_mixed, which is used to prevent users from mixing their SuiFrens without following a countdown period. However, since the function is public, users can set an arbitrary value for last_epoch_mixed and bypass the checks in the capy_labs::mix function. This could potentially lead to security issues. The suggested solution is to change the visibility of the function to public(friend). The bug has been fixed in a recent patch.

## Details

## Overview of `suifrens.move` and `capy_labs.move`

In `suifrens.move`, `suifren_update_last_epoch_mixed` sets the new epoch of mixed, which is intended to prevent users from frequently mixing their SuiFrens without following a countdown period. However, since the function is public, users may set an arbitrary value for `last_epoch_mixed` and bypass the checks in `capy_labs::mix`.

## Code Snippets

### `sources/suifrens.move` (RUST)

```rust
public fun suifren_update_last_epoch_mixed<T>(fren: &mut SuiFren<T>, epoch: u64) {
    fren.last_epoch_mixed = epoch;
}
```

### `sources/capy_labs.move` (RUST)

```rust
public fun mix<T>(
    app: &mut CapyLabsApp,
    sf1: &mut SuiFren<T>,
    sf2: &mut SuiFren<T>,
    clock: &Clock,
    birth_location: vector<u8>,
    ctx: &mut TxContext
): SuiFren<T> {
    [...]
    let last_epoch_mixed_1 = suifrens::suifren_last_epoch_mixed(sf1);
    let last_epoch_mixed_2 = suifrens::suifren_last_epoch_mixed(sf2);
    let epochs_passed_1 = current_epoch - last_epoch_mixed_1;
    let epochs_passed_2 = current_epoch - last_epoch_mixed_2;
    assert!(
        current_epoch == 0 ||
        (epochs_passed_1 >= app.cool_down_period &&
        epochs_passed_2 >= app.cool_down_period),
        EStillInCoolDownPeriod
    );
    [...]
}
```

## Remediation

- Set the visibility of the function to `public(friend)`.

## Patch

- Fixed in commit `b142be2`.
