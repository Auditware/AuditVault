---
tags:
  - lang/solidity
  - sector/bridge
  - sector/gaming
  - sector/staking-pool
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
  - "[[reward-accounting]]"
---
# [H-01] Game fee locked in `earlyEndGame`

- id: 34118
- impact: HIGH
- protocol: [[Curio]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Curio-security-review.md

## Summary


This bug report discusses an issue with the `earlyEndGame` function in a game contract. The problem is that the game fee, which is deducted from a player's payout, is not being transferred to the designated treasury address. Instead, it remains in the contract, causing the funds to be locked without a way to transfer them to the treasury. The report recommends implementing a mechanism within the function to ensure that the game fee is transferred to the treasury after it is deducted from the player's payout. This can be achieved by adding a transfer call to the function. 

## Details

**Severity**

**Impact:** Medium

**Likelihood:** High

**Description**

In the `earlyEndGame` function, there is an issue where the game fee deducted from a player's payout is not subsequently transferred to the treasury address. Instead, the fee is subtracted from the player's payout and remains in the contract. This results in the funds being locked within the contract without a dedicated method available to transfer these collected fees to the treasury.

**Recommendations**

It is crucial to implement a mechanism within the `earlyEndGame` function to ensure that the collected game fee is transferred to the treasury address after it is deducted from the player's payout. This can be achieved by adding a transfer call after the fee deduction logic:

```diff
function earlyEndGame(string calldata gameId, PlayerPayout memory playerPayout) external onlyAdmin whenNotPaused {
    ...

    uint256 gameTakeRate = takeRate[currentSession.gameType];
    uint256 gameFee = (playerPayout.payout * gameTakeRate) / 100;
    playerPayout.payout -= gameFee; // @audit gamefee will be stuck ?

    ...

    // Deduct money from players' balance
    balance[player] -= deduction;

    // Set the player game id to empty
    playerGameId[player] = "";

+    // Deposit game fee to reward pool
+   (bool sent,) = treasury.call{value: gameFee}("");
+   if (!sent) {
+        revert ValueTransferFailed();
+   }

    emit EarlyEndGame(playerPayout);
}
```
