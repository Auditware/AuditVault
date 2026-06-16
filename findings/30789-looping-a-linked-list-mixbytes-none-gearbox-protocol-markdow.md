---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/lending
protocol: "[[Gearbox]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Gearbox%20Protocol/Gearbox%20Protocol%20v.1/README.md#16-looping-a-linked-list"
genome:
  - "[[unbounded-loop]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Looping a linked list

- id: 30789
- impact: HIGH
- protocol: [[Gearbox Protocol]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Gearbox%20Protocol/Gearbox%20Protocol%20v.1/README.md#16-looping-a-linked-list

## Summary


The bug report is about a linked list called `_nextCreditAccount` in the code of a protocol called Gearbox. The list is used to link credit accounts together, but there is a problem with the `takeOut()` function which attaches a credit account to the credit manager. The issue is that the function does not check and reset the link to the next account, which can cause a loop in the list. This can happen when the `returnCreditAccount()` function is used, as it returns the credit account address to the end of the list with the old value still attached. The recommendation is to fix this by resetting the link to the next account after line 260 in the code.

## Details

##### Description
At the line: https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol#L40
there's a linked list called `_nextCreditAccount`.
In this list, the account address refers to the address of the next account. Thus, a chain of addresses linked to each other is formed.
At the  lines contracts/core/AccountFactory.sol#L248-L263 there's a `takeOut ()` function. It takes the credit account address from anywhere on the list and attaches it to the credit manager.
At the  lines: https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol#L186-L199

there's a function `returnCreditAccount ()`. It returns the credit account address in the tail of the `_nextCreditAccount` linked list.
In the `takeOut()` function there is no logic for checking and zeroing the link to the next account from the taken account address.
When the taken address is returned to the tail of the list, it will contain the old value of the address. Loop through the list may occur when the function `_countCreditAccountsInStock ()` is used for the line: https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol#L352-L365.

##### Recommendation
It is necessary to zero the next item from the linked list after the https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol#L260 line:
```
 _nextCreditAccount[creditAccount] = address(0);
```
