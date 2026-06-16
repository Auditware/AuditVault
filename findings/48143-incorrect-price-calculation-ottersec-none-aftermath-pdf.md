---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - vuln/oracle/spot-price
  - novelty/known-pattern
  - misassumption/oracle-is-reliable
  - misassumption/price-cannot-be-manipulated
  - fix/use-twap
  - trigger/price-manipulation
  - sector/dex
protocol: "[[Aftermath]]"
auditors:
  - "[[OtterSec]]"
report: "https://aftermath.finance/"
genome:
  - "[[spot-price]]"
  - "[[known-pattern]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[oracle-manipulation-resistance]]"
---
# Incorrect Price Calculation

- id: 48143
- impact: HIGH
- protocol: [[Aftermath]]
- reporter: OtterSec
- source: https://aftermath.finance/

## Summary


The bug report is about a function called calc_spot_price_fixed, which is supposed to calculate the price of one type of coin in terms of another type of coin. However, it is currently calculating the price of the second coin in terms of the first coin. This is not the intended behavior and needs to be fixed. The fix has been implemented in a new version of the code. To fix this issue, the values of the coins need to be passed in a specific way.

## Details

## Math Move

In `math.move`, `calc_oracle_price` and `calc_spot_price` are intended to calculate the price of BASE coin in terms of a QUOTE coin. The values of BASE coin are passed as values of in-coin, and values of QUOTE coin are passed as values of out-coin. 

However, `calc_spot_price_fixed` computes the price of the out-coin in terms of the in-coin, meaning that the price of the QUOTE coin is calculated in terms of the BASE coin.

## Remediation

Pass the values of BASE coin to out-coin and the values of QUOTE coin to in-coin.

## Patch

Fixed in `85927a3`.
