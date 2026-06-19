---
tags:
  - checklist
  - sector/nft
generated: true
---
# Nft — Audit Checklist

> Auto-generated from **204** findings in this sector (**49** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Dos: Frozen Funds** — 10 findings `vuln/dos/frozen-funds`
- [ ] **Reentrancy: Single Function** — 7 findings `vuln/reentrancy/single-function`
- [ ] **Logic: Reward Calculation** — 7 findings `vuln/logic/reward-calculation`
- [ ] **Dos: Griefing** — 5 findings `vuln/dos/griefing`
- [ ] **Access Control: Missing Modifier** — 5 findings `vuln/access-control/missing-modifier`
- [ ] **Dependency: Upgradeable Contract** — 4 findings `vuln/dependency/upgradeable-contract`
- [ ] **Arithmetic: Underflow** — 4 findings `vuln/arithmetic/underflow`
- [ ] **Logic: Liquidation Logic** — 4 findings `vuln/logic/liquidation-logic`
- [ ] **Logic: Fee Calculation** — 2 findings `vuln/logic/fee-calculation`
- [ ] **Pda: Reinitialization** — 2 findings `vuln/pda/reinitialization`
- [ ] **Oracle: Stale Price** — 2 findings `vuln/oracle/stale-price`
- [ ] **Access Control: Proxy Storage Collision** — 1 finding `vuln/access-control/proxy-storage-collision`
- [ ] **Arithmetic: Decimal Mismatch** — 1 finding `vuln/arithmetic/decimal-mismatch`
- [ ] **Dos: Unbounded Loop** — 1 finding `vuln/dos/unbounded-loop`
- [ ] **Governance: Proposal Manipulation** — 1 finding `vuln/governance/proposal-manipulation`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/reentrancy-callback` — 7
- [ ] `trigger/cross-chain-message` — 3
- [ ] `trigger/flash-loan` — 2
- [ ] `trigger/governance-vote` — 2
- [ ] `trigger/reorg` — 1
- [ ] `trigger/price-manipulation` — 1
- [ ] `trigger/low-liquidity` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 32
- `impact/loss-of-funds/locked-funds` — 11
- `impact/mev/frontrun` — 9
- `impact/privilege-escalation/ownership-transfer` — 5
- `impact/loss-of-funds/reward-theft` — 2
- `impact/dos/permanent` — 2
- `impact/loss-of-funds/fee-theft` — 2
- `impact/data-corruption/price-manipulation` — 1
- `impact/mev/backrun` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/use-reentrancy-guard` — 18
- `fix/fix-arithmetic` — 11
- `fix/add-access-control` — 7
- `fix/add-check` — 5
- `fix/upgrade-dependency` — 4
- `fix/redesign-logic` — 4
- `fix/initialize-proxy` — 2
- `fix/use-multi-oracle` — 1

## 📚 Study these findings

- [[10299-potential-contract-storage-layout-overlap-in-upgradable-cont|Potential contract storage layout overlap in upgradable contracts]] — `vuln/access-control/proxy-storage-collision`
- [[15980-h-07-user-can-pass-auction-recovery-health-check-easily-with|[H-07] User can pass auction recovery health check easily with flashloan]] — `vuln/reentrancy/single-function`
- [[15982-h-09-uniswapv3-tokens-of-certain-pairs-will-be-wrongly-value|[H-09] UniswapV3 tokens of certain pairs will be wrongly valued, leading to liquidations]] — `vuln/arithmetic/decimal-mismatch`
- [[18411-specified-minoutput-will-remain-locked-in-lssvmrouterswapnft|Specified `minOutput` will remain locked in `LSSVMRouter::swapNFTsForSpecificNFTsThroughETH`]] — `vuln/dos/frozen-funds`
- [[18412-malicious-pair-can-re-enter-veryfastrouter-to-drain-original|Malicious pair can re-enter `VeryFastRouter` to drain original caller's funds]] — `vuln/reentrancy/single-function`
- [[20071-h-03-position-nft-can-be-spammed-with-insignificant-position|[H-03] Position NFT can be spammed with insignificant positions by anyone until rewards DoS]] — `vuln/dos/griefing`
- [[20073-h-05-incorrect-calculation-of-the-remaining-updatedrewards-l|[H-05] Incorrect calculation of the remaining `updatedRewards` leads to possible underflow error]] — `vuln/arithmetic/underflow`
- [[20611-h-01-accepting-input-after-randomness-is-requested-can-be-ex|[H-01] Accepting input after randomness is requested can be exploited]] — `vuln/dos/griefing`
