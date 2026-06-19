---
tags:
  - checklist
  - sector/multisig
generated: true
---
# Multisig — Audit Checklist

> Auto-generated from **28** findings in this sector (**6** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Pda: Reinitialization** — 2 findings `vuln/pda/reinitialization`
- [ ] **Access Control: Missing Signer** — 1 finding `vuln/access-control/missing-signer`
- [ ] **Dos: Frozen Funds** — 1 finding `vuln/dos/frozen-funds`
- [ ] **Reentrancy: Single Function** — 1 finding `vuln/reentrancy/single-function`
- [ ] **Logic: Fee Calculation** — 1 finding `vuln/logic/fee-calculation`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/reentrancy-callback` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 4
- `impact/mev/frontrun` — 3
- `impact/privilege-escalation/ownership-transfer` — 2
- `impact/loss-of-funds/locked-funds` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/initialize-proxy` — 2
- `fix/add-access-control` — 1
- `fix/use-reentrancy-guard` — 1
- `fix/fix-arithmetic` — 1

## 📚 Study these findings

- [[10280-h-8-hatssignergate-multihatssignergate-more-than-maxsignatur|H-8: HatsSignerGate + MultiHatsSignerGate: more than maxSignatures can be claimed which leads to DOS in reconcileSignerCount]] — `vuln/access-control/missing-signer`
- [[24301-h-3-protocol-fee-from-marketsol-is-locked-sherlock-none-pere|H-3: Protocol fee from Market.sol is locked]] — `vuln/dos/frozen-funds`
- [[33449-storage-cache-can-become-out-of-sync-for-reentrant-and-deleg|Storage cache can become out of sync for reentrant and delegated calls]] — `vuln/reentrancy/single-function`
- [[36310-c-01-withdrawing-collateral-and-fees-and-bypassing-trust-saf|[C-01] Withdrawing collateral and fees and bypassing trust safety mechanism]] — `vuln/logic/fee-calculation`
- [[gh-3a62a6-appsfun-smart-contract-audit-report-aw-h-01-poisoned-position-denial-of-service|**AW-H-01: Poisoned Position Denial of Service** {#aw-h-01:-poisoned-position-denial-of-service}]] — `vuln/pda/reinitialization`
- [[gh-7fa2c1-appsfun-smart-contract-audit-report-aw-h-01-poisoned-position-denial-of-service-|**AW-H-01: Poisoned Position Denial of Service** {#aw-h-01:-poisoned-position-denial-of-service}]] — `vuln/pda/reinitialization`
