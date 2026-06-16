---
tags:
  - lang/solidity
  - sector/governance
  - sector/liquid-staking
  - platform/mixbytes
  - has/github
  - severity/high
  - vuln/access-control/uninitialized-owner
  - precondition/uninitialized
  - novelty/variant
  - misassumption/proxy-is-initialized
  - fix/add-access-control
protocol: "[[Lido]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Lido/Deposit%20Security%20Module/README.md#1-possible-blocking-of-the-contract"
genome:
  - "[[uninitialized-owner]]"
  - "[[data/uninitialized]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[access-roles]]"
  - "[[initializer-auth]]"
---
# Possible blocking of the contract

- id: 28139
- impact: HIGH
- protocol: [[Lido]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Lido/Deposit%20Security%20Module/README.md#1-possible-blocking-of-the-contract

## Summary


This bug report is about the code in the line https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.8.9/DepositSecurityModule.sol#L123. The problem is that the `owner` variable is initialized without checking the new value of the variable. If the value of the variable is equal to zero, then certain functions will stop working. These functions include `setOwner()`, `setNodeOperatorsRegistry()`, `setPauseIntentValidityPeriodBlocks()`, `setMaxDeposits()`, `setMinDepositBlockDistance()`, `setGuardianQuorum()`, `addGuardian()`, `addGuardians()`, `removeGuardian()`, and `unpauseDeposits()`.

The recommendation to fix this bug is to add a check for the value of the `newValue` variable to zero before initializing the `owner` variable. This way, the functions that rely on the `owner` variable will continue to work properly.

## Details

##### Description
At the line 
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.8.9/DepositSecurityModule.sol#L123 
initializes the `owner` variable without checking the new value of the variable.
If the value of the variable is equal to zero, then the following functions will stop working:
`setOwner()`, `setNodeOperatorsRegistry()`, `setPauseIntentValidityPeriodBlocks()`, `setMaxDeposits()`,
`setMinDepositBlockDistance()`, `setGuardianQuorum()`, `addGuardian()`, `addGuardians()`, `removeGuardian()`, `unpauseDeposits()`.
##### Recommendation
It is necessary to add a check for the value of the `newValue` variable to zero before initializing the `owner` variable.
