---
tags:
  - lang/solidity
  - sector/dex
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[Burve]]"
auditors:
  - Aamirusmani1552
report: "https://github.com/sherlock-audit/2025-04-burve-judging"
genome:
  - "[[frontrun-exposure]]"
  - "[[single-function]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[mev/frontrun]]"
  - "[[sandwich]]"
  - "[[trigger/price-manipulation]]"
  - "[[trigger/sandwich-attack]]"
  - "[[known-pattern]]"
  - "[[external-call-is-safe]]"
  - "[[use-reentrancy-guard]]"
  - "[[reentrancy-callback]]"
---
# H-5: Attacker captures unclaimed fees by timing deposit with range re-entry and price manipulation

- id: 56954
- impact: HIGH
- protocol: Burve
- reporter: Aamirusmani1552 (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue with the Burve platform, where an attacker can exploit the system to capture a disproportionate share of accumulated fees. This occurs when the Burve ranges are out of bounds in the underlying Uniswap V3 pool and the collected fees do not meet the minimum liquidity criteria. The attacker can deposit into Burve just before the market re-enters the ranges, then withdraw shortly after, effectively collecting a larger share of the fees. This is due to a flaw in the `collectAndCalcCompound()` function, which only adds liquidity when both tokens are usable. This creates a situation where one token is "stuck" in the contract until the market moves back into the Burve-defined ranges. The report suggests adding a small weighted big range to mitigate this issue. 

## Details

Source: https://github.com/sherlock-audit/2025-04-burve-judging/issues/288 

This issue has been acknowledged by the team but won't be fixed at this time.

## Found by 
Aamirusmani1552, bladeee, cccz, future, mstpr-brainbot

### Summary

Whenever users deposit into or withdraw from Burve, the associated fees are collected and redistributed back into the ranges according to their weights. However, if the current Burve ranges are *out of bounds* relative to the underlying Uniswap V3 pool-and the collected amounts don't meet the minimum liquidity criteria for out-of-range deposits-then no liquidity is compounded. This state persists until the market moves back within the Burve-defined ranges.

An attacker can exploit this by depositing into Burve just before the market re-enters the Burve ranges, then withdrawing shortly after. By sandwiching this moment, the attacker effectively collects a disproportionate share of the accumulated fees.


### Root Cause

Assume Burve has a single range that is currently out of range in the underlying Uniswap V3 pool. In this case, only one token-either token0 or token1, depending on the direction the range is out of-will be needed to add liquidity.

In the function [`collectAndCalcCompound()`](https://github.com/sherlock-audit/2025-04-burve/blob/44cba36e2a0c3cd7b6999459bf7746db92f8cc0a/Burve/src/single/Burve.sol#L848-L920), if only one token is collected, or if the collected token amount is small enough that dividing it by `amountInUnitLiqX64` results in `0` or a very low value, then the nominal liquidity to be compounded will also be very small-since it's based on the lesser of the two token-derived values.

Once the price in the underlying pool moves back into the Burve-defined range, the other token becomes usable for liquidity provision. An attacker can front-run this moment by depositing into Burve shortly before the range comes back into play-potentially even forcing this through swaps in the underlying pool.

As a result, when `collectAndCalcCompound()` is triggered again(by the withdraw function) and both token amounts are usable, the compounded liquidity will be much higher. The attacker can then immediately withdraw, capturing a disproportionate share of the previously accumulated fees.

### Internal Pre-conditions

None needed

### External Pre-conditions

1. Underlying pool tick is out of range for all Burve ranges and there are accumulated fees on the other token (the token that is not wanted to add liquidity at current out of range position)

### Attack Path

Assume the current Uniswap V3 pool tick is at 100, while Burve has a single active range set between ticks 50–90. Since the range is out of bounds, the position is not earning any liquidity fees. As a result, all of the position's value is held in a single token. In this scenario, only **token0** is required to add liquidity.

Now, assume the following state in Burve’s vault in fees:

* `token0` collected: **0**
* `token1` collected: **1000**

Because the Burve range is currently out of range, any deposit or withdrawal will not trigger fee compounding. This happens for reasons explained earlier: the `collectAndCalcCompound()` function cannot add liquidity when it only has the wrong-side token (here, `token1`) available.

This creates a situation where 1000 `token1` is effectively "stuck" in the contract-it won't be converted into liquidity until the underlying pool's price moves back into Burve's specified range (50–90).

An attacker can exploit this by:

1. **Depositing liquidity** into Burve while the range is still out of bounds.
2. **Pushing the Uniswap V3 price down** into Burve’s tick range (e.g., from tick 100 to 85) by initiating a large swap.
3. Once the pool price re-enters the Burve range, the next `collectAndCalcCompound()` call will succeed. This time, the previously idle 1000 `token1` will be used to add real liquidity.
4. The attacker then **withdraws** their shares from Burve. Because they entered just before compounding occurred, and now more liquidity was added, their share of the vault is inflated-they effectively captured the full benefit of the previously unclaimed 1000 `token1`.

This results in the attacker siphoning off previously accumulated fees that should have been distributed across all participants proportionally. It’s a type of fee-sniping sandwich attack.


### Impact

As long as burve ranges are out of range and their accumulated fees on the other token which is always likely, the above attack is possible. Even it's not an attack, users depositing or withdrawing when the range is out of order will not receive fair results. 

Additional note, burve ranges can not be changed. Its immutable so it makes the attack more viable and inevitable.

### PoC

Described in attack path.

### Mitigation

The best mitigation is to make sure the burve ranges are always in range. This can be achieved by adding a small weighted big range.
