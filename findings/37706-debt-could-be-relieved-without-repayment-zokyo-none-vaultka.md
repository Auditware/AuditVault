---
tags:
  - lang/rust
  - sdk/anchor
  - has/github
  - platform/zokyo
  - severity/high
  - sector/lending
  - lang/anchor
protocol: "[[Vaultka]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-07-06-Vaultka.md"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Debt could be relieved without repayment

- id: 37706
- impact: HIGH
- protocol: [[Vaultka]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-07-06-Vaultka.md

## Summary


The bug report states that there is a critical issue in the code that has been resolved. The issue was found in a specific file called "lib.rs" in the "lending/programs/water" folder. The problem is with the "repay" function, which is supposed to increase the balance of a vault and decrease the borrowed amount. However, it is not receiving any payments to do so. The recommendation is to add a Transfer function to receive the payment from the borrower.

## Details

**Description**

the 'repay' function increases a vault_sol_balance and decreases a borrowed_amount without receiving any payments
File: lending/programs/water/src/lib.rs: 614

**Recommendation**

add a Transfer function to get the payment from the borrower

**Re-audit comment**

Resolved
