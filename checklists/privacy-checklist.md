---
tags:
  - checklist
  - sector/privacy
generated: true
---
# Privacy — Audit Checklist

> Auto-generated from **26** findings in this sector (**4** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Logic: Fee Calculation** — 2 findings `vuln/logic/fee-calculation`
- [ ] **Bridge: Replay** — 1 finding `vuln/bridge/replay`
- [ ] **Dependency: Unchecked Return Value** — 1 finding `vuln/dependency/unchecked-return-value`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/cross-chain-message` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 3

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/fix-arithmetic` — 2
- `fix/add-nonce` — 1
- `fix/add-check` — 1

## 📚 Study these findings

- [[16739-replay-attack-and-revocation-inversion-on-confidentialapprov|Replay attack and revocation inversion on conﬁdentialApprove]] — `vuln/bridge/replay`
- [[17854-missing-range-checks-in-muldivgadget-trailofbits-degate-pdf|Missing range checks in MulDivGadget]] — `vuln/logic/fee-calculation`
- [[35023-h-2-split-transactions-fixed-fees-undercharge-block-stuff-do|H-2: `split` transaction's fixed fees undercharge block stuff DOS attacks]] — `vuln/logic/fee-calculation`
- [[49490-partial-sha256-var-interstitial-may-give-the-same-hash-state|partial_sha256_var_interstitial May Give the Same Hash State h for Different Data Objects if They Are Smaller Than message_size]] — `vuln/dependency/unchecked-return-value`
