---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/token
protocol: "[[Triall]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-07-09-Triall.md"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[reward-accounting]]"
---
# Incorrect total in case of whitelist re-setting

- id: 56031
- impact: HIGH
- protocol: [[Triall]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-07-09-Triall.md

## Summary


The bug report is about a problem with a function called setWhitelist() in a file called PrivateVesting.sol. The bug occurs on line 95 and affects the calculation of a variable called _totalDeposit. If the whitelist needs to be reset while there are deposits already made, the _totalDeposit is not calculated correctly. This is because the code subtracts the deposit amount from the _totalDeposit, but does not add the corresponding token amount for that user. As a result, the token amount is not considered for that user. The recommendation is to remove an unnecessary else statement and always add the token amount within the if statement.

## Details

**Description**

PrivateVesting.sol, setWhitelist(), line 95
In case if whitelist should be re set (there are some deposits set), the _totalDeposit will be
calculated incorrectly. In case if the user has a deposit (line 94), its value is subtracted from the
_totalDeposit, but is never increased by _tokenAmount[] for this user. In spite of the
deposit[user] value is actually changed to _tokenAmount[index]. Thus, the token amount is
not taken into the consideration for that user.

**Recommendation**:

else statement is unneeded. Subtract deposit[user] value within the if statement and
always perform the addition of _tokenAmount[index] value.
