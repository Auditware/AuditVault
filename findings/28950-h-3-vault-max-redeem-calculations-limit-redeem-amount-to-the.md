---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/lending
protocol: "[[Perennial]]"
auditors:
  - "[[panprog]]"
report: "https://github.com/sherlock-audit/2023-10-perennial-judging"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[integer-bounds]]"
---
# H-3: Vault max redeem calculations limit redeem amount to the smallest position size in underlying markets which can lead to very small max redeem amount even with huge TVL vault

- id: 28950
- impact: HIGH
- protocol: [[Perennial]]
- reporter: panprog (Sherlock)
- source: N/A

## Summary


This bug report is about an issue with the Vault max redeem calculations in the Perennial protocol. The issue is that the max redeem amount is limited to the smallest position size in the underlying markets, which can lead to very small max redeem amounts even with huge Total Value Locked (TVL) in the Vault. This can be a problem for users with large deposits, as they would need to make a lot of transactions to redeem their full amount, and would lose funds to gas. The underlying code snippet for the `maxRedeem` calculation is provided. The recommendation is to calculate max redeem by comparing target position vs current position and then target collateral vs current collateral instead of using only current position for calculations.

## Details

Source: https://github.com/sherlock-audit/2023-10-perennial-judging/issues/29 

## Found by 
panprog
## Summary

When redeeming from the vault, maximum amount allowed to be redeemed is limited by current opened position in each underlying market (the smallest opened position adjusted for weight). However, if any one market has its maker close to maker limit, the vault will open very small position, limited by maker limit. But now all redeems will be limited by this very small position for no reason: when almost any amount is redeemed, the vault will attempt to **increase** (not decrease) position in such market, so there is no sense in limiting redeem amount to the smallest position.

This issue can create huge problems for users with large deposits. For example, if the user has deposited $10M to the vault, but due to one of the underlying markets the max redeem amount is only $1, user will need to do 10M transactions to redeem his full amount (which will not make sense due to gas).

## Vulnerability Detail

Vault's `maxRedeem` is calculated for each market as:

```solidity
UFixed6 collateral = marketContext.currentPosition.maker
    .sub(marketContext.currentPosition.net().min(marketContext.currentPosition.maker))  // available maker
    .min(marketContext.closable.mul(StrategyLib.LEVERAGE_BUFFER))                       // available closable
    .muldiv(marketContext.latestPrice.abs(), registration.leverage)                     // available collateral
    .muldiv(totalWeight, registration.weight);                                          // collateral in market

redemptionAssets = redemptionAssets.min(collateral);
```

`closable` is limited by the vault's settled and current positions in the market. As can be seen from the calculation, redeem amount is limited by vault's position in the market. However, if the position is far from target due to different market limitations, this doesn't make much sense. For example, if vault has $2M deposts and there are 2 underlying markets, each with weight 1, and:

1. In Market1 vault position is worth $1 (target position = $1M)
2. In Market2 vault position is worth $1M (target position = $1M)

The `maxRedeem` will be limited to $1, even though redeeming any amount up to $999999 will only make the vault attempt to increase position in Market1 rather than decrease.

There is also an opposite situation possible, when current position is higher than target position (due to LEVERAGE_BUFFER). This will make maxredeem too high. For example, similar example to previous, but:

1. In Market1 vault position is worth $1.2M (target position = $1M)
2. In Market2 vault position is worth $1.2M (target position = $1M)

The `maxRedeem` will be limited to $1.44M (due to LEVERAGE_BUFFER), without even comparing the current collateral (which is just $1M per market), based only on position size.

## Impact

When vault's position is small in any underlying market due to maker limit, the max redeem amount in the vault will be very small, which will force users with large deposits to use a lot of transactions to redeem it (they'll lose funds to gas) or it might even be next to impossible to do at all (if, for example, user has a deposit of $10M and max redeem = $1), in such case the redeems are basically broken and not possible to do.

## Code Snippet

`maxRedeem` calculation:
https://github.com/sherlock-audit/2023-10-perennial/blob/main/perennial-v2/packages/perennial-vault/contracts/lib/StrategyLib.sol#L94-L98

## Tool used

Manual Review

## Recommendation

Consider calculating max redeem by comparing target position vs current position and then target collateral vs current collateral instead of using only current position for calculations. This might be somewhat complex, because it will require to re-calculate allocation amounts to compare target vs current position. Possibly max redeem should not be limited as a separate check, but rather as part of the `allocate()` calculations (reverting if the actual leverage is too high in the end)
