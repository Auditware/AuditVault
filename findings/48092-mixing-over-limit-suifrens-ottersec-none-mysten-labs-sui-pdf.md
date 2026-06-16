---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - sector/lending
  - sector/options
protocol: "[[Sui]]"
auditors:
  - "[[Cauê Obici]]"
report: "https://mystenlabs.com/"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Mixing Over Limit Suifrens

- id: 48092
- impact: HIGH
- protocol: [[Mysten Labs Sui]]
- reporter: Cauê Obici (OtterSec)
- source: https://mystenlabs.com/

## Summary


The code in capy_labs.move is supposed to prevent users from mixing their Suifrens over a certain limit. However, there is a mistake in the code that allows users to mix their Suifrens even when they have reached the limit. This happens because the code uses the wrong value when setting the mixing limit for the second Suifren. This bug can be fixed by borrowing the correct value in the code. The issue has been resolved in the latest patch.

## Details

## Issue with Mixing Limit in Capy Labs

In `capy_labs.move`, `mix` ensures that users are unable to mix their Suifrens over a certain limit. However, a typo in the code results in the application allowing the minting of Suifrens with an insufficient `mixing_limit`. This issue occurs in the second `else` statement where the application borrows the value of `l1` instead of `l2` while setting the `mixing_limit` of the second Suifren.

## Affected Code

```rust
sources/capy_labs.move RUST
public fun mix<T>(
    app: &mut CapyLabsApp,
    sf1: &mut SuiFren<T>,
    sf2: &mut SuiFren<T>,
    clock: &Clock,
    birth_location: vector<u8>,
    ctx: &mut TxContext
): SuiFren<T> {
    [...]
    // Deal with mixing limits;
    {
        let l1 = mixing_limit(sf1);
        let l2 = mixing_limit(sf2);
        if (option::is_none(&l1)) {
            set_limit(sf1, app.mixing_limit - 1);
        } else {
            let limit = *option::borrow(&l1);
            assert!(limit > 0, EReachedMixingLimit);
            set_limit(sf1, limit - 1);
        };
        if (option::is_none(&l2)) {
            set_limit(sf2, app.mixing_limit - 1);
        } else {
            let limit = *option::borrow(&l1);
            assert!(limit > 0, EReachedMixingLimit);
            set_limit(sf2, limit - 1);
        };
    };
    [...]
}
```

## Remediation

Borrow the value of `l2` instead of `l1` in the second `else` statement.

## Patch

Fixed in commit `b142be2`.
