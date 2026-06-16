---
tags:
  - lang/solidity
  - sector/dex
  - platform/openzeppelin
  - has/github
  - severity/high
  - impact/loss-of-funds/fee-theft
protocol: "[[Uniswap Hooks]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/openzeppelin-uniswap-hooks-v1.1.0-rc-1-audit"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[fee-theft]]"
  - "[[reward-accounting]]"
---
# Accrued Limit Order Fees Can Be Stolen

- id: 61378
- impact: HIGH
- protocol: OpenZeppelin [[Uniswap Hooks]] v1.1.0 RC 1 Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/openzeppelin-uniswap-hooks-v1.1.0-rc-1-audit

## Summary


The LimitOrderHook contract in Uniswap has a bug where an attacker can manipulate the system to unfairly claim a majority of the fees collected by limit order liquidity. This can be done by creating a large limit order and filling it quickly, allowing the attacker to claim fees that were accrued before they even became a liquidity provider. To fix this issue, it is suggested to track the timestamp or block number when each user adds liquidity and distribute fees only based on the portion of fees accrued after that point. Alternatively, maintaining per-user fee snapshots would also ensure fair distribution of rewards.

## Details

In the `LimitOrderHook` [contract](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol), a limit order is [one](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L228) `tickSpacing` wide and is [considered](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L209) *filled* [when](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L198) the tick goes from the lower tick of the `tickSpacing` to the upper tick.

In Uniswap, a tick is a small price difference, but the `tickSpacing` is multiple ticks. For example, the default tick spacing in a 1% fee pool [is](https://arbiscan.io/address/0x80A9ae39310abf666A87C743d6ebBD0E8C42158E#readContract#F14) 200, which corresponds to a price difference between `tickSpacings` of 2.02%. With this significant price range between `tickSpacing`, the price can land within a limit order and multiple swaps can occur without fully crossing over to the other side of `tickSpacing`, which would lead to significant accrual of fees for the liquidity that makes up the limit order.

When limit orders are filled, the fees are added to the tokens that are claimable as part of [the](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L569) `delta`. Upon withdrawal, the total token amount is divided based on how much liquidity a user has [provided](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L362).

Suppose that an unfilled limit order has accrued significant fees. The attacker can execute this sequence in one block:

1. Create a large limit order, capturing 90% of the limit order liquidity for that tick spacing.
2. Swap so that the `tickSpacing` is crossed and the limit order is filled.
3. Withdraw once filled the limit order.

Since all the fees collected by the limit order liquidity are split based on the share of liquidity when the order is filled, regardless of how much of the fees they were *responsible for* or how long their position was active, the attacker captures the majority of fees despite providing liquidity for less than 1 block. They capture fees that were accrued before they were ever an active liquidity provider. Moreover, the [comment](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L305) on canceled orders mentions that the fee is given to the existing order. It does not take into account that future liquidity providers can claim/steal a portion of these fees.

Consider tracking the timestamp or block number when each user adds liquidity, and distributing fees only based on the portion of fees accrued after that point. This would prevent newly added liquidity, especially JIT additions, from unfairly claiming fees that were accumulated before their participation. Alternatively, maintaining per-user fee snapshots would allow precise and fair distribution of rewards.
