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
  - "[[cross-contract-state-consistency]]"
  - "[[use-reentrancy-guard]]"
---
# [H-07] Exchange rate implementation not used in token operations

- id: 58615
- impact: HIGH
- protocol: Kinetiq_2025-02-26
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Kinetiq-security-review_2025-02-26.md

## Summary


The `StakingManager` contract has a bug that affects the exchange rate between HYPE and kHYPE tokens. This bug can cause incorrect token accounting and value loss for users. The contract has a function called `getExchangeRatio()` that calculates the exchange rate based on various factors, but this rate is not used correctly in token operations such as staking and withdrawal. This means that the contract assumes a 1:1 relationship between HYPE and kHYPE tokens, even though the actual exchange rate may be different. This can result in incorrect token minting and burning, and ultimately, value loss for users. The recommended solution is to properly integrate the exchange rate into all token operations, such as the `stake()` function.

## Details


## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The `StakingManager` contract implements an exchange rate mechanism between HYPE and kHYPE tokens, but fails to utilize it in critical token operations. This discrepancy between the implemented exchange rate logic and its actual usage in token minting and burning operations will lead to incorrect token accounting and value loss for users.

The contract maintains an exchange rate calculation through `getExchangeRatio()` which considers:
- Total staked HYPE
- Total rewards
- Total claimed HYPE
- Total slashing
- Current kHYPE supply

This ratio is meant to reflect the actual value relationship between HYPE and kHYPE tokens. However, the contract's token operations (`stake()`, `queueWithdrawal()`, etc.) assume a 1:1 relationship between HYPE and kHYPE, completely ignoring the implemented exchange rate mechanism.

```solidity
kHYPE.mint(msg.sender, msg.value);
```

The discrepancy between the implemented exchange rate and its actual usage can lead to:

1. Incorrect token minting during staking operations
2. Incorrect token burning during withdrawals
3. Value loss for users when the actual exchange rate deviates from 1:1

### Proof of Concept

Consider the following scenario:

1. User stakes 100 HYPE through `stake()`
2. Contract mints 100 kHYPE (1:1 ratio) instead of using `HYPEToKHYPE()`
3. Later, due to slashing or rewards, the exchange rate becomes 0.9 (1 HYPE = 0.9 kHYPE)
4. User requests withdrawal of 100 kHYPE
5. Contract burns 100 kHYPE and sends 100 HYPE (1:1 ratio) instead of using `kHYPEToHYPE()`
6. User receives more HYPE than they should (100 instead of 90)

This creates a direct value loss for the protocol and incorrect token accounting.

## Recommendations

The exchange rate should be properly integrated into all token operations. Here's the fix for the `stake()` function:

```solidity
function stake() external payable nonReentrant whenNotPaused {
    // ... existing validation code ...

    uint256 kHYPEAmount = HYPEToKHYPE(msg.value);
    totalStaked += msg.value;
    kHYPE.mint(msg.sender, kHYPEAmount);
}
```




