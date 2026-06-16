---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
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
  - "[[defi/sandwich-attack]]"
  - "[[indirect-loss]]"
  - "[[sandwich]]"
  - "[[defi/sandwich-attack]]"
  - "[[fee-accounting]]"
  - "[[frontrun-exposure]]"
---
# JIT Liquidity Penalty Can Be Bypassed

- id: 61375
- impact: HIGH
- protocol: OpenZeppelin [[Uniswap Hooks]] v1.1.0 RC 1 Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/openzeppelin-uniswap-hooks-v1.1.0-rc-1-audit

## Summary


The LiquidityPenaltyHook contract is designed to penalize traders who add and remove liquidity quickly, in order to prevent them from manipulating the market. However, there is a vulnerability that allows traders to bypass this penalty by strategically performing certain actions. This means that the contract is not effectively protecting against market manipulation and can result in ordinary traders losing value to manipulators. To fix this issue, the contract needs to be updated to monitor and account for fee collection during liquidity increases.

## Details

The `LiquidityPenaltyHook` [contract](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LiquidityPenaltyHook.sol) implements a mechanism to penalize JIT liquidity provision by imposing a [penalty](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LiquidityPenaltyHook.sol#L119) fee on positions that are added and removed within a short timeframe ([defined](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LiquidityPenaltyHook.sol#L61) by `blockNumberOffset`). This aims to prevent sandwich attacks where traders add liquidity just before a large swap, collect fees from that swap, and then immediately withdraw their liquidity.

When liquidity is removed before the configured `blockNumberOffset` number of blocks has passed, the hook calculates a penalty based on the fees earned (`feeDelta`) and [donates](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LiquidityPenaltyHook.sol#L121) this penalty back to the pool, effectively reducing the profit from JIT liquidity tactics. However, there is a vulnerability that allows a complete bypass of the penalty mechanism through a sequence of operations leveraging Uniswap v4's fee collection behavior. In Uniswap v4, when an `increaseLiquidity` operation is performed on an existing position, it automatically collects all accrued fees and [credits](https://github.com/Uniswap/v4-core/blob/main/src/libraries/Pool.sol#L189) them to the user, resetting `feesOwed` to zero.

The `LiquidityPenaltyHook` calculates penalties based on `feeDelta` [from](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LiquidityPenaltyHook.sol#L105) the `afterRemoveLiquidity` hook, which represents uncollected fees at the time of liquidity removal. By strategically performing an `increaseLiquidity` operation with a minimal amount before removing all liquidity, an attacker can collect all fees separately from the removal action, resulting in a `feeDelta` of zero during the liquidity removal and, thus, avoiding the intended penalty entirely.

1. Attacker adds substantial liquidity position to a pool.
2. Target swap executes, generating fees for the attacker's position.
3. Attacker calls `increaseLiquidity` with a minimal amount (e.g., 1 wei), which:
   * collects all accrued fees and transfers them to the attacker
   * calls `_afterAddLiquidity` hook (which only records the block number but does not penalize)
   * resets `feesOwed` to zero
4. Attacker immediately removes all liquidity. This calls `_afterRemoveLiquidity`, but since `feeDelta` is now zero, the penalty calculation yields zero.

This vulnerability completely undermines the core security mechanism of the `LiquidityPenaltyHook` contract. It allows JIT liquidity providers to execute sandwich attacks with zero penalty, defeating the entire purpose of the contract. Since the penalty can be fully bypassed, there is effectively no protection against JIT manipulation, leaving pools vulnerable to the exact attacks that this hook was designed to prevent.

The economic impact is significant since attackers can extract value from ordinary traders through JIT tactics without incurring the intended penalties, resulting in a direct transfer of value from normal users to manipulators.

The simplest immediate fix would be to extend the hook permissions to also monitor `beforeAddLiquidity` events and track fee collection that occurs during liquidity increases, accounting for these collected fees when calculating penalties during eventual liquidity removal.
