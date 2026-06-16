---
tags:
  - lang/solidity
  - sector/bridge
  - sector/lending
  - sector/stable
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[LEND]]"
auditors:
  - rudhra1749
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[liquidation-underwater]]"
  - "[[liquidation-logic]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[redesign-logic]]"
---
# H-14: Incorrect srcToken Used When Cross-Chain Liquidation

- id: 58383
- impact: HIGH
- protocol: LEND
- reporter: rudhra1749 (Sherlock)
- source: N/A

## Summary


This bug report describes an issue with the cross-chain borrow and liquidation flow in a lending protocol. The bug occurs when the underlying token and lToken of different chains are used incorrectly, leading to potential failures in finding the correct borrow position and causing liquidations to fail. This could result in losses for both users and the protocol. To mitigate this issue, the incorrect use of tokens needs to be fixed in the code.

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/720 

## Found by 
aman, future, rudhra1749

### Summary
The cross-chain borrow flow is as follow:
1. On Chain A (source chain), calculate the collateral value and send it.
2. On Chain B (destination chain), borrow the asset and register it to `crossChainCollateral`.
3. On Chain A, register the debt to `crossChainBorrow`.
During this process, the underlying token of the source chain and the lToken of the destination chain are used for `srcToken` and `dstlToken` of `crossChainCollateral` and `crossChainBorrow`. 

The cross-chain liquidation flow is as follow:
1. Initiation on Chain B.
2. Seizure on Chain A (the source chain).
3. Repayment on Chain B (the destination chain), or handle failure.
4. Matching(DestRepay) on Chain A.

### Root Cause
In Cross-Chain Liquidation Flow Step 3, during the identification of `crossChainCollaterals`, the `srcToken` field incorrectly uses the destination chain's borrowed token instead of the source chain's borrowed token.

### Internal pre-conditions
N/A

### External pre-conditions
N/A

### Attack Path
N/A

### PoC
https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L804-L821
```solidity
    function _send(
        uint32 _dstEid,
        uint256 _amount,
        uint256 _borrowIndex,
        uint256 _collateral,
        address _sender,
        address _destlToken,
        address _liquidator,
        address _srcToken,
        ContractType ctype
    ) ...
```

We can confirm that `crossChainCollaterals.srcToken` represents the underlying token on the source chain, while `crossChainCollaterals.borrowedlToken` corresponds to the lToken on the destination chain.

Borrow Step 1, on Chain A:
https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L151
```solidity
    function borrowCrossChain(uint256 _amount, address _borrowToken, uint32 _destEid) external payable {
        ...
        address destLToken = lendStorage.underlyingToDestlToken(_borrowToken, _destEid);
        ...
        _send(
            _destEid,
            _amount,
            0, // Initial borrowIndex, will be set on dest chain
            collateral,
            msg.sender,
            destLToken,
            address(0), // liquidator
151:        _borrowToken,
            ContractType.BorrowCrossChain
        );
    }
```
The _borrowToken is underlying token of chainA.

Borrow Step 2, on Chain B:
https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L650
```solidity
    function _handleBorrowCrossChainRequest(LZPayload memory payload, uint32 srcEid) private {
        ...{
            lendStorage.addCrossChainCollateral(
                payload.sender,
                destUnderlying,
                LendStorage.Borrow({
                    srcEid: srcEid,
                    destEid: currentEid,
                    principle: payload.amount,
                    borrowIndex: currentBorrowIndex,
                    borrowedlToken: payload.destlToken,
650:                srcToken: payload.srcToken
                })
            );
        }...
    }
```
The payload.srcToken(srcToken of CrossChainCollateral) is underlying token of chainA.

Liquidation Step 1, on Chain B:
https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L282
```solidity
    function _executeLiquidationCore(LendStorage.LiquidationParams memory params) private {
        // Calculate seize tokens
        address borrowedlToken = lendStorage.underlyingTolToken(params.borrowedAsset);
        ...
        _send(
            params.srcEid,
            seizeTokens,
            params.storedBorrowIndex,
            0,
            params.borrower,
            lendStorage.crossChainLTokenMap(params.lTokenToSeize, params.srcEid), // Convert to Chain A version before sending
            msg.sender,
282:        params.borrowedAsset,
            ContractType.CrossChainLiquidationExecute
        );
    }
```
Here, `params.borrowedAsset` is the underlying borrowed token on Chain B.

Liquidation Step 2, on Chain A:
https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L363
```solidity
    function _handleLiquidationExecute(LZPayload memory payload, uint32 srcEid) private {
        ...
        _send(
            srcEid,
            payload.amount,
            0,
            0,
            payload.sender,
            payload.destlToken,
            payload.liquidator,
363:        payload.srcToken,
            ContractType.LiquidationSuccess
        );
    }
```
In this step, the payload.srcToken(above the `borrowedAsset`) is sent again to Chain B.

Liquidation Step 3, on Chain B:
https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L453
```solidity
    function _handleLiquidationSuccess(LZPayload memory payload) private {
        // Find the borrow position on Chain B to get the correct srcEid
        address underlying = lendStorage.lTokenToUnderlying(payload.destlToken);

        // Find the specific collateral record
        (bool found, uint256 index) = lendStorage.findCrossChainCollateral(
            payload.sender,
            underlying,
            currentEid, // srcEid is current chain
            0, // We don't know destEid yet, but we can match on other fields
453:        payload.destlToken,
454:        payload.srcToken
        );

        require(found, "Borrow position not found");

        LendStorage.Borrow[] memory userCollaterals = lendStorage.getCrossChainCollaterals(payload.sender, underlying);
        uint32 srcEid = uint32(userCollaterals[index].srcEid);

        // Now that we know the borrow position and srcEid, we can repay the borrow using the escrowed tokens
        // repayCrossChainBorrowInternal will handle updating state and distributing rewards.
        repayCrossChainBorrowInternal(
            payload.sender, // The borrower
            payload.liquidator, // The liquidator (repayer)
            payload.amount, // Amount to repay
            payload.destlToken, // lToken representing the borrowed asset on this chain
            srcEid // The chain where the collateral (and borrow reference) is tracked
        );
    }
```
Here, `payload.srcToken`, which is the destination chain(chainB)'s borrowed token, is incorrectly used as the source chain's borrowed token.
Even if the asset is the same (e.g., USDC), the address on each chain could be different.
This could lead to failures in finding the borrow position and potentially cause the liquidation to revert.

Even if the seize operation is successful on Chain A, the repayment could fail on Chain B. 
This means that while the liquidatee's collateral is seized, the liquidatee's debt remains unchanged.
This is loss of liquidatee and the protocol could also suffer losses due to under-water positions.

### Impact
1. Loss of users' funds.
2. Protocol's financial loss.

### Mitigation
