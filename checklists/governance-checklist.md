---
tags:
  - checklist
  - sector/governance
generated: true
---
# Governance — Audit Checklist

> Auto-generated from **339** findings in this sector (**81** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Logic: Reward Calculation** — 14 findings `vuln/logic/reward-calculation`
- [ ] **Dos: Frozen Funds** — 8 findings `vuln/dos/frozen-funds`
- [ ] **Arithmetic: Underflow** — 8 findings `vuln/arithmetic/underflow`
- [ ] **Reentrancy: Single Function** — 7 findings `vuln/reentrancy/single-function`
- [ ] **Dos: Unbounded Loop** — 6 findings `vuln/dos/unbounded-loop`
- [ ] **Access Control: Missing Modifier** — 6 findings `vuln/access-control/missing-modifier`
- [ ] **Pda: Missing Seeds Check** — 6 findings `vuln/pda/missing-seeds-check`
- [ ] **Arithmetic: Precision Loss** — 4 findings `vuln/arithmetic/precision-loss`
- [ ] **Logic: Fee Calculation** — 4 findings `vuln/logic/fee-calculation`
- [ ] **Bridge: Replay** — 4 findings `vuln/bridge/replay`
- [ ] **Dos: Griefing** — 4 findings `vuln/dos/griefing`
- [ ] **Access Control: Missing Signer** — 4 findings `vuln/access-control/missing-signer`
- [ ] **Dependency: Upgradeable Contract** — 3 findings `vuln/dependency/upgradeable-contract`
- [ ] **Pda: Reinitialization** — 3 findings `vuln/pda/reinitialization`
- [ ] **Oracle: Stale Price** — 3 findings `vuln/oracle/stale-price`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/governance-vote` — 13
- [ ] `trigger/price-manipulation` — 9
- [ ] `trigger/reentrancy-callback` — 7
- [ ] `trigger/sandwich-attack` — 7
- [ ] `trigger/flash-loan` — 6
- [ ] `trigger/cross-chain-message` — 6
- [ ] `trigger/first-deposit` — 5
- [ ] `trigger/time-based/epoch-boundary` — 2
- [ ] `trigger/time-based/timelock-expiry` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 35
- `impact/mev/frontrun` — 20
- `impact/loss-of-funds/locked-funds` — 16
- `impact/data-corruption/price-manipulation` — 8
- `impact/mev/sandwich` — 7
- `impact/loss-of-funds/reward-theft` — 5
- `impact/dos/permanent` — 5
- `impact/privilege-escalation/ownership-transfer` — 3
- `impact/loss-of-funds/fee-theft` — 2
- `impact/privilege-escalation/admin-takeover` — 1
- `impact/mev/backrun` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/fix-arithmetic` — 30
- `fix/use-reentrancy-guard` — 21
- `fix/add-access-control` — 12
- `fix/add-check` — 12
- `fix/add-snapshot` — 5
- `fix/add-nonce` — 4
- `fix/upgrade-dependency` — 3
- `fix/initialize-proxy` — 3
- `fix/redesign-logic` — 2
- `fix/use-twap` — 2
- `fix/use-multi-oracle` — 1

## 📚 Study these findings

- [[10564-extending-the-staking-duration-discards-rewards-openzeppelin|Extending the staking duration discards rewards]] — `vuln/logic/reward-calculation`
- [[11321-h10-a-service-provider-can-deceive-its-delegators-openzeppel|[H10] A service provider can deceive its delegators]] — `vuln/dos/frozen-funds`
- [[11542-h01-approved-proposal-may-be-impossible-to-queue-cancel-or-e|[H01] Approved proposal may be impossible to queue, cancel or execute]] — `vuln/dos/unbounded-loop`
- [[13206-multiple-checks-effects-violations-consensys-rocket-pool-atl|Multiple checks-effects violations]] — `vuln/reentrancy/single-function`
- [[13830-erc-777-callback-issue-partially-fixed-consensys-skale-token|ERC-777 callback issue ✓ Partially fixed]] — `vuln/access-control/missing-modifier`
- [[16040-h-03-dmutesol-attacker-can-push-lock-items-to-victims-array|[H-03] `dMute.sol`: Attacker can push lock items to victim's array such that redemptions are forever blocked]] — `vuln/dos/unbounded-loop`
- [[18211-external-calls-in-loop-can-lead-to-denial-of-service-trailof|External calls in loop can lead to denial of service]] — `vuln/dos/unbounded-loop`
- [[19346-duplicate-actions-unaccounted-for-during-voting-tally-sigmap|Duplicate Actions Unaccounted for During Voting Tally]] — `vuln/pda/duplicate-mutable-accounts`
