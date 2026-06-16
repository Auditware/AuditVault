---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/bridge
  - sector/lending
  - platform/sherlock
protocol: "[[LEND]]"
auditors:
  - stonejiajia
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[liquidation-incentives]]"
  - "[[liquidation-underwater]]"
  - "[[logic/liquidation-logic]]"
  - "[[loss-of-funds/direct-drain]]"
  - "[[known-pattern]]"
  - "[[cross-chain-message]]"
  - "[[add-check]]"
  - "[[blast-radius/single-user]]"
---
# H-10: Malicious Liquidator Can Liquidate Without Providing Collateral

- id: 58379
- impact: HIGH
- protocol: LEND
- reporter: stonejiajia (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found in the current implementation of cross-chain liquidation. When a liquidation is requested on the destination chain, there is no transfer of the underlying token from the liquidator. This can potentially lead to an exploit where the liquidator receives the underlying tokens from the liquidatee on the source chain but the repayment fails on the destination chain. The root cause of this issue is that there is no transfer of the underlying tokens from the liquidator at the start of the liquidation process on the destination chain. The report includes a proof of concept and explains the impact of this bug, which can allow a malicious liquidator to liquidate without providing the necessary collateral. The report suggests implementing an escrow mechanism to mitigate this issue. 

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/636 

## Found by 
0x23r0, 0xc0ffEE, Kvar, MRXSNOWDEN, Phaethon, SarveshLimaye, Tychai0s, alphacipher, anchabadze, dmdg321, dystopia, future, ggg\_ttt\_hhh, hgrano, jokr, oxelmiguel, stonejiajia, t.aksoy

### Summary
In the current implementation of cross-chain liquidation, when a liquidation is requested on chainB (the destination chain), there is no transfer of the underlying token from the liquidator. If the seize operation succeeds on chainA (the source chain), the underlying tokens are transferred to the liquidator, and the repayment is executed on chainB. However, if the seize fails, the underlying tokens are transferred from the contract to the liquidator on chainB.

In this scenario, if the seize operation is successful but the liquidator has not approved the underlying token on chainB, the repayment may fail while the liquidator still successfully receives the underlying tokens from the liquidatee on chainA. This creates a potential exploit.

### Root Cause
The root cause of this issue is that, on chainB, there is no transfer of the underlying tokens from the liquidator at the start of the liquidation process.

### Internal pre-conditions
N/A

### External pre-conditions
N/A

### Attack Path
N/A

### PoC
https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L172-L192
```solidity
    function liquidateCrossChain(
        ...
    ) external {
        LendStorage.LiquidationParams memory params = LendStorage.LiquidationParams({
            ...
        });

        _validateAndPrepareLiquidation(params);
        _executeLiquidation(params);
    }
```
https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L197-L233
```solidity
    function _validateAndPrepareLiquidation(LendStorage.LiquidationParams memory params) private view {
        require(params.borrower != msg.sender, "Liquidator cannot be borrower");
        require(params.repayAmount > 0, "Repay amount cannot be zero");

        // Get the lToken for the borrowed asset on this chain
        params.borrowedlToken = lendStorage.underlyingTolToken(params.borrowedAsset);
        require(params.borrowedlToken != address(0), "Invalid borrowed asset");

        // Important: Use underlying token addresses consistently
        address borrowedUnderlying = lendStorage.lTokenToUnderlying(params.borrowedlToken);

        // Verify the borrow position exists and get details
        LendStorage.Borrow[] memory userCrossChainCollaterals =
            lendStorage.getCrossChainCollaterals(params.borrower, borrowedUnderlying);
        bool found = false;

        for (uint256 i = 0; i < userCrossChainCollaterals.length;) {
            if (userCrossChainCollaterals[i].srcEid == params.srcEid) {
                found = true;
                params.storedBorrowIndex = userCrossChainCollaterals[i].borrowIndex;
                params.borrowPrinciple = userCrossChainCollaterals[i].principle;
                break;
            }
            unchecked {
                ++i;
            }
        }
        require(found, "No matching borrow position");

        // Validate liquidation amount against close factor
        uint256 maxLiquidationAmount = lendStorage.getMaxLiquidationRepayAmount(
            params.borrower,
            params.borrowedlToken,
            false // cross-chain liquidation
        );
        require(params.repayAmount <= maxLiquidationAmount, "Exceeds max liquidation");
    }
```
https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L235-L243
```solidity
    function _executeLiquidation(LendStorage.LiquidationParams memory params) private {
        // First part: Validate and prepare liquidation parameters
        uint256 maxLiquidation = _prepareLiquidationValues(params);

        require(params.repayAmount <= maxLiquidation, "Exceeds max liquidation");

        // Secon part: Validate collateral and execute liquidation
        _executeLiquidationCore(params);
    }
```
https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L264-L285
```solidity
    function _executeLiquidationCore(LendStorage.LiquidationParams memory params) private {
        // Calculate seize tokens
        address borrowedlToken = lendStorage.underlyingTolToken(params.borrowedAsset);

        (uint256 amountSeizeError, uint256 seizeTokens) = LendtrollerInterfaceV2(lendtroller)
            .liquidateCalculateSeizeTokens(borrowedlToken, params.lTokenToSeize, params.repayAmount);

        require(amountSeizeError == 0, "Seize calculation failed");

        // Send message to Chain A to execute the seize
        _send(
            params.srcEid,
            seizeTokens,
            params.storedBorrowIndex,
            0,
            params.borrower,
            lendStorage.crossChainLTokenMap(params.lTokenToSeize, params.srcEid), // Convert to Chain A version before sending
            msg.sender,
            params.borrowedAsset,
            ContractType.CrossChainLiquidationExecute
        );
    }
```

### Impact
A malicious liquidator can liquidate without providing the necessary collateral resulting the liquidatee's debt is not deducted.

### Mitigation
Consider implementing an escrow mechanism for the collateral from the liquidator before initiating the liquidation process to ensure that the collateral is secured.
