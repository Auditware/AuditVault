---
tags:
  - checklist
  - sector/vault
generated: true
---
# Vault — Audit Checklist

> Auto-generated from **117** findings in this sector (**14** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Logic: Reward Calculation** — 3 findings `vuln/logic/reward-calculation`
- [ ] **Dos: Frozen Funds** — 3 findings `vuln/dos/frozen-funds`
- [ ] **Logic: Fee Calculation** — 2 findings `vuln/logic/fee-calculation`
- [ ] **Arithmetic: Rounding Direction** — 1 finding `vuln/arithmetic/rounding-direction`
- [ ] **Dependency: Upgradeable Contract** — 1 finding `vuln/dependency/upgradeable-contract`
- [ ] **Arithmetic: Underflow** — 1 finding `vuln/arithmetic/underflow`
- [ ] **Reentrancy: Single Function** — 1 finding `vuln/reentrancy/single-function`
- [ ] **Dependency: Unchecked Return Value** — 1 finding `vuln/dependency/unchecked-return-value`
- [ ] **Oracle: Spot Price** — 1 finding `vuln/oracle/spot-price`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/first-deposit` — 4
- [ ] `trigger/sandwich-attack` — 3
- [ ] `trigger/cross-chain-message` — 1
- [ ] `trigger/reentrancy-callback` — 1
- [ ] `trigger/flash-loan` — 1
- [ ] `trigger/price-manipulation` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 14
- `impact/mev/frontrun` — 5
- `impact/loss-of-funds/locked-funds` — 5
- `impact/mev/sandwich` — 3
- `impact/privilege-escalation/role-bypass` — 2
- `impact/loss-of-funds/reward-theft` — 1
- `impact/data-corruption/price-manipulation` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/fix-arithmetic` — 7
- `fix/use-reentrancy-guard` — 7
- `fix/upgrade-dependency` — 1
- `fix/use-twap` — 1

## 📚 Study these findings

- [[10416-rounding-up-in-minting-shares-openzeppelin-pods-finance-ethe|Rounding up in minting shares]] — `vuln/arithmetic/rounding-direction`
- [[13255-convexpositionhandler-claimrewards-incorrectly-calculates-am|ConvexPositionHandler._claimRewards incorrectly calculates amount of LP tokens to unstake]] — `vuln/logic/reward-calculation`
- [[20229-h-06-division-by-zero-error-causes-kangaroovault-to-be-dos-w|[H-06] Division by zero error causes KangarooVault to be DoS with funds locked inside]] — `vuln/dos/frozen-funds`
- [[32466-incomplete-implementation-of-erc-4626-base-contract-leading|Incomplete Implementation of ERC-4626 Base Contract Leading to Asset Management and Usability Issues]] — `vuln/dependency/upgradeable-contract`
- [[34765-h-3-pool-value-does-not-consider-the-open-funding-fees-sherl|H-3: Pool value does not consider the open funding fees]] — `vuln/logic/fee-calculation`
- [[41067-h-03-a-dos-on-snapshots-due-to-a-rounding-error-in-calculati|[H-03] A `DoS` on snapshots due to a rounding error in calculations]] — `vuln/arithmetic/underflow`
- [[48701-bypass-internaladjustment-by-using-past-closures-ottersec-no|Bypass internalAdjustment by Using Past Closures. . . . . . .]] — `vuln/reentrancy/single-function`
- [[57531-stake-begin-time-updated-before-reward-calculation-in-mystak|Stake begin time updated before reward calculation in MyStaking.]] — `vuln/logic/reward-calculation`
