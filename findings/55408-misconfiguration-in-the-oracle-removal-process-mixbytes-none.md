---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/oracle
protocol: "[[DIA]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/DIA/Multi%20Scope/README.md#1-misconfiguration-in-the-oracle-removal-process"
genome:
  - "[[oracle-freshness]]"
  - "[[oracle/missing-validation]]"
  - "[[defi/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# Misconfiguration in the Oracle Removal Process

- id: 55408
- impact: HIGH
- protocol: DIA
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/DIA/Multi%20Scope/README.md#1-misconfiguration-in-the-oracle-removal-process

## Summary


The `removeOracle` function in the `DIAOracleV2Meta` contract has a bug that needs to be fixed. Currently, the code tries to replace the address of the oracle being removed with an address that does not exist, which can cause problems with the contract's operation. To fix this, the code should be changed to replace the address with the last valid oracle address in the array. This is marked as a high severity issue and should be addressed as soon as possible.

## Details

##### Description
During the audit, an issue was identified in the `removeOracle` function of the `DIAOracleV2Meta` contract. This function, intended to remove an oracle from the registry, appears to have an incorrect implementation.
Presently, the code tries to replace the address of the oracle to be removed with the address of an oracle that doesn’t exist (`oracles[numOracles]`). This has been marked as a **High** severity issue because, in its current form, the oracle removal is flawed, affecting the proper operation of the contract.

##### Recommendation
It is recommended to replace `oracles[numOracles]` with `oracles[numOracles - 1]`. This will point to the last valid oracle address in the array, ensuring that the action of removing an oracle functions as expected.
