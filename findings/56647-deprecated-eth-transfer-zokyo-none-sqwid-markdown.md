---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/governance
protocol: "[[Sqwid]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-06-16-Sqwid.md"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[access-roles]]"
---
# Deprecated ETH transfer.

- id: 56647
- impact: HIGH
- protocol: [[Sqwid]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-06-16-Sqwid.md

## Summary


This bug report is about a problem in the code for a project called Governance.sol. The issue is with a function called withdraw() on line 163. There are also problems with other functions in a different part of the code called SqwidMarketplace, specifically on lines 214, 896, 918, and 1181. This problem was caused by an update to the EVM (Ethereum Virtual Machine) called the Istanbul update. This update made some methods, like .transfer() and .send(), no longer work for sending ETH (Ethereum). The report recommends using a different method called .call() and checking the results, or using a library called OpenZeppelin to fix this issue and prevent any future problems with updates to the EVM.

## Details

**Description**

 Governance.sol: function withdraw(), line 163.
 SqwidMarketplace: withdraw() line 214, fundLoan() line 896, repayLoan() line 918, 
_createItemTransaction() line 1181
 Due to the Istanbul update there were several changes provided to the EVM, which made 
.transfer() and .send() methods deprecated for the ETH transfer. Thus it is highly 
recommended to use .call() functionality with mandatory result check, or the built-in 
functionality of the Address contract from OpenZeppelin library. This should be done in 
order to mitigate any possible future update of EVM for the Reef Chain.
 
 **Recommendation**:
 
 Correct ETH sending functionality
