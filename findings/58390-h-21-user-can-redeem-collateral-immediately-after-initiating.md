---
tags:
  - lang/solidity
  - sector/bridge
  - sector/lending
  - sector/uncollat-lending
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[LEND]]"
auditors:
  - owanemi
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[bridge-message-ordering]]"
  - "[[direct-drain]]"
  - "[[cross-chain-message]]"
---
# H-21: User can redeem collateral immediately after initiating the borrow, leading undercollateralization.

- id: 58390
- impact: HIGH
- protocol: LEND
- reporter: owanemi (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found by multiple users in the code of a lending platform. The issue occurs when a user initiates a cross-chain borrow and then immediately redeems their collateral, which can result in undercollateralization once the borrow is completed on the destination chain. The root cause of this issue is that there is no locking mechanism in place to restrict access to the collateral after it is added to storage in the borrowCrossChain() function. This means that the user can still interact with their collateral, even after initiating the cross-chain borrow. This can lead to the user being able to borrow on other chains without having enough collateral on the source chain, and potentially draining the pool. To mitigate this issue, the report suggests adding a flag in the code to lock the collateral when a cross-chain borrow is initiated. 

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/909 

## Found by 
0xhp9, 1337web3, Constant, Fade, Hueber, Kirkeelee, Leaningone, befree3x, chaos304, coin2own, future, hgrano, jokr, owanemi, t.aksoy, xiaoming90, zacwilliamson

### Summary

When a user initiates a cross-chain borrow, during a pending cross-chain borrow operation, the user redeems their collateral immediately after initiating the borrow,  which could result in undercollateralization once the borrow is completed on the destination chain.

### Root Cause

- function borrowCrossChain() in CrossChainRouter.sol : https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L113C5-L154 
- function redeem() in CoreRouter.sol: https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CoreRouter.sol#L100-L138

In CrossChainRouter.borrowCrossChain(), after adding collateral tracking on the source chain, it sends a cross-chain message. The collateral is added to storage via lendStorage.addUserSuppliedAsset, but no locking mechanism is applied to restrict access to it. After this function is called, the user can still interact with their collateral, like calling redeem() on the source chain.
```solidity
  function borrowCrossChain(uint256 _amount, address _borrowToken, uint32 _destEid) external payable {
        // validations

        // Then adding collateral tracking on source chain
        lendStorage.addUserSuppliedAsset(msg.sender, _lToken);

        if (!isMarketEntered(msg.sender, _lToken)) {
            enterMarkets(_lToken);
        }
        // get collateral
        // Get current collateral amount for the LayerZero message
        // This will be used on dest chain to check if sufficient
        (, uint256 collateral) =
            lendStorage.getHypotheticalAccountLiquidityCollateral(msg.sender,LToken(_lToken), 0, 0);

        // @audit: Send BorrowCrossChain message without setting any lock
        Send message to destination chain with verified sender
        _send(
            _destEid,
            _amount,
            0, 
            collateral,
            msg.sender,
            destLToken,
            address(0), 
            _borrowToken,
            ContractType.BorrowCrossChain
        );
    }
```
The CoreRouter.redeem function allows the user to redeem their supplied tokens if they have sufficient balance and liquidity
```solidity
  function redeem(uint256 _amount, address payable _lToken) external returns (uint256) {
        //Checks
        require(lendStorage.totalInvestment(msg.sender, _lToken) >= _amount, "Insufficient balance");

        // Check liquidity
        (uint256 borrowed, uint256 collateral) =
            lendStorage.getHypotheticalAccountLiquidityCollateral(msg.sender, LToken(_lToken), _amount, 0);
        require(collateral >= borrowed, "Insufficient liquidity");

        // proceeds to redeem
    }
```
Issue arises: The liquidity check in lendStorage.getHypotheticalAccountLiquidityCollateral only considers existing borrows. It might not account for the pending cross-chain borrow (the new borrow has not been recorded yet, pending the message to the destination chain).
Before the LZ message is finalized, when redeeming, the user still has sufficient liquidity to redeem part of their collateral, so the redemption still passes.

### Internal Pre-conditions

N/A

### External Pre-conditions

N/A

### Attack Path

1. User supplies collateral on Chain A in contract CoreRouter.sol and calls borrowCrossChain() in CrossChainRouter.sol to borrow on Chain B - sending LZ message.
2. The user calls redeem() immediately on Chain A in contract CoreRouter.sol to redeem part of their collateral.
2. The liquidity check in redeem() passes because the pending borrow is not yet reflected in the borrow balance.
3. LZ message finalized on Chain B, the position on Chain A becomes undercollateralized - The user can borrow without enough collateral.
4. The user can repeat this process to drain the pool.

### Impact

Users can borrow on other chains without having enough collateral on the source chain. The user can repeat this process to drain the pool.

### PoC

N/A

### Mitigation

Add a flag in lendStorage to lock collateral when a cross-chain borrow is initiated.
