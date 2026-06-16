---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - sector/stable
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - impact/dos/permanent
protocol: "[[Parallel]]"
auditors:
  - "[[0xStalin]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-03-04-cyfrin-parallel3.1-v2.0.md"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[fot-slippage]]"
---
# `Surplus::processSurplus` always reverts for managed collateral - diamond holds zero balance

- id: 65528
- impact: HIGH
- protocol: [[Parallel]]
- reporter: 0xStalin (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-03-04-cyfrin-parallel3.1-v2.0.md

## Summary


The bug report states that there is a problem with the `LibSurplus::_computeCollateralSurplus` function, which reads the collateral balance from `LibManager::totalAssets` for managed collateral. This balance is then used to compute a `collateralSurplus` in the `Surplus::processSurplus` function. However, when this surplus is used to self-swap via `ISwapper(address(this)).swapExactInput(collateralSurplus, ...)`, it fails because the `msg.sender` inside `Swapper::_swap` is the diamond, which does not hold any managed collateral tokens. This results in a permanent DoS on surplus processing for all managed collateral, and the strategy yield cannot be captured. To fix this, the surplus should be withdrawn from the strategy before the self-swap. This bug has been fixed in the `2dfad62` commit.

## Details

**Description:** `LibSurplus::_computeCollateralSurplus` reads the collateral balance from `LibManager::totalAssets` for managed collateral (L83-84), which returns the balance held by the external strategy. It then computes a `collateralSurplus` based on this balance.

`Surplus::processSurplus` uses this surplus to self-swap via `ISwapper(address(this)).swapExactInput(collateralSurplus, ...)` (L50). Since this is an external self-call, `msg.sender` inside `Swapper::_swap` is the diamond.

The mint path in `Swapper::_swap` for managed collateral (L222-225) does:

```solidity
IERC20(tokenIn).safeTransferFrom(
    msg.sender, LibManager.transferRecipient(collatInfo.managerData.config), amountIn
);
```

This tries to transfer from the diamond to the manager. But the diamond's balance is always 0 for managed collateral - during normal mints, tokens go directly from user to manager (L222-225), and during burns, `LibManager::release` sends from manager to user (L247). The diamond never holds managed collateral tokens.

The transfer reverts. `maxCollateralAmount` cannot help since even 1 wei exceeds a 0 balance.

**Impact:** Permanent DoS on surplus processing for all managed collateral. Strategy yield (the primary surplus source for managed assets) accumulates in the manager but can never be captured as distributable tokenP.

**Proof of Concept:** Added to `tests/units/Parallelizer.t.sol`. Run with:
`forge test --match-test "test_ProcessSurplus_RevertWhen_ManagedCollateral_DiamondHasZeroBalance" -vvvv`

```solidity
function test_ProcessSurplus_RevertWhen_ManagedCollateral_DiamondHasZeroBalance()
    public setZeroMintFeesOnAllCollaterals
{
    // Set up eurA as managed collateral
    MockManager manager = new MockManager(address(eurA));
    IERC20[] memory subCollaterals = new IERC20[](1);
    subCollaterals[0] = eurA;
    manager.setSubCollaterals(subCollaterals, "");
    ManagerStorage memory managerData = ManagerStorage({
        subCollaterals: subCollaterals,
        config: abi.encode(ManagerType.EXTERNAL, abi.encode(address(manager)))
    });
    vm.prank(governor);
    parallelizer.setCollateralManager(address(eurA), true, managerData);

    // Mint tokenP - tokens flow to manager, diamond holds 0
    _mintZeroFee(address(eurA), 100 * BASE_6);
    assertEq(eurA.balanceOf(address(parallelizer)), 0);

    // Simulate 8% strategy yield
    deal(address(eurA), address(manager), 108 * BASE_6);

    // Surplus exists
    (uint256 surplus,) = parallelizer.getCollateralSurplus(address(eurA));
    assertGt(surplus, 0);

    // processSurplus reverts - diamond has 0 balance
    _setSlippageTolerance(address(eurA), 1e8);
    vm.startPrank(governor);
    parallelizer.updateSurplusBufferRatio(uint64(BASE_9));
    vm.expectRevert();
    parallelizer.processSurplus(address(eurA), 0);
    vm.stopPrank();
}
```

The `-vvvv` trace confirms the exact revert point:

```
Surplus::processSurplus
  → MockManager::totalAssets()          // surplus = 8 USDC (108 - 100)
  → eurA::approve(Parallelizer, 8e6)   // diamond approves itself
  → Swapper::swapExactInput             // self-call, msg.sender = diamond
    → eurA::transferFrom(Parallelizer, MockManager, 8e6)
      └─ REVERT: ERC20InsufficientBalance(Parallelizer, 0, 8000000)
```

Diamond balance = 0, needed = 8,000,000. The `transferFrom` fails because the diamond never holds managed collateral.
**Recommended Mitigation:** Before the self-swap in `Surplus::processSurplus`, withdraw the surplus from the strategy:

```solidity
if (collatInfo.isManaged > 0) {
    LibManager.release(collateral, address(this), collateralSurplus, collatInfo.managerData.config);
}
```

**Parallel:** Fixed in commit [2dfad62](https://github.com/parallel-protocol/parallel-parallelizer/commit/2dfad6252bf84c3b1d66607f8f9969a164bb26ff)

**Cyfrin:** Verified. Assets managed by an external manager are released before the swap when processing surplus

\clearpage
