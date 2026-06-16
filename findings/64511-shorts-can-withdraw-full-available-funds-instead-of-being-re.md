---
tags:
  - lang/rust
  - lang/solidity
  - sdk/anchor
  - platform/cyfrin
  - has/github
  - severity/high
  - sector/dex
  - sector/lending
  - sector/perpetuals
  - sector/uncollat-lending
  - lang/anchor
protocol: "[[Deriverse]]"
auditors:
  - "[[RajKumar]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md"
genome:
  - "[[broken-logic]]"
  - "[[direct-drain]]"
  - "[[oracle-manipulation-resistance]]"
---
# Shorts can withdraw full available funds instead of being restricted to margin call limits in `perp-withdraw`

- id: 64511
- impact: HIGH
- protocol: [[Deriverse]] Dex
- reporter: RajKumar (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md

## Summary


This bug report is about a problem in the code for a program called perp_withdraw.rs. The code is supposed to detect when a user's short position in a financial market is in danger of losing money. However, it fails to do this correctly because it checks for long positions twice instead of checking for both long and short positions. This causes the code to incorrectly evaluate a variable called `margin_call` to be `false` instead of `true`, which can have two major impacts.

The first impact is that it allows users to withdraw more money than they should be able to. This is because the code calculates the amount of money a user can withdraw based on their margin call status. When the `margin_call` variable is `false`, the code allows users with short positions in danger of losing money to withdraw more money than they should be able to. This means that they can take out more money than they should be allowed to, which can lead to financial losses for the program.

The second impact is that it can cause the code to execute a function called `check_rebalancing()` when it shouldn't. This function is supposed to be called only when a user's position is not in danger of losing money. However, because the `margin_call` variable is incorrectly evaluated to be `false`, the code calls this function even when a user's short position is in danger of losing money. This can lead to incorrect actions being taken and further financial losses for the program.

To fix this bug, the report recommends replacing the current condition with a new one that checks for both long and short positions. This will ensure that the `margin_call` variable is correctly evaluated and the code functions as intended. The bug has been fixed in a recent commit and verified by another user. 

## Details

**Description:** In [perp_withdraw.rs](https://github.com/deriverse/protocol-v1/blob/f611019674f668681c3dbe074f8b7bc2ba846c97/src/program/processor/perp_withdraw.rs#L99), the margin call detection logic fails to detect for shorts ,where [is_long_margin_call()](https://github.com/deriverse/protocol-v1/blob/f611019674f668681c3dbe074f8b7bc2ba846c97/src/program/processor/perp_withdraw.rs#L147) is called twice instead of checking both long and short positions:
```rust
        engine.check_long_margin_call()?;
        engine.check_short_margin_call()?;
        //@audit both are long, one should be short
        let margin_call = engine.is_long_margin_call() || engine.is_long_margin_call();
        if !margin_call {
            engine.check_rebalancing()?;
}
```
When a user has a short perpetual position that is in margin call (underwater/undercollateralized), the `margin_call` variable incorrectly evaluates to false because:
- `is_long_margin_call()` returns `false` for short positions
- The duplicate call also returns `false`
- Result: [margin_call = false || false = false]

**Impact:**
1. Bypassed Withdrawal Restrictions
The withdrawal amount calculation differs based on margin call status:
```rust
let amount = if margin_call {
    // Limited withdrawal - only excess margin above requirements
    let margin_call_funds = funds.min(engine.get_avail_funds(client_state.temp_client_id, true)?);
    if margin_call_funds <= 0 {
        bail!(ImpossibleToWithdrawFundsDuringMarginCall);
    }
    // Restricted amount
} else if data.amount == 0 {
    funds  // Full funds available - NO RESTRICTIONS
} else {
    // Normal withdrawal
};
```
This lets users with underwater short positions withdraw full available funds instead of being restricted to margin call limits. This allows extraction of collateral that should be locked to cover their short position's potential losses.

2. Incorrect Rebalancing Execution
When `margin_call` is incorrectly `false` for short positions in margin call, `check_rebalancing()`is called when it shouldn't be..

**Recommended Mitigation:** Replace current condition to this:
```rust
let margin_call = engine.is_long_margin_call() || engine.is_short_margin_call();
```
**Deriverse:** Fixed in commit: https://github.com/deriverse/protocol-v1/commit/4f7bc8ac68325aa93b339ff91c0ac794ea17ffd9

**Cyfrin:** Verified.
