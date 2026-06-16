---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/staking
protocol: "[[YuzuUSD]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/YuzuUSD-security-review_2025-08-28.md"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[reward-accounting]]"
---
# [H-01] Pending withdrawals in `YuzuILP` contract are not considered in totalAssets calculation

- id: 62756
- impact: HIGH
- protocol: YuzuUSD_2025-08-28
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[YuzuUSD]]-security-review_2025-08-28.md

## Summary


YuzuILP is a contract that calculates and records the asset amount a user is entitled to when creating a redeem order. However, a bug has been identified where the tokens being withdrawn are not excluded from vault accounting, causing the user to lose a portion of their rightful profits. The recommended solution is for the vault to prevent pending withdrawals from accruing additional yield by adjusting accounting to exclude them from totalAssets() and totalSupply() as soon as the redeem order is created.

## Details


_Resolved_

## Severity

**Impact:** Medium

**Likelihood:** High  

## Description

In `YuzuILP`, when a user creates a redeem order, the contract calculates and records the asset amount they are entitled to based on the vault price at that moment. 

```Solidity
    // from YuzuOrderBook file
    function createRedeemOrder(uint256 tokens, address receiver, address owner)
        public
        virtual
        returns (uint256, uint256)
    {
        if (receiver == address(0)) {
            revert InvalidZeroAddress();
        }
        uint256 maxTokens = maxRedeemOrder(owner);
        if (tokens > maxTokens) {
            revert ExceededMaxRedeemOrder(owner, tokens, maxTokens);
        }

        uint256 assets = previewRedeemOrder(tokens);
        address caller = _msgSender();
        uint256 orderId = _createRedeemOrder(caller, receiver, owner, tokens, assets);

        emit CreatedRedeemOrder(caller, receiver, owner, orderId, assets, tokens);

        return (orderId, assets);
    }
```

However, the tokens being withdrawn are not excluded from vault accounting and remain part of `totalAssets()` and `totalSupply()` until the order is finalized. This means that while the user’s redemption value is fixed, the tokens continue to accrue yield within the vault. When the user later finalizes the order, only the originally recorded asset amount is transferred, **while the yield that accumulated during the pending period remains in the vault**. This causes the withdrawing user to lose a portion of their rightful profits, and those profits are instead redistributed to the remaining participants.

## Recommendations

The vault should prevent pending withdrawals from accruing additional yield. This can be achieved by adjusting accounting to exclude them from `totalAssets()` and `totalSupply()` as soon as the redeem order is created.
