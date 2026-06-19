---
tags:
  - checklist
  - sector/infra
generated: true
---
# Infra — Audit Checklist

> Auto-generated from **106** findings in this sector (**14** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Pda: Reinitialization** — 2 findings `vuln/pda/reinitialization`
- [ ] **Arithmetic: Underflow** — 2 findings `vuln/arithmetic/underflow`
- [ ] **Logic: Fee Calculation** — 2 findings `vuln/logic/fee-calculation`
- [ ] **Bridge: Replay** — 2 findings `vuln/bridge/replay`
- [ ] **Oracle: Spot Price** — 2 findings `vuln/oracle/spot-price`
- [ ] **Dos: Frozen Funds** — 2 findings `vuln/dos/frozen-funds`
- [ ] **Access Control: Proxy Storage Collision** — 1 finding `vuln/access-control/proxy-storage-collision`
- [ ] **Reentrancy: Single Function** — 1 finding `vuln/reentrancy/single-function`
- [ ] **Logic: Reward Calculation** — 1 finding `vuln/logic/reward-calculation`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/cross-chain-message` — 2
- [ ] `trigger/price-manipulation` — 2
- [ ] `trigger/reentrancy-callback` — 1
- [ ] `trigger/flash-loan` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/locked-funds` — 3
- `impact/mev/frontrun` — 2
- `impact/loss-of-funds/direct-drain` — 2
- `impact/privilege-escalation/ownership-transfer` — 1
- `impact/loss-of-funds/fee-theft` — 1
- `impact/data-corruption/price-manipulation` — 1
- `impact/dos/permanent` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/fix-arithmetic` — 4
- `fix/initialize-proxy` — 2
- `fix/add-nonce` — 2
- `fix/use-twap` — 2
- `fix/upgrade-dependency` — 1
- `fix/use-reentrancy-guard` — 1
- `fix/use-multi-oracle` — 1

## 📚 Study these findings

- [[10298-custom-selectors-could-facilitate-proxy-selector-clashing-at|Custom Selectors could facilitate proxy selector clashing attack]] — `vuln/access-control/proxy-storage-collision`
- [[13206-multiple-checks-effects-violations-consensys-rocket-pool-atl|Multiple checks-effects violations]] — `vuln/reentrancy/single-function`
- [[34320-initialization-script-of-taikol2-allows-reinitialization-of|Initialization Script of TaikoL2 Allows Reinitialization of the Rollup - Phase 1]] — `vuln/pda/reinitialization`
- [[35004-incorrect-accounting-of-reportrecoveredeffectivebalance-can|Incorrect accounting of `reportRecoveredEffectiveBalance` can prevent report from being finalized when a validator is slashed]] — `vuln/arithmetic/underflow`
- [[35023-h-2-split-transactions-fixed-fees-undercharge-block-stuff-do|H-2: `split` transaction's fixed fees undercharge block stuff DOS attacks]] — `vuln/logic/fee-calculation`
- [[40983-malicious-restoration-servers-can-replay-restoredata-message|Malicious Restoration Servers can replay RestoreData messages and drain accounts]] — `vuln/bridge/replay`
- [[54962-h-02-unspent-gas-fees-are-always-refunded-to-the-feepayer-wh|[H-02] Unspent gas fees are always refunded to the `FeePayer()` which leads to incorrect refunds if the `FeeGranter()` paid for the fees]] — `vuln/logic/fee-calculation`
- [[55274-h-01-domain-pricing-relies-on-pool-price-which-can-be-manipu|[H-01] Domain pricing relies on pool price, which can be manipulated]] — `vuln/oracle/spot-price`
