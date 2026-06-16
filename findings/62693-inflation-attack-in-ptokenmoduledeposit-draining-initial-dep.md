---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
  - sector/oracle
protocol: "[[NUTS Finance]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/NUTS%20Finance/Pike/README.md#1-inflation-attack-in-ptokenmoduledeposit-draining-initial-deposits"
genome:
  - "[[arithmetic/rounding]]"
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
---
# Inflation Attack in `PTokenModule.deposit` Draining Initial Deposits

- id: 62693
- impact: HIGH
- protocol: [[NUTS Finance]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/NUTS%20Finance/Pike/README.md#1-inflation-attack-in-ptokenmoduledeposit-draining-initial-deposits

## Summary


The report describes a bug in the `deposit` function of the `PTokenModule` contract. The bug allows an attacker to manipulate the `exchangeRate` by depositing a small amount of the underlying token and then transferring a large amount to the contract. This can result in subsequent depositors receiving zero pTokens and losing their funds. The severity of the bug is classified as critical as it can lead to a complete loss of funds for users. To fix this issue, the report recommends minting a small amount of "dead shares" during the initial mint and implementing a check to ensure users always receive a positive number of pTokens when depositing.

## Details

##### Description
This issue has been identified within the `deposit` function of the `PTokenModule` contract.

An attacker can front-run initial depositors by depositing 1 wei of the underlying token to receive a single pToken. By then directly transferring a large amount of the underlying token to the contract, the attacker artificially inflates the `exchangeRate` because `totalSupply` remains unchanged while `getCash()` grows significantly. Consequently, any subsequent depositor who supplies tokens may end up receiving zero pTokens (due to integer division at the inflated exchange rate) and thus lose their funds. The attacker can then redeem their single pToken and drain the entire contract balance, including other users’ deposits.

The issue is classified as **critical** severity because it can result in a complete loss of funds for unsuspecting users.

##### Recommendation
We recommend minting a small amount (for example, 1000) of “dead shares” during the initial mint to ensure that this inflation attack is not possible. Additionally, implement a check that the minted amount is greater than 0 to ensure a user always receives a positive number of pTokens when depositing.
