---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/dex
  - sector/streaming
  - sector/staking-pool
  - platform/sherlock
protocol: "[[Superfluid Locker System]]"
auditors:
  - newspacexyz
report: "https://github.com/sherlock-audit/2025-06-superfluid-locker-system-judging"
genome:
  - "[[access-roles]]"
  - "[[access-control/broken-logic]]"
  - "[[loss-of-funds/fee-theft]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-check]]"
  - "[[precondition/always]]"
  - "[[blast-radius/protocol-wide]]"
---
# H-2: Pumponomics can be skipped when using FluidLocker::provideLiquidity

- id: 58282
- impact: HIGH
- protocol: Superfluid Locker System
- reporter: newspacexyz (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found in the Superfluid Locker System, a smart contract on the Ethereum blockchain. The issue was discovered by a group of users and reported on GitHub. The bug allows locker owners to bypass a key mechanism, known as "Pumponomics," which is designed to create buying pressure and support the economic model of Superfluid. This can result in the loss of potential fees and weaken the protocol. The root cause of the bug is identified as a function within the contract that only pumps a specific amount of Ethereum, while all available funds are used to create a position. This allows locker owners to manually send funds to the contract, effectively skipping Pumponomics. The impact of this bug is discussed, along with a proof of concept and potential mitigation strategies. The Superfluid team has since fixed the issue in their code.

## Details

Source: https://github.com/sherlock-audit/2025-06-superfluid-locker-system-judging/issues/210 

## Found by 
0x73696d616f, 0xb0k0, 0xbakeng, 0xloscar01, 37H3RN17Y2, SamuelTroyDomi, illoy\_sci, katz, nagato, newspacexyz

### Summary

Pumponomics can be effectively skipped since the eth amount used to create a position on uniswap could be different than the called amount. It uses all available balance inside the contract. This causes the intended buy-pressure mechanism to be skipped, and damages Superfluid's economic model.

### Root Cause

Inside [FluidLocker::provideLiquidity](https://github.com/sherlock-audit/2025-06-superfluid-locker-system/blob/d8beaeed47f766659a1600a87372a7905109aa3c/fluid/packages/contracts/src/FluidLocker.sol#L423-L429) function, only the eth sent in this call are pumped. However, all available wrapped eth are used to create a position. This allows locker owners to send eth manually to the locker, not when they are calling the provideLiquidity function, effectively skipping Pumponomics.

### Internal Pre-conditions

None

### External Pre-conditions

None

### Attack Path

1. Locker owner transfers certain amount of wrapped ethers to the locker directly by calling WETH9.transfer, they will be used as the paired asset for provideLiquidity function.
2. Call provideLiquidity function with a dust amount of eth, and a normal amount of supAmount to utilize the wrapped ether we sent in step 1.
Now a position is created without Pumponomics.

### Impact

Weaken the intended structural buy-pressure; causes protocol to lose potential fees earned from swaps and liquidity.

### PoC

Due to the difficulty of observing the effect of the pump function (1% difference), we directly modify the FluidLocker contract for visibility by creating a new field
```uint256 public ethPumped;``` 
and place it after all other fields that already exist.
To use it, we insert this line into the beginning of the [_pump](https://github.com/sherlock-audit/2025-06-superfluid-locker-system/blob/d8beaeed47f766659a1600a87372a7905109aa3c/fluid/packages/contracts/src/FluidLocker.sol#L639) function
```ethPumped += ethAmount;```
These modification should not change the behaviour of the contract.

Now, paste the following test into FluidLockerTest contract inside FluidLocker.t.sol
If needed, please import `import { IWETH9 } from "../src/token/IWETH9.sol";`
```solidity
    function testSkipPumponomics()
    external
    virtual
    {
        uint fundingAmount = 100e18;
        // Set up Alice's Locker to be functional
        // i. e. not revert due to "lack of funds", "no LP pool units", "no staker pool units", etc.
        _helperFundLocker(address(aliceLocker), fundingAmount);
        _helperLockerStake(address(bobLocker));
        _helperLockerProvideLiquidity(address(carolLocker));

        //Alice transfer the eth into locker via a plain call
        //Then call provideLiquidity with dust amount of eth
        //Therefore the pump function only pumps the dust eth amount, but the position is created with all eth in locker
        uint ethAmount = fundingAmount / (2 * 9900);
        address weth = _nonfungiblePositionManager.WETH9();
        vm.startPrank(ALICE);
        IWETH9(weth).deposit{ value: ethAmount }();
        IWETH9(weth).transfer(address(aliceLocker), ethAmount);
        aliceLocker.provideLiquidity{ value: 100 }(fundingAmount);
        vm.stopPrank();

        // Only a dust amount of eth has been pumped
        assertEq(FluidLocker(payable(address(aliceLocker))).ethPumped(), 1);
        // However, a position is opened with basically all the eth in the locker
        assertGt(FluidLocker(payable(address(aliceLocker))).activePositionCount(), 0);
        assertApproxEqAbs(0,
            IWETH9(weth).balanceOf(address(aliceLocker)),
            fundingAmount * 5 / 100 // 5% tolerance
        );
    }
```

### Mitigation

_No response_

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/superfluid-finance/fluid/pull/27
