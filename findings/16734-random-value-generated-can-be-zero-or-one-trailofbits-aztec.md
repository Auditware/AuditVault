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
  - "[[upgradeable-contract]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
---
# Random value generated can be zero or one

- id: 16734
- impact: HIGH
- protocol: [[AZTEC]]
- reporter: James Miller (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/aztec.pdf

## Summary


This bug report is about a data validation issue in the AdminUpgradeabilityProxy.sol file. The difficulty of the issue is rated as high. The issue is caused by the libff random number generator which can lead to accidentally generating a zero or one. This can cause false verification of invalid G1 points. It can be exploited both in setup.cpp and verifier.cpp.

To fix the issue, a short-term solution is to keep generating random values until a value not equal to zero or one is found. A long-term solution is to add an additional check for trivial points in verifier.cpp, update the specification to note that r=0 causes the first validation in V mpc to always succeed, and include test coverage for when the random value is 0.

## Details

## Data Validation

**Target:** AdminUpgradeabilityProxy.sol

**Difficulty:** High

## Description
Using the libff random number generator can lead to accidentally generating a zero or one. The libff random number generator generates random bits, setting all bits higher than the highest non-zero bit of the modulus to zero, and succeeds when the resulting number is between 0 (inclusive) and the modulus (exclusive). If the random value generated in `same_ratio_preprocess` is zero or one, this can lead to a false verification of invalid G1 points.

![Figure 8.1: Multiplicand of zero being used in Setup.]

Keccak256 is used to generate random values, x_i, that are used in the ACE/validator contracts. The Keccak256 function can output 0 and 1, which can lead to the false validation of invalid proofs.

## Exploit Scenario
This vulnerability can be exploited both in `setup.cpp` and `verifier.cpp`.

## Verification
A malicious adversary can generate a valid G2 point and a valid G1[0] point, with the rest of the G1 points invalid. If the random value generated is zero, this will verify. Similarly, an adversary can generate a valid G2 point and a valid G1[0], set the G1[N-1] point equal to a valid G1[1] point, and zero out the rest of the G1 points. If the random value generated is one, this will also lead to a false verification.

![Figure 8.2: Scalar array being set to zero in Verify.]

## Setup
If an honest client running the Setup tool has a random “toxic waste” value generated to be zero, their transcript will be classified as invalid. This is not an exploit, but it is undesirable behavior for parties acting honestly.

## ACE/validator
A malicious party can generate an invalid commitment \((-1, \sigma_1, \gamma)\) resulting in \(x_i\) value either 0 or 1. The validator will incorrectly validate invalid commitments \((1, \sigma_1, \gamma)\), with the rest of the commitments valid. Then if the result is zero and another invalid \((i, \sigma_i)\), this can lead to a serious issue.

## Recommendation
Short term, keep generating random values until a value not equal to zero or one is found. Long term, we also recommend adding an additional check for trivial points in `verifier.cpp`, as this will prevent similar exploits. The specification should also be updated to note that \(r=0\) causes the first validation in \(V_{mpc}\) to always succeed. Lastly, when dealing with random numbers, include test coverage for when that random value is 0.
