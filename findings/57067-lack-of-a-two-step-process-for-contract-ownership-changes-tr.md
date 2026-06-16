---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - severity/high
  - vuln/dependency/upgradeable-contract
  - impact/privilege-escalation/ownership-transfer
  - novelty/variant
  - misassumption/external-call-is-safe
  - fix/upgrade-dependency
  - sector/token
protocol: "[[Reserve]]"
auditors:
  - "[[Felipe Manzano]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2022-08-reserve-protocol-securityreview.pdf"
genome:
  - "[[upgradeable-contract]]"
  - "[[ownership-transfer]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[upgrade-safety]]"
---
# Lack of a two-step process for contract ownership changes

- id: 57067
- impact: HIGH
- protocol: [[Reserve]]
- reporter: Felipe Manzano (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2022-08-reserve-protocol-securityreview.pdf

## Summary


This bug report is about a potential security issue in the Reserve Protocol, which is a type of software used to manage financial transactions. The problem is related to how the software handles changes in ownership, which can be a critical and irreversible action. The report suggests that the current method of transferring ownership is risky and can lead to mistakes. The report also provides recommendations for short-term and long-term solutions to address this issue.

## Details

## Reserve Protocol Security Assessment

## Diﬃculty: High

## Type: Data Validation

## Description
The Main contract inherits from OpenZeppelin’s OwnableUpgradeable contract, which provides a basic access control mechanism. However, to perform contract ownership changes, the OwnableUpgradeable contract internally calls the `_transferOwnership()` function, which immediately sets the new owner of the contract. Making such a critical change in a single step is error-prone and can lead to irrevocable mistakes.

```solidity
function _transferOwnership(address newOwner) internal virtual {
    address oldOwner = _owner;
    _owner = newOwner;
    emit OwnershipTransferred(oldOwner, newOwner);
}
```
*Figure 2.1: The `_transferOwnership` function in OwnableUpgradeable.sol#L76-80*

## Exploit Scenario
Alice, the owner of the Reserve protocol Main contract, calls `transferOwnership()` but accidentally enters the wrong address as the new owner address. As a result, she permanently loses access to the contract.

## Recommendations
- **Short term:** Perform ownership transfers through a two-step process in which the owner proposes a new address and the transfer is completed once the new address has executed a call to accept the role.
- **Long term:** Identify and document all possible actions that can be taken by privileged accounts and their associated risks. This will facilitate reviews of the codebase and prevent future mistakes.

---

*Trail of Bits*  
*Reserve Protocol Security Assessment*  
*PUBLIC*
