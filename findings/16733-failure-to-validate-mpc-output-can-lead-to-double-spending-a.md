---
tags:
  - blockchain/evm
  - lang/solidity
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - sector/privacy
  - sector/staking
protocol: "[[AZTEC]]"
auditors:
  - "[[James Miller]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/aztec.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[cross-contract-state-consistency]]"
  - "[[reward-accounting]]"
  - "[[commitment-uniqueness]]"
---
# Failure to validate MPC output can lead to double spending attack

- id: 16733
- impact: HIGH
- protocol: [[AZTEC]]
- reporter: James Miller (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/aztec.pdf

## Summary


This bug report is about the AZTEC Protocol, which is a cryptography system. It states that the MPC server does not check if the jointly computed secret value is between 0 and k_max. If this is the case, any user of the AZTEC system can compute the secret value and create transactions with arbitrary amounts of money. The exploit scenario details how a user of the AZTEC system can detect this issue by checking if any of the Boneh-Boyen signatures are equal to 1. 

The recommendation is to first verify that the secret value is not less than k_max. This can be done by checking if any of the final Boneh-Boyen signatures are equal to 1. In the long term, it is suggested to validate all cryptographically sensitive parameters, even if they are extremely unlikely to be malicious.

## Details

## Cryptography

## Target
- setup/setup.cpp
- verify/verifier.cpp
- ACE/validator

## Difficulty
High

## Description
Currently, the MPC server does not check if the jointly computed secret value is between 0 and `k_max`. If this occurs, any user of the AZTEC system will be able to compute the secret value and create transactions with arbitrary amounts of money. While this event is extremely unlikely, failure to detect it would lead to a complete failure of the AZTEC system.

## Exploit Scenario
During the MPC setup, the parties jointly compute a secret value that is smaller than `k_max`. A user of the AZTEC system is able to detect this by checking if any of the Boneh-Boyen signatures are 1. Using this information, they compute the secret value and can double spend arbitrary amounts of money.

## Recommendation
- **Short term**: Verify that the secret value is not less than `k_max`. This can be achieved by checking if any of the final Boneh-Boyen signatures are equal to 1.
- **Long term**: Validate all cryptographically sensitive parameters, even if they are extremely unlikely to be malicious.
