---
tags:
  - lang/rust
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/infra
protocol: "[[OpenBrush]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/openbrush-contracts-library-security-review"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[timelock-timestamp-bypass]]"
---
# Zero Address Management Inconsistencies

- id: 32775
- impact: HIGH
- protocol: [[OpenBrush]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/openbrush-contracts-library-security-review

## Summary


The report discusses an issue with public addresses in the Substrate ecosystem. These addresses use a specific encoding called SS58, which does not include certain characters that can be confusing when printed. However, this can lead to confusion when referencing the "zero address" from EVM blockchains, as the concept does not translate smoothly to Substrate chains. Additionally, the address derived from a hex public key composed entirely of zeros can vary across different Substrate chains. The term "zero address" is used multiple times in the codebase, but in some cases, it actually refers to Options without an associated `AccountId`, which can cause misunderstandings. The report suggests using "None" instead of "zero address" when there is no associated address, and recommends renaming or refactoring any "zero address" references for clarity. The issue has been resolved in a recent pull request on GitHub.

## Details

In the Substrate ecosystem, public addresses adopt the SS58 encoding. The Base-58 alphabet omits characters prone to confusion when printed, such as the number 0.


Given this, referring to the "zero address" from EVM blockchains can be confusing. In this context, what could potentially use zeros is the public key, which is seldom referenced by regular users. The very idea of a "zero address" does not seamlessly translate from EVM chains to Substrate chains.


Additionally, the address derived from a hex public key composed entirely of zeros varies across different Substrate chains.


Throughout the codebase, the term "zero address" appears numerous times. However, in many instances, it actually refers to Options without an associated `AccountId` ("None") which can lead to potentially harmful misunderstandings.


When using `AccountId` without an associated address, it might be preferable to use "None". It is also recommended to rename or refactor any "zero address" references throughout the codebase for clarity. For instance, consider changing [`PSP22TokenTimelockError::BeneficiaryZeroAddress`](https://github.com/Brushfam/openbrush-contracts/blob/553347354de6d0ead6a335ba4c197bdd01fb2d12/contracts/src/token/psp22/utils/token_timelock.rs#L123) to `PSP22TokenTimelockError::BeneficiaryIsNotSet`.


***Update:** Resolved in [pull request #136](https://github.com/Brushfam/openbrush-contracts/pull/136) at commit [36e2a49](https://github.com/Brushfam/openbrush-contracts/pull/136/commits/36e2a490c5b4ede526fe90f57b7efbd556c3f967).*
