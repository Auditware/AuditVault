---
tags:
  - lang/solidity
  - sector/nft
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/frozen-funds
  - vuln/logic/reward-calculation
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/locked-funds
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Super DCA]]"
auditors:
  - "[[0xpetern]]"
  - "[[0xv1bh4]]"
  - "[[BengalCatBalu]]"
  - "[[Boy2000]]"
  - "[[DSbeX]]"
  - "[[DuoSec]]"
  - "[[Ironsidesec]]"
  - "[[Josh4324]]"
  - "[[JuggerNaut]]"
  - "[[Ollam]]"
  - "[[ScarletFir]]"
  - "[[Sir_Shades]]"
  - "[[SuperDevFavour]]"
  - "[[TECHFUND-inc]]"
  - "[[Y4nhu1]]"
  - "[[Ziusz]]"
  - "[[_Ranjan2003]]"
  - "[[bustomer]]"
  - "[[codexNature]]"
  - "[[deadmanwalking]]"
  - "[[drdee]]"
  - "[[eww]]"
  - "[[fullstop]]"
  - "[[glitch-Hunter]]"
  - "[[heavyw8t]]"
  - "[[itsRavin]]"
  - "[[jayjoshix]]"
  - "[[ke1caM]]"
  - "[[khaye26]]"
  - "[[lucky-gru]]"
  - "[[maigadoh]]"
  - "[[makeWeb3safe]]"
  - "[[montecristo]]"
  - "[[peazzycole]]"
  - "[[secret__one]]"
  - "[[softdev0323]]"
  - "[[tinnohofficial]]"
  - "[[vivekd]]"
  - "[[zcai]]"
report: "https://github.com/sherlock-audit/2025-09-super-dca-judging"
genome:
  - "[[frozen-funds]]"
  - "[[reward-calculation]]"
  - "[[direct-drain]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[reward-accounting]]"
---
# H-1: Users with pre-campaign trades will drain cashback funds by claiming retroactive rewards for periods before campaign existed

- id: 63419
- impact: HIGH
- protocol: [[Super DCA]] Liquidity Network
- reporter: TECHFUND-inc (Sherlock)
- source: N/A

## Summary


Summary: 
The contract for Super DCA contains a bug that allows early trade holders to claim disproportionate amounts of cashback rewards meant for legitimate campaign participants. This is due to the absence of validation for the `cashbackClaim.startTime` field, which defines when the campaign begins. This bug can lead to fund drainage, unfair advantage, campaign failure, and insolvency risk. The protocol team has fixed the issue in a recent PR/commit. 

## Details


Source: https://github.com/sherlock-audit/2025-09-super-dca-judging/issues/71 

## Found by 
0xpetern, 0xv1bh4, BengalCatBalu, Boy2000, DSbeX, DuoSec, Ironsidesec, Josh4324, JuggerNaut, Ollam, ScarletFir, Sir\_Shades, SuperDevFavour, TECHFUND-inc, Y4nhu1, Ziusz, \_Ranjan2003, bustomer, codexNature, deadmanwalking, drdee, eww, fullstop, glitch-Hunter, heavyw8t, itsRavin, jayjoshix, ke1caM, khaye26, lucky-gru, maigadoh, makeWeb3safe, montecristo, peazzycole, secret\_\_one, softdev0323, tinnohofficial, vivekd, zcai

### Summary

The contract contains a `cashbackClaim.startTime` field that defines when the campaign begins, but this field is never validated or used in reward calculations. As a result, trades that started before the campaign launch can claim cashback rewards retroactively for all time periods, including those before the campaign existed. This allows early trade holders to drain disproportionate amounts of cashback funds meant for legitimate campaign participants.

### Root Cause

https://github.com/sherlock-audit/2025-09-super-dca/blob/main/super-dca-cashback/src/SuperDCACashback.sol#L152

https://github.com/sherlock-audit/2025-09-super-dca/blob/main/super-dca-cashback/src/SuperDCACashback.sol#L168

The root cause is the complete absence of `cashbackClaim.startTime` validation in three critical locations:
1. `Constructor` Does not validate `_cashbackClaim.startTime`
2. `_isTradeValid()`: Does not check `trade.startTime >= cashbackClaim.startTime`
3. `_calculateEpochData()` : Calculates `timeElapsed` from `trade.startTime` instead of `max(trade.startTime, cashbackClaim.startTime)`

### Internal Pre-conditions

1. A user must have created a trade in the SuperDCATrade contract with `trade.startTime < cashbackClaim.startTime`
2. The trade must meet minimum flow rate requirements (`trade.flowRate >= cashbackClaim.minRate`)
3. The trade must still be active or have ended after the campaign started
4. User must own the trade NFT

### External Pre-conditions

N/A

### Attack Path

1. User creates Trade #1 on January 1, 2024 (timestamp: 1704067200) with valid flow rate
2. Protocol team deploys SuperDCACashback contract on March 1, 2024 with `cashbackClaim.startTime = 1709251200` (March 1, 2024)
3. Campaign is intended to reward participants starting March 1 onwards
4. On March 15, 2024, user calls `claimAllCashback(1)`
5. `_calculateEpochData()` calculates: `timeElapsed = currentTime - trade.startTime = March 15 - January 1 = 73 days`
6. User receives rewards for 10+ completed epochs (~73 days worth) instead of just 2 epochs (~14 days)
7. User claims 5x more rewards than intended, draining funds meant for legitimate campaign participants
8. Multiple pre-campaign trade holders repeat this, potentially draining the entire cashback pool

### Impact

- **Fund Drainage**: Pre-campaign trades can drain the majority of cashback funds before legitimate participants can claim
- **Unfair Advantage**: Users who happened to create trades months before campaign launch get massively disproportionate rewards (up to unlimited retroactive rewards)
- **Campaign Failure**: The cashback campaign fails to incentivize new behavior since all funds go to pre-existing trades
- **Insolvency Risk**: Contract becomes insolvent as retroactive claims exceed funded amounts

### PoC

```diff
Timeline:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Jan 1, 2024          Mar 1, 2024           Mar 15, 2024
    │                     │                      │
    │                     │                      │
    ▼                     ▼                      ▼
Trade Created      Campaign Launches      User Claims
(startTime:        (cashbackClaim.        Rewards
 timestamp 1)       startTime: 
                    timestamp 2)

Expected Reward Period:  [────14 days────]
Actual Reward Period:    [──────────73 days────────────]
                         (Jan 1 to Mar 15)
```

### Mitigation

Implement proper validation and usage of the `cashbackClaim.startTime`

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/Super-DCA-Tech/super-dca-cashback/pull/24
