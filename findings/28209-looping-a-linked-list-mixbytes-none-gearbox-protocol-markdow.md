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
report: "https://github.com/mixbytes/audits_public/blob/master/GearBox%20Protocol/README.md#16-looping-a-linked-list"
genome:
  - "[[unbounded-loop]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Looping a linked list

- id: 28209
- impact: HIGH
- protocol: [[Gearbox]] Protocol
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/GearBox%20Protocol/README.md#16-looping-a-linked-list

## Summary


This bug report is about the Gearbox Protocol's codebase, specifically the AccountFactory.sol file. The code contains a linked list called _nextCreditAccount, which contains addresses that refer to the next account in the list. There is a function called takeOut() which takes the credit account address from anywhere on the list and attaches it to the credit manager. The function returnCreditAccount() returns the credit account address in the tail of the list. The bug is that when the taken address is returned to the tail of the list, it will contain the old value of the address. This can lead to a loop when the function _countCreditAccountsInStock() is used. The recommendation is to add a line of code to zero the next item from the linked list after the specified line.

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
