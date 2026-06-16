---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - sector/staking
protocol: "[[YuzuUSD]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/YuzuUSD-security-review_2025-08-28.md"
genome:
  - "[[fee-manipulation]]"
  - "[[fee-theft]]"
  - "[[fee-accounting]]"
---
# [H-03] Fee avoidance possible by uncollected fees in pool accounting

- id: 62758
- impact: HIGH
- protocol: YuzuUSD_2025-08-28
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[YuzuUSD]]-security-review_2025-08-28.md

## Summary


This bug report is about an issue with two contracts, YuzuILP and StakedYuzuUSD, where fees collected during withdrawals and redemptions are not being properly separated from the pool's available assets. This means that fees collected by previous redemptions are benefiting remaining shareholders instead of being collected by the protocol. The report includes a scenario where this bug can be exploited and offers recommendations for fixing the issue, including properly collecting fees and modifying the accounting to track them separately.

## Details


_Resolved_

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

Both `YuzuILP` and `StakedYuzuUSD` contracts have an accounting issue where fees collected during withdrawals and redemptions are not properly separated from the pool's available assets. This creates an opportunity to minimize fees as the remaining shares benefit from the fees collected by previous redemptions.

- In `YuzuILP._withdraw()`, when a user redeems shares, the fee is deducted from the assets they receive, but the fee amount remains in the `poolSize`.

- Similarly, in `StakedYuzuUSD._initiateRedeem()`, when shares are burned during redeem order initiation, the `totalSupply` decreases, but the underlying assets (including any fees) remain in the contract.

This means the fee stays as part of the pool's available assets, benefiting remaining shareholders rather than being collected by the protocol.

**Consider the following scenario**:
0. User A and User B deposit assets into the vault and receive shares.
    - User A deposit 100 `yzUSD` and receive 100 `st-yzUSD`.
    - User B deposit 100 `yzUSD` and receive 100 `st-yzUSD`.
    - **Redeem fee is 10%**.

1. User A initiate a full redemption of 100 st-yzUSD`.
    - Applying fee as `(100) - (100*0.1/1.1) = 90.9090909 yzUSD`
    - `totalPendingOrderValue` += 90.9 `yzUSD`
    - `totalSupply` -= 100 `st-yzUSD` = 100 `st-yzUSD`
    - `totalAssets` = 200 `yzUSD` - 90.9 `yzUSD` = 109.1 `yzUSD`
    
2. User B initiate a full redemption of 100 `st-yzUSD`.
    - Now 100 `st-yzUSD` worth `totalAssets() = 109.1 `yzUSD`
    - Applying fee as `(109.1) - (109.1*0.1/1.1) = 99.1090909 `yzUSD`
    - `totalPendingOrderValue` += 99.1090909 `yzUSD` = 90.9 + 99.1090909 `yzUSD` = 190 `yzUSD`
    - `totalSupply` -= 100 `st-yzUSD` = 0 `st-yzUSD`
    - `totalAssets` = 200 `yzUSD` - 190 `yzUSD` = 10 `yzUSD`

3. **Result**: 
    - Net User A paid 10% fee: `((100 - 90.9090909) / 100) * 100`
    - Net User B paid 0.8909091% fee: `((100 - 99.1090909) / 100) * 100`

**Proof of Concept**: 
- [test_audit_feeHasNotBeenCollected_StateProof](https://gist.github.com/merlinboii/b125979b081266de2491e883712713fc#file-yuzuilp-t-sol-L24)
- [test_audit_feeHasNotBeenCollected_MinimizeRedeemFee](https://gist.github.com/merlinboii/b125979b081266de2491e883712713fc#file-yuzuilp-t-sol-L71)

## Recommendation

- Properly collect fees from the pool's available assets. When fees are collected during withdrawals or redemptions, the fees should be transferred to a separate fee vault or treasury address rather than remaining in the pool.

- Modify the accounting to track collected fees separately and exclude them from the `totalAssets()` and all vault's calculations.
