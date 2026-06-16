---
tags:
  - lang/solidity
  - platform/halborn
  - has/github
  - severity/high
  - sector/farm
  - sector/vault
  - sector/yield-aggregator
protocol: "[[Trillion Contracts + Synth Chefs (Updates)]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/entangle-labs/trillion-contracts-synth-chefs-updates"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# Missing Yield Booster Mechanism in CamelotSynthChef Contract

- id: 51272
- impact: HIGH
- protocol: Trillion contracts + synth chefs (Updates)
- reporter: Halborn
- source: https://www.halborn.com/audits/entangle-labs/trillion-contracts-synth-chefs-updates

## Summary


The current version of the `CamelotSynthChef` contract does not have a yield boosting feature, which could potentially decrease the rewards for users and make the yield farming less attractive. This could also put the contract at a disadvantage compared to other yield aggregators. The team has recommended implementing a yield boosting mechanism on the contract, which has been solved by managing it off-chain. The issue can be found in the `Trillionxyz/trillion-sc-audit` repository under `contracts/SynthChefs/Camelot/CamelotSynthChef.sol`.

## Details

##### Description

The current implementation of the `CamelotSynthChef` contract lacks a yield booster mechanism, which is present in the original Camelot protocol. This feature could potentially increase the APR for users and make the yield farming more attractive.

The `CamelotSynthChef` contract currently handles basic farming operations such as deposit, withdraw, and harvest, but does not implement any yield boosting functionality.

**Impact**

- Potentially lower APR for users compared to direct interaction with Camelot protocol.

- Missed opportunity for optimizing yield farming rewards.

- Possible competitive disadvantage compared to other yield aggregators that implement yield boosting.

##### BVSS

[AO:A/AC:L/AX:L/C:N/I:L/A:M/D:N/Y:N/R:N/S:C (7.0)](/bvss?q=AO:A/AC:L/AX:L/C:N/I:L/A:M/D:N/Y:N/R:N/S:C)

##### Recommendation

Implement a yield boosting mechanism on the contract.

  

### Remediation Plan

**SOLVED :** The **Entangle team** solved the issue by managing the yield boosting mechanism through off-chain.

##### References

[Trillionxyz/trillion-sc-audit/contracts/SynthChefs/Camelot/CamelotSynthChef.sol](https://github.com/Trillionxyz/trillion-sc-audit/blob/b7c9ca7ce38bb72e9a4571f423d503dd246d0087/contracts/SynthChefs/Camelot/CamelotSynthChef.sol)
