---
tags:
  - checklist
  - sector/oracle
generated: true
---
# Oracle — Audit Checklist

> Auto-generated from **278** findings in this sector (**70** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Oracle: Stale Price** — 11 findings `vuln/oracle/stale-price`
- [ ] **Arithmetic: Decimal Mismatch** — 10 findings `vuln/arithmetic/decimal-mismatch`
- [ ] **Oracle: Spot Price** — 10 findings `vuln/oracle/spot-price`
- [ ] **Logic: Liquidation Logic** — 9 findings `vuln/logic/liquidation-logic`
- [ ] **Logic: Fee Calculation** — 7 findings `vuln/logic/fee-calculation`
- [ ] **Arithmetic: Underflow** — 5 findings `vuln/arithmetic/underflow`
- [ ] **Access Control: Missing Modifier** — 4 findings `vuln/access-control/missing-modifier`
- [ ] **Pda: Missing Seeds Check** — 4 findings `vuln/pda/missing-seeds-check`
- [ ] **Logic: Reward Calculation** — 4 findings `vuln/logic/reward-calculation`
- [ ] **Reentrancy: Single Function** — 3 findings `vuln/reentrancy/single-function`
- [ ] **Access Control: Missing Signer** — 3 findings `vuln/access-control/missing-signer`
- [ ] **Arithmetic: Precision Loss** — 3 findings `vuln/arithmetic/precision-loss`
- [ ] **Oracle: Single Source** — 2 findings `vuln/oracle/single-source`
- [ ] **Dependency: Upgradeable Contract** — 2 findings `vuln/dependency/upgradeable-contract`
- [ ] **Pda: Reinitialization** — 2 findings `vuln/pda/reinitialization`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/price-manipulation` — 16
- [ ] `trigger/flash-loan` — 12
- [ ] `trigger/sandwich-attack` — 6
- [ ] `trigger/low-liquidity` — 3
- [ ] `trigger/reentrancy-callback` — 3
- [ ] `trigger/first-deposit` — 3
- [ ] `trigger/reorg` — 1
- [ ] `trigger/cross-chain-message` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 30
- `impact/data-corruption/price-manipulation` — 13
- `impact/mev/frontrun` — 12
- `impact/mev/sandwich` — 6
- `impact/loss-of-funds/locked-funds` — 6
- `impact/dos/permanent` — 6
- `impact/loss-of-funds/fee-theft` — 2

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/fix-arithmetic` — 26
- `fix/add-check` — 13
- `fix/use-reentrancy-guard` — 11
- `fix/use-twap` — 11
- `fix/add-access-control` — 9
- `fix/redesign-logic` — 9
- `fix/use-multi-oracle` — 6
- `fix/add-circuit-breaker` — 3
- `fix/upgrade-dependency` — 2
- `fix/initialize-proxy` — 2
- `fix/add-nonce` — 1

## 📚 Study these findings

- [[11553-h01-inconsistencies-in-stored-data-may-lead-to-incorrect-med|[H01] Inconsistencies in stored data may lead to incorrect median price]] — `vuln/oracle/stale-price`
- [[15978-h-05-attacker-can-manipulate-low-tvl-uniswap-v3-pool-to-borr|[H-05] Attacker can manipulate low TVL Uniswap V3 pool to borrow and swap to make Lending Pool in loss]] — `vuln/arithmetic/decimal-mismatch`
- [[15979-h-06-discrepency-in-the-uniswap-v3-position-price-calculatio|[H-06] Discrepency in the Uniswap V3 position price calculation because of decimals]] — `vuln/arithmetic/decimal-mismatch`
- [[15982-h-09-uniswapv3-tokens-of-certain-pairs-will-be-wrongly-value|[H-09] UniswapV3 tokens of certain pairs will be wrongly valued, leading to liquidations]] — `vuln/arithmetic/decimal-mismatch`
- [[17624-compromise-of-a-single-oracle-enables-limited-control-of-the|Compromise of a single oracle enables limited control of the dAPI value]] — `vuln/oracle/single-source`
- [[18434-read-only-reentrancy-cyfrin-beanstalk-wells-markdown|Read-only reentrancy]] — `vuln/access-control/missing-modifier`
- [[18535-h-3-depositfee-can-be-bypassed-via-deposit-queue-sherlock-no|H-3: `depositFee` can be bypassed via deposit queue]] — `vuln/logic/fee-calculation`
- [[19134-h-5-price-calculation-susceptible-to-flashloan-exploits-sher|H-5: Price calculation susceptible to flashloan exploits]] — `vuln/oracle/manipulable-twap`
