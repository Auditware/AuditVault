---
tags:
  - platform/pashov-audit-group
  - lang/solidity
  - has/github
  - has/poc
  - severity/high
  - sector/vault
protocol: "[[Yield Ninja]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2022-11-01-Yield Ninja.md"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
---
# [H-01] Incorrect user accounting in `withdraw` method

- id: 19123
- impact: HIGH
- protocol: [[Yield Ninja]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2022-11-01-Yield Ninja.md

## Summary


A bug has been discovered in the `withdraw` method in `NYProfitTakingVaultBaseV1`. The code incorrectly subtracts the `shares` burned instead of the `underlying` tokens deposited. This will cause incorrect user accounting as `shares` are not 1:1 with `underlying` tokens. 

The bug will cause two possible issues - if `_shares` is less than the amount withdrawn, then the user will be able to withdraw more than he deposited, creating a possibility to deplete the vault to zero. If `_shares` is more than the amount withdrawn, then the user will be able to withdraw less than he deposited, resulting in a loss of value for users.

To fix the bug, the code should be changed from `user.amount = user.amount - _shares;` to `user.amount = user.amount - r;`. This will ensure that the user accounting is correct and prevent any losses of value for users.

## Details

**Proof of Concept**

The `withdraw` method in `NYProfitTakingVaultBaseV1` does incorrect user accounting in the following line:

```solidity
user.amount = user.amount - _shares;
```

In the `deposit` method we use the `user.amount` to store the amount of `underlying` tokens deposited, but in `withdraw` instead of subtracting the `underlying` tokens the code subtracts the shares burned.

**Impact**

Since `shares` are not 1:1 with `underlying` this will completely mess up the user accounting on each withdraw. It is possible to be in two directions - if `_shares` was less than the amount withdrawn, then the user will be able to withdraw more than he deposited, essentially a possibility to deplete the vault to zero. If `_shares` was more than the amount withdrawn, then the user will be able to withdraw less than he deposited, essentially a loss of value for users.

**Recommendation**

Make the following change:

```diff
- user.amount = user.amount - _shares;
+ user.amount = user.amount - r;
```
