---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/lending
  - sector/oracle
protocol: "[[Cedro Finance]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-03-19-Cedro Finance.md"
genome:
  - "[[liquidation-logic]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
---
# Minted `ceTokens` not added to users list if minted using `Repay()`

- id: 37520
- impact: HIGH
- protocol: [[Cedro Finance]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-03-19-Cedro Finance.md

## Summary


The bug report states that there is a problem in the `repay(...)` method in the Contract Core.sol file. This method allows a user to deposit more than the required amount, which results in the creation of `ceTokens` for the user. However, these `ceTokens` are not added to the user's record using the `_addToken(...)` method. This leads to issues with the `borrow(...)` method and puts the user at risk of having their collateral liquidated. The recommended solution is to add the `ceToken` using the `_addToken(...)` method when a user mints `ceTokens` through the `repay(...)` method. 

## Details

**Severity**: High

**Status**: Resolved

**Description**

In Contract Core.sol, the method `repay(...)` allows a user to deposit any extra amount more than the repay amount. This deposit mints `ceTokens` for the user but the same is not added using `_addToken(...)` method to keep a record of all the `ceTokens` held by the user.

This impacts the `borrow(...)` for the user or risk liquidation of users collateral because the earlier minted ceTokens will not be counted towards the health factor calculation because of the following logic:
```solidity
function healthFactor(
       address user
   ) public view returns (Data.HealthData memory health) {
       bytes32[] memory ids = users[user];
       if (ids.length > 0) {
           uint256[] memory prices = oracle.getPrices(ids);
           for (uint256 i; i < ids.length; i++) { … }
     … }
 … }
```
Here only ids in the `users[user]` list are used for calculating the health factor. 

**Recommendation**: 

Add the `ceToken` using `_addToken(...)` for users using `repay(...)` to mint ceTokens.
