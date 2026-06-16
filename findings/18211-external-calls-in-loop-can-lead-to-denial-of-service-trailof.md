---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - sector/token
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/unbounded-loop
  - precondition/specific-token-type
  - novelty/known-pattern
protocol: "[[Origin]]"
auditors:
  - "[[Dominik Teiml]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf"
genome:
  - "[[unbounded-loop]]"
  - "[[specific-token-type]]"
  - "[[known-pattern]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[liquidation-underwater]]"
---
# External calls in loop can lead to denial of service

- id: 18211
- impact: HIGH
- protocol: [[Origin Dollar]]
- reporter: Dominik Teiml (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf

## Summary


This bug report is about several contracts that have function calls made in unbounded loops. This type of pattern is known to be error-prone as it can trap the contracts due to gas limitations or failed transactions. An example of such a loop can be found in AaveStrategy.sol, where a loop iterates over the assetsMapped items and calls safeApproveAllTokens. This can be trapped if a call to an asset fails, or if the number of items in assetsMapped increases the gas cost beyond a certain limit. Similar patterns have been found in CompoundStrategy.liquidate(), CompoundStrategy.safeApproveAllTokens(), MixOracle.priceMin(string), MixOracle.priceMax(string), RebaseHooks.postRebase(bool), AaveStrategy.liquidate(), and Governor.execute(uint256).

The exploit scenario is that over time, the governor adds dozens of assets in assetsMapped, which makes the safeApproveAllTokens no longer callable. The recommendation is to either allow iteration over part of the loop, or remove elements, and to subscribe to crytic.io to review external calls in loops, as Crytic catches bugs of this type.

## Details

## Type: Auditing and Logging
## Target: Several contracts

### Difficulty: Low

### Description
Several function calls are made in unbounded loops. This pattern is error-prone as it can trap the contracts due to the gas limitations or failed transactions. For example, `AaveStrategy` has several loops that iterate over the `assetsMapped` items, including `safeApproveAllTokens`:

```solidity
function safeApproveAllTokens() external onlyGovernor {
    uint256 assetCount = assetsMapped.length;
    address lendingPoolVault = _getLendingPoolCore();
    // approve the pool to spend the bAsset
    for (uint256 i = 0; i < assetCount; i++) {
        address asset = assetsMapped[i];
        // Safe approval
        IERC20(asset).safeApprove(lendingPoolVault, 0);
        IERC20(asset).safeApprove(lendingPoolVault, uint256(-1));
    }
}
```

*Figure 20.1: AaveStrategy.sol#L114-L124*

`assetsMapped` is an unbounded array that can only grow. `safeApproveAllTokens` can be trapped if:
- A call to an asset fails (for example, the asset is paused).
- Items in `assetsMapped` increase the gas cost beyond a certain limit.

Similar patterns exist in:
- `CompoundStrategy.liquidate()`
- `CompoundStrategy.safeApproveAllTokens()`
- `MixOracle.priceMin(string)`
- `MixOracle.priceMax(string)`
- `RebaseHooks.postRebase(bool)`
- `AaveStrategy.liquidate()`
- `Governor.execute(uint256)`

### Exploit Scenario
Over time, the governor adds dozens of assets in `assetsMapped`. As a result, `safeApproveAllTokens` is no longer callable.

### Recommendation
In the short term, review all the loops mentioned above and either:
- Allow iteration over part of the loop, or
- Remove elements.

In the long term, subscribe to [crytic.io](https://crytic.io) to review external calls in loops. Crytic catches bugs of this type.
