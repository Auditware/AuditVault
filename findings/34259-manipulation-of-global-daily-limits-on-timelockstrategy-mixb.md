---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/governance
  - sector/lending
protocol: "[[DForce]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/dForce/Lending%20v2/README.md#2-manipulation-of-global-daily-limits-on-timelockstrategy"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[timelock-timestamp-bypass]]"
---
# Manipulation of global daily limits on `TimeLockStrategy`

- id: 34259
- impact: HIGH
- protocol: [[DForce]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/dForce/Lending%20v2/README.md#2-manipulation-of-global-daily-limits-on-timelockstrategy

## Summary


Report Summary:

The code for global daily limits can be manipulated by attackers, causing inconvenience for legitimate users and requiring intervention from the smart contract owner. The severity of this issue is rated as high. The recommended solution is to rework the code to prevent manipulation.

## Details

##### Description
The global daily limits implemented in the audited code are susceptible to manipulation by an attacker, leading to inconvenience for legitimate users due to the time lock on any outgoing transfers. Since the system will remain in an undesired state until the smart contract owner intervenes, this issue is rated as high in severity.

Related code - procedure for accumulating daily statistics:
https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/TimeLockStrategy.sol#L166
##### Recommendation
We recommend reworking the global limits to prevent manipulation.
