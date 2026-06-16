---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/staking
protocol: "[[Spool]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-03-30-Spool.md"
genome:
  - "[[wrong-condition]]"
  - "[[reward-accounting]]"
  - "[[direct-drain]]"
---
# New shares overwrite previously recorded shares.

- id: 56555
- impact: HIGH
- protocol: [[Spool]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-03-30-Spool.md

## Summary


This bug report is about a problem with a function called "_saveUserShares()" in a program. The report mentions specific lines of code (186 and 189) where the problem occurs. The issue is that the function is not adding the correct amount of shares and deposits to user balances. This can cause a problem if a user transfers shares without withdrawing them, and then calls another function called "withdrawFast()" multiple times without actually withdrawing any funds. This could result in the user losing some of their funds. The recommendation is to make changes to the code by adding some variables to ensure that the correct amounts are being assigned.

## Details

**Description**

line 186, 189, function _saveUserShares().
Shares and proportionateDeposit should be added to balances, instead of just being assigned.
Since a user is able to perform transfer shares without withdrawing them, it is possible that a
user calls vault.withdrawFast() several times without withdrawing funds(passing boolean
variable executeWithdraw as false). This way previously recorded shares will be overwritten
with new shares and the user might lose part of his funds.

**Recommendation**:

Add variables ‘proportionateDeposit’ to ‘vaultWithdraw.proportionateDeposit’ and
‘sharesWithdrawn[i]’ to ‘vaultWithdraw.userStrategyShares[vaultStrategies[i]]’ instead of just
assigning them.
