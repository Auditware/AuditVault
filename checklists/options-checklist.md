---
tags:
  - checklist
  - sector/options
generated: true
---
# Options — Audit Checklist

> Auto-generated from **103** findings in this sector (**18** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Reentrancy: Single Function** — 3 findings `vuln/reentrancy/single-function`
- [ ] **Arithmetic: Decimal Mismatch** — 3 findings `vuln/arithmetic/decimal-mismatch`
- [ ] **Logic: Reward Calculation** — 2 findings `vuln/logic/reward-calculation`
- [ ] **Dos: Griefing** — 2 findings `vuln/dos/griefing`
- [ ] **Dos: Frozen Funds** — 2 findings `vuln/dos/frozen-funds`
- [ ] **Governance: Flash Loan Voting** — 1 finding `vuln/governance/flash-loan-voting`
- [ ] **Oracle: Stale Price** — 1 finding `vuln/oracle/stale-price`
- [ ] **Access Control: Missing Signer** — 1 finding `vuln/access-control/missing-signer`
- [ ] **Dos: Unbounded Loop** — 1 finding `vuln/dos/unbounded-loop`
- [ ] **Oracle: Missing Circuit Breaker** — 1 finding `vuln/oracle/missing-circuit-breaker`
- [ ] **Oracle: Single Source** — 1 finding `vuln/oracle/single-source`
- [ ] **Reentrancy: Cross Contract** — 1 finding `vuln/reentrancy/cross-contract`
- [ ] **Logic: Fee Calculation** — 1 finding `vuln/logic/fee-calculation`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/price-manipulation` — 5
- [ ] `trigger/flash-loan` — 4
- [ ] `trigger/reentrancy-callback` — 3
- [ ] `trigger/governance-vote` — 2
- [ ] `trigger/time-based/epoch-boundary` — 1
- [ ] `trigger/low-liquidity` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 10
- `impact/mev/frontrun` — 5
- `impact/data-corruption/price-manipulation` — 5
- `impact/loss-of-funds/locked-funds` — 4
- `impact/privilege-escalation/ownership-transfer` — 2

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/fix-arithmetic` — 6
- `fix/use-reentrancy-guard` — 6
- `fix/use-multi-oracle` — 2
- `fix/add-snapshot` — 1
- `fix/add-check` — 1
- `fix/add-access-control` — 1
- `fix/add-circuit-breaker` — 1

## 📚 Study these findings

- [[13255-convexpositionhandler-claimrewards-incorrectly-calculates-am|ConvexPositionHandler._claimRewards incorrectly calculates amount of LP tokens to unstake]] — `vuln/logic/reward-calculation`
- [[15980-h-07-user-can-pass-auction-recovery-health-check-easily-with|[H-07] User can pass auction recovery health check easily with flashloan]] — `vuln/reentrancy/single-function`
- [[18534-h-2-earlier-users-in-rollover-queue-can-grief-later-users-sh|H-2: Earlier users in rollover queue can grief later users]] — `vuln/dos/griefing`
- [[24656-h-02-cooldown-and-redeem-windows-can-be-rendered-useless-cod|[H-02] Cooldown and redeem windows can be rendered useless]] — `vuln/governance/flash-loan-voting`
- [[26267-funds-can-be-drained-from-the-protocol-by-liquidating-an-acc|Funds can be Drained from the Protocol by Liquidating an Account During an Asset Transfer]] — `vuln/reentrancy/single-function`
- [[26270-account-can-be-created-with-arbitrary-manager-address-sigmap|Account Can Be Created With Arbitrary Manager Address]] — `vuln/dos/frozen-funds`
- [[32162-h-1-two-pyth-prices-can-be-used-in-the-same-transaction-to-a|H-1: Two Pyth prices can be used in the same transaction to attack the LP pools]] — `vuln/oracle/stale-price`
- [[40196-permissions-can-drain-approvals-given-to-certain-paymasters|Permissions can drain approvals given to certain paymasters]] — `vuln/access-control/missing-signer`
