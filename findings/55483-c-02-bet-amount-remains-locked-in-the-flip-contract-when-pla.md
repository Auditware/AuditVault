---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/staking
  - sector/gaming
protocol: "[[Coinflip]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Coinflip-security-review_2025-02-05.md"
genome:
  - "[[reward-accounting]]"
  - "[[dos/frozen-funds]]"
  - "[[loss-of-funds/locked-funds]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[redesign-logic]]"
  - "[[blast-radius/single-user]]"
---
# [C-02] Bet amount remains locked in the `Flip` contract when player wins

- id: 55483
- impact: HIGH
- protocol: Coinflip_2025-02-05
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Coinflip-security-review_2025-02-05.md

## Summary


This bug report highlights a problem in a game where, upon winning, a percentage of the bet amount is sent to the manager and/or staking contract, but the rest of the bet amount remains locked forever. This results in the protocol losing tokens for every game won and gaining tokens for every game lost, making it unsustainable in the long term. The report recommends a code change to fix the issue.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

When a game is completed and the player wins, a percentage of the bet amount (fee) is sent to the manager and/or the staking contract. But the rest of the bet amount remains locked forever.

This means that for every game won, the protocol loses `netPayout` tokens, while for every game lost, the protocol gains `betAmount` tokens.

Considering a scenario where the parameters are set to provide the maximum profitability for the protocol we would have the following:

- feePercentage = 10%
- managerWinFeePercentage = 0%
- liquidityEdge = 0%

A player bets 100 tokens for 1 head out of 1 flip, so the chance of winning is 50%.

- If the player wins, Staking contract sends 190 tokens to the player, 10 tokens (fee) are transferred from Flip to Staking contract, and 90 tokens get locked in the Flip contract. The result for the protocol is a net loss of 180 tokens.
- If the player loses, the protocol gains 100 tokens from the player bet.

As we can see, the protocol is not sustainable in the long term.

## Recommendations

```diff
        uint256 managerFee = (fee * managerWinFeePercentage) / 10000;
-       uint256 stakingFee = fee - managerFee;
+       uint256 stakingAmount = game.betAmount - managerFee;

        if (managerFee > 0) {
            game.token.safeTransfer(manager, managerFee);
        }
-       if (stakingFee > 0) {
-           game.token.safeTransfer(address(stakingContract), stakingFee);
-       }
+       game.token.safeTransfer(address(stakingContract), stakingAmount);
```
