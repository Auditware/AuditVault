---
tags:
  - checklist
  - sector/zk
generated: true
---
# Zk — Audit Checklist

> Auto-generated from **73** findings in this sector (**8** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Logic: Fee Calculation** — 2 findings `vuln/logic/fee-calculation`
- [ ] **Dos: Frozen Funds** — 2 findings `vuln/dos/frozen-funds`
- [ ] **Arithmetic: Underflow** — 2 findings `vuln/arithmetic/underflow`
- [ ] **Access Control: Missing Modifier** — 1 finding `vuln/access-control/missing-modifier`
- [ ] **Reentrancy: Single Function** — 1 finding `vuln/reentrancy/single-function`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/flash-loan` — 1
- [ ] `trigger/reentrancy-callback` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 8
- `impact/loss-of-funds/locked-funds` — 4
- `impact/mev/frontrun` — 3

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/fix-arithmetic` — 4
- `fix/add-access-control` — 2
- `fix/use-reentrancy-guard` — 1

## 📚 Study these findings

- [[17854-missing-range-checks-in-muldivgadget-trailofbits-degate-pdf|Missing range checks in MulDivGadget]] — `vuln/logic/fee-calculation`
- [[30084-prover-can-censor-l2-l1-messages-partially-addressed-consens|Prover Can Censor L2 → L1 Messages  Partially Addressed]] — `vuln/dos/frozen-funds`
- [[35023-h-2-split-transactions-fixed-fees-undercharge-block-stuff-do|H-2: `split` transaction's fixed fees undercharge block stuff DOS attacks]] — `vuln/logic/fee-calculation`
- [[36001-prover-payment-in-erc20-tokens-always-reverts-sigmaprime-non|Prover Payment In ERC20 Tokens Always Reverts]] — `vuln/dos/frozen-funds`
- [[38363-public-visibility-on-checkmerklerootandverifysignatures-allo|Public Visibility on checkMerkleRootAndVerifySignatures Allows for DOS Attacks and User Fund Loss ✓ Fixed]] — `vuln/access-control/missing-modifier`
- [[45169-h-02-prover-can-cheat-in-felt-to-bytes-little-due-to-value-u|[H-02] Prover can cheat in `felt_to_bytes_little` due to value underflow]] — `vuln/arithmetic/underflow`
- [[56731-byte-to-bit-mismatch-in-shift-operations-openzeppelin-none-e|Byte-to-Bit Mismatch in Shift Operations]] — `vuln/arithmetic/underflow`
- [[60151-missinglimited-test-suite-quantstamp-hinkal-protocol-markdow|Missing/Limited Test Suite]] — `vuln/reentrancy/single-function`
