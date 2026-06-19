---
tags:
  - checklist
  - sector/perpetuals
generated: true
---
# Perpetuals — Audit Checklist

> Auto-generated from **106** findings in this sector (**25** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Logic: Fee Calculation** — 5 findings `vuln/logic/fee-calculation`
- [ ] **Logic: Liquidation Logic** — 4 findings `vuln/logic/liquidation-logic`
- [ ] **Oracle: Spot Price** — 4 findings `vuln/oracle/spot-price`
- [ ] **Logic: Reward Calculation** — 3 findings `vuln/logic/reward-calculation`
- [ ] **Oracle: Stale Price** — 3 findings `vuln/oracle/stale-price`
- [ ] **Dos: Frozen Funds** — 2 findings `vuln/dos/frozen-funds`
- [ ] **Dos: Unbounded Loop** — 1 finding `vuln/dos/unbounded-loop`
- [ ] **Access Control: Missing Modifier** — 1 finding `vuln/access-control/missing-modifier`
- [ ] **Dependency: Upgradeable Contract** — 1 finding `vuln/dependency/upgradeable-contract`
- [ ] **Arithmetic: Underflow** — 1 finding `vuln/arithmetic/underflow`
- [ ] **Logic: Wrong Condition** — 1 finding `vuln/logic/wrong-condition`
- [ ] **Pda: Reinitialization** — 1 finding `vuln/pda/reinitialization`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/price-manipulation` — 4
- [ ] `trigger/sandwich-attack` — 2
- [ ] `trigger/flash-loan` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 13
- `impact/mev/frontrun` — 4
- `impact/data-corruption/price-manipulation` — 4
- `impact/loss-of-funds/locked-funds` — 4
- `impact/mev/sandwich` — 2
- `impact/privilege-escalation/ownership-transfer` — 1
- `impact/loss-of-funds/reward-theft` — 1
- `impact/dos/permanent` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/fix-arithmetic` — 9
- `fix/use-reentrancy-guard` — 5
- `fix/add-access-control` — 4
- `fix/redesign-logic` — 3
- `fix/add-check` — 3
- `fix/use-twap` — 2
- `fix/upgrade-dependency` — 1
- `fix/initialize-proxy` — 1

## 📚 Study these findings

- [[18634-h-8-malicious-revert-reasons-with-faked-lengths-can-disrupt|H-8: Malicious revert reasons with faked lengths can disrupt order execution]] — `vuln/dos/unbounded-loop`
- [[20225-h-02-hedging-during-liquidation-is-incorrect-code4rena-polyn|[H-02] Hedging during liquidation is incorrect]] — `vuln/logic/liquidation-logic`
- [[29745-not-update-rewards-in-handleincomingupdate-function-of-sdlpo|Not Update Rewards in `handleIncomingUpdate` Function of `SDLPoolPrimary` Leads to Incorrect Reward Calculations]] — `vuln/logic/reward-calculation`
- [[32162-h-1-two-pyth-prices-can-be-used-in-the-same-transaction-to-a|H-1: Two Pyth prices can be used in the same transaction to attack the LP pools]] — `vuln/oracle/stale-price`
- [[34764-h-2-anyone-can-change-the-balance-of-an-account-to-drain-the|H-2: Anyone can change the balance of an account to drain the entire portfolio vault]] — `vuln/access-control/missing-modifier`
- [[34765-h-3-pool-value-does-not-consider-the-open-funding-fees-sherl|H-3: Pool value does not consider the open funding fees]] — `vuln/logic/fee-calculation`
- [[37995-wrong-parameter-passed-in-tradingaccountdeductaccountmargin|Wrong parameter passed in `TradingAccount::deductAccountMargin` function that results in excess margin withdrawal]] — `vuln/logic/liquidation-logic`
- [[40715-openposition-should-not-charge-fees-on-marginfrom-or-charge|openPosition should not charge fees on marginfrom or charge fees on marginTo as well]] — `vuln/logic/fee-calculation`
