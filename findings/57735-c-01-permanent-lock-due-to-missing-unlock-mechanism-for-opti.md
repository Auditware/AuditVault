---
tags:
  - lang/solidity
  - sector/options
  - has/github
  - severity/high
protocol: "[[Hyperhyper]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Hyperhyper-security-review_2025-03-30.md"
genome:
  - "[[dos-resistance]]"
  - "[[frozen-funds]]"
  - "[[variant]]"
---
# [C-01] Permanent lock due to missing unlock mechanism for options

- id: 57735
- impact: HIGH
- protocol: Hyperhyper_2025-03-30
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Hyperhyper-security-review_2025-03-30.md

## Summary


This bug report describes a critical issue in a protocol where liquidity can become permanently locked in the pool. This happens when options are not exercised within a specific time window or if they result in a loss. The problem is caused by a code flow that locks liquidity when an option is created and only unlocks it during a specific function call. This can lead to scenarios where liquidity is permanently locked, and it also creates a potential attack vector. The recommendation is to implement a mechanism to unlock liquidity in these situations. 

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

The protocol has a critical issue where liquidity can be permanently locked in the pool when options are not exercised within the specified window(`exerciseWindowDuration`) or have 0 `PNL`(at a loss). Here's the problematic flow:

```solidity
// In PositionInteractionFacet.sol
function _lockLiquidity(Position memory pos) internal {
    PoolStorage.Layout storage strg = PoolStorage.layout();
    if (pos.opType == OptionType.CALL)
        strg.ledger.state.lockedToken[pos.uAsset] += pos.sizeUa;
    else if (pos.opType == OptionType.PUT)
        strg.ledger.state.lockedUSD += pos.sizeUSD;
}

// In StrategyView.sol
function isPayoffAvailable(uint256 positionID, address caller, address /*recipient*/ )
    external
    view
    virtual
    override
    returns (bool)
{
    return strg.setUp.treasury.manager().isApprovedOrOwner(caller, positionID)
        && _calculateStrategyPayOff(positionID) > 0
        && block.timestamp >= maturity
        && block.timestamp <= maturity + strg.setUp.base.exerciseWindowDuration;
}
```

The issue manifests in several ways:

- Liquidity is locked when an option is created.
- Liquidity is only unlocked through `exerciseOrLiquidatePosition`.
- `exerciseOrLiquidatePosition` is only called during `payoff`.
- `payoff` is only available when:
  - The option is profitable (`_calculateStrategyPayOff > 0`).
  - Within the exercise window (maturity to maturity + exerciseWindowDuration).

This creates scenarios where liquidity becomes permanently locked:

- Options not exercised within the time window.
- Options where the holder fails to exercise.

Additionally, this creates a potential attack vector:

1. The attacker opens multiple options with small premiums.
2. Intentionally doesn't exercise them.
3. Causes permanent locking of pool liquidity.

## Recommendations

Implement an unlock mechanism for this situation.
