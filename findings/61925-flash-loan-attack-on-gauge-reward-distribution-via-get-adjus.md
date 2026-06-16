---
tags:
  - lang/vyper
  - sector/farm
  - sector/governance
  - sector/lending
  - sector/staking
  - platform/mixbytes
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - trigger/flash-loan
  - precondition/flash-loan-available
protocol: "[[Yield Basis]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Yield%20Basis/DAO/README.md#4-flash-loan-attack-on-gauge-reward-distribution-via-get_adjustment-manipulation"
genome:
  - "[[direct-drain]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[reward-calculation]]"
  - "[[dos-resistance]]"
  - "[[flashloan-callback-auth]]"
  - "[[reward-accounting]]"
---
# Flash Loan Attack on Gauge Reward Distribution via `get_adjustment()` Manipulation

- id: 61925
- impact: HIGH
- protocol: [[Yield Basis]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Yield%20Basis/DAO/README.md#4-flash-loan-attack-on-gauge-reward-distribution-via-get_adjustment-manipulation

## Summary


The bug report describes a problem with the `GaugeController._checkpoint_gauge()` function where an attacker can manipulate the reward allocation for a specific gauge by using a flash loan. This allows them to temporarily inflate the gauge's adjusted weight and increase their share of newly minted rewards. The report also suggests a potential fix to either prohibit unstaking in the same transaction or always calculate `balanceOf()/totalSupply()` as equal to 1. The client has also provided an example of the issue and recommends making changes to the checkpoint process in LiquidityGauge and GaugeController. 

## Details

##### Description

In the `GaugeController._checkpoint_gauge()` function, rewards are minted and the amount allocated to each gauge is computed for users to later claim. The gauge's adjusted weight (`aw`) is calculated based on `Gauge(gauge).get_adjustment()`, which internally evaluates `LP_TOKEN.balanceOf(self) / LP_TOKEN.totalSupply()`. The higher this ratio, the greater the share of newly minted rewards allocated to that gauge (as `aw / aw_sum`). This value can be manipulated using a flash loan, since `deposit()` and `withdraw()` can be called within a single transaction. An attacker can temporarily inflate the `aw` of their gauge to increase its reward share.

**Example:**

Assume there are two gauges, `gauge1` and `gauge2`, with equal vote weights and 90% of the LP token total supply staked in each.

An attacker flash-loans assets from `gauge1`'s pool, mints a large amount of LP tokens, deposits them into `gauge1`, and calls `GC.checkpoint(gauge1)` to register a much higher `aw` (due to the temporary spike in `balanceOf(self)`). In the same transaction, the attacker withdraws and repays the flash loan.

At this point, `GaugeController` holds an inflated `aw` for `gauge1`, increasing its reward ratio (`aw / aw_sum`). The attacker then waits (e.g., one day), allowing time-based rewards to accumulate under the manipulated weight. When `Gauge1.claim()` is called, rewards are distributed accordingly, granting the attacker a significantly larger share.

In this scenario, waiting one day can earn the attacker an extra 1.5% of total rewards. This figure grows with longer wait times or lower initial LP stake ratios in the targeted gauge.

**Additional note:**

An attacker could also use flash loans to increase the `LP_TOKEN.totalSupply()` in other gauges, reducing their `adjustment` and thereby their reward share. This doesn't boost rewards for `gauge1`, but acts as a denial-of-service (DoS) vector. However, Curve pool fees might outweigh the gains from such an attack, making the economic incentive unclear. Moreover, the attack is more effective in low-activity gauges, where the manipulated state can persist longer.

An example of the test was provided in the chat with the client.
<br/>
##### Recommendation

We recommend either prohibiting unstaking in the same transaction or always calculating `balanceOf()/totalSupply()` as equal to 1.

> **Client's Commentary:**
> **Client:** The issue is different from what is stated, but the test correctly covers TWO issues:
> 1) HIGH - checkpoints should be done AFTER Gauge token transfers, not before. Fixed in dc55c70b0a7192656ba2c8d54db093fd4a114647
> 2) Flashloan-assisted operations with LT combined with gauge checkpoint can temporarily disadvantage any gauge by making its adjustment small.
> 
> The issue is even bigger: checkpoint must be done before transfers in LiquidityGauge but after in GaugeController. 

---
