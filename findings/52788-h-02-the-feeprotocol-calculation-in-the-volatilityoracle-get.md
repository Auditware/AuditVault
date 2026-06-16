---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - platform/shieldify
  - has/github
  - severity/high
protocol: "[[Stackingsalmon]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/StackingSalmon-Security-Review.md"
genome:
  - "[[fee-accounting]]"
  - "[[fee-calculation]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# [H-02] The `feeProtocol` Calculation in the `VolatilityOracle::_getPoolMetadata()` Is Flawed

- id: 52788
- impact: HIGH
- protocol: Stackingsalmon
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/StackingSalmon-Security-Review.md

## Summary


The report states that there is a bug in the `feeProtocol` calculation in the `VolatilityOracle::_getPoolMetadata()` function. This calculation is used to determine the protocol fee for a new market creation. The bug is caused by using only 8 bits for the calculation instead of the entire 32 bits. This results in wrong Implied Volatility values and price outputs, leading to critical functions in the `Borrower` contract being broken. It is recommended to change the calculation logic and consider the decoded fee value as a basis point rather than a denominator. The team has fixed the bug.

## Details

## Severity

High Risk

## Description

The `feeProtocol` calculation in the `VolatilityOracle::_getPoolMetadata()` is erroneous:

```solidity
unchecked {
  if (feeProtocol % 16 != 0) metadata.gamma0 -= uint24(fee / (feeProtocol % 16));
  if (feeProtocol >> 4 != 0) metadata.gamma1 -= uint24(fee / (feeProtocol >> 4));
}
```

The `feeProtocol` is given in `uint32` and the first 16 bits are for `token1` and the lower 16 bits are for `token0`.

But the above calculation uses only 8 bits for the `protocolFee` calculation, similar to UniswapV,3 but that is wrong with regard to Kodiak.

Furthermore, the `KodiakV3Factory` contract is deployed at `0xD84CBf0B02636E7f53dB9E5e45A616E05d710990` in Berachain.

In the constructor, the `defaultFeeProtocol` is given as

```solidity
defaultFeeProtocol = 229379500; //35%, 35%
```

Hence, this is equal to 3500, 3500 after converting to hexadecimal and then again to decimal for two tokens (token1 and token0).

Hence the `feeProtocol` is given in `basis points` and not as a `denominator` as with `UniswapV3 Pools`.

## Location of Affected Code

File: [src/VolatilityOracle.sol](https://github.com/cryptovash/sammin-core/blob/c49807ae2965cf6d121a10507a43de1d64ba1e70/core/src/VolatilityOracle.sol)

```solidity
unchecked {
    if (feeProtocol % 16 != 0) metadata.gamma0 -= uint24(fee / (feeProtocol % 16));
    if (feeProtocol >> 4 != 0) metadata.gamma1 -= uint24(fee / (feeProtocol >> 4));
}
```

## Impact

This will lead to wrong protocol fee calculation during the new market creation and these erroneous values will result in providing wrong Implied Volatility values in the `VolatilityOracle`. This will result in erroneous price values being given as output of the `Borrower::getPrices()` function. Hence the critical function execution in the `Borrower` contract, which uses the `getPrices()` such as the `modify()`, `liquidate()`, `warn()` and `clear()`, will be broken.

## Recommendation

Hence it is recommended to change the `feeProtocol` calculation logic in the `VolatilityOracle::_getPoolMetadata()` to use the entire `uint32` value. And consider the decoded fee value as a basis point and not as the denominator of the total fee.

## Team Response

Fixed.
