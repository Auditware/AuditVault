---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - platform/mixbytes
  - has/github
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[DForce]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/dForce/Lending%20v2/README.md#3-funds-may-freeze-on-the-timelock-if-the-beneficiary-does-not-implement-claim"
genome:
  - "[[missing-modifier]]"
  - "[[locked-funds]]"
  - "[[account-ownership]]"
  - "[[timelock-timestamp-bypass]]"
---
# Funds may freeze on the `TimeLock` if the beneficiary does not implement `claim()`

- id: 34260
- impact: HIGH
- protocol: [[DForce]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/dForce/Lending%20v2/README.md#3-funds-may-freeze-on-the-timelock-if-the-beneficiary-does-not-implement-claim

## Summary


The report states that there is a bug in the `TimeLock` contract where beneficiaries are unable to claim their locked assets if they are an immutable smart contract. This means that the assets become inaccessible to the beneficiary and can only be accessed if the smart contract owner intervenes manually. This bug is considered to be a high severity issue. The recommended solution is to allow any account to invoke the `claim` function to avoid this problem.

## Details

##### Description
Assets from the `TimeLock` can only be claimed by their respective beneficiaries via calling the `claim` function. However, if the beneficiary is an immutable smart contract with no ability to invoke `claim` against the `TimeLock`, the locked assets become inaccessible to the beneficiary. Given that some accounts will be unable to access their assets until the manual intervention of the smart contract owner, this issue is rated as high in severity.

Related code - procedure of agreement execution:
https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/DefaultTimeLock.sol#L81
##### Recommendation
We recommend allowing any account to invoke the `claim`.
