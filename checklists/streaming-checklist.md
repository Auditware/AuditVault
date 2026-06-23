---
tags:
  - checklist
  - sector/streaming
generated: true
---
# Streaming — Audit Checklist

> Auto-generated from **39** findings in this sector (**8** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Reentrancy: Single Function** — 2 findings `vuln/reentrancy/single-function`
- [ ] **Dos: Frozen Funds** — 2 findings `vuln/dos/frozen-funds`
- [ ] **Arithmetic: Underflow** — 2 findings `vuln/arithmetic/underflow`
- [ ] **Reentrancy: Read Only** — 1 finding `vuln/reentrancy/read-only`
- [ ] **Logic: Fee Calculation** — 1 finding `vuln/logic/fee-calculation`
- [ ] **Dos: Unbounded Loop** — 1 finding `vuln/dos/unbounded-loop`
- [ ] **Oracle: Spot Price** — 1 finding `vuln/oracle/spot-price`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/reentrancy-callback` — 2
- [ ] `trigger/flash-loan` — 1
- [ ] `trigger/sandwich-attack` — 1
- [ ] `trigger/price-manipulation` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/locked-funds` — 8
- `impact/loss-of-funds/direct-drain` — 6
- `impact/mev/frontrun` — 2
- `impact/privilege-escalation/admin-takeover` — 1
- `impact/mev/sandwich` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/fix-arithmetic` — 3
- `fix/use-reentrancy-guard` — 2
- `fix/use-twap` — 1

## 📚 Study these findings

- [[19588-reentrancy-vulnerabilities-may-drain-tokens-sigmaprime-none|Reentrancy Vulnerabilities May Drain Tokens]] — `vuln/reentrancy/single-function`
- [[20308-h-01-the-unlockexponent-does-not-work-as-intended-when-it-is|[H-01] The `unlockExponent` does not work as intended when it is ≠ 1]] — `vuln/dos/frozen-funds`
- [[31192-h-3-reentrancy-in-vestingsolclaim-will-allow-users-to-drain|H-3: Reentrancy in Vesting.sol:claim() will allow users to drain the contract due to executing .call() on user's address before setting s.index = uint128(i)]] — `vuln/reentrancy/read-only`
- [[32846-incorrect-accounting-of-earned-and-unlocked-tokens-on-exit-m|Incorrect Accounting of earned and unlocked Tokens on exit May Brick the Protocol]] — `vuln/logic/fee-calculation`
- [[43733-h-2-fluidlocker-getunlockingpercentage-uses-540-instead-of-5|H-2: `FluidLocker::_getUnlockingPercentage()` uses 540 instead of `540 days` leading to stuck funds as the unlocking percentage will be bigger than `100%` and underflow]] — `vuln/arithmetic/underflow`
- [[54672-owner-can-be-temporarily-changed-within-proxy-calls-allowing|Owner can be temporarily changed within proxy calls, allowing complete control of proxy]] — `vuln/dos/unbounded-loop`
- [[61287-rebaseable-tokens-cause-unfair-vesting-and-claim-failures-mi|Rebaseable Tokens Cause Unfair Vesting and Claim Failures]] — `vuln/arithmetic/underflow`
- [[65583-circular-slippage-protection-in-sablierlidoadapter-wstethtow|Circular slippage protection in `SablierLidoAdapter::_wstETHToWeth` enables sandwich attacks on adapter vault unstaking]] — `vuln/oracle/spot-price`
