---
tags:
  - checklist
  - sector/staking
generated: true
---
# Staking — Audit Checklist

> Auto-generated from **573** findings in this sector (**127** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Logic: Reward Calculation** — 35 findings `vuln/logic/reward-calculation`
- [ ] **Reentrancy: Single Function** — 21 findings `vuln/reentrancy/single-function`
- [ ] **Arithmetic: Underflow** — 18 findings `vuln/arithmetic/underflow`
- [ ] **Dos: Frozen Funds** — 11 findings `vuln/dos/frozen-funds`
- [ ] **Dos: Griefing** — 10 findings `vuln/dos/griefing`
- [ ] **Dependency: Upgradeable Contract** — 7 findings `vuln/dependency/upgradeable-contract`
- [ ] **Access Control: Missing Modifier** — 6 findings `vuln/access-control/missing-modifier`
- [ ] **Pda: Missing Seeds Check** — 6 findings `vuln/pda/missing-seeds-check`
- [ ] **Dos: Unbounded Loop** — 5 findings `vuln/dos/unbounded-loop`
- [ ] **Arithmetic: Decimal Mismatch** — 5 findings `vuln/arithmetic/decimal-mismatch`
- [ ] **Bridge: Replay** — 5 findings `vuln/bridge/replay`
- [ ] **Access Control: Missing Signer** — 4 findings `vuln/access-control/missing-signer`
- [ ] **Logic: Fee Calculation** — 4 findings `vuln/logic/fee-calculation`
- [ ] **Oracle: Stale Price** — 3 findings `vuln/oracle/stale-price`
- [ ] **Arithmetic: Precision Loss** — 2 findings `vuln/arithmetic/precision-loss`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/reentrancy-callback` — 19
- [ ] `trigger/cross-chain-message` — 8
- [ ] `trigger/flash-loan` — 7
- [ ] `trigger/sandwich-attack` — 7
- [ ] `trigger/price-manipulation` — 6
- [ ] `trigger/first-deposit` — 6
- [ ] `trigger/governance-vote` — 5
- [ ] `trigger/low-liquidity` — 2
- [ ] `trigger/time-based/epoch-boundary` — 1
- [ ] `trigger/time-based/timelock-expiry` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 42
- `impact/loss-of-funds/locked-funds` — 29
- `impact/mev/frontrun` — 26
- `impact/dos/permanent` — 8
- `impact/mev/sandwich` — 7
- `impact/loss-of-funds/reward-theft` — 7
- `impact/data-corruption/price-manipulation` — 5
- `impact/privilege-escalation/role-bypass` — 3
- `impact/mev/backrun` — 2
- `impact/privilege-escalation/admin-takeover` — 1
- `impact/loss-of-funds/fee-theft` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/fix-arithmetic` — 60
- `fix/use-reentrancy-guard` — 37
- `fix/add-access-control` — 14
- `fix/add-check` — 12
- `fix/upgrade-dependency` — 7
- `fix/add-nonce` — 5
- `fix/add-snapshot` — 2
- `fix/initialize-proxy` — 2
- `fix/use-twap` — 2

## 📚 Study these findings

- [[10281-h-9-signers-can-bypass-checks-and-change-threshold-within-a|H-9: Signers can bypass checks and change threshold within a transaction]] — `vuln/access-control/missing-signer`
- [[10564-extending-the-staking-duration-discards-rewards-openzeppelin|Extending the staking duration discards rewards]] — `vuln/logic/reward-calculation`
- [[11316-h05-rewards-calculation-is-incorrect-when-the-service-provid|[H05] Rewards calculation is incorrect when the service provider has a pending “decrease stake” request]] — `vuln/logic/reward-calculation`
- [[11321-h10-a-service-provider-can-deceive-its-delegators-openzeppel|[H10] A service provider can deceive its delegators]] — `vuln/dos/frozen-funds`
- [[13206-multiple-checks-effects-violations-consensys-rocket-pool-atl|Multiple checks-effects violations]] — `vuln/reentrancy/single-function`
- [[13830-erc-777-callback-issue-partially-fixed-consensys-skale-token|ERC-777 callback issue ✓ Partially fixed]] — `vuln/access-control/missing-modifier`
- [[13843-users-can-burn-delegated-tokens-using-re-entrancy-attack-add|Users can burn delegated tokens using re-entrancy attack ✓ Addressed]] — `vuln/reentrancy/single-function`
- [[13844-rounding-errors-after-slashing-addressed-consensys-skale-tok|Rounding errors after slashing ✓ Addressed]] — `vuln/arithmetic/underflow`
