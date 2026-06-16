---
tags:
  - lang/solidity
  - sector/staking
  - sector/staking-pool
  - platform/cantina
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Goat Tech]]"
auditors:
  - "[[cccz]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_goat_mar2024.pdf"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# When _dp2pdtoken.athbalance() is increased, the power of almost all pools becomes stale 

- id: 40668
- impact: HIGH
- protocol: [[Goat Tech]]
- reporter: cccz (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_goat_mar2024.pdf

## Summary


Summary:
The report discusses a bug in the calculation of pool power in a system called Booster. The problem is that when the largest balance in the pool changes, the power of other pools becomes incorrect. This can lead to incorrect reward distribution. The recommendation is to make the calculation function public so that it can be updated as needed. The bug has been fixed.

## Details

## Context
(No context files were provided by the reviewer)

## Description
**Booster** is an important factor in calculating the pool's power. Booster is defined as:

\[ \text{Booster} = 1 + \frac{\text{current pool's } _dP2PDToken \text{ balance}}{\text{largest } _dP2PDToken \text{ balance (i.e. athBalance)}} \]

```solidity
function _reCalBooster(
    address account_
)
internal
{
    uint maxBoostVotePower = _dP2PDToken.athBalance();
    uint boostVotePower = _dP2PDToken.balanceOf(account_);
    uint newBooster = LProfile.calBooster(boostVotePower, maxBoostVotePower, _maxBooster);
    _profileC.updateBoosterOf(account_, newBooster);
}
```

The problem here is that `athBalance` changes, and when `athBalance` is increased, the power of other pools becomes stale due to not using the latest `athBalance` for calculations.

**Example:**
- Current `athBalance` = 1000
- Pool A's `_dP2PDToken` balance = 500
- Pool B's `_dP2PDToken` balance = 1000

Calculations:
- BoosterA = \( 1 + \frac{500}{1000} = 1.5 \)
- BoosterB = \( 1 + \frac{1000}{1000} = 2 \)

If the owner of Pool B stakes 500 DCT, then the balance of Pool B's `_dP2PDToken` becomes 1500 and `athBalance` also becomes 1500. At this time:

- BoosterB = \( 1 + \frac{1500}{1500} = 2 \)
- BoosterA should be recalculated to \( 1 + \frac{500}{1500} = 1.33 \)

However, since BoosterA will only be recalculated when staking and withdrawing in Pool A, it will remain at 1.5 instead of the recalculated 1.33. This issue propagates across other pools, causing the power of almost all pools to become stale and leading to incorrect reward distribution.

## Recommendation
It is recommended to wrap `_reCalBooster` and `_reCalEP2PDBalance` with a public function so that anyone can recalculate any pool's Booster and Power as `athBalance` increases.

```solidity
function reCalFs(
    address poolOwner_
)
external
{
    _reCalFs(poolOwner_);
}
```

**Goat:** correct. fixed
