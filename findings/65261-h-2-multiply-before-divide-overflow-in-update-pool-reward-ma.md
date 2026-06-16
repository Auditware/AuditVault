---
tags:
  - lang/solidity
  - sector/lending
  - sector/stable
  - sector/uncollat-lending
  - platform/sherlock
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/known-pattern
protocol: "[[CurrentSUI]]"
auditors:
  - "[[0x37]]"
  - "[[0xpetern]]"
  - "[[6PottedL]]"
  - "[[Demonhatz]]"
  - "[[Edoscoba]]"
  - "[[Polaris_2]]"
  - "[[joshuam33]]"
  - "[[krikolkk]]"
  - "[[maigadoh]]"
  - "[[playerOfGames]]"
  - "[[shieldrey]]"
report: "https://github.com/sherlock-audit/2026-03-current-finance-judging"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
  - "[[reward-accounting]]"
  - "[[muldiv-overflow]]"
---
# H-2: Multiply-before-divide overflow in update_pool_reward_manager permanently freezes all lending operations for affected CoinType

- id: 65261
- impact: HIGH
- protocol: [[CurrentSUI]] Contest - March 2026
- reporter: 0xpetern (Sherlock)
- source: N/A

## Summary


This bug report is about an issue found in the code for a finance platform. The bug was discovered by a group of people and is considered to have a high impact. The issue is related to an arithmetic overflow in a function called `update_pool_reward_manager` which causes the platform to freeze all lending operations for a specific type of currency. This happens when a reward program with a realistic configuration is created and the platform is inactive for a period of time. Once triggered, the platform enters an irrecoverable deadlock and no admin function can fix it without a protocol upgrade. This bug can lead to permanent fund freeze, blocked liquidations, lost rewards, and no admin recovery. The severity of this bug is considered to be high and it is recommended to reorder the arithmetic or add a validation to prevent it from happening. 

## Details


Source: https://github.com/sherlock-audit/2026-03-current-finance-judging/issues/620 

## Found by 
0x37, 0xpetern, 6PottedL, Demonhatz, Edoscoba, Polaris\_2, joshuam33, krikolkk, maigadoh, playerOfGames, shieldrey

### High

## Summary

Arithmetic overflow in `update_pool_reward_manager` permanently freezes all lending operations (deposits, withdrawals, borrows, repays, liquidations, and reward claims) for the affected CoinType. The overflow occurs when `total_rewards * time_passed_ms > U64_MAX` inside `float::mul`, which is triggered by realistic reward configurations (e.g., 500K USDC over 30 days) after a modest period of pool inactivity (~10 hours). Once triggered, the pool enters an irrecoverable deadlock - no admin function can fix it without a protocol upgrade.

## Root Cause

In [`reward_manager.move:316-321`](https://github.com/pebble-protocol/sui-move-contract/blob/8a250918a763b63449a767482a4c4a5079b30893/contracts/protocol/sources/internal/liquidity/reward_manager.move#L316-L321), `unlocked_rewards` is computed as:

```move
let unlocked_rewards =
    float::from(pool_reward.total_rewards).mul(    // Step 1: from(total_rewards)
        float::from(time_passed_ms)                 // Step 2: .mul(from(time_passed_ms)) <-- OVERFLOW HERE
    ).div(
    float::from(pool_reward.end_time_ms - pool_reward.start_time_ms)
    );
```

The multiplication is performed **before** the division. In [`float.move:72-76`](https://github.com/pebble-protocol/sui-move-contract/blob/8a250918a763b63449a767482a4c4a5079b30893/contracts/math/sources/float.move#L72-L76):

```move
public fun mul(a: Decimal, b: Decimal): Decimal {
    Decimal {
        value: ensure_decimal_value_safe((a.value * b.value) / WAD),
    }
}
```

The intermediate result is `total_rewards * time_passed_ms * WAD` (after the u256 division by WAD). The `ensure_decimal_value_safe` check at [`float.move:145-148`](https://github.com/pebble-protocol/sui-move-contract/blob/8a250918a763b63449a767482a4c4a5079b30893/contracts/math/sources/float.move#L145-L148) enforces:

```move
fun ensure_decimal_value_safe(n: u256): u256 {
    assert!(n <= VALUE_MAX_256, math_error::decimal_value_overflow());  // VALUE_MAX_256 = U64_MAX * WAD
    n
}
```

This simplifies to: **`total_rewards * time_passed_ms <= U64_MAX`**. When the product exceeds `U64_MAX (≈ 1.844 × 10¹⁹)`, the assertion fires and the transaction **aborts**.

The division by `(end_time - start_time)` would normalize the result back to a safe range, but it is **never reached** because the `mul` aborts first. This is a classic **multiply-before-divide overflow** bug.

## Attack Path

1. Admin calls `add_liquidity_mining_rewards` to create a reward program: 500,000 USDC (= `5 × 10¹¹` atomic units at 6 decimals) over 30 days for a lending pool's deposit incentives. This is a normal, expected admin action for incentivizing deposits.

2. The pool has active depositors (`total_shares > 0`). During a period of low activity (weekend, overnight, or simply a new market), no deposit/withdraw/borrow/repay/liquidation transactions occur for the affected CoinType for **~10.25 hours**.

3. After this inactivity gap, any user attempts any lending operation involving the rewarded CoinType (e.g., deposit USDC, withdraw USDC, borrow USDC, repay USDC, or liquidate a position with USDC as collateral/debt).

4. The operation calls `update_obligation_reward_manager` → `update_pool_reward_manager`. Inside the loop, the overflow computation runs:
   - `time_passed_ms = 10.25 hours = 36,900,000 ms`
   - `total_rewards * time_passed_ms = 5×10¹¹ × 3.69×10⁷ = 1.845×10¹⁹ > U64_MAX (1.844×10¹⁹)`
   - `ensure_decimal_value_safe` **aborts** the transaction.

5. **Every subsequent attempt** to interact with this CoinType also aborts, because `last_update_time_ms` was never updated (the abort happens before line 335). The `time_passed` only grows larger with each passing moment, making the overflow worse.

6. The pool enters a **permanent deadlock**:
   - `cancel_pool_reward` → calls `update_pool_reward_manager` → **aborts**
   - `close_pool_reward` → requires `num_obligation_reward_managers == 0`, but users cannot claim (claim calls update → **aborts**), so close **fails**
   - All deposit/withdraw/borrow/repay → call update → **abort**
   - All liquidations involving this CoinType as debt or collateral → call `post_liquidation` which calls update → **abort**
   - No admin function exists to remove or modify the pool reward without triggering the update

7. Undercollateralized positions involving the frozen CoinType **cannot be liquidated**. Bad debt accumulates, risking protocol insolvency.

**Overflow thresholds for common reward amounts (USDC, 6 decimals):**

| Reward Amount | Max Inactivity Before Permanent Freeze |
|---|---|
| 10,000 USDC | ~21.3 days |
| 100,000 USDC | ~2.13 days |
| 500,000 USDC | ~10.25 hours |
| 1,000,000 USDC | ~5.12 hours |
| 10,000,000 USDC | ~30.7 minutes |

For SUI (9 decimals), 1,000 SUI triggers after ~5.12 hours of inactivity.

## Impact

- **Permanent fund freeze**: All users with deposits/borrows in the affected CoinType cannot withdraw or repay. Their funds are locked indefinitely with no recovery mechanism short of a protocol version upgrade.
- **Blocked liquidations**: Positions with the affected CoinType as collateral or debt cannot be liquidated. This causes unbounded bad debt accumulation, threatening protocol solvency.
- **Lost rewards**: Users who earned legitimate rewards cannot claim them.
- **No admin recovery**: The admin cannot cancel, close, or modify the overflowing reward because all such operations trigger the same overflow. The only fix requires deploying a new protocol version.

Under Sherlock DoS rules (III.3): funds are locked for more than a week (permanent), AND time-sensitive functions (liquidations) are impacted. Both criteria are met → **High severity**.

## Mitigation

Reorder the arithmetic to divide before multiplying, preventing the intermediate overflow:

```move
let unlocked_rewards =
    float::from(pool_reward.total_rewards).div(
        float::from(pool_reward.end_time_ms - pool_reward.start_time_ms)
    ).mul(
        float::from(time_passed_ms)
    );
```

This computes `(total_rewards / total_time) * time_passed` instead of `(total_rewards * time_passed) / total_time`. The intermediate `total_rewards / total_time` is always <= `total_rewards` (since `time_passed <= total_time`), so it fits within `VALUE_MAX_256`. The final result is the same mathematically.

Alternatively, add a validation in `add_pool_reward` that rejects reward configurations where `total_rewards * (end_time_ms - start_time_ms) > U64_MAX`:

```move
assert!(
    (pool_reward.total_rewards as u256) * ((end_time_ms - start_time_ms) as u256) <= (U64_MAX as u256),
    error::liquidity_mining_reward_overflow_risk()
);
```
