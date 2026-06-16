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
  - "[[missing-modifier]]"
  - "[[variant]]"
  - "[[admin-is-honest]]"
---
# Swaps are not possible on pools registered with Bunni due to incorrect access control in `ValkyrieHooklet::afterSwap`

- id: 61559
- impact: HIGH
- protocol: Paladin Valkyrie
- reporter: Draiakoo (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-03-12-cyfrin-paladin-valkyrie-v2.0.md

## Summary


The bug report discusses an issue with the ValkyrieHooklet function, specifically the onlyBunniHub modifier that is applied to it. The problem is that this modifier is being invoked from BunniHook instead of BunniHub, which will cause a denial of service for pools registered with Bunni and configured with ValkyrieHooklet. This means that these pools will not be able to perform swaps, rendering the function useless. The report also mentions a recommended mitigation, which is to apply the correct onlyBunniHook modifier to both ValkyrieHooklet::afterSwap and ValkyrieHooklet::beforeSwap. The bug has been fixed by the Paladin team and verified by Cyfrin. 

## Details

**Description:** `ValkyrieHooklet::afterSwap` has the `onlyBunniHub` modifier applied; however, this hook is invoked from `BunniHook` (using the `BunniHookLogic` library) and not `BunniHub` (using the `BunniHubLogic` library). As such, this will result in a DoS of swap functionality for pools registered with Bunni and configured with the `ValkyrieHooklet`.

```solidity
function afterSwap(
    address,
    PoolKey calldata key,
    IPoolManager.SwapParams calldata,
    SwapReturnData calldata
) external override onlyBunniHub returns (bytes4 selector) {
    PoolId poolId = key.toId();
    if (address(incentiveManager) != address(0)) {
        incentiveManager.notifySwap(poolId, bunniTokens[poolId]);
    }
    return ValkyrieHooklet.afterSwap.selector;
}
```

Related to this, `ValkyrieHooklet::beforeSwap` while a no-op hook is the only non-view function missing access control and should mirror the correct access control applied to `ValkyrieHooklet::afterSwap`.

**Impact:** While the incentive logic is not directly affected, swaps will not be possible for pools registered with Bunni and configured with the `ValkyrieHooklet`, therefore rendering it useless.

**Proof of Concept:** The current `MockBunniHub` includes the following function:

```solidity
function afterDeposit(
    address hooklet,
    address caller,
    IBunniHub.DepositParams calldata params,
    IHooklet.DepositReturnData calldata returnData
) external {
    ValkyrieHooklet(hooklet).afterDeposit(
        caller,
        params,
        returnData
    );
}
```

Therefore, `test_afterSwap()` in `ValkyrieHooklet.t.sol` does not revert; however, this issue will become apparent with a test failure when the test suite is updated to use the actual Bunni v2 codebase.

**Recommended Mitigation:** Apply the correct `onlyBunniHook` modifier to both `ValkyrieHooklet::afterSwap` and `ValkyrieHooklet::beforeSwap`.

**Paladin:** Fixed by commit [`333f26b`](https://github.com/PaladinFinance/Valkyrie/pull/5/commits/333f26bcdad465cae4f7fbdeee8ebfca2ce43659).

**Cyfrin:** Verified. `ValkyrieHooklet::afterSwap` now checks the correct caller using the newly-added `onlyHook` modifier. Note that the `bunniHook` NatSpec has been erroneously copied from `bunniHub`.

**Paladin:** In the latest version of the branch, the Natspec is `/// @dev Modifier to check that the caller is the BunniHook`.

**Cyfrin:** Acknowledged.
