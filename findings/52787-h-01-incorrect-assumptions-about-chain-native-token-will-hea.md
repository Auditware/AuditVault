---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/lending
  - sector/governance
  - sector/options
  - platform/shieldify
protocol: "[[Stackingsalmon]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/StackingSalmon-Security-Review.md"
genome:
  - "[[oracle-manipulation-resistance]]"
  - "[[token-decimal-normalization]]"
  - "[[oracle/wrong-feed]]"
  - "[[defi/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[misassumption/token-is-standard]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-01] Incorrect Assumptions About Chain Native Token Will Heavily Skew Protocol Pricing Mechanism

- id: 52787
- impact: HIGH
- protocol: Stackingsalmon
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/StackingSalmon-Security-Review.md

## Summary


The bug report states that there is a problem with the contract's use of the native token, which is meant to be used in various parts of the contract. The issue is that the contract is set up to be used with a more expensive native token, like ETH, but it is actually being deployed on Berachain, which has a much cheaper native token called BERA. This results in a large price discrepancy that affects the protocol's pricing mechanisms and can lead to bad debt. The default ante, which is the minimum amount required to take on debt, is set to a very low value of 0.01 ether, which is only about 6 cents in BERA. This encourages borrowing and can lead to significant bad debt. The team recommends creating a governance function to update the ante values, rather than hardcoding them, as token prices can change over time. The team has fixed the issue.

## Details

## Severity

High Risk

## Description

In various parts of the contract, the native token is meant to be used. Contracts have payable receive functions, etc. The ante constant is set to an amount that otherwise would be reasonable, were the contracts to be deployed on a chain with an expensive native token like ETH. But the contracts are to be deployed on Berachain. Its native token is BERA, which at the time of writing, costs about $6,29 per ether. Compared to ETH which costs $2371 per ether, there is a very large price discrepancy which skews protocol pricing mechanisms, disincentivizes warnings, and liquidations, encourages bad debt, etc.

The default ante is 0.01 ether, which, based on our above pricing assumptions, is about $0,06 or 6 cents. Our max ante therefore will be about $3,14.

## Location of Affected Code

File: [src/libraries/constants/Constants.sol](https://github.com/cryptovash/sammin-core/blob/c49807ae2965cf6d121a10507a43de1d64ba1e70/core/src/libraries/constants/Constants.sol)

```solidity
/// @dev The default amount of Ether required to take on debt in a `Borrower`. The `Factory` can override this value
/// on a per-market basis. Incentivizes calls to `Borrower.warn`.
uint208 constant DEFAULT_ANTE = 0.01 ether; //@audit Bera is much cheaper than eth
```

```solidity
/// @dev The maximum amount of Ether that `Borrower`s can be required to post before taking on debt
uint216 constant CONSTRAINT_ANTE_MAX = 0.5 ether;
```

## Impact

The main impact here revolves around protocol pricing. Since the ante determines the minimum amount required to take on debt, having it as low as $0.06 strongly incentivizes borrowing, which can quickly lead to significant bad debt. Even if governance adjusts the ante upwards, `governMarketConfig()` enforces a cap (`CONSTRAINT_ANTE_MAX`) of just $3-still relatively low.

On top of that, the warning mechanism isn't compelling enough; with a minimum payout of either ante/4 or the contract balance, warners won’t be properly incentivized. As a result, liquidations won’t happen as frequently as needed, since warnings must occur before liquidation can take place.

## Recommendation

Create a governance function that can be used to update the ante and max ante values. This is a better option than hardcoding new ante values as token prices can change significantly over time.

## Team Response

Fixed.
