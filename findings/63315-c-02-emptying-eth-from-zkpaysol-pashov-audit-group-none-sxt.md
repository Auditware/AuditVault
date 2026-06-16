---
tags:
  - lang/solidity
  - sector/token
  - platform/pashov
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[SXT]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/SXT-security-review_2025-03-31.md"
genome:
  - "[[missing]]"
  - "[[direct-drain]]"
  - "[[extcall-return-validation]]"
---
# [C-02] Emptying ETH from `ZKPay.sol`

- id: 63315
- impact: HIGH
- protocol: SXT_2025-03-31
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[SXT]]-security-review_2025-03-31.md

## Summary


This bug report discusses a high severity and likelihood issue where an attacker can manipulate the ZKPay contract to withdraw a large amount of ETH without actually depositing any funds. This is done by calling the `ZKPay::query()` function with a specified amount of ETH and then cancelling the query to withdraw the funds. The recommendation is to add a condition that checks if the `asset` parameter is not equal to `NATIVE_ADDRESS` before executing the `ZKPay::query()` function.

## Details


## Severity

**Impact:** High

**Likelihood:** High

## Description

An attacker can call `ZKPay::query()`, which is supposed to be used with ERC20 tokens, but pass `NATIVE_ADDRESS` and specify a large amount of ETH. Then, `handleQueryPayment` will assume that this amount came from `msg.value`, so it will think the sender actually sent that ETH to the contract.
```solidity
    function query(address asset, uint248 amount, QueryLogic.QueryRequest calldata queryRequest)
        external
        returns (bytes32 queryHash)
    {
        return _query(asset, amount, queryRequest);
    }

    function handleQueryPayment(
        mapping(address asset => PaymentAsset) storage _assets,
        address assetAddress,
        uint248 tokenAmount
    ) internal returns (uint248 actualAmountReceived, uint248 amountInUSD) {
        if (!isSupported(_assets, assetAddress, PaymentType.Query)) {
            revert AssetIsNotSupportedForThisMethod();
        }

        if (assetAddress == NATIVE_ADDRESS) {
@>            actualAmountReceived = tokenAmount;
        } else {
            uint256 balanceBefore = IERC20(assetAddress).balanceOf(address(this));
            IERC20(assetAddress).safeTransferFrom(msg.sender, address(this), tokenAmount);
            uint256 balanceAfter = IERC20(assetAddress).balanceOf(address(this));

            actualAmountReceived = uint248(balanceAfter - balanceBefore);
        }

        amountInUSD = convertToUsd(_assets, assetAddress, actualAmountReceived);
    }
```
In the same transaction, the attacker cancels their query and withdraws the entire ETH amount. They haven’t deposited a single wei, but a `QueryPayment` for a large ETH amount was created, and now they’re able to withdraw it.

## Recommendations

Consider reverting if the simple `ZKPay::query` function is called with `asset == NATIVE_ADDRESS`.
```diff
    function query(address asset, uint248 amount, QueryLogic.QueryRequest calldata queryRequest)
        external
        returns (bytes32 queryHash)
    {
+       require(asset != NATIVE_ADDRESS);
        return _query(asset, amount, queryRequest);
    }
```
