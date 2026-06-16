---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/dex
  - sector/lending
  - sector/stable
protocol: "[[Ostium]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Ostium-security-review_2025-09-14.md"
genome:
  - "[[liquidation-logic]]"
  - "[[indirect-loss]]"
  - "[[liquidation-underwater]]"
  - "[[reward-accounting]]"
---
# [H-03] LP providers will not get liquidation fee most times

- id: 65201
- impact: HIGH
- protocol: Ostium_2025-09-14
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Ostium]]-security-review_2025-09-14.md

## Summary


The report highlights a bug in the code where the function `receiveAssets()` is not working as intended. This function is used to send funds to a vault when liquidation occurs. The bug has two main issues: 

1. The funds received by `receiveAssets()` do not immediately affect the share price, which means that some users may not receive their rewards if they interact with the vault before the rewards distribution is finalized. 

2. The funds received by `receiveAssets()` are being accumulated with a variable called `accPnlPerToken` as traders' losses. However, the code does not take into account these accumulated losses when calculating the share price in the function `updateShareToAssetsPrice()`. This means that if a trader has a negative net profit, the liquidation fee will not affect the share price, contrary to what is stated in the documentation. 

To fix this bug, the report recommends using the function `distributeReward()` to distribute the liquidation fee. This will ensure that the share price is affected immediately and that accumulated losses are taken into account when calculating the share price. 

## Details


_Acknowledged_

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

When liquidation happens, code use function `receiveAssets()` to send funds to the vault:
```solidity
        // 3 USDC vault reward
        if (liquidationFee > 0) {
            storageT.transferUsdc(address(storageT), address(this), liquidationFee);
            vault.receiveAssets(liquidationFee, trade.trader);
            emit VaultLiqFeeCharged(orderId, tradeId, trade.trader, liquidationFee);
        }
```
The issue is that:
1- funds received by `receiveAssets()` don't affect the share price immediately, and some users won't receive those rewards if they interact with the vault before the rewards distribution finalization.
2- funds received by `receiveAssets()` is accumulated with variable `accPnlPerToken` as traders loss, and code doesn't consider this accumulated trader losses for share calculation if `accPnlPerToken < 0` in function `updateShareToAssetsPrice()`.

As a result of #2 if traders net profit was negative, then the liquidation fee won't affect the share price, unlike what's described in the documentation. 

## Recommendations
Use function `distributeReward()` to distribute the liquidation fee.
