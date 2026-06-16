---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/stable
  - sector/token
  - sector/streaming
protocol: "[[DefiApp]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/DefiApp-security-review_2025-01-08.md"
genome:
  - "[[token-decimal-normalization]]"
  - "[[arithmetic/decimal-mismatch]]"
  - "[[loss-of-funds/indirect-loss]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[misassumption/math-is-safe]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-01] Sale token amount is not adjusted per its decimals

- id: 49882
- impact: HIGH
- protocol: DefiApp_2025-01-08
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/DefiApp-security-review_2025-01-08.md

## Summary


This bug report discusses an issue with the `_computeTokens` function in the `PublicSale.sol` file. This function is used to calculate the number of tokens a user would receive when depositing USDC. The problem is that the result is not properly scaled for the token's decimals, leading to users receiving a smaller amount of tokens than expected. The report recommends adjusting the function to account for the token's decimals and setting the token address in the `PublicSale` contract for increased transparency.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

During depositing USDC, the `_computeTokens` function is called (`depositUSDC -> _purchase -> _calculateTokensToTransfer -> _computeTokens`) to calculate the number of tokens that the user would receive for the deposited amount:

```solidity
File: PublicSale.sol
519:     function _computeTokens(uint256 _amountUSDC, uint256 _price) private pure returns (uint256) {
520:         // _price = price * 10^18 --> precision scaling
521:         // _amount = (input_amount * 10^6 (USDC/T)) * 10^18 (_price)
522:         // (_amount * 1e18) / _price = (10^6 * 10^18) / 10^18 = 10^6 precision
523:         // 10^6 * 10^12 = 10^18 --> scale for future token's decimals
524:         return ((_amountUSDC * 1e18) / _price); <=@
525:     }
```

The problem is that despite the comment at L523, the result is not scaled for the token's decimals and the user later would receive a vesting with this incorrect amount.

This means that if the token has 18 decimals, the result would be less than the actual amount of tokens 10^12 times. For example, if the price is `0.01e18` and the user deposits 1000 USDC (1000 _ 10^6), the result would be `1000 _ 1e6 \* 1e18 / 0.01e18 = 1e11` tokens, which is dust amount for a token with 18 decimals.

## Recommendations

Consider adjusting the result of the `_computeTokens` function to be scaled for the token's decimals by multiplying it by `tokenDecimals - 10^6`. To achieve this, consider also setting the token address in the `PublicSale` contract during creation. This way `decimals()` function on the contract address would be accessible during depositing USDC and users would be sure what token they would receive, which increases overall transparency.
