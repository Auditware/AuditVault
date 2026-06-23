---
tags:
  - checklist
  - sector/farm
generated: true
---
# Farm — Audit Checklist

> Auto-generated from **58** findings in this sector (**14** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Logic: Reward Calculation** — 6 findings `vuln/logic/reward-calculation`
- [ ] **Logic: Liquidation Logic** — 2 findings `vuln/logic/liquidation-logic`
- [ ] **Reentrancy: Single Function** — 2 findings `vuln/reentrancy/single-function`
- [ ] **Arithmetic: Underflow** — 2 findings `vuln/arithmetic/underflow`
- [ ] **Dos: Griefing** — 1 finding `vuln/dos/griefing`
- [ ] **Governance: Proposal Manipulation** — 1 finding `vuln/governance/proposal-manipulation`
- [ ] **Arithmetic: Precision Loss** — 1 finding `vuln/arithmetic/precision-loss`
- [ ] **Dos: Frozen Funds** — 1 finding `vuln/dos/frozen-funds`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/flash-loan` — 4
- [ ] `trigger/reentrancy-callback` — 2
- [ ] `trigger/low-liquidity` — 2
- [ ] `trigger/price-manipulation` — 1
- [ ] `trigger/governance-vote` — 1
- [ ] `trigger/first-deposit` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 7
- `impact/loss-of-funds/reward-theft` — 4
- `impact/loss-of-funds/locked-funds` — 2
- `impact/mev/frontrun` — 2
- `impact/privilege-escalation/ownership-transfer` — 1
- `impact/data-corruption/price-manipulation` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/fix-arithmetic` — 8
- `fix/use-reentrancy-guard` — 3
- `fix/redesign-logic` — 2
- `fix/add-check` — 1

## 📚 Study these findings

- [[13255-convexpositionhandler-claimrewards-incorrectly-calculates-am|ConvexPositionHandler._claimRewards incorrectly calculates amount of LP tokens to unstake]] — `vuln/logic/reward-calculation`
- [[29590-h-02-wlp-tokens-could-be-stolen-code4rena-init-capital-init|[H-02] wLp tokens could be stolen]] — `vuln/logic/liquidation-logic`
- [[30653-healthy-loans-can-be-liquidated-trailofbits-none-lindy-labs|Healthy loans can be liquidated]] — `vuln/logic/liquidation-logic`
- [[35119-h-6-loss-of-rewards-due-to-continuous-griefing-attacks-on-l2|H-6: Loss of rewards due to continuous griefing attacks on L2 environment]] — `vuln/dos/griefing`
- [[40818-a-malicious-user-can-inflate-his-voting-power-via-merge-cant|A malicious user can inﬂate his voting power via merge()]] — `vuln/governance/proposal-manipulation`
- [[41859-h-01-loss-of-fees-due-to-rounding-down-pashov-audit-group-no|[H-01] Loss of fees due to rounding down]] — `vuln/arithmetic/precision-loss`
- [[43032-h-09-incorrect-accounting-in-syndicaterewardsprocessor-resul|[H-09] Incorrect accounting in `SyndicateRewardsProcessor` results in any LP token holder being able to steal other LP tokens holder's ETH from the fees and MEV vault]] — `vuln/logic/reward-calculation`
- [[44334-reentrancy-in-escrowmanager-mixbytes-none-eywa-markdown|Reentrancy in `EscrowManager`]] — `vuln/reentrancy/single-function`
