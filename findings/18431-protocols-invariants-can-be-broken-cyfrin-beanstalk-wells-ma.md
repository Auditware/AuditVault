---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - sector/dex
  - sector/lending
protocol: "[[Beanstalk]]"
auditors:
  - "[[Hans]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2023-06-16-Beanstalk wells.md"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[integer-bounds]]"
  - "[[timestamp-dependence]]"
---
# Protocol's invariants can be broken

- id: 18431
- impact: HIGH
- protocol: [[Beanstalk]] Wells
- reporter: Hans (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2023-06-16-Beanstalk wells.md

## Summary


A bug was reported in the protocol that provides a generalized framework for constant-function AMM liquidity pools. The bug was identified when the invariant `totalSupply() == calcLpTokenSupply(reserves)` was broken with valid transactions in the current implementation. This bug can lead to protocol insolvency as valid liquidity removal might revert.

In order to help verify the invariant, a `checkInvariant` function was added to the majority of tests including `swapFrom`, `swapTo`, `removeLiquidity`, `removeLiquidityImbalanced`, `removeLiquidityOneToken`, and `addLiquidity`. The `checkInvariant` function reverts if the invariant does not hold. This change was added in commit [876da9a](https://github.com/BeanstalkFarms/Basin/pull/84/commits/876da9a8f0df4118a701299397b36065c8a92530).

The bug was tested and it was found that the invariant `totalSupply() == calcLpTokenSupply(reserves)` was indeed broken with valid transactions in the current implementation. This bug can lead to protocol insolvency as valid liquidity removal might revert. The bug was acknowledged and the changes made to mitigate the issue were validated.

## Details

**Description:** The protocol intends to provide a generalized framework for constant-function AMM liquidity pools.
We have identified some invariants that should hold at any given time. One of these invariants is `totalSupply() == calcLpTokenSupply(reserves)`, and we can interpret this as the pool's total LP supply should match the calculation of LP from the current `reserves` state values.

This invariant can be broken with valid transactions in the current implementation, leading to several problems. For example, valid liquidity removal might revert, as shown in the PoC test below.

**Impact:** The impact is HIGH because this discrepancy will lead to protocol insolvency (revert on valid transactions).

**Proof of Concept:**
```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import {IERC20} from "test/TestHelper.sol";
import {IWellFunction} from "src/functions/ConstantProduct2.sol";
import {LiquidityHelper} from "test/LiquidityHelper.sol";
import "forge-std/Test.sol";
import {MockToken} from "mocks/tokens/MockToken.sol";

contract GetRemoveLiquidityOneTokenOutArithmeticFail is LiquidityHelper {
    function setUp() public {
        setupWell(2);
    }

    address internal constant ADDRESS_0 = 0x0000000000000000000000000000000000001908;
    address internal constant ADDRESS_1 = 0xffffFFFfFFffffffffffffffFfFFFfffFFFfFFfE;
    address internal constant ADDRESS_2 = 0x0000000000000000000000000000000000000001;
    address internal constant ADDRESS_3 = 0x00000011EF7b76c418fC426B8707dC60c8404f4a;

    // Failing unit tests from invariant results
    function test_getRemoveLiquidityOneTokenOutArithmeticFail() public {
        showStatus();

        address msgSender = ADDRESS_0;
        _addLiquidity(msgSender, 77_470_052_844_788_801_811_950_156_551, 17_435);
        _removeLiquidityOneTokenOut(msgSender, 5267, 0);
        showStatus();

        msgSender = ADDRESS_1;
        _addLiquidity(msgSender, 79_228_162_514_264_337_593_543_950_335, 0);
        _removeLiquidity(msgSender, 2_025_932_259_663_320_959_193_637_370_794);
        showStatus();

        msgSender = ADDRESS_2;
        _addLiquidity(msgSender, 69_069_904_726_099_247_337_000_262_288, 3);
        showStatus();

        msgSender = ADDRESS_1;
        _transferLp(msgSender, ADDRESS_3, 1_690_276_116_468_540_706_301_324_542_928);
        emit log_named_uint("LP Balance (1)", well.balanceOf(ADDRESS_1));
        emit log_named_uint("LP Balance (3)", well.balanceOf(ADDRESS_3));
        showStatus();

        msgSender = ADDRESS_0;
        emit log_string("removeLiquidity");
        _removeLiquidity(msgSender, 122_797_404_990_851_137_316_041_024_188);
        showStatus();

        msgSender = ADDRESS_3;
        emit log_string("removeLiquidityOneToken");
        _removeLiquidityOneTokenOut(msgSender, 1_690_276_116_468_540_706_301_000_000_000, 1);
        emit log_named_uint("LP Balance (3)", well.balanceOf(ADDRESS_3));
        showStatus();
        // The next line fails with an under/overflow error
        //
        // CONTEXT: In the previous operation, ADDRESS_3 removes the vast majority of his LP position
        // for token[1]. At this point the token balances of the well are as follows:
        //  * token[0].balanceOf(well) = 198508852592404865716451834587
        //  * token[1].balanceOf(well) =          625986797429655048967
        // The next operation ADDRESS_3 calls is removeLiquidityOneTokenOut() for token[0] using his
        // remaining LP position. The amount of LP tokens he has left is 3. Line 526 reverts with underflow,
        // despite all operations being completely valid. How severe is this?
        _removeLiquidityOneTokenOut(msgSender, 324_542_928, 0);
        showStatus();
    }

    function test_audit() public {
        address msgSender = address(this);
        _removeLiquidityOneTokenOut(msgSender, 1e16, 0);
        _removeLiquidity(msgSender, well.balanceOf(msgSender) - 1);
        _removeLiquidity(msgSender, 1);
    }

    function test_totalSupplyInvariantSwapFail() public {
        address msgSender = 0x576024f76bd1640d7399a5B5F61530f997Ae06f2;
        changePrank(msgSender);
        IERC20[] memory mockTokens = well.tokens();
        uint tokenInIndex = 0;
        uint tokenOutIndex = 1;
        uint tokenInAmount = 52_900_000_000_000_000_000;
        MockToken(address(mockTokens[tokenInIndex])).mint(msgSender, tokenInAmount);
        mockTokens[tokenInIndex].approve(address(well), tokenInAmount);
        uint minAmountOut = well.getSwapOut(mockTokens[tokenInIndex], mockTokens[tokenOutIndex], tokenInAmount);
        well.swapFrom(
            mockTokens[tokenInIndex], mockTokens[tokenOutIndex], tokenInAmount, minAmountOut, msgSender, block.timestamp
        );
        // check the total supply
        uint functionCalc =
            IWellFunction(well.wellFunction().target).calcLpTokenSupply(well.getReserves(), well.wellFunction().data);
        // assertEq(well.totalSupply(), functionCalc);
        showStatus();
    }

    function _transferLp(address msgSender, address to, uint amount) private {
        changePrank(msgSender);
        well.transfer(to, amount);
    }

    function _removeLiquidityOneTokenOut(
        address msgSender,
        uint lpAmountIn,
        uint tokenIndex
    ) private returns (uint tokenAmountOut) {
        changePrank(msgSender);
        IERC20[] memory mockTokens = well.tokens();
        uint minTokenAmountOut = well.getRemoveLiquidityOneTokenOut(lpAmountIn, mockTokens[tokenIndex]);
        tokenAmountOut = well.removeLiquidityOneToken(
            lpAmountIn, mockTokens[tokenIndex], minTokenAmountOut, msgSender, block.timestamp
        );
    }

    function _removeLiquidity(address msgSender, uint lpAmountIn) private returns (uint[] memory tokenAmountsOut) {
        changePrank(msgSender);
        uint[] memory minTokenAmountsOut = well.getRemoveLiquidityOut(lpAmountIn);
        tokenAmountsOut = well.removeLiquidity(lpAmountIn, minTokenAmountsOut, msgSender, block.timestamp);
    }

    function _addLiquidity(
        address msgSender,
        uint token0Amount,
        uint token1Amount
    ) private returns (uint lpAmountOut) {
        changePrank(msgSender);
        uint[] memory tokenAmountsIn = _mintToSender(msgSender, token0Amount, token1Amount);
        uint minLpAmountOut = well.getAddLiquidityOut(tokenAmountsIn);

        lpAmountOut = well.addLiquidity(tokenAmountsIn, minLpAmountOut, msgSender, block.timestamp);
    }

    function _mintToSender(
        address msgSender,
        uint token0Amount,
        uint token1Amount
    ) private returns (uint[] memory tokenAmountsIn) {
        changePrank(msgSender);
        IERC20[] memory mockTokens = well.tokens();
        MockToken(address(mockTokens[0])).mint(msgSender, token0Amount);
        MockToken(address(mockTokens[1])).mint(msgSender, token1Amount);

        tokenAmountsIn = new uint[](2);
        tokenAmountsIn[0] = token0Amount;
        tokenAmountsIn[1] = token1Amount;

        mockTokens[0].approve(address(well), token0Amount);
        mockTokens[1].approve(address(well), token1Amount);
    }

    function showStatus() public {
        IERC20[] memory mockTokens = well.tokens();
        uint[] memory reserves = well.getReserves();

        uint calcedSupply = IWellFunction(well.wellFunction().target).calcLpTokenSupply(well.getReserves(), well.wellFunction().data);
        emit log_named_uint("Total  LP Supply", well.totalSupply());
        emit log_named_uint("Calced LP Supply", calcedSupply);
    }
}
```

The test results are shown below.

```
Running 1 test for test/invariant/RemoveOneLiquidity.t.sol:GetRemoveLiquidityOneTokenOutArithmeticFail
[FAIL. Reason: Arithmetic over/underflow] test_getRemoveLiquidityOneTokenOutArithmeticFail() (gas: 1029158)
Logs:
  Total  LP Supply: 1000000000000000000000000000
  Calced LP Supply: 1000000000000000000000000000
  Total  LP Supply: 8801707439172742871919189288925
  Calced LP Supply: 8801707439172742871919189288909
  Total  LP Supply: 10491983555641283578220513831854
  Calced LP Supply: 10491983555641283578222260432821
  Total  LP Supply: 12960446346289240477619201802843
  Calced LP Supply: 12960446346289240477619201802843
  LP Balance (1): 1
  LP Balance (3): 1690276116468540706301324542928
  Total  LP Supply: 12960446346289240477619201802843
  Calced LP Supply: 12960446346289240477619201802843
  removeLiquidity
  Total  LP Supply: 12837648941298389340303160778655
  Calced LP Supply: 12837648941298389340310429464350
  removeLiquidityOneToken
  LP Balance (3): 324542928
  Total  LP Supply: 11147372824829848634002160778655
  Calced LP Supply: 11147372824829848633998681214926

Test result: FAILED. 0 passed; 1 failed; finished in 3.70ms

Failing tests:
Encountered 1 failing test in test/invariant/RemoveOneLiquidity.t.sol:GetRemoveLiquidityOneTokenOutArithmeticFail
[FAIL. Reason: Arithmetic over/underflow] test_getRemoveLiquidityOneTokenOutArithmeticFail() (gas: 1029158)

Encountered a total of 1 failing tests, 0 tests succeeded
```

Looking into this, the `ConstantProduct2`, we see three problems:

1. No rounding direction is specified in the functions `calcReserve` and `calcLpTokenSupply`. These Well functions are used in critical places where the Well's state (reserve, LP) will change. Mathematical discrepancies should be rounded in favor of the protocol; however, no rounding direction is specified in the current implementation, which allows unfavorable transactions.

   For example, in [Well::getSwapOut](https://github.com/BeanstalkFarms/Wells/blob/e5441fc78f0fd4b77a898812d0fd22cb43a0af55/src/Well.sol#L231) and [Well::\_getRemoveLiquidityOneTokenOut](https://github.com/BeanstalkFarms/Wells/blob/e5441fc78f0fd4b77a898812d0fd22cb43a0af55/src/Well.sol#L519), the calculation of the output token amount is rounded up (downside rounded value is subtracted) while it should be rounded down. These unfavorable transactions will compound, affecting the health of the protocol.

2. This invariant is not guaranteed after `Well::removeLiquidity`. The current implementation calculates the token output amount from the ratio of the `lpAmountIn` to the `totalSupply`, assuming that `calcLpTokenSupply([r0 * delta, r1 * delta]) = totalSupply() * delta` where `delta` denotes the ratio `1 - lpAmountIn/lpTokenSupply`. This is also mentioned separately in another issue, but we want to note again that ensuring the invariant holds after any transaction is essential. Handling the last token separately is recommended, similar to `Well::removeLiquidityOneToken`.

3. It is practically almost impossible to make the invariant `totalSupply() == calcLpTokenSupply(reserves)` hold strictly. For this example, we will focus on the `Well::removeLiquidityOneToken` function because it is the simplest and most reasonable way to withdraw liquidity, and we will assume `ConstantProduct2` is the Well function. The mechanism is intuitive - the protocol burns the requested `lpAmountIn` and calculates the new reserve value for the requested `tokenOut` (`tokens[0]`) using the decreased LP token supply.

Let us assume `totalSupply() == calcLpTokenSupply(reserves) == T0` before the transaction. After the transaction, the total supply will be `T0 - lpAmountIn`. The output token amount is calculated as `getRemoveLiquidityOneTokenOut(lpAmountIn, 0, reserves) = reserves[0] - calcReserve(reserves, 0, T0 - lpAmountIn)`. After the transaction, the calculated total supply will be `calcLpTokenSupply([calcReserve(reserves, 0, T0 - lpAmountIn), reserves[1]])`. For the invariant to hold after the transaction, the functions `ConstantProduct2::calcLpTokenSupply` and `ConstantProduct2::calcReserve` should exhibit an accurate inverse relationship (`calcLpTokenSupply(calcReserves(reserves, LP)) == LP`). In practice, all calculations come with rounding to some extent, and this relationship is not possible so long as the two functions are implemented separately.

**Recommended Mitigation:**
1. Add a rounding direction flag parameter to the `IWellFunction::calcReserve` and `IWellFunction::calcLpTokenSupply` functions. At all invocations of these functions, apply the correct rounding direction such that the transaction is processed favorably to the protocol.

2. Handle the last token separately in `Well::removeLiquidity`. In `Well::getRemoveLiquidityOut`, calculate the output token amount for the first `n-1` tokens as usual but use an approach similar to `Well::getRemoveLiquidityOneTokenOut` for the last token. This will help to have the invariant hold. We understand that another finding suggested adding a dedicated function to calculate the output token amount at the `IWellFunction` level. If the issue is mitigated that way, consider adding another check to ensure the invariant holds.

3. As we explained above, it is practically almost impossible to make the invariant `totalSupply() == calcLpTokenSupply(reserves)` hold strictly. We recommend a slightly looser invariant `totalSupply() >= calcLpTokenSupply(reserves)`, which can be interpreted as "the Well function underestimates the LP supply". Otherwise, we suggest adding another variable, `totalCalcSupply`, which will always reflect the calculated LP supply from the current `reserves`. This new variable can be used with `totalSupply()` together while deciding the output token amount. For example, in `Well::_getRemoveLiquidityOneTokenOut`, we can calculate `lpAmountInCalc = lpAmountIn * totalCalcSupply / totalSupply()` and use that in the function `_calcReserve`. This will be helpful because the discrepancy is reflected in the calculation.

Please note that `well.getReserves()[i] == wellFunction.calcReserve(i)` is also supposed to hold.
Because of the rounding in the calculation, we understand this invariant might be too strict and similar mitigation is recommended.
Below is a test to show that the above _invariant_ can be broken.
```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import {IERC20} from "test/TestHelper.sol";
import {IWellFunction} from "src/functions/ConstantProduct2.sol";
import {LiquidityHelper} from "test/LiquidityHelper.sol";
import "forge-std/Test.sol";
import {MockToken} from "mocks/tokens/MockToken.sol";

contract ReservesMathFunctionCalcReservesFail is LiquidityHelper {
    function setUp() public {
        setupWell(2);
    }

    function testReservesMismatchFail() public {
        // perform initial check
        uint[] memory reserves = well.getReserves();

        uint reserve0 =
            IWellFunction(wellFunction.target).calcReserve(reserves, 0, well.totalSupply(), wellFunction.data);
        uint reserve1 =
            IWellFunction(wellFunction.target).calcReserve(reserves, 1, well.totalSupply(), wellFunction.data);

        assertEq(reserves[0], reserve0);
        assertEq(reserves[1], reserve1);

        // swap
        address msgSender = address(2);
        changePrank(msgSender);
        uint tokenInIndex = 0;
        uint tokenOutIndex = 1;
        uint amountIn = 59_534_739_918_926_377_591_512_171_513;

        IERC20[] memory mockTokens = well.tokens();
        MockToken(address(mockTokens[tokenInIndex])).mint(msgSender, amountIn);
        // approve the well
        mockTokens[tokenInIndex].approve(address(well), amountIn);
        uint minAmountOut = well.getSwapOut(mockTokens[tokenInIndex], mockTokens[tokenOutIndex], amountIn);
        well.swapFrom(
            mockTokens[tokenInIndex], mockTokens[tokenOutIndex], amountIn, minAmountOut, msgSender, block.timestamp
        );

        // perform check again
        reserves = well.getReserves();

        reserve0 = IWellFunction(wellFunction.target).calcReserve(reserves, 0, well.totalSupply(), wellFunction.data);
        reserve1 = IWellFunction(wellFunction.target).calcReserve(reserves, 1, well.totalSupply(), wellFunction.data);

        assertEq(reserves[0], reserve0);
        assertEq(reserves[1], reserve1);
    }
}

```

**Beanstalk:**
1. `ConstantProduct2::_calcReserve` now rounds up instead of to the nearest number. `ConstantProduct2::_calcLpTokenSupply` still rounds down. The rationale is below. Fixed in commit [876da9a](https://github.com/BeanstalkFarms/Basin/pull/84/commits/876da9a8f0df4118a701299397b36065c8a92530).

    No rounding mode is necessary because `calcReserve` and `calcLpTokenSupply` should round the same direction in all cases:

    1. All instances of `calcReserve` should round up:
        * All output `amountIn` values are calculated by subtracting `_calcReserve(...) - reserveBefore`. The Well wants to overestimate `amountIn` to guarantee more tokens on the margin are sent to the Well. Thus, `_calcReserve` should round up. (See `swapTo`)
        * All output `amountOut` values are calculated by subtracting `reserveBefore - _calcReserve(...)`. The Well wants to underestimate `amountOut` so that less tokens are removed from the Well on the margin. Thus, `_calcReserve` should round up again. (See `swapFrom`, `shift`, `removeLiquidityOneToken`)
    2. All instances of `calcLpTokenSupply` should round down:
        * All `lpAmountIn` values are calculated by subtracting `totalSupply() - _calcLpTokenSupply(...)`. `lpAmountIn` should be overestimated and thus `_calcLpTokenSupply` should round down. (See `removeLiquidityImbalanced`)
        * All `lpAmountOut` values are calculated by subtracting `_calcLpTokenSupply(...) - totalSupply()`.  `lpAmountOut` values should be underestimated and thus `_calcLpTokenSupply` should round down.

    Given no rounding mode is necessary–It is in fact up to the corresponding Well Function to decide how to round. The above rounding methods are only a suggestion and each Well Function is free to round however it wants.

2. The remediation for [H-03] added a `calcLPTokenUnderlying` function to `IWellFunction` to determine how much of each amount to remove when removing LP tokens. As a consequence, the Well Function itself now determines how many tokens to remove when LP is removed instead of the Well. Thus, the Well Function is free to define how to handle the `removeLiquidity` calculation and can ensure that it doesn't break its own defined invariant.

    Documentation has been added [here](https://github.com/BeanstalkFarms/Basin/commit/39ea396b0e78762cbeeee4e3fe8e343c2e114259) to indicate that a valid implementation of `calcLPTokenUnderlying` should never break a Well's invariant.

    Also, updated the `test_removeLiquidity_fuzz` test to include a check to test that the invariant holds after the `removeLiquidity` call [here](https://github.com/BeanstalkFarms/Basin/commit/f5d14eba5c9c7a02ed15eba675ed869916ea469d).

    Given that users should verify that a Well has a valid Well Function before interacting with a Well and protocols using Wells should keep a list of verified Well Functions, adding a check would just serve as an extra precaution in the case that an invalid Well Function is verified.,

    Adding the following check to `removeLiquidity`:

    ```solidity
    require(lpTokenSupply - lpAmountIn <= _calcLpTokenSupply(wellFunction(), reserves), "Well Function Invalid");
    ```

    increases the gas cost by 3,940. Given that the check only serves as an extra precaution, it doesn't seem like it is worth the extra gas cost to add. Therefore, the check has not been added.

3. The invariant that the Well is maintaining is `_calcLpTokenSupply(...) >= totalSupply()`. In order words, the Well issues fewer Well LP Tokens at the margin. This is to ensure that Well LP Tokens at least maintain their underlying value and don’t get diluted.

    In order to help verify this, a `checkInvariant` function has been added to `TestHelper` which reverts if the above invariant does not hold. The `checkInvariant` function has been added to the majority of tests including `swapFrom`, `swapTo`, `removeLiquidity`, `removeLiquidityImbalanced`, `removeLiquidityOneToken`, and `addLiquidity`. Added in commit [876da9a](https://github.com/BeanstalkFarms/Basin/pull/84/commits/876da9a8f0df4118a701299397b36065c8a92530).

**Cyfrin:** Acknowledged and validated changes mitigate the original issue.
