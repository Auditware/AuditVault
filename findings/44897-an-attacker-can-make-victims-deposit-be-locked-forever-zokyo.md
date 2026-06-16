---
tags:
  - lang/solidity
  - sector/stable
  - platform/zokyo
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - vuln/dos/griefing
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/locked-funds
  - novelty/variant
protocol: "[[Vaultka]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-08-30-Vaultka.md"
genome:
  - "[[frozen-funds]]"
  - "[[griefing]]"
  - "[[direct-drain]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[timelock-timestamp-bypass]]"
  - "[[timestamp-dependence]]"
---
# An Attacker Can Make Victim's Deposit Be Locked Forever

- id: 44897
- impact: HIGH
- protocol: [[Vaultka]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-08-30-Vaultka.md

## Summary


This bug report discusses a critical issue in the deposit() function of the Water contract. The bug allows an attacker to reset the withdrawal time for a victim, preventing them from being able to withdraw their assets. The report recommends removing the ability to deposit for others as a solution. However, the fix for this bug introduces another critical bug where a user can deposit funds to another account and immediately withdraw them without following the lockup period. The report suggests removing the parameter for the receiver address as it serves no purpose. This bug has been resolved in the latest commit, 7d32cf53cebcb6c81bc4755bbfd6befe4ac8522b.

## Details

**Severity**: Critical

**Status**: Resolved 

**Description**

Inside the deposit() function in Water.sol let's consider the following scenario ->

1.) Victim deposits x amount of assets into the Water contract, expecting good returns. He can withdraw at block.timestamp + lockTime

2.) It's almost time to withdraw for the victim, now an attacker calls deposit() with `assets` as 1 (1 USDC) and the receiver as a victim.

3.) The `userTimelock` for the victim gets reset again to block.timestamp + lockTime.

If this griefing keeps happening, the victim won't be able to withdraw ever (Due to check at L209)

**Recommendation** 

The functionality to deposit for others should be removed.

**Comment**: The new fix adds another critical bug where a user can deposit to another account and instantly remove the funds bypassing the lockup.

**Comment**: The client fixed the following issue in commit: 7d32cf53cebcb6c81bc4755bbfd6befe4ac8522b. However, the paremter `address _receiver` should be removed as it has no functionality.
