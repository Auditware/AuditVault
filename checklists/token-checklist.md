---
tags:
  - checklist
  - sector/token
generated: true
---
# Token — Audit Checklist

> Auto-generated from **333** findings in this sector (**53** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Reentrancy: Single Function** — 15 findings `vuln/reentrancy/single-function`
- [ ] **Logic: Fee Calculation** — 6 findings `vuln/logic/fee-calculation`
- [ ] **Logic: Reward Calculation** — 6 findings `vuln/logic/reward-calculation`
- [ ] **Arithmetic: Decimal Mismatch** — 5 findings `vuln/arithmetic/decimal-mismatch`
- [ ] **Dos: Frozen Funds** — 5 findings `vuln/dos/frozen-funds`
- [ ] **Access Control: Missing Modifier** — 4 findings `vuln/access-control/missing-modifier`
- [ ] **Arithmetic: Underflow** — 3 findings `vuln/arithmetic/underflow`
- [ ] **Dependency: Upgradeable Contract** — 3 findings `vuln/dependency/upgradeable-contract`
- [ ] **Pda: Reinitialization** — 3 findings `vuln/pda/reinitialization`
- [ ] **Dos: Griefing** — 2 findings `vuln/dos/griefing`
- [ ] **Dos: Unbounded Loop** — 1 finding `vuln/dos/unbounded-loop`
- [ ] **Pda: Duplicate Mutable Accounts** — 1 finding `vuln/pda/duplicate-mutable-accounts`
- [ ] **Reentrancy: Read Only** — 1 finding `vuln/reentrancy/read-only`
- [ ] **Logic: Liquidation Logic** — 1 finding `vuln/logic/liquidation-logic`
- [ ] **Access Control: Missing Signer** — 1 finding `vuln/access-control/missing-signer`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/reentrancy-callback` — 15
- [ ] `trigger/flash-loan` — 5
- [ ] `trigger/price-manipulation` — 4
- [ ] `trigger/first-deposit` — 4
- [ ] `trigger/governance-vote` — 3
- [ ] `trigger/sandwich-attack` — 3
- [ ] `trigger/low-liquidity` — 1
- [ ] `trigger/cross-chain-message` — 1
- [ ] `trigger/time-based/epoch-boundary` — 1
- [ ] `trigger/time-based/timelock-expiry` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 58
- `impact/mev/frontrun` — 19
- `impact/loss-of-funds/locked-funds` — 14
- `impact/privilege-escalation/ownership-transfer` — 5
- `impact/data-corruption/price-manipulation` — 4
- `impact/loss-of-funds/reward-theft` — 3
- `impact/mev/sandwich` — 3
- `impact/loss-of-funds/fee-theft` — 3
- `impact/mev/backrun` — 2
- `impact/privilege-escalation/role-bypass` — 1
- `impact/dos/permanent` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/use-reentrancy-guard` — 33
- `fix/fix-arithmetic` — 21
- `fix/add-access-control` — 6
- `fix/upgrade-dependency` — 3
- `fix/initialize-proxy` — 3
- `fix/add-snapshot` — 2
- `fix/add-check` — 1
- `fix/redesign-logic` — 1

## 📚 Study these findings

- [[11879-unsafe-arithmetic-operations-in-airdrop-contract-openzeppeli|Unsafe arithmetic operations in Airdrop contract]] — `vuln/arithmetic/underflow`
- [[13830-erc-777-callback-issue-partially-fixed-consensys-skale-token|ERC-777 callback issue ✓ Partially fixed]] — `vuln/access-control/missing-modifier`
- [[15978-h-05-attacker-can-manipulate-low-tvl-uniswap-v3-pool-to-borr|[H-05] Attacker can manipulate low TVL Uniswap V3 pool to borrow and swap to make Lending Pool in loss]] — `vuln/arithmetic/decimal-mismatch`
- [[15982-h-09-uniswapv3-tokens-of-certain-pairs-will-be-wrongly-value|[H-09] UniswapV3 tokens of certain pairs will be wrongly valued, leading to liquidations]] — `vuln/arithmetic/decimal-mismatch`
- [[18201-reentrancy-and-untrusted-contract-call-in-mintmultiple-diffi|Reentrancy and untrusted contract call in mintMultiple Diﬃculty: Low]] — `vuln/reentrancy/single-function`
- [[18211-external-calls-in-loop-can-lead-to-denial-of-service-trailof|External calls in loop can lead to denial of service]] — `vuln/dos/unbounded-loop`
- [[18412-malicious-pair-can-re-enter-veryfastrouter-to-drain-original|Malicious pair can re-enter `VeryFastRouter` to drain original caller's funds]] — `vuln/reentrancy/single-function`
- [[19346-duplicate-actions-unaccounted-for-during-voting-tally-sigmap|Duplicate Actions Unaccounted for During Voting Tally]] — `vuln/pda/duplicate-mutable-accounts`
