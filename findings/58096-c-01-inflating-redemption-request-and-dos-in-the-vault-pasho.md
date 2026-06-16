---
tags:
  - lang/solidity
  - sector/lending
  - has/github
  - severity/high
protocol: "[[Astrolab]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Astrolab-security-review.md"
genome:
  - "[[dos-resistance]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
---
# [C-01] Inflating redemption request and DoS in the vault

- id: 58096
- impact: HIGH
- protocol: Astrolab
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Astrolab-security-review.md

## Summary


This bug report discusses a high severity issue in a vault system that can disrupt its primary functions and lead to a denial of service. The problem arises when users are able to inflate the `req.totalRedemption` value by submitting multiple redemption requests with different operator addresses. This leads to an increase in `pendingRedemption` and `req.totalClaimableRedemption`, which in turn causes the `sharePrice()` function to consistently revert. This calculation error results in a DoS for the entire protocol. To fix this issue, it is recommended to validate the `operator` in the `requestRedeem` function and ensure that an owner can only request redemption once.

## Details

## Severity

**Impact:** High, because this can disrupt all primary functionalities of the vaults, leading to a denial of service

**Likelihood:** High, because any vault share owner can exploit this easily

## Description

In `requestRedeem`, the function ensures that the shares requested for redemption are not greater than the owner's share balance. However, the operator parameter is not validated. This allows users to inflate the `req.totalRedemption` value by repeatedly submitting redemption requests with different operator addresses. The `req.totalRedemption` can be inflated to be larger than `totalAssets`.

        function requestRedeem(
            uint256 shares,
            address operator,
            address owner
        ) public nonReentrant {
            if (owner != msg.sender || shares == 0 || balanceOf(owner) < shares)
                revert Unauthorized();

This inflation of `totalRedemption` subsequently leads to an increase in `pendingRedemption` during the liquidate function call by the keeper, which in turn inflates `req.totalClaimableRedemption`

        uint256 pendingRedemption = totalPendingRedemptionRequest();

        req.totalClaimableRedemption += pendingRedemption;

The inflated `req.totalClaimableRedemption` disrupts the `sharePrice()` function, causing it to consistently revert. This is problematic as critical operations like deposit, mint, withdraw, and redeem rely on the `sharePrice` function.

        function sharePrice() public view virtual returns (uint256) {
            uint256 supply = totalAccountedSupply();
            return
                supply == 0
                    ? weiPerShare
                    : totalAccountedAssets().mulDiv( // eg. e6
                        weiPerShare ** 2, // 1e8*2
                        supply * weiPerAsset
                    ); // eg. (1e6+1e8+1e8)-(1e8+1e6)
        }

The sharePrice function reverts because the `totalAccountedAssets` calculation returns a negative value due to `totalAssets` being smaller than the inflated req.`totalClaimableRedemption`. This calculation error results in a DoS for the entire protocol.

        function totalAccountedAssets() public view returns (uint256) {
            return
                totalAssets() -
                req.totalClaimableRedemption.mulDiv(
                    last.sharePrice * weiPerAsset,
                    weiPerShare ** 2
                ); // eg. (1e8+1e8+1e6)-(1e8+1e8) = 1e6
        }

## Recommendations

To validate the `operator` in the `requestRedeem` function and ensure that an owner can only request redemption once, using their own shares.
