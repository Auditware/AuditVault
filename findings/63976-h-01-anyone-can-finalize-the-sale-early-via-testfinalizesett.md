---
tags:
  - lang/solidity
  - platform/shieldify
  - has/github
  - severity/high
  - impact/dos/permanent
  - sector/bridge
protocol: "[[Harmonix Finance]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/HarmonixFinance-TokenSale-Hyperliquid-Security-Review.md"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# [H-01] Anyone Can Finalize the Sale Early via `testFinalizeSettlement()`

- id: 63976
- impact: HIGH
- protocol: Harmonixfinance Tokensale Hyperliquid
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/HarmonixFinance-TokenSale-Hyperliquid-Security-Review.md

## Summary


The bug report describes a problem with a function called `testFinalizeSettlement()` in a smart contract called `HarTokenSale.sol`. The function is publicly available, meaning anyone can use it, and does not have any checks in place to make sure it is being used correctly. This means that someone could use this function to freeze the contract and prevent anyone from making purchases. The bug has a high risk level and could result in a denial of service attack, where no one can use the contract. The team has responded by fixing the issue and removing the problematic function. 

## Details


## Severity

High Risk

## Description

The `testFinalizeSettlement()` is publicly callable and lacks both an owner check and a time check. Any address can flip `settlementFinalized = true` at any time, freezing allocations and permanently blocking further purchases.

## Location of Affected Code

File: [contracts/token_sales/HarTokenSale.sol#L182-L185](https://github.com/harmonixfi/core-contracts/blob/72db1cc14bd3601a94a97e5096400599f5a72cac/contracts/token_sales/HarTokenSale.sol#L182-L185)

```solidity
function testFinalizeSettlement() external {
    require(!settlementFinalized, "Settlement: finalized");
    _finalizeSettlement();
}
```

## Impact

- Permanent DoS of `purchase()` for everyone (`require(!settlementFinalized)` fails).
- Allocations (`totalAccepted`, `priorityRaiseFilled`, `publicRaiseFilled`) get locked at attacker-chosen block, skewing results and preventing intended participation.

## Recommendation

Remove `testFinalizeSettlement()` in production.

## Team Response

Fixed.
