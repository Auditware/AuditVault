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
report: "https://github.com/mixbytes/audits_public/blob/master/Gearbox%20Protocol/Gearbox%20Protocol%20v.1/README.md#17-no-checking-of-element-properties-when-returning-it-to-the-list"
genome:
  - "[[unchecked-return-value]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# No checking of element properties when returning it to the list

- id: 30790
- impact: HIGH
- protocol: [[Gearbox Protocol]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Gearbox%20Protocol/Gearbox%20Protocol%20v.1/README.md#17-no-checking-of-element-properties-when-returning-it-to-the-list

## Summary


The bug report is about a function called "returnCreditAccount" in a code repository on GitHub. This function returns the address of a credit account in a linked list. The problem is that there is a line of code that checks if the value of "since()" is not equal to "block.number". However, this check also allows addresses that have never been registered in the "AccountFactory" to pass, which violates the logic of the contract. The recommendation is to correct the code by adding another condition to the check.

## Details

##### Description
At the lines: https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol#L186-L199
there's a function `returnCreditAccount ()`. It returns the credit account address in the tail of the `_nextCreditAccount` linked list.
For the line: https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/core/AccountFactory.sol#L192,
the check is made that the value of `since ()` is not equal to `block.number`.
If the address has never been registered in an `AccountFactory` it will pass this check too.
But this address will not be added to the `creditAccounts` array and the logic of the entire contract will be violated.

##### Recommendation
It is necessary to make a code correction at the line contracts/core/AccountFactory.sol#L192:
```
ICreditAccount(usedAccount).since() != block.number &&
ICreditAccount(usedAccount).since() > 0,
```
