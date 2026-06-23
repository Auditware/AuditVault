---
tags:
  - checklist
  - sector/launchpad
generated: true
---
# Launchpad — Audit Checklist

> Auto-generated from **32** findings in this sector (**7** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Logic: Fee Calculation** — 4 findings `vuln/logic/fee-calculation`
- [ ] **Reentrancy: Single Function** — 2 findings `vuln/reentrancy/single-function`
- [ ] **Dos: Frozen Funds** — 1 finding `vuln/dos/frozen-funds`
- [ ] **Logic: Wrong Condition** — 1 finding `vuln/logic/wrong-condition`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/reentrancy-callback` — 2
- [ ] `trigger/price-manipulation` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 11
- `impact/mev/frontrun` — 4
- `impact/data-corruption/price-manipulation` — 1
- `impact/loss-of-funds/locked-funds` — 1
- `impact/loss-of-funds/reward-theft` — 1
- `impact/dos/permanent` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/use-reentrancy-guard` — 3
- `fix/fix-arithmetic` — 3
- `fix/add-check` — 1

## 📚 Study these findings

- [[18412-malicious-pair-can-re-enter-veryfastrouter-to-drain-original|Malicious pair can re-enter `VeryFastRouter` to drain original caller's funds]] — `vuln/reentrancy/single-function`
- [[31929-h-01-gas-issuance-is-inflated-and-will-halt-the-chain-or-lea|[H-01] Gas issuance is inflated and will halt the chain or lead to incorrect base fee]] — `vuln/dos/frozen-funds`
- [[43397-h-06-reentrancy-in-creating-creds-allows-an-attacker-to-stea|[H-06] Reentrancy in creating Creds allows an attacker to steal all Ether from the Cred contract]] — `vuln/reentrancy/single-function`
- [[64503-fee-discount-calculation-ignores-base-currency-value-differe|Fee Discount Calculation Ignores Base Currency Value Differences]] — `vuln/logic/fee-calculation`
- [[64851-h-03-gtelaunchpadv2pairburn-over-estimates-distribution-amou|[H-03] `GTELaunchpadV2Pair::burn` over-estimates distribution amounts when there are non-zero accrued launchpad fees]] — `vuln/logic/fee-calculation`
- [[64853-h-05-gtelaunchpadv2pair-permits-minting-lp-tokens-for-free-w|[H-05] `GTELaunchpadV2Pair` permits minting LP tokens for free when there are non-zero accumulated launch pad fees]] — `vuln/logic/fee-calculation`
- [[64855-h-07-total-reward-shares-for-token-can-reach-zero-after-unlo|[H-07] Total reward shares for token can reach zero after unlocking, causing `GTELaunchpadV2Pair` to be bricked]] — `vuln/logic/wrong-condition`
