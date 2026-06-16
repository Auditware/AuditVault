---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/staking
  - platform/spearbit
protocol: "[[InfiniFi Contracts]]"
auditors:
  - R0bert
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/InfiniFi-Spearbit-Security-Review-March-2025.pdf"
genome:
  - "[[reward-accounting]]"
  - "[[arithmetic/rounding-direction]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/protocol-wide]]"
---
# Incorrect accounting in LockingController.applyLosses function

- id: 55051
- impact: HIGH
- protocol: infiniFi contracts
- reporter: R0bert (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/InfiniFi-Spearbit-Security-Review-March-2025.pdf

## Summary


This is a report about a bug found in the code for LockingController.sol. The bug is classified as a high risk vulnerability and is located on line 415 of the file. The issue is in the `applyLosses` function, where the code is incorrectly distributing negative `yield_amount` among each epoch bucket. This is due to a mistake in the calculation, where the denominator is being artificially decremented in each iteration of the for loop. This results in an incorrect sum of allocations and corrupts the final accounting. To fix this, the calculation should use the correct state variable instead of the incorrectly decremented one. The bug has been fixed and verified by the development team.

## Details

## Vulnerability Report

## Severity
**High Risk**

## Context
**File:** LockingController.sol  
**Location:** Line 415

## Description
In the `applyLosses` function, the code attempts to distribute the negative `yield_amount` among each epoch bucket by computing:

```solidity
uint256 allocation = epochTotalReceiptToken.mulDivUp(_amount, _globalReceiptToken);
_globalReceiptToken -= allocation;
```

Because `_globalReceiptToken` is decremented in each iteration of the for loop, each bucket's allocation is calculated over a progressively smaller denominator. This will cause the sum of all allocations to exceed `_amount`, leading to more slash than intended. Worse, at the end of the loop, `globalReceiptToken` and `globalRewardWeight` are incorrectly set to these artificially decremented values, corrupting the final accounting.

## Recommendation
To fix this accounting error and ensure accurate loss distribution, the allocation calculation should use the state variable `globalReceiptToken` as the denominator instead of `_globalReceiptToken`. The corrected line of code should read:

```solidity
uint256 allocation = epochTotalReceiptToken.mulDivUp(_amount, globalReceiptToken);
```

## Status
**infiniFi:** Fixed in b9af8d.  
**Spearbit:** Fix verified.
