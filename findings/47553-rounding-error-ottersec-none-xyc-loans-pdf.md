---
tags:
  - lang/solidity
  - sector/lending
  - platform/ottersec
  - has/poc
  - severity/high
  - vuln/logic/fee-calculation
  - impact/loss-of-funds/direct-drain
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[XYC]]"
auditors:
  - "[[OtterSec]]"
report: "https://main.xycloans.app/"
genome:
  - "[[fee-calculation]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
  - "[[integer-bounds]]"
---
# Rounding Error

- id: 47553
- impact: HIGH
- protocol: [[XYC]] Loans
- reporter: OtterSec
- source: https://main.xycloans.app/

## Summary


The report describes a bug in a function called compute_fee_earned that calculates the earned fee for a user based on their balance and specific fee per share values. The function uses a rounding method called fixed_mul_ceil which rounds the result up to the nearest integer. However, in certain scenarios, this can result in unfair benefits for users with small deposits, draining the pool at the expense of users with larger deposits. An attacker can exploit this by repeatedly making small deposits and taking advantage of the rounding-up behavior to drain the pool of profits. The bug has been fixed in a recent patch.

## Details

## Compute Fee Earned

`compute_fee_earned` calculates the earned fee for a user based on their balance and specific fee per share values. The current implementation utilizes `fixed_mul_ceil` for multiplying the fee difference by the user’s balance. The ceil rounding method rounds the result up to the nearest integer. In certain scenarios, this may result in a situation where users with small deposits benefit unfairly, draining the pool at the expense of users with larger deposits.

## Code Implementation

```rust
pub fn compute_fee_earned(
    user_balance: i128,
    fee_per_share_universal: i128,
    fee_per_share_particular: i128,
) -> i128 {
    user_balance
        .fixed_mul_ceil(
            fee_per_share_universal.sub(fee_per_share_particular),
            STROOP.into(),
        )
        .unwrap()
}
```

Utilizing `fixed_mul_ceil` rounds it up even if the multiplication result has a fractional part. This creates a scenario where the platform might be overcompensating users with small balances.

## Proof of Concept

An example scenario is where the attacker exploits this by making small deposits, repeatedly taking advantage of the rounding-up behavior to drain the pool of profits. Since the multiplication rounds up, the computed fee for small balances becomes disproportionately larger than if rounded down. Users with larger deposits may receive less than they are entitled to, as the rounding method favors smaller balances. A test case implementing this scenario may be found in Appendix A.

## Remediation

Utilize a rounding method that does not favor the user.

## Patch

Fixed in `b26e012`.
