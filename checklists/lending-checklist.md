---
tags:
  - checklist
  - sector/lending
generated: true
---
# Lending — Audit Checklist

> Auto-generated from **593** findings in this sector (**136** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Logic: Liquidation Logic** — 28 findings `vuln/logic/liquidation-logic`
- [ ] **Logic: Fee Calculation** — 20 findings `vuln/logic/fee-calculation`
- [ ] **Arithmetic: Underflow** — 14 findings `vuln/arithmetic/underflow`
- [ ] **Dos: Frozen Funds** — 14 findings `vuln/dos/frozen-funds`
- [ ] **Reentrancy: Single Function** — 13 findings `vuln/reentrancy/single-function`
- [ ] **Logic: Reward Calculation** — 12 findings `vuln/logic/reward-calculation`
- [ ] **Oracle: Spot Price** — 12 findings `vuln/oracle/spot-price`
- [ ] **Arithmetic: Decimal Mismatch** — 7 findings `vuln/arithmetic/decimal-mismatch`
- [ ] **Oracle: Stale Price** — 5 findings `vuln/oracle/stale-price`
- [ ] **Arithmetic: Precision Loss** — 4 findings `vuln/arithmetic/precision-loss`
- [ ] **Dos: Unbounded Loop** — 3 findings `vuln/dos/unbounded-loop`
- [ ] **Pda: Missing Seeds Check** — 3 findings `vuln/pda/missing-seeds-check`
- [ ] **Dos: Griefing** — 3 findings `vuln/dos/griefing`
- [ ] **Access Control: Missing Modifier** — 3 findings `vuln/access-control/missing-modifier`
- [ ] **Access Control: Missing Signer** — 2 findings `vuln/access-control/missing-signer`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/flash-loan` — 29
- [ ] `trigger/price-manipulation` — 25
- [ ] `trigger/reentrancy-callback` — 13
- [ ] `trigger/sandwich-attack` — 11
- [ ] `trigger/first-deposit` — 9
- [ ] `trigger/low-liquidity` — 7
- [ ] `trigger/governance-vote` — 2
- [ ] `trigger/time-based/epoch-boundary` — 1
- [ ] `trigger/cross-chain-message` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 69
- `impact/mev/frontrun` — 31
- `impact/data-corruption/price-manipulation` — 22
- `impact/loss-of-funds/locked-funds` — 22
- `impact/mev/sandwich` — 11
- `impact/loss-of-funds/fee-theft` — 6
- `impact/dos/permanent` — 6
- `impact/privilege-escalation/ownership-transfer` — 3
- `impact/mev/backrun` — 3
- `impact/loss-of-funds/reward-theft` — 2

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/fix-arithmetic` — 54
- `fix/use-reentrancy-guard` — 43
- `fix/redesign-logic` — 27
- `fix/use-twap` — 12
- `fix/add-check` — 8
- `fix/add-access-control` — 8
- `fix/use-multi-oracle` — 2
- `fix/add-circuit-breaker` — 2
- `fix/add-snapshot` — 2
- `fix/upgrade-dependency` — 1
- `fix/add-nonce` — 1

## 📚 Study these findings

- [[10564-extending-the-staking-duration-discards-rewards-openzeppelin|Extending the staking duration discards rewards]] — `vuln/logic/reward-calculation`
- [[11542-h01-approved-proposal-may-be-impossible-to-queue-cancel-or-e|[H01] Approved proposal may be impossible to queue, cancel or execute]] — `vuln/dos/unbounded-loop`
- [[11553-h01-inconsistencies-in-stored-data-may-lead-to-incorrect-med|[H01] Inconsistencies in stored data may lead to incorrect median price]] — `vuln/oracle/stale-price`
- [[12293-h-11-vaults-withdrawfromprotocol-incorrectly-scales-amount-t|H-11: Vault's withdrawFromProtocol incorrectly scales amount to be withdrawn]] — `vuln/arithmetic/decimal-mismatch`
- [[13206-multiple-checks-effects-violations-consensys-rocket-pool-atl|Multiple checks-effects violations]] — `vuln/reentrancy/single-function`
- [[15976-h-03-interest-rates-are-incorrect-on-liquidation-code4rena-p|[H-03] Interest rates are incorrect on Liquidation]] — `vuln/logic/liquidation-logic`
- [[15978-h-05-attacker-can-manipulate-low-tvl-uniswap-v3-pool-to-borr|[H-05] Attacker can manipulate low TVL Uniswap V3 pool to borrow and swap to make Lending Pool in loss]] — `vuln/arithmetic/decimal-mismatch`
- [[15980-h-07-user-can-pass-auction-recovery-health-check-easily-with|[H-07] User can pass auction recovery health check easily with flashloan]] — `vuln/reentrancy/single-function`
