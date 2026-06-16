---
tags:
  - lang/solidity
  - sector/bridge
  - sector/lending
  - sector/stable
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[LEND]]"
auditors:
  - jokr
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[reward-accounting]]"
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# H-12: Incorrect LEND reward distribution for cross-chain borrows

- id: 58381
- impact: HIGH
- protocol: LEND
- reporter: jokr (Sherlock)
- source: N/A

## Summary


This bug report describes an issue in the `distributeBorrowerLend()` function of the LendStorage contract. The function incorrectly uses `borrowWithInterest()` to determine the borrow amount for distributing LEND rewards. This results in users who borrowed on this chain via cross-chain requests from other chains not receiving any LEND rewards, and rewards being distributed based on incorrect borrow values. The root cause of this issue is that the function uses `borrowWithInterest()`, which returns borrows originated on this chain instead of borrows executed on this chain. This bug can be exploited in two ways - users who borrowed on this chain via cross-chain requests will not receive rewards, and users who did not borrow on this chain will receive rewards. The impact of this bug is that real borrowers on this chain are under-rewarded, and users who did not borrow on this chain are over-rewarded. To mitigate this issue, a new function can be introduced to aggregate borrows from `crossChainCollaterals` for this chain, and in `distributeBorrowerLend()`, only borrows executed on this chain should be considered, and `crossChainBorrows` should be excluded.

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/669 

## Found by 
jokr

### Summary

The `distributeBorrowerLend()` function incorrectly uses `borrowWithInterest()` to determine the borrow amount for distributing LEND rewards. However, `borrowWithInterest()` returns the sum of all cross-chain borrows of a token that originated from the current chain (stored in `crossChainBorrows`).

What the function should actually consider are the user's borrows on this chain, regardless of where the borrow was initiated from. In particular, it must include cross-chain collateral records (stored in `crossChainCollaterals`), which represent borrows executed on this chain using collateral from another chain.

https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/LendStorage.sol#L365-L368

https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/LendStorage.sol#L478-L504

As a result:

- Users who borrowed on this chain via cross-chain requests from other chains will not receive any LEND rewards.
- LEND rewards will be distributed based on incorrect borrow values (crossChainBorrows).
- `crossChainBorrows` should not be considered for LEND rewards because those borrows were executed elsewhere.

### Root Cause

- The function uses `borrowWithInterest()`, which returns borrows originated on this chain (`crossChainBorrows`) instead of borrows executed on this chain (`crossChainCollaterals`).

### Internal Pre-conditions

None  

### External Pre-conditions

None

### Attack Path

#### Attack Path 1: User gets no rewards despite borrowing on this chain

1. Alice borrows 10,000 USDC on Chain A using funds on Chain B as collateral (cross-chain borrow).
2. This creates an entry in `crossChainCollaterals[Alice][USDC]` on Chain A.
3. The protocol later calls `distributeBorrowerLend()` on Chain A to distribute LEND rewards.
4. Internally, `borrowWithInterest()` is called, which only reads from `crossChainBorrows` (i.e., borrows originated from Chain A).
5. Since Alice's borrow was executed on Chain A (not originated), her borrow is ignored.
6. Result: Alice receives 0 LEND despite having an active borrow on this chain.

#### Attack Path 2: User receives rewards despite not borrowing on this chain

1. Bob initiates a cross-chain borrow of 10,000 USDC on Chain B using his Chain A funds as collateral.
2. This creates an entry in `crossChainBorrows[Bob][USDC]` on Chain A.
3. Bob has no borrow activity on Chain A; he only has `crossChainBorrows` here, no `crossChainCollaterals`.
4. The protocol calls `distributeBorrowerLend()` on Chain A.
5. As `borrowWithInterest()` includes Bob’s `crossChainBorrows` , rewards will be calculated with that amount.
6. Result: Bob receives LEND rewards on Chain A for a borrow he actually executed on Chain B .

### Impact

- Users who took cross-chain borrows executed on this chain are excluded from LEND reward distribution.
- User who actually didn't borrowed funds from this chain will get LEND rewards.


### PoC

In `distributeBorrowerLend()`:

```solidity
uint256 borrowerAmount = div_(
    add_(
        borrowWithInterest(borrower, lToken),
        borrowWithInterestSame(borrower, lToken)
    ),
    Exp({ mantissa: LTokenInterface(lToken).borrowIndex() })
);
```

This calculation:
- Ignores borrows in `crossChainCollaterals`, leading to under-rewarding real borrowers on this chain.
- Includes borrows in `crossChainBorrows`, which shouldn’t be rewarded here, leading to over-rewarding.

### Mitigation

- Introduce a new function (e.g., `borrowWithInterestExecutedHere()`) that aggregates borrows from `crossChainCollaterals` for this chain.
- In `distributeBorrowerLend()`, use:
  - Only borrows executed on this chain (i.e., `crossChainCollaterals`)
  - Exclude `crossChainBorrows`, as those represent debt executed on other chains and shouldn't be rewarded here.
