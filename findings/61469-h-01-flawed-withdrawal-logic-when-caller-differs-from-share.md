---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/lending
  - sector/token
  - sector/vault
protocol: "[[Blueberry]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Blueberry-security-review_2025-03-26.md"
genome:
  - "[[frozen-funds]]"
  - "[[temporary]]"
  - "[[account-ownership]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
---
# [H-01] Flawed withdrawal logic when caller differs from share owner

- id: 61469
- impact: HIGH
- protocol: Blueberry_2025-03-26
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Blueberry]]-security-review_2025-03-26.md

## Summary


The report describes a bug in the HyperEvmVault code where the `previewWithdraw()` and `previewRedeem()` functions are not functioning correctly. These functions are supposed to allow users to preview the amount of funds they can withdraw, but they are currently using the wrong account to calculate the amount. This can cause accounting issues and even a denial of service. The recommendation is to fix the code so that the correct account is used for the calculations.

## Details


## Severity

**Impact:** Medium

**Likelihood:** High

## Description

Withdrawals in HyperEvmVault have a custom behavior. Users need to first call `requestRedeem()` to move funds from L1 back to the EVM side. After this, available funds to be withdrawn are stored in the `redeemRequests` mapping.

These mechanics lead to a specialization of the `previewWithdraw()` and `previewRedeem()` functions. Instead of operating with the global supply or TVL values, these functions are implementended using the `redeemRequests` mapping:

```solidity
function previewWithdraw(uint256 assets_) public view override(ERC4626Upgradeable, IERC4626) returns (uint256) {
    V1Storage storage $ = _getV1Storage();
    RedeemRequest memory request = $.redeemRequests[msg.sender];
    return assets_.mulDivUp(request.shares, request.assets);
}

function previewRedeem(uint256 shares_) public view override(ERC4626Upgradeable, IERC4626) returns (uint256) {
    V1Storage storage $ = _getV1Storage();
    RedeemRequest memory request = $.redeemRequests[msg.sender];
    return shares_.mulDivDown(request.assets, request.shares);
}
```

Note that this forces the implementation to predicate over an account, which is chosen here to be `msg.sender`.

Withdrawals in ERC4626 also support a flow in which the caller could be different from the owner of the shares, leveraging ERC20 approvals. While this is correctly implemented in the overridden version of `_withdraw()`, the implementation still uses the preview functions that operate on `msg.sender`. This means that conversion will be calculated using the caller balances, but balances will be modified for the owner account, leading to accounting issues and a potential denial of service.

## Recommendations

Override the implementations of `withdraw()` and `redeem()` so that the `previewWithdraw()` and `previewRedeem()` actions execute the conversion on the owner (i.e. by using `$.redeemRequests[owner]`).
