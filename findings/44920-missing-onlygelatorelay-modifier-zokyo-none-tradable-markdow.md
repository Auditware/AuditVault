---
tags:
  - lang/solidity
  - sector/staking
  - platform/zokyo
  - has/github
  - severity/high
  - vuln/access-control/missing-modifier
  - fix/add-access-control
  - novelty/variant
  - misassumption/admin-is-honest
protocol: "[[Tradable]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-09-01-Tradable.md"
genome:
  - "[[missing-modifier]]"
  - "[[add-access-control]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# Missing `onlyGelatoRelay` modifier

- id: 44920
- impact: HIGH
- protocol: [[Tradable]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-09-01-Tradable.md

## Summary


The bug report describes an issue with a contract called `TradableSideVault`. This contract has several methods that are used on behalf of users, but they are missing a key modifier called `onlyGelatoRelay`. This modifier is important for security purposes and should be added to these methods. The bug has been acknowledged and the methods in question have been removed.

## Details

**Severity**: High

**Status**: Acknowledged

**Description**

In Contract `TradableSideVault`, there are several methods that are “ForUser” meaning those methods will be called on behalf of a user and using _msgSender() for getting the address for the user.

Although these methods are using _msgSender(), they are missing the onlyGelatoRelay modifier. It defeats the purpose of having another method with the only difference of using _msgSender(). 

```solidity
function stakingAccountDepositForUser(
address token,
uint256 amount
) external {
 
function stakeFromMarginAccountForUser(
address token,
uint256 amount
) external {

function withdrawalRequestForUser(
WithdrawalType withdrawalType,
address token,
uint256 amount
) external {
```

**Recommendation**: 

Add `onlyGelatoRelay` modifier to the above methods.

**Fixed**: Acknowledged and removed these methods.
