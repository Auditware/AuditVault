---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/variant
  - sector/account
protocol: "[[Enso Finance]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Enso%20Finance/Enso%20Wallet/README.md#1-destruction-of-the-ensowallet-implementation-contract"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
---
# Destruction of the EnsoWallet implementation contract

- id: 28036
- impact: HIGH
- protocol: [[Enso Finance]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Enso%20Finance/Enso%20Wallet/README.md#1-destruction-of-the-ensowallet-implementation-contract

## Summary


This bug report is about an attack that can be made on the EnsoWallet contract. If an attacker makes a direct call to the EnsoWallet.initialize() function, they can execute the SELFDESTRUCT opcode or specify themselves as EXECUTOR and gain the ability to execute SELFDESTRUCT later. If this occurs, the current implementation contract will be destroyed and all users' wallet functionality will be inaccessible until the core upgrade. In the worst case scenario, if the attack happens after EnsoBeacon.renounceAdministration(), all users' funds will be frozen.

To prevent this attack, the report recommends disallowing direct calls to EnsoWallet.initialize().

## Details

##### Description
An attacker can make a direct call (not via proxy) to [EnsoWallet.initialize()](https://github.com/EnsoFinance/shortcuts-contracts/blob/4902e55608f975f73772310955444110b1cfc4fc/contracts/EnsoWallet.sol#L24) and execute the SELFDESTRUCT opcode or specify themself as EXECUTOR and gain the ability to execute SELFDESTRUCT later. Consequently, the current implementation contract will be destroyed, and all users' wallet functionality will be inaccessible until the core upgrade. The worst case occurs if an attack happens after EnsoBeacon.renounceAdministration(), and all users' funds will be frozen.
##### Recommendation
We recommend disallowing direct calls to EnsoWallet.initialize().
