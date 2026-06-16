---
tags:
  - lang/solidity
  - sector/dex
  - sector/farm
  - sector/lending
  - sector/staking-pool
  - platform/halborn
  - has/poc
  - severity/high
  - impact/mev/frontrun
  - trigger/low-liquidity
protocol: "[[Entangle Trillion]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/entangle-labs/entangle-trillion"
genome:
  - "[[spot-price]]"
  - "[[frontrun]]"
  - "[[trigger/low-liquidity]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[liquidation-underwater]]"
---
# Inadequate Slippage Control in Liquidity Withdrawal

- id: 51375
- impact: HIGH
- protocol: [[Entangle Trillion]]
- reporter: Halborn
- source: https://www.halborn.com/audits/entangle-labs/entangle-trillion

## Summary


The `withdraw` function in the contract has a critical issue where the minimum received tokens are set to `1`, leaving it vulnerable to front-running attacks and unfavorable exchange rates. This means that the contract is at risk of losing a lot of money when removing liquidity from a pool. An attacker can exploit this by buying a large amount of one of the pool's tokens before the contract's transaction is executed, causing the exchange rate to become worse. To fix this, the contract should implement dynamic slippage control or set more conservative slippage bounds. However, the issue has been marked as "Not Applicable" for now as the code will be used for liquidation in the future and users are currently not able to remove liquidity.

## Details

##### Description

The `withdraw` function in the contract is designed to withdraw LP tokens from a farm, remove liquidity, and then transfer the resultant tokens to the Entangle MasterChef. A critical issue arises from setting both `amountAMin` and `amountBMin` parameters to `1` in the `router.removeLiquidity` call. This approach poses a significant risk of slippage, making the transaction susceptible to front-running attacks and potentially resulting in a significantly worse exchange rate than expected.

By setting the minimum received tokens (`amountAMin` and `amountBMin`) to `1`, the contract effectively removes any meaningful slippage protection. This can lead to unfavorable rates for the withdrawn liquidity, especially in volatile or low-liquidity pools, where the actual amounts received can be drastically lower than the market rate. Such a vulnerability could be exploited by malicious actors performing front-running attacks, further worsening the slippage experienced by the contract.

##### Proof of Concept

The vulnerability arises from setting the minimum received amounts (`amountAMin` and `amountBMin`) to `1` in a liquidity removal operation. This practically removes any slippage protection and can be exploited through a front-running attack. Here's how an attacker could exploit this vulnerability:

An attacker monitors the mempool for pending transactions that call the `withdraw` function of the vulnerable contract. The goal is to identify transactions intending to remove liquidity from a pool.

Upon detecting a pending `withdraw` transaction, the attacker submits a transaction that buys a significant amount of one of the pool's tokens (either `token0` or `token1`). This transaction is crafted with a higher gas price to ensure it is mined before the targeted `withdraw` transaction. The purchase increases the price of the bought token in the pool.

The original `withdraw` transaction is executed after the attacker's purchase transaction. Due to the slippage vulnerability (with `amountAMin` and `amountBMin` set to `1`), the contract accepts whatever the current rate is, regardless of how unfavorable it has become due to the attacker's front-running transaction.

##### BVSS

[AO:A/AC:L/AX:L/C:N/I:N/A:N/D:H/Y:N/R:N/S:U (7.5)](/bvss?q=AO:A/AC:L/AX:L/C:N/I:N/A:N/D:H/Y:N/R:N/S:U)

##### Recommendation

Implement dynamic slippage control based on the current market conditions or set more conservative, realistic slippage bounds. This could involve querying the expected amounts using a method like `getAmountsOut` before executing the liquidity removal and setting the `amountAMin` and `amountBMin` parameters based on a permissible slippage percentage from those expected amounts.

  

**Remediation Plan:** The issue is marked as “Not Applicable” due to the code will be used for liquidation at the future. In the current design of protocol, the user is not able to remove liquidity.
