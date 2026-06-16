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
report: "https://github.com/mixbytes/audits_public/blob/master/GearBox%20Protocol/README.md#17-no-checking-of-element-properties-when-returning-it-to-the-list"
genome:
  - "[[unchecked-return-value]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# No checking of element properties when returning it to the list

- id: 28210
- impact: HIGH
- protocol: [[Gearbox]] Protocol
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/GearBox%20Protocol/README.md#17-no-checking-of-element-properties-when-returning-it-to-the-list

## Summary


The bug reported is related to the function `returnCreditAccount ()` in the `AccountFactory.sol` file. The bug is that the address is not being added to the `creditAccounts` array when it has never been registered in an `AccountFactory`. This check is done at the line contracts/core/AccountFactory.sol#L192 where the value of `since ()` is checked to not be equal to `block.number`. However, as the address has never been registered, it will pass this check too. 

The recommendation to fix this bug is to make a code correction at the line contracts/core/AccountFactory.sol#L192, where the check should be made that `ICreditAccount(usedAccount).since() != block.number && ICreditAccount(usedAccount).since() > 0`. This will ensure that the address is added to the `creditAccounts` array and the logic of the entire contract is not violated.

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
