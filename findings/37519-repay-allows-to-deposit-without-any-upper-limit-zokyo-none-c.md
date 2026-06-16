---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/bridge
  - sector/lending
protocol: "[[Cedro Finance]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-03-19-Cedro Finance.md"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[bridge-message-validation]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Repay allows to deposit without any upper limit

- id: 37519
- impact: HIGH
- protocol: [[Cedro Finance]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-03-19-Cedro Finance.md

## Summary


The bug report is about a problem in two contracts, Contract Branch.sol and Contract Core.sol. The problem is that the method "repayRequest" in Contract Branch.sol allows users to repay their loan amount without checking the amount being repaid. This means that any user can repay any amount, even if it is more than the loan amount. In Contract Core.sol, the "repay" method allows users to deposit and mint ceTokens for any amount without any limit, even after the deposit cap has been reached. The recommendation is to add a check in the "repayRequest" method to prevent users from depositing more than the deposit cap. The bug has been marked as resolved.

## Details

**Severity**: High

**Status**: Resolved

**Description**

In Contract Branch.sol, the method repayRequest(...) allows any user to repay their loan amount. However, there is no check on the amount being repaid. 

In Contract Core.sol, the repay(..) has the logic to deposit any extra amount other than the repay amount and mint ceTokens for the user.
Any user can use this method to deposit and mint ceTokens for any amount without any upper limit even after the deposit cap has been reached.

**Recommendation**: Add a check on `repayRequest(...)` method to not allow deposit amount more than the deposit cap.
