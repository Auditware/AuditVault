---
tags:
  - lang/solidity
  - sector/dex
  - platform/openzeppelin
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - impact/mev/sandwich
  - trigger/sandwich-attack
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Uniswap Hooks]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/openzeppelin-uniswap-hooks-v1.1.0-rc-1-audit"
genome:
  - "[[underflow]]"
  - "[[sandwich]]"
  - "[[defi/sandwich-attack]]"
  - "[[known-pattern]]"
  - "[[frontrun-exposure]]"
  - "[[integer-bounds]]"
---
# Integer Underflow in _getTargetOutput Due to Improper Type Casting

- id: 61383
- impact: HIGH
- protocol: OpenZeppelin [[Uniswap Hooks]] v1.1.0 RC 1 Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/openzeppelin-uniswap-hooks-v1.1.0-rc-1-audit

## Summary


The `AntiSandwichHook` contract has a bug where a negative value can be improperly converted to a positive value, resulting in an incorrect and potentially large value. This can be exploited by attackers to carry out a sandwich attack and make profits without penalties. The bug can be fixed by performing a sign check and normalizing the value before converting it to an unsigned integer.

## Details

In the `AntiSandwichHook` contract, an integer underflow may occur due to the improper casting of a negative `int128` value to `uint128` in the [`_getTargetOutput`](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/AntiSandwichHook.sol#L196) function:

```
 int128 target =
    (params.amountSpecified < 0 == params.zeroForOne) ? targetDelta.amount1() : targetDelta.amount0();
targetOutput = uint256(uint128(target));

```

To understand the issue, consider the following example:

```
 SwapParams({
    zeroForOne: true,
    amountSpecified: 10_000 * 1e18,
    sqrtPriceLimitX96: sqrtPriceLimitX96
});

```

In this scenario, the user specifies they want to *receive* 10,000 units of token1. Since `amountSpecified` is positive and `zeroForOne` is `true`, the swap direction is token0 → token1, and the *unspecified amount* - the amount of token0 that the user must pay - will be negative.

The logic in `_getTargetOutput` selects this negative `int128` value (`target`), directly casts it to `uint128`, and then to `uint256`, without correcting the sign. This results in an underflow, setting `targetOutput` to a very large, incorrect value (e.g., `2**128 - 1`).

An attacker could exploit this vulnerability to carry out a profitable sandwich attack. Specifically, they could execute the final swap in a block with a positive `amountSpecified`, which causes the `target` (the unspecified input amount) to be negative. As a result, the anti-sandwich mechanism would interpret this as an extremely high `targetOutput`, allowing the attacker to extract the expected profits without penalties, completing the sandwich strategy successfully.

Consider performing a sign check and normalizing before casting to unsigned integers.
