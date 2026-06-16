---
tags:
  - lang/solidity
  - sector/farm
  - sector/lending
  - sector/stable
  - platform/spearbit
  - has/github
  - severity/high
  - novelty/known-pattern
protocol: "[[Cod3x]]"
auditors:
  - "[[Saw-mon and Natalie]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Cod3x-Spearbit-Security-Review-December-2024.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[known-pattern]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
  - "[[token-decimal-normalization]]"
---
# Index can reach type(uint104).max when asset totalSupply is dust and DoS aToken transfers inDefinetely

- id: 49176
- impact: HIGH
- protocol: [[Cod3x]] lend
- reporter: Saw-mon and Natalie (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Cod3x-Spearbit-Security-Review-December-2024.pdf

## Summary


This bug report discusses an issue with the reward formula in the RewardsDistributor.sol and RewardsDistributor6909.sol contracts. The formula uses an index to track rewards, but when the total supply of the asset token is very low, the index can reach its maximum value and no further rewards can be accrued. This can happen if the asset token has a low decimal precision or if the total supply is very small. The report suggests increasing the size of the index or implementing a threshold to prevent this issue. The bug has been fixed in PR 34.

## Details

**Severity:** High Risk  
**Context:** RewardsDistributor.sol#L501  
**Description:**  
The reward formula in Reward Distributors (RewardsDistributor.sol and RewardsDistributor6909.sol) uses an index to track accrual of rewards per unit of aToken held. The size for the index is set to be `uint104`, and it should be well enough for cases when `assetTotalSupply >= 10**assetDecimals` or decimals is a low value. However, in the case totalSupply is dust, even for a short amount of time, the index can reach `type(uint104).max`, and no further reward accrual can happen:

```solidity
// RewardsDistributor.sol#L279:
if (newIndex != oldIndex) {
    require(newIndex <= type(uint104).max, "Index overflow"); // <<<
    // optimization: storing one after another saves one SSTORE
    rewardConfig.index = uint104(newIndex);
    rewardConfig.lastUpdateTimestamp = uint32(block.timestamp);
    emit AssetIndexUpdated(asset, reward, newIndex);
} else {
    rewardConfig.lastUpdateTimestamp = uint32(block.timestamp);
}
```

The formula for computing the index is given below:

```solidity
// RewardsDistributor.sol#L501:
uint256 currentTimestamp = block.timestamp > distributionEnd ? distributionEnd : block.timestamp;
uint256 timeDelta = currentTimestamp - lastUpdateTimestamp;
return (emissionPerSecond * timeDelta * (10 ** decimals)) / totalBalance + currentIndex;
```

- `emissionPerSecond` is the number of reward tokens to emit globally per second.
- `decimals` is the decimals precision for asset token considered.
- `totalBalance` is the total supply of the asset token considered.

## Scenario:

### Preconditions:

| Parameter                  | Value                       |
|----------------------------|-----------------------------|
| Asset token                | aWeth (decimals: 18)       |
| Reward token               | DAI (decimals: 18)         |
| Total reward amount (A)    | 1000 DAI                   |
| Total asset supply         | 1                           |
| Time elapsed (t)          | 12 sec (~1 block)          |
| Distribution duration (T)  | 1 month                    |

Very reasonable values except for total asset supply which may need some stars to align.

### Index calculation:

First let's calculate `emissionPerSecond` denoted `r`:

```
r = A / T = (1000 * 10^18) / (262800) = 3.8 * 10^14
```

Which yields the index value:

```
i = r * t * 10^d = (3.8 * 10^14) * 12 * 10^18 = 4.56 * 10^34 / 10^104
```

## Recommendation:

Multiple recommendations can be considered:

- **Increasing index size:** When `A = 1_000_000e18` and `d = 18`, index would be safe from reverting using `uint140`.
  
- **Do not accrue index when normalized total supply is below a threshold** (which should not happen anyway in any reasonable case):

```solidity
if (
    emissionPerSecond == 0 ||
    totalBalance == 0 ||
    (decimals == 18 && totalBalance <= UPDATE_THRESHOLD) || // @audit ok to be below threshold
    for low decimal tokens, 
    lastUpdateTimestamp == block.timestamp ||
    lastUpdateTimestamp >= distributionEnd
) {
    return currentIndex;
}
```

Additionally, to avoid reverting at any costs during action handling, overflow could be allowed so the index would naturally wrap around (it would be safe since we only use index differences when computing rewards).

**Cod3x:** Fixed in PR 34.  
**Spearbit:** Fix verified.
