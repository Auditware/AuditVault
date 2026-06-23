---
tags:
  - checklist
  - sector/insurance
generated: true
---
# Insurance — Audit Checklist

> Auto-generated from **21** findings in this sector (**4** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Access Control: Tx Origin** — 1 finding `vuln/access-control/tx-origin`
- [ ] **Access Control: Fake Account Substitution** — 1 finding `vuln/access-control/fake-account-substitution`
- [ ] **Bridge: Replay** — 1 finding `vuln/bridge/replay`
- [ ] **Arithmetic: Underflow** — 1 finding `vuln/arithmetic/underflow`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/flash-loan` — 1
- [ ] `trigger/time-based/epoch-boundary` — 1
- [ ] `trigger/cross-chain-message` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 4
- `impact/mev/frontrun` — 2

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/add-access-control` — 1
- `fix/add-nonce` — 1
- `fix/fix-arithmetic` — 1

## 📚 Study these findings

- [[28662-it-is-possible-to-carry-out-attacks-to-manipulate-pools-with|It is possible to carry out attacks to manipulate pools within one transaction using a flash loan]] — `vuln/access-control/tx-origin`
- [[36775-precisely-timed-malicious-restoration-requests-can-grieve-re|Precisely timed malicious restoration requests can grieve restoration servers]] — `vuln/access-control/fake-account-substitution`
- [[56710-potential-signature-replay-attack-in-erc1271handler-openzepp|Potential Signature Replay Attack in ERC1271Handler]] — `vuln/bridge/replay`
- [[64718-missing-association-checks-between-redemption-offer-and-rede|Missing Association Checks Between Redemption Offer and Redemption Request Enables State Corruption]] — `vuln/arithmetic/underflow`
