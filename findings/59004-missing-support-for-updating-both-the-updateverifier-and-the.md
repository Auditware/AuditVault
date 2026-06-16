---
tags:
  - lang/solidity
  - sector/bridge
  - sector/staking
  - platform/quantstamp
  - severity/high
  - vuln/pda/missing-seeds-check
  - novelty/variant
  - fix/add-check
protocol: "[[Sonic Gateway]]"
auditors:
  - "[[Julio Aguilar]]"
report: "https://certificate.quantstamp.com/full/sonic-gateway/fbb78575-2a22-4f4b-813f-340eb6296185/index.html"
genome:
  - "[[missing-seeds-check]]"
  - "[[permanent]]"
  - "[[variant]]"
  - "[[pda-derivation]]"
---
# Missing Support for Updating Both the `updateVerifier` and the `newValidators`

- id: 59004
- impact: HIGH
- protocol: [[Sonic Gateway]]
- reporter: Julio Aguilar (Quantstamp)
- source: https://certificate.quantstamp.com/full/sonic-gateway/fbb78575-2a22-4f4b-813f-340eb6296185/index.html

## Summary


The client has marked a bug as "Fixed" in the `UpdateManager.sol` file. The bug occurred when using the `UpdateManager.update()` function to update both a list of new validators and a new update verifier contract. This caused the bridge to become non-operational due to the order in which the conditionals were executed. The recommendation is to swap the order of the conditionals so that the new `updateVerifier` address is reassigned before any functions are invoked on it. This will ensure that the new set of validators is reflected in the new `updateVerifier` contract. 

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `53cccf01fb301ed4a082d87b129bff0269cc95d3`. The order has been corrected to allow for both of these states to be updated in tandem.

**File(s) affected:**`UpdateManager.sol`

**Description:** If `UpdateManager.update()` were to be invoked with both a list of new validators, and a new update verifier contract, the bridge can potentially become inoperative. This is due to the order in which the conditionals are executed inside this function. The first condition invokes `updateVerifier.setValidators()` if there is a list of `newValidators` specified during the call. However, the third condition, will update `updateVerifier = IUpdateVerifier(_updateVerifier)` in the case where there is a non-zero `_updateVerifier` address specified during the call. With the reassignment of the `updateVerifier` address occuring after `newValidators` are updated in the previous `updateVerifier` address, this new `updateVerifier` address does not have the proper set of new validators assigned in its state.

Further, assuming that the `IUpdateVerifier(ValidatorsRegistry)` contract was deployed with the `UpdateManager` contract assigned as the owner, the bridge would be totally non-operational because there would be no way to invoke `setValidators()` on this new `updateVerifier` contract, because there are no validators defined in its state.

**Recommendation:** The order of the update should reassign all addresses before invoking any functions on it. Therefore, in the `update()` function, the first and third conditionals should be swapped, so that if there is a new `updateVerifier` address being assigned in conjunction with a new set of validators being defined, the new set of validators will be reflected in the new `updateVerifier` contract.
