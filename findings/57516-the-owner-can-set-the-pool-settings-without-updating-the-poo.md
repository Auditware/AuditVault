---
tags:
  - lang/solidity
  - sector/dex
  - sector/governance
  - sector/multisig
  - platform/zokyo
  - has/github
  - severity/high
  - impact/privilege-escalation/ownership-transfer
protocol: "[[Sharkswap]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-08-08-SharkSwap.md"
genome:
  - "[[reward-calculation]]"
  - "[[ownership-transfer]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
---
# The owner can set the pool settings without updating the pool.

- id: 57516
- impact: HIGH
- protocol: [[Sharkswap]]
- reporter: zokyo (Zokyo)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-08-08-SharkSwap.md

## Summary


This bug report is about a function called "set" in a contract called MiniChefV2.sol. The owner of the contract can use this function to change certain settings, but there is a problem. The owner can change these settings without updating the pool, which can cause users to lose their rewards. The owner can also reset another contract that manages rewards, which can also cause users to lose their rewards. To fix this, it is recommended to update the pool before changing any settings and to consider transferring ownership of the contract to a group called the DAO in the future. It is also important to let users know about any changes ahead of time so they can claim their rewards before they are lost. The SharkSwap team has checked and confirmed that the ownership is already set to the DAO and users will be notified about any changes in the future.

## Details

**Description**

MiniChefV2.sol: function set(). The owner can set new allocation points to the pool without updating the pool, which can lead to the loss of users' pending rewards. The owner can also reset the rewarder contract for the pool, which can also lead to the loss of pending rewards on the previous rewarder.

**Recommendation**

Update the pool before setting new parameters. Consider transferring the ownership of the contract to the DAO in the future and notify users about all the changes in advance so that they can claim their rewards in time.

**Re-audit comment**

Verified.

Post-audit:

The SharkSwap team verified that the ownership is set to multi-sig DAO contract and users will be notified about any changes in advance.
