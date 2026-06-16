---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - platform/sherlock
  - sector/dex
protocol: "[[Burve]]"
auditors:
  - nganhg
report: "https://github.com/sherlock-audit/2025-04-burve-judging"
genome:
  - "[[fee-accounting]]"
  - "[[arithmetic/precision-loss]]"
  - "[[loss-of-funds/indirect-loss]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# H-8: `ValueFacet::removeValueSingle(...)` will withdraw less than required from the vertex vault due to unaccounted tax

- id: 56957
- impact: HIGH
- protocol: Burve
- reporter: nganhg (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue with the `ValueFacet::removeValueSingle(...)` function in the Burve protocol. This function is used to remove value from a single vertex in a closure, but it is currently withdrawing less than the required amount from the vertex vault due to an unaccounted tax. This issue was found by a group of users and has been identified as a root cause of the problem. The bug is caused by a mismatch between the amount being removed and the amount being withdrawn from the vault, as the calculated tax is not being taken into account. This issue could potentially lead to a denial of service (DoS) if another related issue is fixed. The protocol team has already fixed this issue in their recent PRs/commits. 

## Details

Source: https://github.com/sherlock-audit/2025-04-burve-judging/issues/406 

## Found by 
0L5S6W, 0xNov1ce, Cybrid, TessKimy, Tigerfrake, VinciGearHead, bladeee, bretzel, elolpuer, heeze, nganhg, v1c7

### Summary

_NB: This issue assumes that issue `removeValueSingle(...) will always produce a zero realTax, leading to issues` has been fixed_

When users want to remove value from a single vertex in a closure with `removeValueSingle`, the `Burve` protocol charges a tax to prevent users from using add value and remove value as a swapping mechanism. When the protocol determines the required token amount and tax to be removed based on the input value, it then withdraws the set amount from the underlying vertex vault in order to deposit tax earnings and transfer user funds. However, there seems to be a mismatch between the amount being removed and the amount being withdrawn, as the calculated tax is not being withdrawn from the vault.

### Root Cause

When the removedAmount is calculated in `Closure::removeValueSingle(...)`, it has [the `tax` deducted from it](https://github.com/sherlock-audit/2025-04-burve/blob/44cba36e2a0c3cd7b6999459bf7746db92f8cc0a/Burve/src/multi/closure/Closure.sol#L288) before being returned. However, when [withdrawing from the vault in the facet](https://github.com/sherlock-audit/2025-04-burve/blob/44cba36e2a0c3cd7b6999459bf7746db92f8cc0a/Burve/src/multi/facets/ValueFacet.sol#L234), this tax is not taken into account, leading to fewer tokens being withdrawn from the vault.

### Internal Pre-conditions

1. The user adds value to a closure with a base fee.
2. The user wants to remove value for a single token.

### External Pre-conditions

N/A

### Attack Path

N/A

### Impact

In the current state, this mismatch is compensated, as the user is being double taxed [here](https://github.com/sherlock-audit/2025-04-burve/blob/44cba36e2a0c3cd7b6999459bf7746db92f8cc0a/Burve/src/multi/facets/ValueFacet.sol#L241). However, if the issue `Users will receive fewer tokens when using ValueFacet::removeValueSingle(...) due to double tax` is fixed, then because fewer funds are taken out from the vault, there won't be enough to cover the user transfer, leading to a revert due to insufficient balance and thus to DoS of the `removeValueSingle(...)` function.

### PoC

N/A

### Mitigation

Calculate the real tax before withdrawing from the vault, and when withdrawing, add the `realTax` to the `realRemoved` being withdrawn.

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/itos-finance/Burve/commit/ca58c88be97e8f3f7a4617b171377d77fca52cdc
