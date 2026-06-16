---
tags:
  - lang/solidity
  - sector/liquid-staking
  - sector/staking
  - platform/halborn
  - has/github
  - has/poc
  - severity/high
  - impact/data-corruption/price-manipulation
  - impact/mev/backrun
  - impact/mev/frontrun
  - impact/mev/sandwich
  - trigger/price-manipulation
  - trigger/sandwich-attack
protocol: "[[Entangle Trillion]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/entangle-labs/entangle-trillion"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[backrun]]"
  - "[[frontrun]]"
  - "[[sandwich]]"
  - "[[trigger/price-manipulation]]"
  - "[[defi/sandwich-attack]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[oracle-manipulation-resistance]]"
---
# Function reinvest from SynthChef contracts are prone to MEV bot attack

- id: 51372
- impact: HIGH
- protocol: [[Entangle Trillion]]
- reporter: Halborn
- source: https://www.halborn.com/audits/entangle-labs/entangle-trillion

## Summary


This bug report discusses a vulnerability in the SynthChef contracts used in decentralized finance (DeFi). The vulnerability, known as a "sandwich attack," allows an attacker to manipulate market prices and profit from a victim's trade by exploiting the predictability of transaction execution on the blockchain. The report outlines the steps an attacker can take to carry out this attack and the impact it can have on the victim. The report also includes a recommendation to set reasonable values in liquidity addition/removal functions to protect against slippage. The issue has been resolved by the Entangle team by adding a minimum return check. 

## Details

##### Description

In decentralized finance (DeFi), transactions are transparent on the blockchain, allowing observers to anticipate trades and potentially exploit them. A notable exploit is the "sandwich attack," which leverages the predictability of transaction execution to manipulate market prices for profit. This proof of concept outlines how the `reinvest` function in SynthChef contracts, when called with `amountMin` parameter set to zero, can be vulnerable to such attacks.

##### Proof of Concept

**Step 1: Observer Identifies a Vulnerable Transaction**

1. An MEV bot (the observer) monitors pending transactions in the mempool for calls to the `reinvest` function in SynthChef contracts where `amountMin` are set to zero.

**Step 2: Attacker Prepares a Sandwich Attack**

1. Upon identifying a vulnerable transaction, the attacker prepares two transactions:

   * **Front-run Transaction**: Buys asset Y (the asset being bought in the victim's trade) before the victim's transaction, anticipating a price increase.
   * **Back-run Transaction**: Sells asset Y after the victim's trade, aiming to profit from the price increase caused by the victim's transaction.

**Step 3: Execution of the Sandwich Attack**

1. The attacker submits the front-run transaction with a higher gas price to ensure it is mined before the victim's transaction.
2. The victim's transaction executes, buying asset Y as intended but at a higher price due to the front-run transaction, causing slippage.
3. The attacker submits the back-run transaction, also with a high gas price, to sell asset Y at the new, elevated price.

**Step 4: Outcome and Impact**

1. The attacker profits from the price difference between the front-run and back-run transactions, exploiting the lack of slippage protection in the victim's trade.
2. The victim experiences a worse trade outcome than expected, potentially losing a significant amount due to slippage and price manipulation.

##### BVSS

[AO:A/AC:L/AX:L/C:N/I:C/A:N/D:C/Y:N/R:P/S:C (7.8)](/bvss?q=AO:A/AC:L/AX:L/C:N/I:C/A:N/D:C/Y:N/R:P/S:C)

##### Recommendation

Always set reasonable `amountMin` values in liquidity addition/removal functions to provide slippage protection.

  

**Remediation Plan:** The Entangle team solved the issue by adding minimum return check.

##### Remediation Hash

<https://github.com/Entangle-Protocol/entangle-lsd-protocol/commit/8b071215def0f60f75afe508f39576fe909a36ab>
