---
tags:
  - checklist
  - sector/yield-aggregator
generated: true
---
# Yield Aggregator — Audit Checklist

> Auto-generated from **21** findings in this sector (**4** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Logic: Reward Calculation** — 3 findings `vuln/logic/reward-calculation`
- [ ] **Dos: Frozen Funds** — 1 finding `vuln/dos/frozen-funds`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/first-deposit` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/mev/frontrun` — 1
- `impact/loss-of-funds/locked-funds` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/fix-arithmetic` — 3
- `fix/use-reentrancy-guard` — 1

## 📚 Study these findings

- [[13255-convexpositionhandler-claimrewards-incorrectly-calculates-am|ConvexPositionHandler._claimRewards incorrectly calculates amount of LP tokens to unstake]] — `vuln/logic/reward-calculation`
- [[57531-stake-begin-time-updated-before-reward-calculation-in-mystak|Stake begin time updated before reward calculation in MyStaking.]] — `vuln/logic/reward-calculation`
- [[57532-incorrect-storage-of-user-rewards-during-staking-in-mystakin|Incorrect storage of user rewards during staking in MyStaking.]] — `vuln/logic/reward-calculation`
- [[57533-user-funds-lock-in-mystaking-due-to-stakercount-manipulation|User funds lock in MyStaking due to stakerCount manipulation.]] — `vuln/dos/frozen-funds`
