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
  - "[[frozen-funds]]"
  - "[[sandwich]]"
  - "[[defi/sandwich-attack]]"
  - "[[frontrun-exposure]]"
---
# Sandwich Attack Possible via JIT Attack in AntiSandwichHook

- id: 61381
- impact: HIGH
- protocol: OpenZeppelin [[Uniswap Hooks]] v1.1.0 RC 1 Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/openzeppelin-uniswap-hooks-v1.1.0-rc-1-audit

## Summary


The AntiSandwichHook contract is meant to prevent sandwich attacks on the Uniswap platform. However, there is a vulnerability that allows attackers to manipulate liquidity positions within the same block. This means that they can still profit from sandwich attacks despite the additional fee charged on swaps. An attack scenario has been identified where the attacker can add a large amount of liquidity, receive most of the penalty fee, and then withdraw the liquidity for a profit. To prevent this, a protection mechanism should be implemented against these types of attacks.

## Details

The [`AntiSandwichHook`](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/AntiSandwichHook.sol#L47) contract attempts to mitigate sandwich attacks by ensuring that swaps do not execute at prices better than those available at the beginning of the block. This is [enforced](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/AntiSandwichHook.sol#L167) through an additional fee charged on the swap, which is then donated to the pool and [distributed](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/AntiSandwichHook.sol#L206) to active liquidity providers (LPs) at the tick where the swap concludes.

However, a profitable sandwich strategy remains viable due to the ability of attackers to manipulate liquidity positions within the same block. The vulnerability emerges from the fact that liquidity provision and removal are permissionless and costless (excluding gas), and the redistribution of the penalized amount is proportional to the LP share at the final tick of the swap.

A possible attack scenario is as follows:

1. **Alice initiates a `!zeroForOne` swap**, [setting](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/AntiSandwichHook.sol#L138) the price checkpoint for the block.
2. **Bob (victim) performs a second `!zeroForOne` swap**, receiving a worse price.
3. **Alice adds a large, concentrated liquidity position** in the tick where the pool price will land, acquiring ~99% of the active liquidity.
4. **Alice executes a `zeroForOne` swap**, triggering `_afterSwapHandler`, which donates the fee to the pool.
5. **Alice receives 99% of the penalty** back via her dominant liquidity share.
6. **Alice withdraws the liquidity**, capturing a profit despite the intended penalty.

Consider implementing a protection mechanism against JIT liquidity attacks to prevent users from briefly injecting large amounts of liquidity immediately before fee redistribution events.
