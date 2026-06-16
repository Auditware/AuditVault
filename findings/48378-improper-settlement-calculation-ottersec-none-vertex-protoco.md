---
tags:
  - lang/solidity
  - sector/dex
  - sector/perpetuals
  - platform/ottersec
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Vertex]]"
auditors:
  - "[[Shiva Shankar]]"
report: "https://vertexprotocol.io/"
genome:
  - "[[fee-calculation]]"
  - "[[direct-drain]]"
  - "[[cross-contract-state-consistency]]"
  - "[[fee-accounting]]"
  - "[[fot-slippage]]"
---
# Improper Settlement Calculation

- id: 48378
- impact: HIGH
- protocol: [[Vertex]] Protocol
- reporter: Shiva Shankar (OtterSec)
- source: https://vertexprotocol.io/

## Summary


The bug report is about an error in the PerpEngine code that calculates the amount that users can settle in the perp market. The current code does not consider the user's portion of the liquidity pool when calculating profit and loss, leading to inconsistencies and a drain of funds. The suggested solution is to change the calculation to consider the ratio of the user's liquidity pool amount to the total pool amount. This issue has been fixed in a recent patch.

## Details

## PerpEngine Settlement State Calculation

In PerpEngine, `getSettlementState` is used to calculate the amount that users can settle at that time by calculating the total profit/loss that they made in the perp market.

## Code Snippet
```solidity
contracts/PerpEngine.sol
(int256 ammBaseX18, int256 ammQuoteX18) = MathHelper.ammEquilibrium(
    lpState.base.fromInt(),
    lpState.quote.fromInt(),
    priceX18
);

int256 positionPnlX18 = priceX18.mul(balance.amountX18 + ammBaseX18) +
    balance.vQuoteBalanceX18 +
    ammQuoteX18;
```

## Profit and Loss Calculations
For profit and loss calculations, the entire pool’s base and quote balance is considered, whereas the user’s portion (`lpBalance/supply`) of the amount in it only needs to be considered. Every user will receive the entire liquidity pool’s base and quote value in their profit, leading to a drain of funds and inconsistencies.

## Remediation
Consider `amountLp/supply` ratio of pool liquidity for calculating the user’s PNL.

## Patch
The Position PNL calculation is changed to consider only `amountLp/supply` ratio of `ammBase` and `ammQuote` amounts. Fixed in #130.
