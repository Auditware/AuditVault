---
tags:
  - lang/solidity
  - sector/options
  - sector/vault
  - has/github
  - severity/high
protocol: "[[Hyperhyper]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Hyperhyper-security-review_2025-03-30.md"
genome:
  - "[[oracle-manipulation-resistance]]"
  - "[[spot-price]]"
  - "[[known-pattern]]"
  - "[[oracle-is-reliable]]"
  - "[[price-cannot-be-manipulated]]"
  - "[[use-twap]]"
  - "[[trigger/price-manipulation]]"
---
# [H-01] Option premium calculation underprices options

- id: 57738
- impact: HIGH
- protocol: Hyperhyper_2025-03-30
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Hyperhyper-security-review_2025-03-30.md

## Summary


Report Summary:

The bug report discusses a problem with the option premium calculation in the Strategy contract. The issue is that the premium is calculated using the input `period` in seconds, while the actual duration until the maturity date is rounded up to the end of the day, which can result in a significant difference for short-period positions. This can lead to an underestimation of the time until maturity and a lower premium for the option. The report recommends updating the premium calculation to use the actual duration until the maturity date.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The option premium is calculated using the input `period`, while the actual duration until the maturity date is rounded up to the end of the day which is typically longer than the given `period`. This allows traders to get longer option durations than what they pay for.

The premium calculation in `Strategy._calculatePremium()` uses the input `period` in seconds to calculate the option price:

```solidity
function _calculatePremium(uint256 amount, uint256 period, uint256 preciseCurrentPrice, uint256 strike, uint256 iv)
    internal
    view
    returns (uint256 premium)
{
    (uint256 callPremium, uint256 putPremium) =
@>      StrategyStorage.layout().setUp.base.bs.optionPrices(period, iv, preciseCurrentPrice, strike, 0);
```

However, the maturity date is rounded up to the end of the day in `PositionParams._computeMaturityDate()`:

```solidity
function _computeMaturityDate(uint256 period) internal view returns (uint32) {
    uint256 maturityTimestamp = block.timestamp + period;
    maturityTimestamp -= (maturityTimestamp % 1 days);
    maturityTimestamp += 1 days - 1;
    return uint32(maturityTimestamp);
}
```

Therefore, the gap between the input `period` and the actual duration until maturity date can be up to `86399` seconds, which can be a significant difference for short-period positions.

Consider the following scenario:

1. Current time: `1743638400` (Thu Apr 03 2025 00:00:00).
2. User inputs period = 7 days = `604800` seconds.
3. Actual maturity: `1744329599` (Thu Apr 10 2025 23:59:59).

Input period: `604800` seconds
Actual period: `1744329599 - 1743638400` = `691199` seconds (7 days + 86399 seconds ≈ 8 days).

The premium is calculated using the input period (`604800` seconds) in the Black-Scholes formula, resulting in a lower premium as it underestimates the time until maturity.

Below is an example output for a 7-day `CALL` option (3500 USD spot price, 10% relative strike, 48.9% IV).
This results in approximately 23% underpricing for this `CALL` option position.

```bash
Logs:
  Period: 604800 sec
  Maturity: 1744329599
  Actual Period: 691199 sec
  --- Premium: period 
---
  call: 8963759233891000000
  put: 358963759233891000000
  --- Premium: maturity - uint32(block.timestamp)
---
  call: 11675104193168500000
  put: 361675104193168500000

  Premium difference: 2711344959277500000
```

## Recommendation

Update the premium calculation to use the actual duration until the maturity date.
