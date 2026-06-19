---
tags:
  - checklist
  - sector/nft-marketplace
generated: true
---
# Nft Marketplace — Audit Checklist

> Auto-generated from **25** findings in this sector (**5** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Dos: Frozen Funds** — 3 findings `vuln/dos/frozen-funds`
- [ ] **Reentrancy: Single Function** — 1 finding `vuln/reentrancy/single-function`
- [ ] **Pda: Reinitialization** — 1 finding `vuln/pda/reinitialization`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/reentrancy-callback` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 6
- `impact/loss-of-funds/locked-funds` — 2
- `impact/mev/frontrun` — 2
- `impact/loss-of-funds/reward-theft` — 1
- `impact/mev/backrun` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/use-reentrancy-guard` — 4
- `fix/add-access-control` — 1
- `fix/initialize-proxy` — 1

## 📚 Study these findings

- [[18411-specified-minoutput-will-remain-locked-in-lssvmrouterswapnft|Specified `minOutput` will remain locked in `LSSVMRouter::swapNFTsForSpecificNFTsThroughETH`]] — `vuln/dos/frozen-funds`
- [[18412-malicious-pair-can-re-enter-veryfastrouter-to-drain-original|Malicious pair can re-enter `VeryFastRouter` to drain original caller's funds]] — `vuln/reentrancy/single-function`
- [[46493-permanent-failure-to-bridge-wrapped-erc721-using-bridgesende|Permanent failure to bridge wrapped ERC721 using Bridge::sendERC721UsingNative function]] — `vuln/dos/frozen-funds`
- [[60495-locked-funds-when-fulfilling-seaport-orders-quantstamp-nifty|Locked Funds when Fulfilling Seaport Orders]] — `vuln/dos/frozen-funds`
- [[63937-c-01-anyone-can-re-initialize-the-swapproxy-pashov-audit-gro|[C-01] Anyone can re-initialize the `swapProxy`]] — `vuln/pda/reinitialization`
