---
tags:
  - checklist
  - sector/rwa
generated: true
---
# Rwa — Audit Checklist

> Auto-generated from **12** findings in this sector (**3** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Arithmetic: Underflow** — 1 finding `vuln/arithmetic/underflow`
- [ ] **Reentrancy: Single Function** — 1 finding `vuln/reentrancy/single-function`
- [ ] **Logic: Liquidation Logic** — 1 finding `vuln/logic/liquidation-logic`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/reentrancy-callback` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/use-reentrancy-guard` — 2
- `fix/fix-arithmetic` — 1
- `fix/redesign-logic` — 1

## 📚 Study these findings

- [[33022-potentially-unsafe-usage-of-unchecked-math-openzeppelin-none|Potentially unsafe usage of unchecked math]] — `vuln/arithmetic/underflow`
- [[60827-denial-of-service-on-batchsend-quantstamp-bretton-woods-digi|Denial of Service on `batchSend()`]] — `vuln/reentrancy/single-function`
- [[64681-h-01-protocol-insolvency-risk-due-to-lack-of-on-chain-oracle|[H-01] Protocol Insolvency Risk Due to Lack of On-Chain Oracle]] — `vuln/logic/liquidation-logic`
