---
tags:
  - lang/solidity
  - sector/bridge
  - sector/gaming
  - platform/pashov
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/variant
protocol: "[[Curio]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Curio-security-review.md"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[gamestate-frontrun]]"
---
# [C-03] Incorrect logical check in `endGame` function

- id: 34117
- impact: HIGH
- protocol: [[Curio]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Curio-security-review.md

## Summary


The `endGame` function in the `Game` contract has a mistake that causes it to not work properly. This function is supposed to handle payouts at the end of a game, but it uses the wrong symbol when comparing game IDs. This means that it skips players who are actually in the game, and no payouts or updates are made. The players' money stays locked in the contract and they cannot withdraw it. To fix this, the comparison symbol should be changed from `==` to `!=` in the `endGame` function. This will allow the function to work correctly and update player balances and game status as intended.

## Details

**Severity**

**Impact:** High

**Likelihood:** High

**Description**

The `endGame` function in the `Game` contract fails to function correctly due to an erroneous logical check. This function, intended to handle the payouts at the end of a game, incorrectly uses `==` instead of `!=` when comparing the hash of the `gameId` provided with the `gameId` of each player. This results in the function skipping all players who are actually in the game it intends to end. Consequently, no player payouts or updates to game status are processed, and the transaction completes without performing any meaningful actions despite returning a successful execution state. This results in the players' funds staying locked in the contract as they cannot withdraw when the game status is `InProgress`.

**Recommendations**

Change the comparison operator in the `endGame` function from `==` to `!=` to ensure that the function processes players who are part of the specified game. This modification will correct the logic, allowing the function to execute its intended operations, such as adjusting player balances and updating game status correctly.

```diff
-if (keccak256(abi.encodePacked(playerGameId[player])) == keccak256(abi.encodePacked(gameId))) {
+if (keccak256(abi.encodePacked(playerGameId[player])) != keccak256(abi.encodePacked(gameId))) {
    continue;
}
```
