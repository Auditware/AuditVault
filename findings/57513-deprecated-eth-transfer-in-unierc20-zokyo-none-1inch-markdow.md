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
# Deprecated ETH transfer in UniERC20.

- id: 57513
- impact: HIGH
- protocol: [[1Inch]]
- reporter: zokyo (Zokyo)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-08-05-1inch.md

## Summary


The report highlights a bug in the UniERc20.sol contract, specifically in the functions uniTransfer() and uniTransferFrom(). Due to recent updates to the EVM, the transfer() and .send() methods for ETH transfers are no longer recommended and it is suggested to use .call() with result checks or the Address contract from OpenZeppelin. The recommendation is to fix the ETH sending functionality. The issue has been resolved after a re-audit.

## Details

**Description**

UniERc20.sol: function uniTransfer(), line 38. UniERc20.sol: function uniTransferFrom(), line 53. Due to the Istanbul update there were several changes provided to the EVM, which made transfer() and .send() methods deprecated for the ETH transfer. Thus it is highly recommended to use .call() functionality with mandatory result check, or the built-in functionality of the Address contract from OpenZeppelin library.

**Recommendation**

Correct ETH sending functionality.

**Re-audit comment**

Resolved
