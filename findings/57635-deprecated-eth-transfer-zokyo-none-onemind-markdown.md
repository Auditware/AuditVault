---
tags:
  - lang/solidity
  - platform/zokyo
  - has/github
  - severity/high
  - sector/vault
protocol: "[[Onemind]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-10-18-Onemind.md"
genome:
  - "[[frozen-funds]]"
  - "[[extcall-return-validation]]"
  - "[[locked-funds]]"
---
# Deprecated ETH transfer.

- id: 57635
- impact: HIGH
- protocol: [[Onemind]]
- reporter: zokyo (Zokyo)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-10-18-Onemind.md

## Summary


This bug report is about a function called Transfer() in a file called PlatformAuction.sol. Due to an update, the function was no longer working properly and needed to be fixed. The report suggests using a different function called call() instead. The issue has been resolved and the function has been updated.

## Details

**Description**

PlatformAuction.sol: function_currency Transfer().
Due to the Istanbul update, there were several changes provided to the EVM, which made .transfer() and .send() methods deprecated for the ETH transfer. It is highly recommended to use .call() functionality with mandatory result check or the built- in functionality of the Address contract from OpenZeppelin library.

**Recommendation**

Correct ETH sending functionality with the call() function.

**Re-audit comment**

Resolved.

Post-audit:
The deprecated ETH transfer function was replaced with the call() function.
