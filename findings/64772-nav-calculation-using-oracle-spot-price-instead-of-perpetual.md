---
tags:
  - lang/solidity
  - sector/lending
  - sector/oracle
  - sector/perpetuals
  - platform/quantstamp
  - severity/high
  - vuln/oracle/spot-price
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
  - novelty/known-pattern
  - misassumption/oracle-is-reliable
  - misassumption/price-cannot-be-manipulated
  - fix/use-twap
protocol: "[[Dipcoin]]"
auditors:
  - "[[Hamed Mohammadi]]"
report: "https://certificate.quantstamp.com/full/dipcoin-vault/287cb76f-d531-451c-b1ae-306a570c4ff3/index.html"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[pyth-oracle-completeness]]"
---
# NAV Calculation Using Oracle Spot Price Instead of Perpetual Mark Price

- id: 64772
- impact: HIGH
- protocol: [[Dipcoin]] Vault
- reporter: Hamed Mohammadi (Quantstamp)
- source: https://certificate.quantstamp.com/full/dipcoin-vault/287cb76f-d531-451c-b1ae-306a570c4ff3/index.html

## Summary


The client has reported a bug in the vault's Net Asset Value (NAV) calculation. The vault uses a price feed from the Pyth oracle to value its positions, but this only provides the spot price of an underlying asset, not the mark price of a specific perpetual contract. This can lead to an incorrect NAV and an exploitable share price. An attacker can take advantage of this by triggering a withdrawal during a period of significant market backwardation, causing the vault's NAV to be artificially inflated and stealing from other depositors. To fix this, the NAV calculation must be refactored to use the perpetual contract's own internal mark price instead of the spot price from the oracle. The spot oracle should only be used for liquidations and calculating the funding rate.

## Details

**Update**
Marked as "Acknowledged" by the client. The client provided the following explanation:

> We choose the oracle price based on the following considerations:
> 
> 
> 1.   Mark price is more susceptible to manipulation than oracle price, especially when liquidity is insufficient in the early stages.
> 2.   The oracle price is more transparent than the mark price.
> 3.   The oracle price is more representative of the fair price. Any deviation of the market price from the oracle price is only temporary and will regress to the oracle price. When withdrawing funds while the market price is lower than the oracle price, the share_price refers to the price obtained after position closure (which already accounts for the price deviation) and will not cause losses to the remaining depositors.

**File(s) affected:**`vault.move`

**Description:** The vault's Net Asset Value (NAV) is calculated by valuing its perpetual contract positions using a price feed from the Pyth oracle. However, Pyth oracles provide the _spot price_ of an underlying asset (e.g., the current market price of BTC), not the _mark price_ of a specific perpetual contract trading on an exchange. In derivatives markets, the perpetual price can significantly deviate from the spot price – a difference known as the basis. By using the spot price for valuation, the contract incorrectly calculates the unrealized PnL of its positions, leading to a flawed NAV and an exploitable share price.

**Exploit Scenario:**

1.   An attacker waits for a period of significant market backwardation, where the price of a perpetual contract (`BTC-PERP`) is trading at a substantial discount to the spot price of the underlying asset (`BTC`). For example,`BTC-PERP`might be at $48,000 while the Pyth oracle reports a spot price of $50,000.
2.   The vault holds a large, long`BTC-PERP`position. The _true_ market value of this position is based on the $48,000 price.
3.   The attacker, who is an existing depositor, triggers a withdrawal. The`compute_perpetual_position_value`function is called and uses the _higher_ spot price of $50,000 from the Pyth oracle to calculate the position's value.
4.   This miscalculation artificially inflates the vault's NAV, resulting in an overstated share price. The attacker's shares are now worth more than they should be, and when they withdraw, they receive an excess amount of the underlying assets, effectively stealing the difference in value from the remaining depositors in the vault.

**Recommendation:** The NAV calculation in`compute_perpetual_position_value()`must be refactored to use the perpetual contract's own internal mark price for valuing positions, not the external spot price from the oracle. The spot oracle should only be used as a reference for liquidations and for calculating the funding rate, which are its correct functions in a perpetuals system.
