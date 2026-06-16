---
tags:
  - lang/solidity
  - sector/bridge
  - platform/trailofbits
  - has/github
  - severity/high
  - vuln/dependency/upgradeable-contract
  - novelty/variant
  - misassumption/external-call-is-safe
  - fix/upgrade-dependency
protocol: "[[Meson]]"
auditors:
  - "[[Damilola Edwards]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/MesonProtocol.pdf"
genome:
  - "[[upgradeable-contract]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[upgrade-safety]]"
---
# Risk of upgrade issues due to missing __gap variable

- id: 18104
- impact: HIGH
- protocol: [[Meson]] Protocol
- reporter: Damilola Edwards (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/MesonProtocol.pdf

## Summary


This bug report is about a data validation issue in the Meson protocol contracts. Without the __gap variable, it is not possible to add any new variables to the inherited contracts without causing storage slot issues. This could lead to the contract breaking if variables are added to an inherited contract. All upgradeable OpenZeppelin contracts have this __gap variable, as shown in the example code.

Exploit Scenario: Alice, a developer of the Meson protocol, adds a new variable to the MesonStates contract as part of an upgrade. As a result of the addition, the storage slot of each subsequent variable changes, and the contract stops working.

Recommendations: Short term, add a __gap variable (specifically uint256 __gap[100]) to all stateful Meson protocol contracts from which UpgradableMeson inherits. Long term, consider redesigning the system such that the contracts can be upgraded through a mechanism other than the proxy pattern.

## Details

## Diﬃculty: High

## Type: Data Validation

## Description
None of the Meson protocol contracts include a **gap variable**. Without this variable, it is not possible to add any new variables to the inherited contracts without causing storage slot issues. Specifically, if variables are added to an inherited contract, the storage slots of all subsequent variables in the contract will shift by the number of variables added. Such a shift would likely break the contract.

All upgradeable OpenZeppelin contracts contain a **gap variable**, as shown in figure 6.1.

```solidity
/**
* @dev This empty reserved space is put in place to allow future versions to
* add new variables without shifting down storage in the inheritance chain.
* See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
*/
uint256[49] private __gap;
```
*Figure 6.1: openzeppelin-contracts-upgradeable/OwnerUpgradeable.sol*

## Exploit Scenario
Alice, a developer of the Meson protocol, adds a new variable to the MesonStates contract as part of an upgrade. As a result of the addition, the storage slot of each subsequent variable changes, and the contract stops working.

## Recommendations
- **Short term:** Add a **gap variable** (specifically `uint256 __gap[100]`) to all stateful Meson protocol contracts from which UpgradableMeson inherits.
- **Long term:** Consider redesigning the system such that the contracts can be upgraded through a mechanism other than the proxy pattern.
