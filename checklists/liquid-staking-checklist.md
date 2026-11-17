---
tags:
  - checklist
  - web3-sector/liquid-staking
generated: true
---
# Liquid Staking — Audit Checklist

> Auto-generated from **46** findings in this sector (**10** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Oracle: Spot Price** — 3 findings `vuln/oracle/spot-price`
- [ ] **Reentrancy: Single Function** — 2 findings `vuln/reentrancy/single-function`
- [ ] **Dos: Frozen Funds** — 2 findings `vuln/dos/frozen-funds`
- [ ] **Dependency: Upgradeable Contract** — 1 finding `vuln/dependency/upgradeable-contract`
- [ ] **Access Control: Uninitialized Owner** — 1 finding `vuln/access-control/uninitialized-owner`
- [ ] **Access Control: Missing Modifier** — 1 finding `vuln/access-control/missing-modifier`
- [ ] **Arithmetic: Underflow** — 1 finding `vuln/arithmetic/underflow`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/price-manipulation` — 4
- [ ] `trigger/reentrancy-callback` — 2
- [ ] `trigger/sandwich-attack` — 2
- [ ] `trigger/cross-chain-message` — 1
- [ ] `trigger/low-liquidity` — 1
- [ ] `trigger/flash-loan` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 7
- `impact/mev/frontrun` — 5
- `impact/loss-of-funds/locked-funds` — 3
- `impact/data-corruption/price-manipulation` — 3
- `impact/mev/sandwich` — 2
- `impact/mev/backrun` — 1
- `impact/dos/permanent` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/use-reentrancy-guard` — 3
- `fix/use-twap` — 3
- `fix/add-access-control` — 2
- `fix/upgrade-dependency` — 1
- `fix/fix-arithmetic` — 1

## 📚 Study these findings

- [[13206-multiple-checks-effects-violations-consensys-rocket-pool-atl|Multiple checks-effects violations]] — `vuln/reentrancy/single-function`
- [[19456-dos-via-uninitialized-easytrack-implementation-contract-sigm|DOS via Uninitialized EasyTrack Implementation Contract]] — `vuln/dependency/upgradeable-contract`
- [[28139-possible-blocking-of-the-contract-mixbytes-none-lido-markdow|Possible blocking of the contract]] — `vuln/access-control/uninitialized-owner`
- [[35126-h-13-kelp-finalizecooldown-cannot-claim-the-withdrawal-if-ad|H-13: `Kelp:_finalizeCooldown` cannot claim the withdrawal if adversary would requestWithdrawals with dust amount for the holder]] — `vuln/dos/frozen-funds`
- [[43028-h-05-reentrancy-in-liquidstakingmanagersolwithdrawethforknow|[H-05] Reentrancy in `LiquidStakingManager.sol#withdrawETHForKnow` leads to loss of fund from smart wallet]] — `vuln/access-control/missing-modifier`
- [[51368-unsafe-casting-leads-to-overflowunderflow-halborn-entangle-l|Unsafe Casting Leads To Overflow/Underflow]] — `vuln/arithmetic/underflow`
- [[61790-pools-can-be-subject-to-price-manipulation-leading-to-early|Pools Can Be Subject to Price Manipulation Leading to Early Liquidations or Arbitrage]] — `vuln/oracle/spot-price`
- [[63991-operator-bond-can-not-be-recovered-and-will-be-locked-in-exm|Operator bond can not be recovered and will be locked in ExManager]] — `vuln/dos/frozen-funds`
