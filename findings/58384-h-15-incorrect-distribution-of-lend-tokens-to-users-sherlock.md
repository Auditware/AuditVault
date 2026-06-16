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
  - patitonar
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[reward-accounting]]"
  - "[[debt-accrual-update]]"
  - "[[logic/reward-calculation]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[cross-chain-message]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# H-15: incorrect distribution of Lend tokens to users

- id: 58384
- impact: HIGH
- protocol: LEND
- reporter: patitonar (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue found in the code for a lending platform. The function responsible for handling cross-chain borrowing requests is not correctly distributing Lend tokens to users. This is because the code first updates the mapping for cross-chain collaterals and then distributes the tokens, when it should be the other way around. This results in an incorrect distribution of tokens to users. To fix this issue, the code should first distribute the tokens and then update the mapping.

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/773 

## Found by 
0xc0ffEE, Kirkeelee, Kvar, PNS, future, ggg\_ttt\_hhh, hard1k, jokr, mussucal, patitonar, rudhra1749, t.aksoy

### Summary

if we observe  _handleBorrowCrossChainRequest function,
https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L581-L660
```solidity
    function _handleBorrowCrossChainRequest(LZPayload memory payload, uint32 srcEid) private {
        // Accrue interest on borrowed token on destination chain
        LTokenInterface(payload.destlToken).accrueInterest();


        // Get current borrow index from destination lToken
        uint256 currentBorrowIndex = LTokenInterface(payload.destlToken).borrowIndex();


        // Important: Use the underlying token address
        address destUnderlying = lendStorage.lTokenToUnderlying(payload.destlToken);


        // Check if user has any existing borrows on this chain
        bool found = false;
        uint256 index;


        LendStorage.Borrow[] memory userCrossChainCollaterals =
            lendStorage.getCrossChainCollaterals(payload.sender, destUnderlying);


        /**
         * Filter collaterals for the given srcEid. Prevents borrowing from
         * multiple collateral sources.
         */
        for (uint256 i = 0; i < userCrossChainCollaterals.length;) {
            if (
                userCrossChainCollaterals[i].srcEid == srcEid
                    && userCrossChainCollaterals[i].srcToken == payload.srcToken
            ) {
                index = i;
                found = true;
                break;
            }
            unchecked {
                ++i;
            }
        }


        // Get existing borrow amount
        (uint256 totalBorrowed,) = lendStorage.getHypotheticalAccountLiquidityCollateral(
            payload.sender, LToken(payable(payload.destlToken)), 0, payload.amount
        );


        // Verify the collateral from source chain is sufficient for total borrowed amount
        require(payload.collateral >= totalBorrowed, "Insufficient collateral");


        // Execute the borrow on destination chain
        CoreRouter(coreRouter).borrowForCrossChain(payload.sender, payload.amount, payload.destlToken, destUnderlying);


        /**
         * @dev If existing cross-chain collateral, update it. Otherwise, add new collateral.
         */
        if (found) {
            uint256 newPrincipleWithAmount = (userCrossChainCollaterals[index].principle * currentBorrowIndex)
                / userCrossChainCollaterals[index].borrowIndex;


            userCrossChainCollaterals[index].principle = newPrincipleWithAmount + payload.amount;
            userCrossChainCollaterals[index].borrowIndex = currentBorrowIndex;


            lendStorage.updateCrossChainCollateral(
                payload.sender, destUnderlying, index, userCrossChainCollaterals[index]
            );
        } else {
            lendStorage.addCrossChainCollateral(
                payload.sender,
                destUnderlying,
                LendStorage.Borrow({
                    srcEid: srcEid,
                    destEid: currentEid,
                    principle: payload.amount,
                    borrowIndex: currentBorrowIndex,
                    borrowedlToken: payload.destlToken,
                    srcToken: payload.srcToken
                })
            );
        }


        // Track borrowed asset
        lendStorage.addUserBorrowedAsset(payload.sender, payload.destlToken);


        // Distribute LEND rewards on destination chain
        lendStorage.distributeBorrowerLend(payload.destlToken, payload.sender);


```
here if we observe, first it updates CrossChainCollaterals mapping then it calls  lendStorage.distributeBorrowerLend which gives Lend tokens to borrower.
But it should first distribute lend tokens and then it should update CrossChainCollaterals mapping.because distributeBorrowerLend function uses CrossChainCollaterals mapping to calculate total user borrowed assets,
https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/LendStorage.sol#L365-L368
```solidity
        uint256 borrowerAmount = div_(
            add_(borrowWithInterest(borrower, lToken), borrowWithInterestSame(borrower, lToken)),
            Exp({mantissa: LTokenInterface(lToken).borrowIndex()})
        );
```
https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/LendStorage.sol#L478-L501
```solidity
    function borrowWithInterest(address borrower, address _lToken) public view returns (uint256) {
        address _token = lTokenToUnderlying[_lToken];
        uint256 borrowedAmount;


        Borrow[] memory borrows = crossChainBorrows[borrower][_token];
        Borrow[] memory collaterals = crossChainCollaterals[borrower][_token];


        require(borrows.length == 0 || collaterals.length == 0, "Invariant violated: both mappings populated");
        // Only one mapping should be populated:
        if (borrows.length > 0) {
            for (uint256 i = 0; i < borrows.length; i++) {
                if (borrows[i].srcEid == currentEid) {
                    borrowedAmount +=
                        (borrows[i].principle * LTokenInterface(_lToken).borrowIndex()) / borrows[i].borrowIndex;
                }
            }
        } else {
            for (uint256 i = 0; i < collaterals.length; i++) {
                // Only include a cross-chain collateral borrow if it originated locally.
                if (collaterals[i].destEid == currentEid && collaterals[i].srcEid == currentEid) {
                    borrowedAmount +=
                        (collaterals[i].principle * LTokenInterface(_lToken).borrowIndex()) / collaterals[i].borrowIndex;
                }
            }
```
due to this protocol will distrubute incorrect amount of lend tokens to users.

### Root Cause

distributing  lend tokens before updating crossChainCollateral mapping 

### Internal Pre-conditions

none

### External Pre-conditions

none

### Attack Path

none

### Impact

incorrect distribution of Lend tokens to users

### PoC

_No response_

### Mitigation

first distribute Lend tokens and then update CrossChainCollateral mapping
