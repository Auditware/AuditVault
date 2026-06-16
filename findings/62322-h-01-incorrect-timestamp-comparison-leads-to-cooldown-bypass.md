---
tags:
  - lang/move
  - lang/rust
  - platform/pashov
  - has/github
  - severity/high
  - sector/lending
  - sector/staking
protocol: "[[Elixir]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Elixir-security-review_2025-08-17.md"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# [H-01] Incorrect timestamp comparison leads to cooldown bypass

- id: 62322
- impact: HIGH
- protocol: Elixir_2025-08-17
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Elixir]]-security-review_2025-08-17.md

## Summary


A bug was found in the `sdeusd.move` function where the cooldown duration is not properly checked. This results in the cooldown duration always passing, making it ineffective. The cause of this is the use of different time units in the code. The recommendation is to use the same time unit for comparison to fix the bug.

## Details


_Resolved_

## Severity

**Impact:** Medium

**Likelihood:** High

## Description
In `sdeusd.move`, unstake uses `clock::timestamp_ms(clock)` (milliseconds) to compare against `cooldown_end`, which is set using `clock_utils::timestamp_seconds(clock)` (seconds). As a result, the check:

```rust
assert!(current_time >= cooldown.cooldown_end || management.cooldown_duration == 0, EInvalidCooldown);
```
always passes, since current_time (ms) is ~1000× larger than cooldown_end (s).

Code in `update_user_cooldown`:

```rust
fun update_user_cooldown(
    management: &mut SdeUSDManagement,
    user: address,
    amount: u64,
    clock: &Clock,
) {
    if (management.cooldowns.contains(user)) {
        let cooldown = management.cooldowns.borrow_mut(user);
        cooldown.cooldown_end = clock_utils::timestamp_seconds(clock) + management.cooldown_duration;
        cooldown.underlying_amount = cooldown.underlying_amount + amount;
    } else {
        management.cooldowns.add(user, UserCooldown {
            cooldown_end: clock_utils::timestamp_seconds(clock) + management.cooldown_duration,
            underlying_amount: amount,
        })
    };
}
```

Later in the `unstake` function:

```rust
[...]
    let current_time = clock::timestamp_ms(clock);
    assert!(
        current_time >= cooldown.cooldown_end || management.cooldown_duration == 0,//@audit-high compared to seconds ??
        EInvalidCooldown
    );
[...]
```

Finding a full description.

## Recommendations
Perform the comparison using `clock_utils::timestamp_seconds` in unstake.
