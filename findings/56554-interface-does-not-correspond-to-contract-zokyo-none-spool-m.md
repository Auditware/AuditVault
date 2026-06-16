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
  - "[[permanent]]"
  - "[[reward-accounting]]"
---
# Interface does not correspond to contract.

- id: 56554
- impact: HIGH
- protocol: [[Spool]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-03-30-Spool.md

## Summary


The bug report is about a function called withdrawAllAndUnwrap() that is not working as expected. The problem is that the function is supposed to return a boolean value, but when it is called in the mainnet, it does not return anything. This causes an error and the program crashes. The recommendation is to fix the interface of the function so that it does not return anything.

## Details

**Description**

Line 26, function withdrawAllAndUnwrap(). In the interface, it is declared that function returns
bool, however the actual contract in mainnet doesn’t return anything, thus the call to the
contract in ConvexBoosterContractHelper(line 84) always reverts.

**Recommendation**:

Fix the interface. Function withdrawAllAndUnwrap() should not return anything.
