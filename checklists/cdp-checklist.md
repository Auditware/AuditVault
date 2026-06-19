---
tags:
  - checklist
  - sector/cdp
generated: true
---
# Cdp — Audit Checklist

> Auto-generated from **20** findings in this sector (**5** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Logic: Liquidation Logic** — 2 findings `vuln/logic/liquidation-logic`
- [ ] **Logic: Reward Calculation** — 2 findings `vuln/logic/reward-calculation`
- [ ] **Logic: Fee Calculation** — 1 finding `vuln/logic/fee-calculation`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/flash-loan` — 3
- [ ] `trigger/price-manipulation` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 3
- `impact/mev/frontrun` — 1
- `impact/data-corruption/price-manipulation` — 1
- `impact/dos/permanent` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/fix-arithmetic` — 3
- `fix/redesign-logic` — 2
- `fix/use-reentrancy-guard` — 2

## 📚 Study these findings

- [[30653-healthy-loans-can-be-liquidated-trailofbits-none-lindy-labs|Healthy loans can be liquidated]] — `vuln/logic/liquidation-logic`
- [[46886-reward-snapshot-misalignment-ottersec-none-fluid-protocol-hy|Reward Snapshot Misalignment]] — `vuln/logic/reward-calculation`
- [[46887-failure-to-update-state-on-redemption-cancellation-ottersec|Failure to Update State on Redemption Cancellation]] — `vuln/logic/reward-calculation`
- [[53948-h-02-the-flashloan-protection-for-zappers-is-insufficient-we|[H-02] The flashloan protection for Zappers is insufficient - We can operate on Troves we don't own]] — `vuln/logic/fee-calculation`
- [[57187-any-attempt-to-liquidate-a-user-will-fail-because-stabilityp|Any attempt to liquidate a user will fail, because StabilityPool does not hold crvUSD during operational lifecycle]] — `vuln/logic/liquidation-logic`
