---
tags:
  - checklist
  - sector/restaking
generated: true
---
# Restaking — Audit Checklist

> Auto-generated from **49** findings in this sector (**6** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Arithmetic: Underflow** — 4 findings `vuln/arithmetic/underflow`
- [ ] **Logic: Reward Calculation** — 1 finding `vuln/logic/reward-calculation`
- [ ] **Arithmetic: Decimal Mismatch** — 1 finding `vuln/arithmetic/decimal-mismatch`

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/mev/frontrun` — 3
- `impact/loss-of-funds/locked-funds` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/fix-arithmetic` — 6
- `fix/use-reentrancy-guard` — 1
- `fix/add-snapshot` — 1

## 📚 Study these findings

- [[38491-h-03-activevalidatorcount-is-never-set-or-increased-pashov-a|[H-03] `activeValidatorCount` is never set or increased]] — `vuln/arithmetic/underflow`
- [[38493-h-05-transferring-nativevault-tokens-can-break-some-function|[H-05] Transferring `NativeVault` tokens can break some functionalities]] — `vuln/arithmetic/underflow`
- [[41067-h-03-a-dos-on-snapshots-due-to-a-rounding-error-in-calculati|[H-03] A `DoS` on snapshots due to a rounding error in calculations]] — `vuln/arithmetic/underflow`
- [[47370-inaccurate-reward-calculation-ottersec-none-composablefi-pdf|Inaccurate Reward Calculation]] — `vuln/logic/reward-calculation`
- [[47546-stake-mint-differentiation-ottersec-none-composable-vaults-p|Stake Mint Differentiation]] — `vuln/arithmetic/decimal-mismatch`
- [[61694-bitmaptoquorumids-will-panic-on-malformed-input-causing-dos|BitmapToQuorumIds() will panic on malformed input causing DOS in multiple services]] — `vuln/arithmetic/underflow`
