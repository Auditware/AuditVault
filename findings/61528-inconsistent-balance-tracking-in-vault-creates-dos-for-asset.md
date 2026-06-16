---
tags:
  - lang/solidity
  - sector/lending
  - sector/vault
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
protocol: "[[CAP Labs Covered Agent Protocol]]"
auditors:
  - Benjamin Samuels
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-05-caplabs-coveredagentprotocol-securityreview.pdf"
genome:
  - "[[dos-resistance]]"
  - "[[variant]]"
---
# Inconsistent balance tracking in vault creates DoS for asset borrowing

- id: 61528
- impact: HIGH
- protocol: CAP Labs Covered Agent Protocol
- reporter: Benjamin Samuels (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-05-caplabs-coveredagentprotocol-securityreview.pdf

## Summary


This report discusses a high difficulty data validation bug in the borrowing functionality of an asset in a vault. This bug can cause negative available balances, which breaks the core protocol functionality. The issue arises due to inconsistent accounting practices in the codebase, where some functions use `totalSupplies` and `totalBorrows` variables, while others use direct `balanceOf` token queries. The report also provides code snippets of the affected functions and explains how the bug can be exploited. To fix this bug, the report recommends modifying the `burn` function to validate withdrawals against the available balance and implementing a consistent token tracking strategy in the long term.

## Details

## Data Validation Vulnerability Report

**Diﬃculty:** High  
**Type:** Data Validation  

## Description

The borrowing functionality for an asset in the vault is vulnerable to DoS attacks due to inconsistent accounting practices. The system can enter a state where the fundamental invariant “total supply of an asset should never be less than total borrows” is violated, resulting in negative available balances that break core protocol functionality. 

The issue stems from inconsistent accounting approaches throughout the codebase, with some functions relying on `totalSupplies` and `totalBorrows` accounting variables of an asset while others use direct `balanceOf` token queries.

### Code Snippet: `burn` Function

```solidity
function burn(IVault.VaultStorage storage $, IVault.MintBurnParams memory params)
external
updateIndex($, params.asset)
{
    if (params.deadline < block.timestamp) revert PastDeadline();
    if (params.amountOut < params.minAmountOut) {
        revert Slippage(params.asset, params.amountOut, params.minAmountOut);
    }
    $.totalSupplies[params.asset] -= params.amountOut;
    IERC20(params.asset).safeTransfer(params.receiver, params.amountOut);
    ...
}
```
*Figure 5.1: Code snippet of the burn function in the VaultLogic contract that uses `totalSupplies` (contracts/vault/libraries/VaultLogic.sol#L111-L124)*

One such inconsistency is in the `burn` function shown in Figure 5.1, which decreases the accounting variable `totalSupplies` without validating against the available balance, while relying on the actual token balance for transfers. Therefore, if the vault has physical tokens that are not tracked in `totalSupplies` but are sufficient for the withdrawal amount, the transaction will succeed, thus reducing `totalSupplies` further and potentially below `totalBorrows`.

### Code Snippet: `availableBalance` Function

```solidity
function availableBalance(address _asset) external view returns (uint256 amount) {
    VaultStorage storage $ = getVaultStorage();
    amount = $.totalSupplies[_asset] - $.totalBorrows[_asset];
}
```
*Figure 5.2: Code snippet from `availableBalance` function in Vault contract (contracts/vault/Vault.sol#L206-L209)*

This can lead to a negative available balance, as the available balance is computed as the difference between `totalSupplies` and `totalBorrows` of an asset (Figure 5.2).

### Code Snippet: `maxBorrowable` Function

```solidity
uint256 assetDecimals = $.reservesData[_asset].decimals;
maxBorrowableAmount = remainingCapacity * (10 ** assetDecimals) / assetPrice;

// Get total available assets using the vault's availableBalance function
uint256 totalAvailable = IVault($.reservesData[_asset].vault).availableBalance(_asset);

// Limit maxBorrowableAmount by total available assets
if (totalAvailable < maxBorrowableAmount) {
    maxBorrowableAmount = totalAvailable;
}
```
*Figure 5.3: Code snippet of `maxBorrowable` function (contracts/lendingPool/libraries/ViewLogic.sol#L83-L91)*

Once the invariant is broken for an asset, all borrowing operations for that asset will fail system-wide. This occurs because the `maxBorrowable` function relies on `availableBalance`, which returns a negative value when `totalSupplies < totalBorrows`.

## Exploit Scenario

A vault for asset A has a total supply of 100 tokens. Bob, an authorized agent, borrows 90 tokens, increasing the total borrows to 90 while total supply remains at 100. Mallory, who wants to brick the functionality of the vault, wants to withdraw 15 tokens, but the vault’s available balance is only 10 tokens. 

To circumvent this, she directly transfers 5 additional tokens to the vault (bypassing the mint function, so totalSupplies is not updated). She then initiates a burn operation to withdraw 15 tokens.

Since the contract physically has 15 tokens, the token transfer succeeds. The `burn` function decreases `totalSupplies` by 15, from 100 to 85, while `totalBorrows` remains at 90. As a result, the system enters an inconsistent state where `totalSupplies` (85) < `totalBorrows` (90), violating the theoretical definition that total supplies should always be greater than or equal to total borrows. When `availableBalance` is called, it returns -5, effectively breaking borrowing functionality for that specific asset across the protocol even though the contract may physically hold sufficient assets.

## Recommendations

- **Short Term:** Modify the `burn` function to validate withdrawals against the accounting-based available balance.
  
- **Long Term:** Implement a consistent token tracking strategy across the system and create comprehensive invariant tests that verify the relationship between `totalSupplies`, `totalBorrows`, and the actual token balances under various scenarios.
