---
tags:
  - lang/solidity
  - platform/zokyo
  - has/github
  - severity/high
  - sector/dex
  - sector/governance
protocol: "[[Sharkswap]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-08-08-SharkSwap.md"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# The owner can change the reward rate.

- id: 57515
- impact: HIGH
- protocol: [[Sharkswap]]
- reporter: zokyo (Zokyo)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-08-08-SharkSwap.md

## Summary


The bug report is about a function in the CloneRewarderTime.sol contract that allows the owner to change the reward per second without updating the current "accToken1PerShare" of the pools. This means that if the owner sets a lower value or 0, users may lose their pending rewards. The recommendation is to update all pools before setting a new reward per second value. The issue has been resolved by the SharkSwap team by ensuring that the Governance contract will always update the pool before setting new parameters. However, this mandatory action is not currently present in the code.

## Details

**Description**

CloneRewarderTime.sol: function setReward PerSecond(). Function allows the owner to change reward per second without updating the current "accToken1PerShare" of the pools. This way, users might lose their pending rewards in case the owner sets a lower value or a 0.

**Recommendation**

Update all the pools before setting a new reward per second value.

**Re-audit comment**

Resolved.

Post audit:

The SharkSwap team verified that the Governance contract will always be calling "updatePool" function before setting new parameters and users will be notified within the dApp about all future changes in advance. However, such mandatories are not present in the current code.
