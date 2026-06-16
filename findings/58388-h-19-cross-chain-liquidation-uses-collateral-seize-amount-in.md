---
tags:
  - lang/solidity
  - sector/bridge
  - sector/lending
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[LEND]]"
auditors:
  - oxelmiguel
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[liquidation-incentives]]"
  - "[[liquidation-logic]]"
  - "[[cross-chain-message]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[redesign-logic]]"
---
# H-19: Cross-Chain liquidation uses collateral seize amount instead of repayment amount for debt reduction

- id: 58388
- impact: HIGH
- protocol: LEND
- reporter: oxelmiguel (Sherlock)
- source: N/A

## Summary


Title: Cross-Chain Liquidation Bug in Lend Audit Contest Judging

Summary: A bug in the cross-chain liquidation feature of Lend Audit Contest Judging causes the wrong amount to be encoded and sent between chains, leading to incorrect debt repayment and compromising the integrity of the protocol.

Cause: The bug is caused by the incorrect reuse of the `amount` field in LayerZero cross-chain message payloads, which leads to the seize amount (collateral being transferred to the liquidator) being interpreted as the repay amount (debt being cleared on behalf of the borrower).

Impact: This bug can result in incorrect updates to the borrower's debt position, potentially leading to under or over-repayment of loans.

Mitigation: The bug can be fixed by ensuring the correct `repayAmount` is encoded and sent in the LayerZero message between chains.

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/836 

## Found by 
Aenovir, Brene, Kvar, Sparrow\_Jac, Tigerfrake, francoHacker, future, ggg\_ttt\_hhh, h2134, jokr, m3dython, oxelmiguel, rudhra1749, wickie, zraxx

## Title
Cross-Chain liquidation uses collateral seize amount instead of repayment amount for debt reduction

## Summary
A flaw in the cross-chain liquidation implementation causes the wrong `amount` value to be encoded and sent via LayerZero between chains. Specifically, `seizeTokens` the amount of collateral to be seized is mistakenly reused as the repayment amount during the final step of liquidation on Chain B. This misrepresentation leads to incorrect debt repayment logic, potentially under-repaying or overpaying loans and compromising protocol integrity.

## Root Cause 
The root cause of the issue is the incorrect reuse of the `amount` field in LayerZero cross-chain message payloads, which leads to the seize amount (collateral being transferred to the liquidator) being interpreted as the repay amount (debt being cleared on behalf of the borrower). This mix-up occurs because multiple messages in the liquidation flow reuse the same generic `Payload` structure containing a single `amount` field, without clearly distinguishing the semantic meaning of that field in each context.

1. The [`_executeLiquidationCore`](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L264-L285) function is invoked when a liquidation is initiated and calculates; 
`seizeTokens`: the amount of collateral to be seized from the borrower and transferred to the liquidator.
```solidity
        (uint256 amountSeizeError, uint256 seizeTokens) = LendtrollerInterfaceV2(lendtroller)
            .liquidateCalculateSeizeTokens(borrowedlToken, params.lTokenToSeize, params.repayAmount);
```

The LayerZero message is encoded with `seizeTokens` as `Payload.amount` and sent to Chain A - this is correct at this stage, as Chain A needs the seize amount to compute protocol share.
```solidity
        // Send message to Chain A to execute the seize
        _send(
            params.srcEid,
>>          seizeTokens,
            params.storedBorrowIndex,
            0,
            params.borrower,
            lendStorage.crossChainLTokenMap(params.lTokenToSeize, params.srcEid), // Convert to Chain A version before sending
            msg.sender,
            params.borrowedAsset,
            ContractType.CrossChainLiquidationExecute
        );
```


2. The [`_handleLiquidationExecute`](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L312-L366) handles final liquidation execution on Chain A (collateral chain). It uses the decoded `payload.amount` to calculate the `protocolSeizeShare` and send the message back to Chain B
```solidity
    function _handleLiquidationExecute(LZPayload memory payload, uint32 srcEid) private {
        // Execute the seize of collateral
>>      uint256 protocolSeizeShare = mul_(payload.amount, Exp({mantissa: lendStorage.PROTOCOL_SEIZE_SHARE_MANTISSA()}));

        require(protocolSeizeShare < payload.amount, "Invalid protocol share");

        uint256 liquidatorShare = payload.amount - protocolSeizeShare;

        //...SNIP...

        _send(
            srcEid,
>>          payload.amount,
            0,
            0,
            payload.sender,
            payload.destlToken,
            payload.liquidator,
            payload.srcToken,
            ContractType.LiquidationSuccess
        );
    }
```
When preparing the message back to Chain B, the function reuses `payload.amount` instead of explicitly encoding `repayFinalAmount`.

3. The [`_handleLiquidationSuccess`](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L443-L471) function receives the second message (from Chain A). It assumes the incoming `payload.amount` represents the repay amount and proceeds to repay the borrower’s debt:
```solidity
        // Now that we know the borrow position and srcEid, we can repay the borrow using the escrowed tokens
        // repayCrossChainBorrowInternal will handle updating state and distributing rewards.
        repayCrossChainBorrowInternal(
            payload.sender, // The borrower
            payload.liquidator, // The liquidator (repayer)
>>          payload.amount, // Amount to repay
            payload.destlToken, // lToken representing the borrowed asset on this chain
            srcEid // The chain where the collateral (and borrow reference) is tracked
        );
```
Since `payload.amount` contains `seizeTokens` (collateral seized) instead of `repayFinalAmount`, the borrower’s debt is incorrectly reduced by the value of the seized collateral rather than the actual repayment.

## Internal Pre-conditions
1. Cross-chain liquidation initiated on Chain B
2. Borrower has both:
   - Debt position on Chain B
   - Collateral position on Chain A
3. Liquidator specifies valid `repayAmount`

## External Pre-conditions
None

## Attack Path
1. A liquidation is triggered cross-chain.
2. In `_executeLiquidationCore`, `seizeTokens` is used as the `amount` and sent to Chain A.
3. Chain A processes the message, calculates internal protocol shares, and prepares to finalize liquidation.
4. In `_handleLiquidationExecute`, the message sent back to Chain B reuses `payload.amount`, assuming it represents the `repayAmount`, but it is actually `seizeTokens`.
5. Chain B’s `_handleLiquidationSuccess` receives the message and passes `payload.amount` (seizeTokens) to `repayCrossChainBorrowInternal`.
6. Debt is repaid using a different amount parameter

## Impact
The function `repayCrossChainBorrowInternal` is supposed to reduce the borrower’s debt using the repayFinalAmount. However, due to passing `seizeTokens` (collateral amount) instead of `repayFinalAmount`, the function receives an incorrect value. This leads to incorrect updates to the borrower's debt position, resulting in under-repayment or over-repayment.

## POC
None

## Mitigation
In `_handleLiquidationExecute` (Chain A), ensure `params.repayAmount` is encoded and sent in the LayerZero message to Chain B:
```diff
        _send(
            srcEid,
-           payload.amount,
+           params.repayAmount,
            0,
            0,
            payload.sender,
            payload.destlToken,
            payload.liquidator,
            payload.srcToken,
            ContractType.LiquidationSuccess
        );
```
