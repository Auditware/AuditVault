---
tags:
  - checklist
  - sector/dex
generated: true
---
# Dex — Audit Checklist

> Auto-generated from **446** findings in this sector (**93** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Logic: Fee Calculation** — 16 findings `vuln/logic/fee-calculation`
- [ ] **Reentrancy: Single Function** — 13 findings `vuln/reentrancy/single-function`
- [ ] **Oracle: Spot Price** — 13 findings `vuln/oracle/spot-price`
- [ ] **Logic: Reward Calculation** — 10 findings `vuln/logic/reward-calculation`
- [ ] **Dos: Frozen Funds** — 10 findings `vuln/dos/frozen-funds`
- [ ] **Access Control: Missing Modifier** — 9 findings `vuln/access-control/missing-modifier`
- [ ] **Arithmetic: Decimal Mismatch** — 8 findings `vuln/arithmetic/decimal-mismatch`
- [ ] **Arithmetic: Underflow** — 6 findings `vuln/arithmetic/underflow`
- [ ] **Pda: Reinitialization** — 4 findings `vuln/pda/reinitialization`
- [ ] **Reentrancy: Read Only** — 3 findings `vuln/reentrancy/read-only`
- [ ] **Pda: Missing Seeds Check** — 3 findings `vuln/pda/missing-seeds-check`
- [ ] **Dos: Griefing** — 2 findings `vuln/dos/griefing`
- [ ] **Bridge: Replay** — 2 findings `vuln/bridge/replay`
- [ ] **Logic: Liquidation Logic** — 2 findings `vuln/logic/liquidation-logic`
- [ ] **Dos: Unbounded Loop** — 2 findings `vuln/dos/unbounded-loop`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/price-manipulation` — 30
- [ ] `trigger/sandwich-attack` — 19
- [ ] `trigger/reentrancy-callback` — 13
- [ ] `trigger/low-liquidity` — 8
- [ ] `trigger/flash-loan` — 8
- [ ] `trigger/first-deposit` — 4
- [ ] `trigger/cross-chain-message` — 3
- [ ] `trigger/time-based/epoch-boundary` — 2
- [ ] `trigger/governance-vote` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 56
- `impact/mev/frontrun` — 28
- `impact/data-corruption/price-manipulation` — 27
- `impact/mev/sandwich` — 19
- `impact/loss-of-funds/locked-funds` — 17
- `impact/loss-of-funds/reward-theft` — 9
- `impact/loss-of-funds/fee-theft` — 7
- `impact/dos/permanent` — 7
- `impact/mev/backrun` — 6
- `impact/privilege-escalation/ownership-transfer` — 4

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/fix-arithmetic` — 35
- `fix/use-reentrancy-guard` — 28
- `fix/add-access-control` — 12
- `fix/use-twap` — 11
- `fix/add-check` — 5
- `fix/initialize-proxy` — 4
- `fix/use-multi-oracle` — 2
- `fix/add-nonce` — 2
- `fix/add-circuit-breaker` — 1
- `fix/redesign-logic` — 1
- `fix/upgrade-dependency` — 1

## 📚 Study these findings

- [[13255-convexpositionhandler-claimrewards-incorrectly-calculates-am|ConvexPositionHandler._claimRewards incorrectly calculates amount of LP tokens to unstake]] — `vuln/logic/reward-calculation`
- [[13830-erc-777-callback-issue-partially-fixed-consensys-skale-token|ERC-777 callback issue ✓ Partially fixed]] — `vuln/access-control/missing-modifier`
- [[15978-h-05-attacker-can-manipulate-low-tvl-uniswap-v3-pool-to-borr|[H-05] Attacker can manipulate low TVL Uniswap V3 pool to borrow and swap to make Lending Pool in loss]] — `vuln/arithmetic/decimal-mismatch`
- [[15979-h-06-discrepency-in-the-uniswap-v3-position-price-calculatio|[H-06] Discrepency in the Uniswap V3 position price calculation because of decimals]] — `vuln/arithmetic/decimal-mismatch`
- [[15982-h-09-uniswapv3-tokens-of-certain-pairs-will-be-wrongly-value|[H-09] UniswapV3 tokens of certain pairs will be wrongly valued, leading to liquidations]] — `vuln/arithmetic/decimal-mismatch`
- [[18411-specified-minoutput-will-remain-locked-in-lssvmrouterswapnft|Specified `minOutput` will remain locked in `LSSVMRouter::swapNFTsForSpecificNFTsThroughETH`]] — `vuln/dos/frozen-funds`
- [[18412-malicious-pair-can-re-enter-veryfastrouter-to-drain-original|Malicious pair can re-enter `VeryFastRouter` to drain original caller's funds]] — `vuln/reentrancy/single-function`
- [[18434-read-only-reentrancy-cyfrin-beanstalk-wells-markdown|Read-only reentrancy]] — `vuln/access-control/missing-modifier`
