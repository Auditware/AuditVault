---
tags:
  - checklist
  - sector/stable
generated: true
---
# Stable — Audit Checklist

> Auto-generated from **227** findings in this sector (**47** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Logic: Fee Calculation** — 8 findings `vuln/logic/fee-calculation`
- [ ] **Arithmetic: Decimal Mismatch** — 7 findings `vuln/arithmetic/decimal-mismatch`
- [ ] **Dos: Griefing** — 6 findings `vuln/dos/griefing`
- [ ] **Dos: Frozen Funds** — 6 findings `vuln/dos/frozen-funds`
- [ ] **Oracle: Spot Price** — 4 findings `vuln/oracle/spot-price`
- [ ] **Logic: Liquidation Logic** — 4 findings `vuln/logic/liquidation-logic`
- [ ] **Access Control: Missing Modifier** — 3 findings `vuln/access-control/missing-modifier`
- [ ] **Reentrancy: Single Function** — 2 findings `vuln/reentrancy/single-function`
- [ ] **Arithmetic: Underflow** — 2 findings `vuln/arithmetic/underflow`
- [ ] **Arithmetic: Precision Loss** — 2 findings `vuln/arithmetic/precision-loss`
- [ ] **Oracle: Manipulable Twap** — 1 finding `vuln/oracle/manipulable-twap`
- [ ] **Oracle: Stale Price** — 1 finding `vuln/oracle/stale-price`
- [ ] **Logic: Reward Calculation** — 1 finding `vuln/logic/reward-calculation`
- [ ] **Arithmetic: Rounding Direction** — 1 finding `vuln/arithmetic/rounding-direction`
- [ ] **Pda: Reinitialization** — 1 finding `vuln/pda/reinitialization`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/price-manipulation` — 9
- [ ] `trigger/low-liquidity` — 4
- [ ] `trigger/sandwich-attack` — 4
- [ ] `trigger/flash-loan` — 3
- [ ] `trigger/reentrancy-callback` — 2
- [ ] `trigger/governance-vote` — 2
- [ ] `trigger/cross-chain-message` — 2
- [ ] `trigger/first-deposit` — 2
- [ ] `trigger/time-based/timelock-expiry` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 43
- `impact/mev/frontrun` — 10
- `impact/data-corruption/price-manipulation` — 7
- `impact/loss-of-funds/locked-funds` — 7
- `impact/mev/sandwich` — 4
- `impact/loss-of-funds/reward-theft` — 3
- `impact/loss-of-funds/fee-theft` — 2
- `impact/privilege-escalation/ownership-transfer` — 1
- `impact/mev/backrun` — 1
- `impact/dos/permanent` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/fix-arithmetic` — 20
- `fix/use-reentrancy-guard` — 15
- `fix/use-twap` — 4
- `fix/add-access-control` — 4
- `fix/redesign-logic` — 4
- `fix/add-circuit-breaker` — 1
- `fix/add-check` — 1
- `fix/initialize-proxy` — 1
- `fix/add-nonce` — 1

## 📚 Study these findings

- [[12293-h-11-vaults-withdrawfromprotocol-incorrectly-scales-amount-t|H-11: Vault's withdrawFromProtocol incorrectly scales amount to be withdrawn]] — `vuln/arithmetic/decimal-mismatch`
- [[15978-h-05-attacker-can-manipulate-low-tvl-uniswap-v3-pool-to-borr|[H-05] Attacker can manipulate low TVL Uniswap V3 pool to borrow and swap to make Lending Pool in loss]] — `vuln/arithmetic/decimal-mismatch`
- [[18201-reentrancy-and-untrusted-contract-call-in-mintmultiple-diffi|Reentrancy and untrusted contract call in mintMultiple Diﬃculty: Low]] — `vuln/reentrancy/single-function`
- [[18534-h-2-earlier-users-in-rollover-queue-can-grief-later-users-sh|H-2: Earlier users in rollover queue can grief later users]] — `vuln/dos/griefing`
- [[19134-h-5-price-calculation-susceptible-to-flashloan-exploits-sher|H-5: Price calculation susceptible to flashloan exploits]] — `vuln/oracle/manipulable-twap`
- [[19138-h-9-uniswap-v3-pool-token-balance-proportion-does-not-necess|H-9: Uniswap v3 pool token balance proportion does not necessarily correspond to the price, and it is easy to manipulate.]] — `vuln/arithmetic/underflow`
- [[29589-h-01-liquidations-can-be-prevented-by-frontrunning-and-liqui|[H-01] Liquidations can be prevented by frontrunning and liquidating 1 debt (or more) due to wrong assumption in POS\_MANAGER]] — `vuln/logic/liquidation-logic`
- [[30421-h-02-convert-to-yang-helper-loss-precision-code4rena-opus-op|[H-02] `convert_to_yang_helper()` loss precision]] — `vuln/arithmetic/precision-loss`
