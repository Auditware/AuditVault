---
tags:
  - checklist
  - sector/gaming
generated: true
---
# Gaming — Audit Checklist

> Auto-generated from **58** findings in this sector (**15** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Dos: Frozen Funds** — 6 findings `vuln/dos/frozen-funds`
- [ ] **Reentrancy: Single Function** — 4 findings `vuln/reentrancy/single-function`
- [ ] **Dos: Griefing** — 3 findings `vuln/dos/griefing`
- [ ] **Access Control: Missing Modifier** — 1 finding `vuln/access-control/missing-modifier`
- [ ] **Logic: Reward Calculation** — 1 finding `vuln/logic/reward-calculation`
- [ ] **Logic: Fee Calculation** — 1 finding `vuln/logic/fee-calculation`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/reentrancy-callback` — 4
- [ ] `trigger/reorg` — 1
- [ ] `trigger/flash-loan` — 1
- [ ] `trigger/low-liquidity` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 4
- `impact/loss-of-funds/locked-funds` — 3
- `impact/loss-of-funds/reward-theft` — 1
- `impact/privilege-escalation/ownership-transfer` — 1
- `impact/privilege-escalation/admin-takeover` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/use-reentrancy-guard` — 8
- `fix/add-access-control` — 2
- `fix/fix-arithmetic` — 2

## 📚 Study these findings

- [[20530-c-02-reentrancy-allows-any-user-allowed-even-one-free-honeyj|[C-02] Reentrancy allows any user allowed even one free `HoneyJar` mint to mint the max supply for himself for free]] — `vuln/access-control/missing-modifier`
- [[20611-h-01-accepting-input-after-randomness-is-requested-can-be-ex|[H-01] Accepting input after randomness is requested can be exploited]] — `vuln/dos/griefing`
- [[21013-settradeoer-and-canceltradeoer-functions-does-not-use-reentr|setTradeOer and cancelTradeOer functions does not use ReentrancyGuard]] — `vuln/reentrancy/single-function`
- [[21014-contract-funds-can-be-drained-out-auditone-none-lotaheros-ma|Contract funds can be drained out]] — `vuln/reentrancy/single-function`
- [[21017-reentrancy-exploit-in-initiateadventure-function-auditone-no|Reentrancy exploit in initiateAdventure function.]] — `vuln/reentrancy/single-function`
- [[34117-c-03-incorrect-logical-check-in-endgame-function-pashov-audi|[C-03] Incorrect logical check in `endGame` function]] — `vuln/dos/frozen-funds`
- [[34118-h-01-game-fee-locked-in-earlyendgame-pashov-audit-group-none|[H-01] Game fee locked in `earlyEndGame`]] — `vuln/dos/frozen-funds`
- [[61819-h-02-hero-owner-with-mythical-weapon-can-never-receive-weapo|[H-02] Hero Owner With Mythical Weapon Can Never Receive Weapon Shard Rewards]] — `vuln/logic/reward-calculation`
