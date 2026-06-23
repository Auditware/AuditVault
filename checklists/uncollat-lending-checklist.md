---
tags:
  - checklist
  - sector/uncollat-lending
generated: true
---
# Uncollat Lending — Audit Checklist

> Auto-generated from **22** findings in this sector (**7** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Logic: Liquidation Logic** — 3 findings `vuln/logic/liquidation-logic`
- [ ] **Arithmetic: Underflow** — 2 findings `vuln/arithmetic/underflow`
- [ ] **Arithmetic: Decimal Mismatch** — 1 finding `vuln/arithmetic/decimal-mismatch`
- [ ] **Access Control: Fake Account Substitution** — 1 finding `vuln/access-control/fake-account-substitution`
- [ ] **Dos: Frozen Funds** — 1 finding `vuln/dos/frozen-funds`

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/locked-funds` — 2
- `impact/loss-of-funds/fee-theft` — 1
- `impact/mev/frontrun` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/fix-arithmetic` — 3
- `fix/redesign-logic` — 3
- `fix/use-reentrancy-guard` — 2
- `fix/add-access-control` — 1
- `fix/use-twap` — 1

## 📚 Study these findings

- [[48836-denial-of-liquidation-ottersec-none-hedge-vault-pdf|Denial of Liquidation]] — `vuln/arithmetic/decimal-mismatch`
- [[57187-any-attempt-to-liquidate-a-user-will-fail-because-stabilityp|Any attempt to liquidate a user will fail, because StabilityPool does not hold crvUSD during operational lifecycle]] — `vuln/logic/liquidation-logic`
- [[61327-liquidations-can-be-made-to-revert-by-an-attacker-through-va|Liquidations can be made to revert by an attacker through various means, causing losses to liquidators and bad debt to accrue in the vault]] — `vuln/access-control/fake-account-substitution`
- [[62822-h-01-not-excluding-accruedprotocolfee-from-state-update-oper|[H-01] Not excluding `accruedProtocolFee` from state update operations causes several issues]] — `vuln/arithmetic/underflow`
- [[63647-h-01-critical-functions-revert-if-system-is-undercollaterali|[H-01] Critical functions revert if system is undercollateralized]] — `vuln/arithmetic/underflow`
- [[64681-h-01-protocol-insolvency-risk-due-to-lack-of-on-chain-oracle|[H-01] Protocol Insolvency Risk Due to Lack of On-Chain Oracle]] — `vuln/logic/liquidation-logic`
- [[65261-h-2-multiply-before-divide-overflow-in-update-pool-reward-ma|H-2: Multiply-before-divide overflow in update_pool_reward_manager permanently freezes all lending operations for affected CoinType]] — `vuln/dos/frozen-funds`
