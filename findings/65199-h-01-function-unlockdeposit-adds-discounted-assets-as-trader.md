---
tags:
  - lang/solidity
  - sector/perpetuals
  - platform/pashov
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/variant
protocol: "[[Ostium]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Ostium-security-review_2025-09-14.md"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[reward-accounting]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
---
# [H-01] Function `unlockDeposit()` adds discounted assets as traders profit and loss

- id: 65199
- impact: HIGH
- protocol: Ostium_2025-09-14
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Ostium]]-security-review_2025-09-14.md

## Summary


This bug report discusses an issue with the code that allows users to deposit funds and receive extra shares. When the lock on these deposits expires, the code adds the discounted assets to a variable called `accPnlPerToken` and updates the share price accordingly. However, this creates multiple problems. Firstly, it interferes with the tracking of traders' profit and loss, which is important for maintaining liquidity. Additionally, it does not change the share price when the accumulated value is negative, leading to a potential insolvency issue for the vault. The recommendation is to distribute the discounted assets by decreasing the variable `accRewardsPerToken` instead.

## Details


_Acknowledged_

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

Users can deposit their funds with a lock and receive extra shares. Later when those locks are expire, code adds the discounted assets to the variable `accPnlPerToken` and updates the share price to socialize the discounted assets.
```solidity
        int256 accPnlDelta = d.assetsDiscount.mulDiv(PRECISION_18, totalSupply(), Math.Rounding.Ceil).toInt256();

        accPnlPerToken += accPnlDelta;
        if (accPnlPerToken > maxAccPnlPerToken().toInt256()) {
            revert NotEnoughAssets();
        }

        lockedDepositNft.burn(depositId);

        accPnlPerTokenUsed += accPnlDelta;
        updateShareToAssetsPrice();
```
This creates multiple issues:
1. Variable `accPnlPerToken` is used to track traders profit, and loss and code uses net profit and loss to calculate share price if only the accumulated value is positive. Adding discounted assets to `accPnlPerToken` interferes with this accumulated net profit and loss of traders, which works as liquidity buffer.
2. Changing variable `accPnlPerToken` doesn't change share price when `accPnlPerToken < 0`. It means adding discounted deposits to `accPnlPerToken` won't change share price in those cases, and a as result vault would become insolvent because total supply includes the discounted assets, but share price doesn't reflect that, and `supply * price` would be higher than total assets.

## Recommendations
Distribute discounted assets by decreasing the variable `accRewardsPerToken`.
