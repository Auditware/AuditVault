---
tags:
  - checklist
  - sector/bridge
generated: true
---
# Bridge — Audit Checklist

> Auto-generated from **251** findings in this sector (**32** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Dos: Frozen Funds** — 7 findings `vuln/dos/frozen-funds`
- [ ] **Dos: Unbounded Loop** — 4 findings `vuln/dos/unbounded-loop`
- [ ] **Logic: Fee Calculation** — 3 findings `vuln/logic/fee-calculation`
- [ ] **Arithmetic: Decimal Mismatch** — 3 findings `vuln/arithmetic/decimal-mismatch`
- [ ] **Bridge: Replay** — 3 findings `vuln/bridge/replay`
- [ ] **Dependency: Upgradeable Contract** — 2 findings `vuln/dependency/upgradeable-contract`
- [ ] **Logic: Reward Calculation** — 2 findings `vuln/logic/reward-calculation`
- [ ] **Reentrancy: Single Function** — 2 findings `vuln/reentrancy/single-function`
- [ ] **Access Control: Missing Modifier** — 2 findings `vuln/access-control/missing-modifier`
- [ ] **Dos: Griefing** — 2 findings `vuln/dos/griefing`
- [ ] **Dependency: Unchecked Return Value** — 1 finding `vuln/dependency/unchecked-return-value`
- [ ] **Pda: Missing Seeds Check** — 1 finding `vuln/pda/missing-seeds-check`
- [ ] **Arithmetic: Underflow** — 1 finding `vuln/arithmetic/underflow`
- [ ] **Arithmetic: Precision Loss** — 1 finding `vuln/arithmetic/precision-loss`
- [ ] **Oracle: Stale Price** — 1 finding `vuln/oracle/stale-price`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/cross-chain-message` — 8
- [ ] `trigger/reorg` — 2
- [ ] `trigger/reentrancy-callback` — 2
- [ ] `trigger/time-based/epoch-boundary` — 1
- [ ] `trigger/price-manipulation` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 16
- `impact/loss-of-funds/locked-funds` — 14
- `impact/mev/frontrun` — 2
- `impact/dos/permanent` — 2
- `impact/mev/backrun` — 1
- `impact/privilege-escalation/ownership-transfer` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/fix-arithmetic` — 8
- `fix/use-reentrancy-guard` — 6
- `fix/add-check` — 4
- `fix/add-nonce` — 3
- `fix/upgrade-dependency` — 2
- `fix/add-access-control` — 2
- `fix/use-twap` — 1
- `fix/initialize-proxy` — 1

## 📚 Study these findings

- [[18104-risk-of-upgrade-issues-due-to-missing-gap-variable-trailof|Risk of upgrade issues due to missing __gap variable]] — `vuln/dependency/upgradeable-contract`
- [[29745-not-update-rewards-in-handleincomingupdate-function-of-sdlpo|Not Update Rewards in `handleIncomingUpdate` Function of `SDLPoolPrimary` Leads to Incorrect Reward Calculations]] — `vuln/logic/reward-calculation`
- [[30560-h-02-due-to-missing-checks-on-minimum-gas-passed-through-lay|[H-02] Due to missing checks on minimum gas passed through LayerZero, executions can fail on the destination chain]] — `vuln/dos/unbounded-loop`
- [[31548-h-03-workers-could-withdraw-without-deregister-and-waiting-f|[H-03] Workers could withdraw without deregister and waiting for the lock period]] — `vuln/dos/unbounded-loop`
- [[34117-c-03-incorrect-logical-check-in-endgame-function-pashov-audi|[C-03] Incorrect logical check in `endGame` function]] — `vuln/dos/frozen-funds`
- [[34118-h-01-game-fee-locked-in-earlyendgame-pashov-audit-group-none|[H-01] Game fee locked in `earlyEndGame`]] — `vuln/dos/frozen-funds`
- [[38512-bridge-is-unable-to-transfer-ownership-and-upgrade-on-erc721|`Bridge` is unable to transfer ownership and upgrade on `ERC721Bridgeable`]] — `vuln/dependency/upgradeable-contract`
- [[46493-permanent-failure-to-bridge-wrapped-erc721-using-bridgesende|Permanent failure to bridge wrapped ERC721 using Bridge::sendERC721UsingNative function]] — `vuln/dos/frozen-funds`
