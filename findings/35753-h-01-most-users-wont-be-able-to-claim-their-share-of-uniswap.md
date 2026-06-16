---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/dex
  - sector/lending
  - sector/nft
  - sector/stable
protocol: "[[Vultisig]]"
auditors:
  - "[[Ryonen]]"
report: "https://code4rena.com/reports/2024-06-vultisig"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[flashloan-callback-auth]]"
  - "[[integer-bounds]]"
---
# [H-01] Most users won't be able to claim their share of Uniswap fees

- id: 35753
- impact: HIGH
- protocol: [[Vultisig]]
- reporter: Ryonen (Code4rena)
- source: https://code4rena.com/reports/2024-06-vultisig

## Summary


The bug report discusses an issue with the Uniswap fee collection mechanism in a contract. When a user claims their share of the fees, the contract collects more fees than the user is due and sends the extra fees to a fee taker. This can result in subsequent claim operations to fail permanently, as there may not be enough fees left for the next user to claim. The report suggests a potential solution to only collect the fees corresponding to the user's specific liquidity position. The severity of this bug is considered high and should be addressed by the developers.

## Details


Users should be able to claim Uniswap fees for their current liquidity position regardless of their pending vestings, or cliff. But most users won't be able to claim those Uniswap fees.

It is also possible that they won't be able to claim their vesting if they accumulate sufficient unclaimed Uniswap fees.

### Vulnerability Details

The root issue is that the `claim()` function collects ALL the owed tokens at once, including the ones from the burnt liquidity, but also the fees corresponding to ALL positions:

```solidity
    (uint128 amountCollected0, uint128 amountCollected1) = pool.collect(
        address(this),
        TICK_LOWER,
        TICK_UPPER,
@>      type(uint128).max,
@>      type(uint128).max
    );
```

<https://github.com/code-423n4/2024-06-vultisig/blob/main/src/ILOPool.sol#L246-L247>

Then the platform fees are sent alongside the Uniswap fees from the users that still didn't claim `amountCollected - amount`:

```solidity
TransferHelper.safeTransfer(_cachedPoolKey.token0, feeTaker, amountCollected0-amount0);
TransferHelper.safeTransfer(_cachedPoolKey.token1, feeTaker, amountCollected1-amount1);
```

<https://github.com/code-423n4/2024-06-vultisig/blob/main/src/ILOPool.sol#L252-L260>

The next time a user calls `claim()`, `pool.collect()` will not contain any Uniswap fees as all of them have already been claimed and sent to the first claimer and the rest to the fee taker. If the platform fees are enough to cover the owed fees for the claiming user, the transaction might succeed (this may be possible if the burnt liquidity is enough).

As time passes, more fees will be accumulated, and when Uniswap fees `>` platform fees, the transaction will also revert even for unclaimed vestings with liquidity to burn. In addition, in most cases after the initial vesting, users won't be able to claim Uniswap fees, as no fees will be collected, and the contract doesn't hold those assets (they have been sent to the fee taker).

### Proof of Concept

This POC shows how after one user claims their share of the fees, there are no more fee tokens to collect for the next claims, and the transactions revert.

1. Add the import to the top of `test/ILOPool.t.sol`.
2. Add the test to the `ILOPoolTest` contract in `test/ILOPool.t.sol`.
3. Run `forge test --mt testClaimFeesRevert`.

```solidity
import '../lib/v3-core/contracts/interfaces/IUniswapV3Pool.sol';
```

```solidity
function testClaimFeesRevert() external {
    _launch();
    vm.warp(VEST_START_0 + 10);

    uint256 tokenId = IILOPool(iloPool).tokenOfOwnerByIndex(INVESTOR, 0);
    uint256 tokenId2 = IILOPool(iloPool).tokenOfOwnerByIndex(INVESTOR_2, 0);

    IUniswapV3Pool uniV3Pool = IUniswapV3Pool(projectId);

    // INVESTOR and INVESTOR_2 burn their liquidity and obtain their tokens

    vm.prank(INVESTOR);
    IILOPool(iloPool).claim(tokenId);

    vm.prank(INVESTOR_2);
    IILOPool(iloPool).claim(tokenId2);

    // Generate some fees via a flash loan
    uniV3Pool.flash(address(this), 1e8, 1e8, "");

    // INVESTOR claims their corresponding part of the fees
    // Only the first one to claim has better odds of claiming successfully
    vm.prank(INVESTOR);
    IILOPool(iloPool).claim(tokenId);

    // INVESTOR_2 can't claim their part of the fees as the transaction will revert
    // It reverts with ST (SafeTransfer) as it is trying to transfer tokens the contract doesn't have
    // The fees for INVESTOR_2 were already taken
    vm.prank(INVESTOR_2);
    vm.expectRevert(bytes("ST"));
    IILOPool(iloPool).claim(tokenId2);

    // Generate more fees
    uniV3Pool.flash(address(this), 1e6, 1e6, "");

    // Even if some new fees are available, they might not be enough to pay back the owed ones to INVESTOR_2
    vm.prank(INVESTOR_2);
    vm.expectRevert(bytes("ST"));
    IILOPool(iloPool).claim(tokenId2);
}

function uniswapV3FlashCallback(uint256, uint256, bytes memory) external {
    deal(USDC, address(this), IERC20(USDC).balanceOf(address(this)) * 2);
    deal(SALE_TOKEN, address(this), IERC20(SALE_TOKEN).balanceOf(address(this)) * 2);

    IERC20(USDC).transfer(projectId, IERC20(USDC).balanceOf(address(this)));
    IERC20(SALE_TOKEN).transfer(projectId, IERC20(SALE_TOKEN).balanceOf(address(this)));
}
```

### Recommended Mitigation Steps

Here's an suggestion on how this could be solved. The idea is to only `collect()` the tokens corresponding to the liquidity of the `tokenId` position. So that the next user can also claim their share.

```diff
    function claim(uint256 tokenId) external payable override isAuthorizedForToken(tokenId)
        returns (uint256 amount0, uint256 amount1)
    {
+       uint128 collect0;
+       uint128 collect1;

        uint128 liquidity2Claim = _claimableLiquidity(tokenId);
        IUniswapV3Pool pool = IUniswapV3Pool(_cachedUniV3PoolAddress);
        {
            IILOManager.Project memory _project = IILOManager(MANAGER).project(address(pool));
            uint128 positionLiquidity = position.liquidity;

            // get amount of token0 and token1 that pool will return for us
            (amount0, amount1) = pool.burn(TICK_LOWER, TICK_UPPER, liquidity2Claim);

+           collect0 = amount0;
+           collect1 = amount1;

            // get amount of token0 and token1 after deduct platform fee
            (amount0, amount1) = _deductFees(amount0, amount1, _project.platformFee);

            ...

            uint256 fees0 = FullMath.mulDiv(
                            feeGrowthInside0LastX128 - position.feeGrowthInside0LastX128,
                            positionLiquidity,
                            FixedPoint128.Q128
                        );
            
            uint256 fees1 = FullMath.mulDiv(
                                feeGrowthInside1LastX128 - position.feeGrowthInside1LastX128,
                                positionLiquidity,
                                FixedPoint128.Q128
                            );

+           collect0 += fees0;
+           collect1 += fees1;

            // amount of fees after deduct performance fee
            (fees0, fees1) = _deductFees(fees0, fees1, _project.performanceFee);

            ...
        }

        (uint128 amountCollected0, uint128 amountCollected1) = pool.collect(
            address(this),
            TICK_LOWER,
            TICK_UPPER,
-           type(uint128).max,
-           type(uint128).max
+           collect0,
+           collect1
        );
        
        ...
    }
```

### Assessed type

Uniswap

**[0xsomeone (judge) commented](https://github.com/code-423n4/2024-06-vultisig-findings/issues/43#issuecomment-2237661021):**
 > The Warden outlines an issue with the fee collection mechanism whenever a position is claimed that would result in the contract claiming more funds than the user is due and the fee taker acquiring this difference.
> 
> In turn, this will result in all consequent claim operations of other NFT IDs on the same tick range (i.e., the same pool) to fail potentially permanently due to being unable to capture the fee-related portion. I consider this to be a significant flaw and one that merits a high-risk severity rating.

**[Haupc (Vultisig) confirmed](https://github.com/code-423n4/2024-06-vultisig-findings/issues/43#event-13596542463)**

***
