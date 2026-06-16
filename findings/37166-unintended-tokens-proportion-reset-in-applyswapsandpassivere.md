---
tags:
  - lang/solidity
  - sector/dex
  - platform/zokyo
  - has/github
  - severity/high
  - precondition/uninitialized
protocol: "[[Aarna]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-01-04-aarna.md"
genome:
  - "[[wrong-condition]]"
  - "[[data/uninitialized]]"
  - "[[direct-drain]]"
  - "[[initializer-auth]]"
  - "[[timestamp-dependence]]"
---
# Unintended tokens proportion reset in `applySwapsAndPassiveRebal` function

- id: 37166
- impact: HIGH
- protocol: [[Aarna]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-01-04-aarna.md

## Summary


This bug report discusses a critical issue in the AFiBase contract, which is used for depositing funds. The problem occurs when the strategy number is not equal to 1, causing an empty array to be returned. This can lead to unintended consequences for the protocol's functioning. The report recommends updating the array only when the strategy number is 1, and the bug has been resolved.

## Details

**Severity**: Critical

**Status**:  Resolved

**Description**

The `applySwapsAndPassiveRebal` function, which is called in the deposit function of AFiBase contract, depending on certain conditions, invokes the applyRebalForProportions function in the AFiPassiveRebalanceStrategies contract. The problem arises when the strategy number is anything other than 1, leading to the return of an empty array. This could potentially reset the token proportions in the AFiBase contract, which can have unintended consequences on the functioning of the protocol.

The function applySwapsAndPassiveRebal checks if the strategy number is equal to or above 1.

If this condition is satisfied, it calls applyRebalForProportions function.
```solidity
   if (
     typeOfProduct == 2 &&
     isPassiveRebalEnabled &&
     (block.timestamp - lastRebalTime >= rebalPeriod) &&
     strategy >= 1
   ) {
     uTokenProportions = rebalContract.applyRebalForProportions(
       address(this),
       aFiManager,
       address(aFiStorage),
       strategy,
       uTokens
     );
```
Within applyRebalForProportions, an uninitialized array uTokenProportions is created. If the strategy number passed is 1, uTokenProportions is updated. However, for any other number (e.g., 2), it remains empty and is subsequently returned.
```solidity
uint[] memory uTokenProportions = new uint[](_tokens.length);
   if (_strategyNumber == 1) {
     uTokenProportions =  IAFiManager(_aFiManager).updateUTokenProportion(_aFiContract, _aFiStorage);
   }
   return uTokenProportions;
```
This will lead to unintended behaviors when trying to perform swaps, rebalances, or any other operations that rely on token proportions.

**Recommendation**: Update the uTokenProportions only when the strategy number is 1.

**Fix**: The vulnerability has been fixed as recommended.
