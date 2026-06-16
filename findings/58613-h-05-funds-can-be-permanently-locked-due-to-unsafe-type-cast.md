---
tags:
  - lang/solidity
  - sector/staking
  - has/github
  - has/poc
  - severity/high
protocol: "[[Kinetiq]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Kinetiq-security-review_2025-02-26.md"
genome:
  - "[[integer-bounds]]"
  - "[[frozen-funds]]"
  - "[[known-pattern]]"
---
# [H-05] Funds can be permanently locked due to unsafe type casting

- id: 58613
- impact: HIGH
- protocol: Kinetiq_2025-02-26
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Kinetiq-security-review_2025-02-26.md

## Summary


This report discusses a bug in the `StakingManager` contract that manages staking operations for HYPE tokens. This bug can cause the loss of staked tokens if the amount exceeds a certain limit. It is recommended to implement a library called SafeCast to prevent this issue.

## Details


## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The `StakingManager` contract manages staking operations for HYPE tokens, allowing users to stake their tokens and receive `kHYPE` tokens in return. When users stake tokens through the `stake()` function, the contract delegates these tokens to validators using the `_distributeStake()` internal function, which in turn calls `l1Write.sendTokenDelegate()`.

A critical issue exists in the type casting of the `amount` parameter in both `_distributeStake()` and `_withdrawFromValidator()` functions. The `l1Write.sendTokenDelegate()` function expects a `uint64` parameter, but the contract performs an unsafe cast from `uint256` to `uint64`. If the amount exceeds `type(uint64).max` (18,446,744,073,709,551,615), the value will silently overflow to 0.

```solidity
            l1Write.sendTokenDelegate(delegateTo, uint64(amount), false);
```

This becomes particularly dangerous when:
1. `maxStakeAmount` is set to 0 (unlimited) or to a value greater than `type(uint64).max`
2. A user stakes an amount larger than `type(uint64).max`

In such cases, the funds will be accepted by the contract and `kHYPE` tokens will be minted, but the delegation to the validator will be carried out with 0 due to the silent overflow. The tokens will become permanently locked in the contract as there is no mechanism to recover from this situation.

### Proof of Concept

1. `maxStakeAmount` is set to 0 (unlimited)
2. User calls `stake()` with 19e18 HYPE tokens (> `type(uint64).max`)
3. Contract accepts the tokens and mints corresponding `kHYPE`
4. In `_distributeStake()`, `amount` is cast to `uint64`, resulting in 0
5. `l1Write.sendTokenDelegate()` is called with 0 tokens
6. The original HYPE tokens remain locked in the contract with no way to recover them

## Recommendations

Implement OpenZeppelin's SafeCast library to ensure safe type conversions.




