---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - platform/consensys
  - severity/high
  - impact/data-corruption/price-manipulation
  - trigger/flash-loan
  - trigger/price-manipulation
  - precondition/flash-loan-available
protocol: "[[Brahma Fi]]"
auditors:
  - "[[George Kobakhidze]]"
report: "https://consensys.net/diligence/audits/2022/05/brahma-fi/"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[flash-loan]]"
  - "[[trigger/price-manipulation]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[oracle-manipulation-resistance]]"
---
# The virtual price may not correspond to the actual price in the pool

- id: 13254
- impact: HIGH
- protocol: [[Brahma Fi]]
- reporter:  George Kobakhidze
 (ConsenSys)
- source: https://consensys.net/diligence/audits/2022/05/brahma-fi/

## Summary


This bug report is about a function in a Curve pool that returns a “virtual price” of the LP token. This price is designed to be resistant to flash-loan attacks and other manipulations. In some cases, however, there may be a significant period when a trade cannot be executed with this price. 

When depositing into Curve, Brahma is doing it in two steps. The first step calculates the user’s share according to the “virtual price”, and the second step deposits funds into the Curve pool. If the deposit price does not correspond to the virtual price, the transaction will revert.

This causes two problems. First, if the chosen slippage parameter is very low, the funds will not be deposited/withdrawn for a long time due to reverts. Second, if the slippage is large enough, the attacker can manipulate the price to steal the slippage. Additionally, because of the two-step deposit, the amount of Vault’s share minted to the users may not correspond to the LP tokens minted during the second step.

## Details

#### Description


A Curve pool has a function that returns a “virtual price” of the LP token; this price is resistant to flash-loan attacks and any manipulations in the Curve pool. While this price formula works well in some cases, there may be a significant period when a trade cannot be executed with this price. So the deposit or withdrawal will also be done under another price and will have a different result than the one estimated under the “virtual price”.


When depositing into Curve, Brahma is doing it in 2 steps. First, when depositing the user’s ETH to the Vault, the user’s share is calculated according to the “virtual price”. And then, in a different transaction, the funds are deposited into the Curve pool. These funds only consist of ETH, and if the deposit price does not correspond (with 0.3% slippage) to the virtual price, it will revert.


So we have multiple problems here:


1. If the chosen slippage parameter is very low, the funds will not be deposited/withdrawn for a long time due to reverts.
2. If the slippage is large enough, the attacker can manipulate the price to steal the slippage. Additionally, because of the 2-steps deposit, the amount of Vault’s share minted to the users may not correspond to the LP tokens minted during the second step.
