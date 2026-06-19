---
tags:
  - checklist
  - sector/algo-stable
generated: true
---
# Algo Stable — Audit Checklist

> Auto-generated from **16** findings in this sector (**2** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Dos: Frozen Funds** — 1 finding `vuln/dos/frozen-funds`
- [ ] **Logic: Liquidation Logic** — 1 finding `vuln/logic/liquidation-logic`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/flash-loan` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/use-reentrancy-guard` — 2
- `fix/redesign-logic` — 1

## 📚 Study these findings

- [[30084-prover-can-censor-l2-l1-messages-partially-addressed-consens|Prover Can Censor L2 → L1 Messages  Partially Addressed]] — `vuln/dos/frozen-funds`
- [[57187-any-attempt-to-liquidate-a-user-will-fail-because-stabilityp|Any attempt to liquidate a user will fail, because StabilityPool does not hold crvUSD during operational lifecycle]] — `vuln/logic/liquidation-logic`
