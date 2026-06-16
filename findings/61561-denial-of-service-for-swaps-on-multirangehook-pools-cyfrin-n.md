---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - severity/high
  - sector/dex
protocol: "[[Paladin Valkyrie]]"
auditors:
  - Draiakoo
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-03-12-cyfrin-paladin-valkyrie-v2.0.md"
genome:
  - "[[dos-resistance]]"
  - "[[unbounded-loop]]"
  - "[[known-pattern]]"
---
# Denial of service for swaps on `MultiRangeHook` pools

- id: 61561
- impact: HIGH
- protocol: Paladin Valkyrie
- reporter: Draiakoo (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-03-12-cyfrin-paladin-valkyrie-v2.0.md

## Summary


This bug report discusses an issue with the `MultiRangeHook` contract. This contract allows for the creation of new ranges and corresponding LP tokens for a specific pool. However, since this action is permissionless, anyone can create an unlimited number of ranges, causing the `poolLpTokens` array to grow without bound. When a genuine user attempts to make a swap in the pool, the `afterSwap()` hook function is triggered. This function notifies the incentive manager and triggers a loop over all the LP token addresses to notify each registered logic of the swap. However, if the array is too large, the function will fail due to an out-of-gas error, preventing any swaps from occurring. This bug can be exploited by a malicious user to prevent swaps from being performed on a pool. The recommended mitigation is to make range creation a permissioned action and constrain the maximum amount that can be created. This bug has been fixed by the Paladin team by enforcing a maximum of five ranges per pool.

## Details

**Description:** When a new range is created in `MultiRangeHook`, a new `IncentivizedERC20` LP token is registered and added to the array of tokens corresponding to the specific pool:

```solidity
    function createRange(PoolKey calldata key, RangeKey calldata rangeKey) external {
        ...
        address lpToken = address(new IncentivizedERC20(tokenSymbol, tokenSymbol, poolId));

        // Store the Range and LP token infos
        rangeLpToken[rangeId] = lpToken;
        validLpToken[lpToken] = true;
@>      poolLpTokens[poolId].push(lpToken);
        ...
    }
```

Since the action is permissionless, this means that anyone can create an unlimited number of ranges to make the `poolLpTokens` array to grow without bound. When a genuine user then attempts to utilize the pool to make a swap,, the `afterSwap()` hook function is triggered:

```solidity
function afterSwap(address, PoolKey calldata key, IPoolManager.SwapParams calldata, BalanceDelta, bytes calldata)
    external
    override
    onlyPoolManager
    returns (bytes4, int128)
{
    PoolId poolId = key.toId();

    if (address(incentiveManager) != address(0)) {
        incentiveManager.notifySwap(poolId, poolLpTokens[poolId]);
    }

    return (MultiRangeHook.afterSwap.selector, 0);
}
```

This function notifies the incentive manager, passing the pool id and the array of LP token addresses corresponding to all the created ranges. This notification therefore triggers a loop over all the addresses to notify each registered logic of the swap:

```solidity
function notifySwap(PoolId id, address[] calldata lpTokens) external onlyAllowedHooks {
    // @gas cheaper not to cache length for calldata array input
    for (uint256 i; i < lpTokens.length;) {
        _notifySwap(id, lpTokens[i]);
        unchecked {
            ++i;
        }
    }
}

function _notifySwap(PoolId id, address lpToken) internal {
    // Convert PoolId to IncentivizedPoolId
    IncentivizedPoolId _id = IncentivizedPoolKey({ id: id, lpToken: lpToken }).toId();
    if (poolLinkedHook[_id] != msg.sender) revert NotLinkedHook();
    // Get the list of Incentive Systems linked to the pool
    uint256[] memory _systems = _getPoolIncentiveSystemIndexes(_id);

    uint256 length = _systems.length;
    if (length > 0) {
        for (uint256 i; i < length;) {
            // @gas cheaper to read them both at same time using this style
            IncentiveSystem storage sRef = incentiveSystems[_systems[i]];
            (address system, bool updateOnSwap) = (sRef.system, sRef.updateOnSwap);
            if (updateOnSwap) {
                // Notify the Incentive Logic of the swap
                IIncentiveLogic(system).notifySwap(_id);
            }
            unchecked {
                ++i;
            }
        }
    }
}
```

If this array is too large, execution of this function will fail due to an out-of-gas error, preventing any swap from occurring in the pool.

**Impact:** A malicious user can prevent swaps from being performed on a pool configured with the `MultiRangeHook`.

**Recommended Mitigation:** Consider making range creation be a permissioned action and constrained to some maximum amount that can be created to prevent the array from growing without limit.

**Paladin:** Fixed by commit [`7af7783`](https://github.com/PaladinFinance/Valkyrie/pull/5/commits/7af7783b2236598193ef0b4fa66032b91e3e4e40). We decided not to make the method to create a range permissioned, knowing there is a case where a malicious actor creates all the possible ranges for a Pool, blocking others to create their ranges. In such case, another version of the `MultiRangeHook.sol` with more control or an allowlist to create ranges could be deployed and plugged into the `IncentiveManager`.

**Cyfrin:** Verified. A maximum of five ranges per pool has been enforced.
