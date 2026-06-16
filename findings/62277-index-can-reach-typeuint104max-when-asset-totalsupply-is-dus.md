---
tags:
  - lang/solidity
  - sector/farm
  - sector/stable
  - platform/spearbit
  - has/github
  - severity/high
  - novelty/known-pattern
protocol: "[[Astera]]"
auditors:
  - "[[Saw-mon and Natalie]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Astera-Spearbit-Security-Review-December-2024.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
  - "[[token-decimal-normalization]]"
---
# Index can reach type(uint104).max when asset totalSupply is dust and DoS aToken transfers in-

- id: 62277
- impact: HIGH
- protocol: [[Astera]]
- reporter: Saw-mon and Natalie (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Astera-Spearbit-Security-Review-December-2024.pdf

## Summary


The report describes a security issue in the Rewards Distributor code. The code uses an index to track rewards for aToken. However, in certain cases, the index can reach its maximum value, causing the rewards to stop accruing. This can happen when the total supply of the asset token is very small. The report suggests increasing the size of the index or not accruing rewards when the total supply is below a certain threshold. The issue has been fixed in the code. 

## Details

## Security Issue: Reward Distribution Index Overflow

**Severity:** High Risk  
**Context:** `RewardsDistributor.sol#L501`  

## Description
The reward formula in Reward Distributors (`RewardsDistributor.sol` and `RewardsDistributor6909.sol`) uses an index to track the accrual of rewards per unit of aToken held. The size for the index is set to be `uint104`, which should be sufficient for cases when `assetTotalSupply >= 10**assetDecimals` or when `decimals` is a low value. However, in the case of a total supply being dust, even for a short amount of time, the index can reach `type(uint104).max`, preventing any further reward accrual.

### Relevant Code Snippet - RewardsDistributor.sol#L279
```solidity
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

### Index Computation Formula - RewardsDistributor.sol#L501
```solidity
uint256 currentTimestamp = 
    block.timestamp > distributionEnd ? distributionEnd : block.timestamp;
uint256 timeDelta = currentTimestamp - lastUpdateTimestamp;
return (emissionPerSecond * timeDelta * (10 ** decimals)) / totalBalance + currentIndex;
```
- `emissionPerSecond`: The number of reward tokens to emit globally per second.
- `decimals`: The decimal precision for the asset token considered.
- `totalBalance`: The total supply of the asset token considered.

## Scenario
### Preconditions:
| Parameter                       | Value                    |
|----------------------------------|--------------------------|
| Asset token                     | aWeth (decimals: 18)    |
| Reward token                    | DAI (decimals: 18)      |
| Total reward amount (A)        | 1000 DAI                 |
| Total asset supply              | 1                        |
| Time elapsed (t)               | 12 sec (~1 block)       |
| Distribution duration (T)       | 1 month                 |

Very reasonable values, except for total asset supply which may need some stars to align.

### Index Calculation
First, let's calculate `emissionPerSecond` denoted as `r`:
```
r = A / T = (1000 * 10**18) / 262800 = 3.8 * 10**14
```
Which yields the index value:
```
i = r * t * 10**d = (3.8 * 10**14) * 12 * 10**18 = 4.56 * 10**34 / 2**104
```

## Recommendation
Multiple recommendations can be considered:

- **Increasing Index Size:** When `A = 1_000_000e18` and `d = 18`, the index would be safe from reverting using `uint140`.

- **Do Not Accrue Index When Normalized Total Supply is Below a Threshold:** This should not happen in any reasonable case:
```solidity
if (
    emissionPerSecond == 0 ||
    totalBalance == 0 ||
    (decimals == 18 && totalBalance <= UPDATE_THRESHOLD) || // @audit ok to be below threshold for low decimal tokens
    lastUpdateTimestamp == block.timestamp || 
    lastUpdateTimestamp >= distributionEnd
) {
    return currentIndex;
}
```

Additionally, to avoid reverting at any cost during action handling, overflow could be allowed so that the index would naturally wrap around, which would be safe since only index differences are used when computing rewards.

## Action Taken
- **Astera:** Fixed in PR 34.
- **Spearbit:** Fix verified.
