---
tags:
  - lang/solidity
  - platform/code4rena
  - severity/high
  - sector/algo-stable
  - sector/lending
  - sector/oracle
  - sector/stable
protocol: "[[Canto]]"
auditors:
  - "[[Zokyo]]"
report: "https://code4rena.com/reports/2022-09-canto"
genome:
  - "[[single-source]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[chainlink-round-completeness]]"
---
# [H-01] Hardcoded USD pegs can be broken

- id: 25379
- impact: HIGH
- protocol: [[Canto]]
- reporter: zokyo (Code4rena)
- source: https://code4rena.com/reports/2022-09-canto

## Summary


A bug report has been filed concerning the hardcoding of prices for USDC and USDT, which are the underlying tokens of cUSDC and cUSDT. This practice is discouraged due to the risk of either stablecoin de-pegging, which can cause major losses for lending protocols. An example of this is the UST debacle, where the price of USDT dropped to $0.95 before recovering.

Furthermore, the philosopher George Santayana's quote “Those who cannot remember the past are condemned to repeat it” is applicable to this situation. Therefore, it is important to take the necessary steps to mitigate this risk.

The recommended mitigation steps include the use of trusted and established oracle providers such as Chainlink, Band Protocol, or Flux. The USDC/NOTE or USDT/NOTE price feed may be used, but NOTE has its own volatility concerns.

## Details


The prices of USDC and USDT, which (I assume) are the underlying tokens of `cUSDC` and `cUSDT`, have been hardcoded to parity. Such practices are highly discouraged because while the likelihood of either stablecoin de-pegging is low, it is not zero.

Because of the UST debacle, the [price of USDT dropped to `$0.95`](https://www.cnbc.com/2022/05/12/tether-usdt-stablecoin-drops-below-1-peg.html) before making a recovery.

### Impact

Here is an example of how [a lending protocol on Fantom was affected by such a depeg event because they hardcoded the value](\[https://cryptoslate.com/scream-protocol-losses-millions-to-stablecoin-depeg/]\(https://cryptoslate.com/scream-protocol-losses-millions-to-stablecoin-depeg/\)).

To quote philosopher George Santayana, *“Those who cannot remember the past are condemned to repeat it.”*

### Recommended Mitigation Steps

Consider using a price feed by trusted and established oracle providers like Chainlink, Band Protocol or Flux. The USDC/NOTE or USDT/NOTE price feed may be used as well, but NOTE has its own volatility concerns.


***
