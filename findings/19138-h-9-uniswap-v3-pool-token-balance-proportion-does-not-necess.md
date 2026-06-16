---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - sector/stable
  - platform/sherlock
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[USSD]]"
auditors:
  - "[[0xRan4212]]"
  - "[[Bahurum]]"
  - "[[VAD37]]"
  - "[[WATCHPUG]]"
  - "[[curiousapple]]"
  - "[[mahdikarimi]]"
  - "[[n33k]]"
  - "[[nobody2018]]"
  - "[[simon135]]"
report: "https://github.com/sherlock-audit/2023-05-USSD-judging"
genome:
  - "[[underflow]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[integer-bounds]]"
  - "[[oracle-manipulation-resistance]]"
---
# H-9: Uniswap v3 pool token balance proportion does not necessarily correspond to the price, and it is easy to manipulate.

- id: 19138
- impact: HIGH
- protocol: [[USSD]] - Autonomous Secure Dollar
- reporter: VAD37 (Sherlock)
- source: N/A

## Summary


This bug report is about an issue found in Uniswap v3 pool, which is a decentralized exchange for trading tokens. The issue is that the proportion of pool tokens does not necessarily correspond to the price, and it is easy to manipulate. This can be exploited by attackers, as they can manipulate the proportion to buy or sell tokens at a manipulated price. 

The root cause of the issue is the `getSupplyProportion()` function, which retrieves the balances of the Uniswap v3 pool. If `ownval` is less than `1e6 - threshold`, `USSDamount` may be lower than `DAIamount`, causing L97 `USSDamount - DAIamount` to revert due to underflow.

The impact of this issue is twofold: 1) `rebalance()` may malfunction if the proportion is not as expected, and 2) manipulating the proportion can result in the protocol selling a significantly larger amount of collateral assets than intended, at a manipulated price.

A code snippet is provided to demonstrate the issue, and the tool used to find this issue was Manual Review. The recommendation is to use a more complex formula that considers the liquidity range to calculate the delta amount required to restore the peg.

The issue has been escalated for 10 USDC, and it has been determined that this issue is not a duplicate of #451 as claimed by @0xJuancito. The issue has been accepted by @0xJuancito, @bahurum, and @0xJuancito.

## Details

Source: https://github.com/sherlock-audit/2023-05-USSD-judging/issues/808 

## Found by 
0xRan4212, Bahurum, VAD37, WATCHPUG, curiousapple, mahdikarimi, n33k, nobody2018, simon135
## Summary

`getSupplyProportion()` retrieves Uniswap v3 pool balances, but the proportion of pool tokens doesn't always correspond to the price. If `ownval` is less than `1e6 - threshold`, `USSDamount` may be lower than `DAIamount`, causing L97 `USSDamount - DAIamount` to revert due to underflow. Proportion can be easily manipulated, which can be exploited by attackers.

## Vulnerability Detail

`getSupplyProportion()` retrieves the balances of the Uniswap v3 pool. However, due to the different designs of Uniswap v3 and Uniswap v2, the proportion of pool tokens does not necessarily correspond to the price.

As a result, if `ownval` is less than `1e6 - threshold` (e.g. 0.95), `USSDamount` may be lower than `DAIamount`, causing L97 `USSDamount - DAIamount` to revert due to underflow.

Additionally, the pool contract holds accumulative fees on its balances, which are not impacted by price changes.

---

Furthermore, the proportion can be easily manipulated with minimal cost, which can be exploited by attackers.

If the price of USSD goes over-peg (which can happen naturally), an attacker can take advantage by following these steps:

1. Add single leg liquidity of DAI to the DAI/USSD pool at an exorbitantly high price range, such as 1 DAI == 1000-2000 USSD.
2. Manipulate the price of the collateral asset, such as WETH, to a higher price.
3. Place a limit-order like JIT liquidity at a higher price in the WETH/DAI pool.
4. Trigger `rebalance() -> SellUSSDBuyCollateral()`, but it will mint and sell much more than expected (the amount needed to bring the peg back) as the `DAIamount` is significantly higher than `USSDamount` at a manipulated high price. This will buy the limit order from step 3.
5. Reverse the price of WETH/DAI and remove the liquidity placed at step 1.

## Impact

1. `rebalance()` may malfunction if the proportion is not as expected.
2. Manipulating the proportion can result in the protocol selling a significantly larger amount of collateral assets than intended. If the collateral asset is also manipulated, it would be sold at a manipulated price, causing even larger damage to the protocol.

## Code Snippet

https://github.com/sherlock-audit/2023-05-USSD/blob/main/ussd-contracts/contracts/USSDRebalancer.sol#L13-L16

https://github.com/sherlock-audit/2023-05-USSD/blob/main/ussd-contracts/contracts/USSDRebalancer.sol#L83-L107

## Tool used

Manual Review

## Recommendation

Instead of using the pool balances to calculate the delta amount required to restore the peg, a more complex formula that considers the liquidity range should be used.



## Discussion

**0xJuancito**

Escalate for 10 USDC

This issue is already addressed on #451 and its duplicates

All of them refer to manipulation of Uniswap v3 pool and calling `rebalance()` to manipulate USSD price. Other duplicate findings address the same issue as here with `getSupplyProportion ()` as well, like https://github.com/sherlock-audit/2023-05-USSD-judging/issues/92, https://github.com/sherlock-audit/2023-05-USSD-judging/issues/731, https://github.com/sherlock-audit/2023-05-USSD-judging/issues/733 just to give some examples.

**sherlock-admin**

 > Escalate for 10 USDC
> 
> This issue is already addressed on #451 and its duplicates
> 
> All of them refer to manipulation of Uniswap v3 pool and calling `rebalance()` to manipulate USSD price. Other duplicate findings address the same issue as here with `getSupplyProportion ()` as well, like https://github.com/sherlock-audit/2023-05-USSD-judging/issues/92, https://github.com/sherlock-audit/2023-05-USSD-judging/issues/731, https://github.com/sherlock-audit/2023-05-USSD-judging/issues/733 just to give some examples.

You've created a valid escalation for 10 USDC!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**bahurum**

Escalate for 10 USDC

This isssue  is not a duplicate of #451 as claimed by @0xJuancito.

The problem here is not the usage of `slot0()` but calculating the price of a Uniswap V3 pool as ratio of pool reserves, which is fundamentally wrong.
Also, while this issue allows an attack vector which involves manipulation of the price of the pool, the issue already exists without manipulation as the rebalancing will be completely off or would not work at all, and this for any normal non-manipulated pool.


**sherlock-admin**

 > Escalate for 10 USDC
> 
> This isssue  is not a duplicate of #451 as claimed by @0xJuancito.
> 
> The problem here is not the usage of `slot0()` but calculating the price of a Uniswap V3 pool as ratio of pool reserves, which is fundamentally wrong.
> Also, while this issue allows an attack vector which involves manipulation of the price of the pool, the issue already exists without manipulation as the rebalancing will be completely off or would not work at all, and this for any normal non-manipulated pool.
> 

You've created a valid escalation for 10 USDC!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**0xJuancito**

Escalate for 10 USDC

For clarification from my previous comment, I'm pointing that many issues have been judged as a duplicate of #451 as stated on my comment due to this root cause as well, not necessarily with `slot0`, but the current use of the pool.

> This issue is already addressed on https://github.com/sherlock-audit/2023-05-USSD-judging/issues/451 and its duplicates

Just to give some examples:

- https://github.com/sherlock-audit/2023-05-USSD-judging/issues/731

> getSupplyProportion uses Uniswap V3 pool tokens balances which are easily manipulated. The protocol rebalances the USSD/DAI token proportion to 50/50 to rebalance the USSD/DAI price. This works for Uniswap V2 pools but does not work for Uniswap V3 pools.

- https://github.com/sherlock-audit/2023-05-USSD-judging/issues/733

> The getSupplyProportion() function, using the balanceOf() function, is designed to maintain the balance of the USSD/DAI pool in order to stabilize the USSD value at $1.

> However, this balance can be manipulated, particularly through UniswapPool flashloan, which facilitates the alteration of the balanceOf() value of both USSD and DAI in the pool. This then tricks the USSDRebalancer.rebalance() function into swapping half the total pool value.

My suggestion is to keep the consistency in the judging and group them all, as similar issues have been already grouped under #451.

**sherlock-admin**

 > Escalate for 10 USDC
> 
> For clarification from my previous comment, I'm pointing that many issues have been judged as a duplicate of #451 as stated on my comment due to this root cause as well, not necessarily with `slot0`, but the current use of the pool.
> 
> > This issue is already addressed on https://github.com/sherlock-audit/2023-05-USSD-judging/issues/451 and its duplicates
> 
> Just to give some examples:
> 
> - https://github.com/sherlock-audit/2023-05-USSD-judging/issues/731
> 
> > getSupplyProportion uses Uniswap V3 pool tokens balances which are easily manipulated. The protocol rebalances the USSD/DAI token proportion to 50/50 to rebalance the USSD/DAI price. This works for Uniswap V2 pools but does not work for Uniswap V3 pools.
> 
> - https://github.com/sherlock-audit/2023-05-USSD-judging/issues/733
> 
> > The getSupplyProportion() function, using the balanceOf() function, is designed to maintain the balance of the USSD/DAI pool in order to stabilize the USSD value at $1.
> 
> > However, this balance can be manipulated, particularly through UniswapPool flashloan, which facilitates the alteration of the balanceOf() value of both USSD and DAI in the pool. This then tricks the USSDRebalancer.rebalance() function into swapping half the total pool value.
> 
> My suggestion is to keep the consistency in the judging and group them all, as similar issues have been already grouped under #451.

You've created a valid escalation for 10 USDC!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**ctf-sec**

Consider this not a duplicate of #451 

and will redo some duplicate later

**0xRan4212**

Escalate for 10 USDC

https://github.com/sherlock-audit/2023-05-USSD-judging/issues/931 is a dup of this issue.

**hrishibhat**

Result:
High
Has duplicates
This issue is not a duplicate of #451, some of the duplications are changed accordingly. 

**sherlock-admin**

Escalations have been resolved successfully!

Escalation status:
- [0xJuancito](https://github.com/sherlock-audit/2023-05-USSD-judging/issues/808/#issuecomment-1605929297): accepted
- [bahurum](https://github.com/sherlock-audit/2023-05-USSD-judging/issues/808/#issuecomment-1605947205): accepted
- [0xJuancito](https://github.com/sherlock-audit/2023-05-USSD-judging/issues/808/#issuecomment-1606170316): accepted
