---
tags:
  - lang/solidity
  - sector/dex
  - platform/openzeppelin
  - has/github
  - severity/high
  - impact/mev/sandwich
  - trigger/sandwich-attack
protocol: "[[Uniswap Hooks]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/openzeppelin-uniswap-hooks-v1.1.0-rc-1-audit"
genome:
  - "[[fee-calculation]]"
  - "[[sandwich]]"
  - "[[defi/sandwich-attack]]"
  - "[[frontrun-exposure]]"
---
# Incorrect Handling of unspecifiedAmount Leads to Overcharging

- id: 61382
- impact: HIGH
- protocol: OpenZeppelin [[Uniswap Hooks]] v1.1.0 RC 1 Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/openzeppelin-uniswap-hooks-v1.1.0-rc-1-audit

## Summary


The bug report discusses an issue with the dynamic-fee hooks in the Uniswap protocol. These hooks assume that the unspecified amount in a swap is always the output that the user will receive. However, this is not always the case as the unspecified amount can also be the input that the user must pay. This can lead to incorrect calculations and the user being charged more than intended. The report suggests adjusting the cap logic in the `_afterSwap` function to properly distinguish between input and output cases and ensure that the user is always charged the correct amount. 

## Details

The dynamic‐fee hooks (`BaseDynamicAfterFee` → `AntiSandwichHook`) [assume](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/AntiSandwichHook.sol#L167-L198) that the `unspecifiedAmount` in a swap is always the output that the user will receive. However, it can also be the input that the user must pay.

* **When `unspecifiedAmount` is output**: capping it by `_targetOutput` makes sense, as it prevents the user from receiving more than the fair amount.
* **When `unspecifiedAmount` is input**: capping by `_targetOutput` is incorrect. If the user’s intended input exceeds `_targetOutput`, the code silently treats the difference as a “fee,” minting extra tokens and charging the user more than intended.

#### Illustrative scenario

1. First swap in the block: user wants to receive 10,000 token₀
   * implies an unspecified input of 9,000 token₁
2. Second swap in the same block: user again wants 10 000 token₀, but now must pay 15 000 token₁.
   * `_targetOutput` will be `9,000`, because of the initial state of the block.
   * `unspecifiedAmount` will be `15,000`
   * It calculates `fee = unspecifiedAmount – _targetOutput = 15,000 – 9,000 = 6,000`, mints 6,000 extra token₁, and effectively charges the user 21,000 instead of 15,000.

Consider adjusting the cap logic in `_afterSwap` to distinguish input vs. output cases. When the `unspecifiedAmount` represents the user’s input (the amount they pay), then one of the following must be done:

* If the unspecified amount is greater than `targetOutput`, then `targetOutput` must be set equal to the unspecified amount.
* If `targetOutput` is greater than the unspecified amount, then the amount the user pays must be equal to `targetOutput`.

This way, the fee will not be applied since `targetOutput == unspecifiedAmount`, and it can always be ensured the user pays the highest amount.
