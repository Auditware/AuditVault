---
tags:
  - lang/solidity
  - platform/zokyo
  - has/github
  - severity/high
  - sector/dex
protocol: "[[1Inch]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-08-05-1inch.md"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[fot-slippage]]"
---
# Deprecated ETH transfer in LimitOrderProtocolRFQ.

- id: 57512
- impact: HIGH
- protocol: [[1Inch]]
- reporter: zokyo (Zokyo)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-08-05-1inch.md

## Summary


The bug report is about a function in the LimitOrder ProtocolRFQ.sol code, specifically line 165. This function is used to transfer ETH (a type of cryptocurrency) and it was affected by a recent update called Istanbul. This update made two methods, .transfer() and .send(), no longer usable for transferring ETH. Instead, it is recommended to use a different method called .call() and to check the results, or to use a built-in function from a library called OpenZeppelin. The report recommends fixing the code to use the correct ETH sending functionality. The issue has been resolved after the first audit.

## Details

**Description**

LimitOrder ProtocolRFQ.sol: function fillOrderRFQTo(), line 165. Due to the Istanbul update there were several changes provided to the EVM, which made .transfer() and .send() methods deprecated for the ETH transfer. Thus it is highly recommended to use .call() functionality with mandatory result check, or the built-in functionality of the Address contract from OpenZeppelin library.

**Recommendation**

Correct ETH sending functionality.

**Re-audit comment**

Resolved.
Post-audit
Fixed after the 1st audit iteration
