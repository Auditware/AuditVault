---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/zk
protocol: "[[Brevis]]"
auditors:
  - "[[0xzey]]"
  - "[[Consigliere]]"
  - "[[cergyk]]"
  - "[[kimnoic]]"
report: "https://github.com/sherlock-audit/2025-08-pico-judging"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[circuit-input-range-check]]"
---
# H-3: Missing modulus bound check in reduction

- id: 63634
- impact: HIGH
- protocol: [[Brevis]] Pico ZKVM
- reporter: cergyk (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found in the function `reduceWithMaxBits` in the GNARK library. The function does not properly check if the remainder is less than the modulus, allowing an attacker to use a remainder that is greater than or equal to the modulus. This can lead to incorrect computations and vulnerabilities in the GNARK. The root cause of this issue is that the code that checks the remainder against the modulus is commented out. To fix this, the code should be uncommented to enforce the modulus bound check. The protocol team has already addressed this issue in a recent PR.

## Details


Source: https://github.com/sherlock-audit/2025-08-pico-judging/issues/124 

## Found by 
0xzey, Consigliere, cergyk, kimnoic

### Summary

The function [`reduceWithMaxBits`](https://github.com/sherlock-audit/2025-08-pico/blob/main/pico/gnark/koalabear/koalabear.go#L410) does not enforce that the remainder is less than the modulus. This allows an attacker to use a remainder that is >= modulus, which breaks the field arithmetic[](url)

### Root Cause

The code that checks the remainder against the modulus is commented out. The current code only checks the bit lengths of the limbs but does not check the actual value of the remainder against the modulus.

### Internal Pre-conditions

The reduction function reduceWithMaxBits is called when a variable's upper bound is >= modulus. It uses a hint to compute the quotient and remainder, and then checks that x = quotient * modulus + remainder. However, it does not check that remainder < modulus.

### External Pre-conditions

The attacker can provide a quotient and remainder that satisfy the equation but with remainder >= modulus.

### Attack Path

An attacker can create a variable that is not reduced (i.e., >= modulus) and then use it in the circuit. The circuit would accept it as a valid field element because the reduction function does not enforce the bound

### Impact

The field arithmetic would be broken because variables could be outside the field. This could lead to incorrect computations and vulnerabilities in the GNARK.

### PoC

Uncomment this liine to implement modulus bound checks on reduction:
https://github.com/sherlock-audit/2025-08-pico/blob/main/pico/gnark/koalabear/koalabear.go#L410

### Mitigation

Uncomment the modulus bound check for the reduceWithMaxBits function.

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/brevis-network/pico/pull/61
