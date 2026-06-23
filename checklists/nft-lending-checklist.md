---
tags:
  - checklist
  - sector/nft-lending
generated: true
---
# Nft Lending — Audit Checklist

> Auto-generated from **27** findings in this sector (**9** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Logic: Liquidation Logic** — 3 findings `vuln/logic/liquidation-logic`
- [ ] **Reentrancy: Single Function** — 2 findings `vuln/reentrancy/single-function`
- [ ] **Dos: Frozen Funds** — 2 findings `vuln/dos/frozen-funds`
- [ ] **Arithmetic: Decimal Mismatch** — 1 finding `vuln/arithmetic/decimal-mismatch`
- [ ] **Access Control: Missing Modifier** — 1 finding `vuln/access-control/missing-modifier`
- [ ] **Logic: Reward Calculation** — 1 finding `vuln/logic/reward-calculation`
- [ ] **Oracle: Stale Price** — 1 finding `vuln/oracle/stale-price`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/flash-loan` — 3
- [ ] `trigger/first-deposit` — 3
- [ ] `trigger/reentrancy-callback` — 2
- [ ] `trigger/price-manipulation` — 2

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 5
- `impact/mev/frontrun` — 3
- `impact/data-corruption/price-manipulation` — 2
- `impact/loss-of-funds/fee-theft` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/use-reentrancy-guard` — 7
- `fix/redesign-logic` — 3
- `fix/fix-arithmetic` — 2
- `fix/add-access-control` — 1
- `fix/add-check` — 1

## 📚 Study these findings

- [[15980-h-07-user-can-pass-auction-recovery-health-check-easily-with|[H-07] User can pass auction recovery health check easily with flashloan]] — `vuln/reentrancy/single-function`
- [[15982-h-09-uniswapv3-tokens-of-certain-pairs-will-be-wrongly-value|[H-09] UniswapV3 tokens of certain pairs will be wrongly valued, leading to liquidations]] — `vuln/arithmetic/decimal-mismatch`
- [[35216-h-14-mergetranchesrefinancepartial-lack-of-nonreentrant-code|[H-14] `mergeTranches()`/`refinancePartial()` lack of `nonReentrant`]] — `vuln/access-control/missing-modifier`
- [[47445-incorrect-implementation-of-self-liquidation-ottersec-none-b|Incorrect Implementation Of Self Liquidation]] — `vuln/logic/liquidation-logic`
- [[47446-price-inflation-attack-ottersec-none-blend-capital-pdf|Price Inflation Attack]] — `vuln/dos/frozen-funds`
- [[47447-backstop-deposit-inflation-ottersec-none-blend-capital-pdf|Backstop Deposit Inflation]] — `vuln/dos/frozen-funds`
- [[57187-any-attempt-to-liquidate-a-user-will-fail-because-stabilityp|Any attempt to liquidate a user will fail, because StabilityPool does not hold crvUSD during operational lifecycle]] — `vuln/logic/liquidation-logic`
- [[62061-h-01-a-reserves-d-supply-is-incorrectly-updated-and-stored-a|[H-01] A reserve’s `d_supply` is incorrectly updated and stored after flash loan execution]] — `vuln/logic/reward-calculation`
