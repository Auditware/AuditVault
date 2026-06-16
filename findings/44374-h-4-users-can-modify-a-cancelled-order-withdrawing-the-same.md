---
tags:
  - lang/solidity
  - sector/oracle
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - novelty/variant
protocol: "[[Oku'S New Order Types Contract Contest]]"
auditors:
  - "[[newspacexyz]]"
report: "https://github.com/sherlock-audit/2024-11-oku-judging"
genome:
  - "[[wrong-condition]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[fee-accounting]]"
  - "[[oracle-freshness]]"
---
# H-4: Users can modify a cancelled order, withdrawing the same tokens twice

- id: 44374
- impact: HIGH
- protocol: [[Oku'S New Order Types Contract Contest]]
- reporter: newspacexyz (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue found by multiple users where users are able to modify a cancelled order and withdraw the same tokens twice in the Bracket, OracleLess, and StopLimit features. This is due to a lack of validation in the code, allowing users to cancel an order and then modify it to withdraw more tokens. This can be done multiple times until all of the contract's tokens are drained. The impact of this bug is that the affected features can be drained. The protocol team has addressed this issue in a recent code update.

## Details

Source: https://github.com/sherlock-audit/2024-11-oku-judging/issues/542 

## Found by 
0x37, 0x486776, 0xaxaxa, 0xc0ffEE, 62616279727564696e, Bigsam, Breaker, BugPull, Cayde-6, Contest-Squad, DenTonylifer, ExtraCaterpillar, IvanFitro, JinxSalamV2, John44, KiroBrejka, NoOneWinner, NoWinner, PNS, Pablo, Ragnarok, Tri-pathi, Uddercover, WildSniper, c-n-o-t-e, etherhood, gajiknownnothing, hals, lanrebayode77, moray5554, mxteem, newspacexyz, onthehunt, oualidpro, phoenixv110, rudhra1749, s0x0mtee, safdie, silver\_eth, t.aksoy, t0x1c, vinica\_boy, xiaoming90, zhigang, zhoo, zxriptor
### Summary

In Bracket, OracleLess and StopLimit a user can modify a canceled order, allowing them to withdraw the order tokens twice.

### Root Cause

In Bracket, OracleLess and StopLimit there is no validation on whether an order has already been canceled before modifying it:
https://github.com/sherlock-audit/2024-11-oku/blob/ee3f781a73d65e33fb452c9a44eb1337c5cfdbd6/oku-custom-order-types/contracts/automatedTrigger/OracleLess.sol#L171-L225

This allows users to cancel an order, withdrawing all of the tokens, and after that modifying it by reducing the `amountIn` to 1, withdrawing the rest of the tokens for a second time.

### Internal pre-conditions

_No response_

### External pre-conditions

_No response_

### Attack Path

1. User creates an order with `amountIn` set to 1e18.
2. The user cancels the order, withdrawing 1e18 of the tokens.
3. Finally, they modify the order, decreasing `amountIn` to 1, withdrawing 1e18 - 1 of the already withdrawn tokens.
4. The attack can be performed several times until all of the contract's tokens are drained.

### Impact

Bracket, OracleLess and StopLimit can be drained.

### PoC

_No response_

### Mitigation

Make sure that a canceled order cannot be modified,



## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/gfx-labs/oku-custom-order-types/pull/1
