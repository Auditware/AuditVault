---
tags:
  - checklist
  - sector/staking-pool
generated: true
---
# Staking Pool — Audit Checklist

> Auto-generated from **66** findings in this sector (**18** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Logic: Reward Calculation** — 8 findings `vuln/logic/reward-calculation`
- [ ] **Arithmetic: Underflow** — 3 findings `vuln/arithmetic/underflow`
- [ ] **Dos: Frozen Funds** — 2 findings `vuln/dos/frozen-funds`
- [ ] **Logic: Fee Calculation** — 2 findings `vuln/logic/fee-calculation`
- [ ] **Oracle: Spot Price** — 2 findings `vuln/oracle/spot-price`
- [ ] **Dos: Griefing** — 1 finding `vuln/dos/griefing`
- [ ] **Governance: Proposal Manipulation** — 1 finding `vuln/governance/proposal-manipulation`
- [ ] **Arithmetic: Decimal Mismatch** — 1 finding `vuln/arithmetic/decimal-mismatch`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/flash-loan` — 3
- [ ] `trigger/sandwich-attack` — 2
- [ ] `trigger/price-manipulation` — 2
- [ ] `trigger/governance-vote` — 1
- [ ] `trigger/low-liquidity` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/locked-funds` — 6
- `impact/loss-of-funds/direct-drain` — 4
- `impact/mev/sandwich` — 2
- `impact/mev/frontrun` — 2
- `impact/loss-of-funds/reward-theft` — 2
- `impact/data-corruption/price-manipulation` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/fix-arithmetic` — 13
- `fix/use-reentrancy-guard` — 2
- `fix/use-twap` — 2
- `fix/add-check` — 1

## 📚 Study these findings

- [[13255-convexpositionhandler-claimrewards-incorrectly-calculates-am|ConvexPositionHandler._claimRewards incorrectly calculates amount of LP tokens to unstake]] — `vuln/logic/reward-calculation`
- [[29745-not-update-rewards-in-handleincomingupdate-function-of-sdlpo|Not Update Rewards in `handleIncomingUpdate` Function of `SDLPoolPrimary` Leads to Incorrect Reward Calculations]] — `vuln/logic/reward-calculation`
- [[34118-h-01-game-fee-locked-in-earlyendgame-pashov-audit-group-none|[H-01] Game fee locked in `earlyEndGame`]] — `vuln/dos/frozen-funds`
- [[34765-h-3-pool-value-does-not-consider-the-open-funding-fees-sherl|H-3: Pool value does not consider the open funding fees]] — `vuln/logic/fee-calculation`
- [[35004-incorrect-accounting-of-reportrecoveredeffectivebalance-can|Incorrect accounting of `reportRecoveredEffectiveBalance` can prevent report from being finalized when a validator is slashed]] — `vuln/arithmetic/underflow`
- [[35119-h-6-loss-of-rewards-due-to-continuous-griefing-attacks-on-l2|H-6: Loss of rewards due to continuous griefing attacks on L2 environment]] — `vuln/dos/griefing`
- [[40668-when-dp2pdtokenathbalance-is-increased-the-power-of-almost|When _dp2pdtoken.athbalance() is increased, the power of almost all pools becomes stale]] — `vuln/logic/reward-calculation`
- [[40818-a-malicious-user-can-inflate-his-voting-power-via-merge-cant|A malicious user can inﬂate his voting power via merge()]] — `vuln/governance/proposal-manipulation`
