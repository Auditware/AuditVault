---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/dex
  - sector/lending
  - sector/stable
protocol: "[[Autonomint Colored Dollar V1]]"
auditors:
  - "[[tjonair]]"
report: "https://github.com/sherlock-audit/2024-11-autonomint-judging"
genome:
  - "[[frozen-funds]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[oracle-manipulation-resistance]]"
---
# H-4: odosAssembledData can be manipulated

- id: 45457
- impact: HIGH
- protocol: [[Autonomint Colored Dollar V1]]
- reporter: tjonair (Sherlock)
- source: N/A

## Summary


This bug report discusses a potential issue found in the code for a project called autonomint-judging. The issue is related to the ability for users to manipulate the odosAssembledData, which can result in them converting less collateral than expected. This is caused by a problem in the code where borrowers can withdraw their collateral, but if the current Ether price is higher than the deposited Ether price, some collateral may remain. This remaining collateral is then swapped to USDT using the odos router. The problem arises when malicious users can choose an improper odosAssembledData and signature, which can result in them only being able to swap a portion of their remaining collateral to USDT. This can lead to some collateral being locked in the contract and the output of USDT being less than expected. The report provides an example of how this can occur and suggests that the odosAssembledData and signature should only be valid for one borrower's specific borrowing index in order to mitigate this issue.

## Details

Source: https://github.com/sherlock-audit/2024-11-autonomint-judging/issues/345 

## Found by 
0x37, 0x73696d616f, 0xNirix, Laksmana, tjonair, volodya

### Summary

The signature in withDraw can be reused and this will cause users can choose one improper odosAssembledData and convert less collateral than expected.

### Root Cause

In [borrowing.sol:withDraw](https://github.com/sherlock-audit/2024-11-autonomint/blob/main/Blockchain/Blockchian/contracts/Core_logic/borrowing.sol#L281), borrowers can withdraw their collateral. If the current Ether price is larger than deposited Ether price, borrowers will not withdraw all collaterals. There will be some remaining collateral. These remaining collaterals will be swapped to USDT via odos router.

In one normal scenario, the protocol backend server will generate odos assembled data got from odos api, and sign the signature. The borrower will use this signed signature and `odosAssembledData` to trigger this `withDraw` function.

But the problem is that malicious users can choose one improper `odosAssembledData` and signature. Although we can not manipulate the `odosAssembledData` to any value we want, the backend servers will generate all kinds of `odosAssembledData` for different borrower's withdrawal. The malicious borrower can choose any `odosAssembledData` from all of these `odosAssembledData`.

For example:
1. Alice deposits WrsETH via depositTokens.
2. The Ether price increases, Alice wants to withdraw her collateral. Her borrow position's remaining collateral is 0.05 ether. Normally, Alice's `odosAssembledData` will swap 0.05 ether wrsETH to USDT. But Alice searches the valid used `odosAssembledData`, and find one `odosAssembledData` which input token amt is 0.01 ether. Alice uses used `odosAssembledData` to trigger her withdraw.
3. We will swap 0.01 ether wrsETH to USDT. This will cause some wrsETH locked in the contract.

```solidity
    function _withdraw(
        address toAddress,
        uint64 index,
        bytes memory odosAssembledData,
        uint64 ethPrice, // current ether price
        uint128 exchangeRate,
        uint64 withdrawTime
    ) internal {
    ...
        uint256 amountToSwap = result.collateralRemainingInWithdraw -
            collateralRemainingInWithdraw;
        if (amountToSwap > 0) {
            amountToSwap = (amountToSwap * 1 ether) / exchangeRate;
            treasury.swapCollateralForUSDT(depositDetail.assetName, amountToSwap, odosAssembledData);
        }
    ...    
}
```

### Internal pre-conditions

N/A

### External pre-conditions

N/A

### Attack Path

1. Alice deposits WrsETH via depositTokens.
2. The Ether price increases, Alice wants to withdraw her collateral. Her borrow position's remaining collateral is 0.05 ether. Normally, Alice's `odosAssembledData` will swap 0.05 ether wrsETH to USDT. But Alice searches the valid used `odosAssembledData`, and find one `odosAssembledData` which input token amt is 0.01 ether. Alice uses used `odosAssembledData` to trigger her withdraw.
3. We will swap 0.01 ether wrsETH to USDT. This will cause some wrsETH locked in the contract.

### Impact

When we swap the remaining collateral to USDT, we may swap only one part of remaining collateral to USDT. This will break our intent. Some remaining collateral will be locked in the contract, and the output USDT is less than expected.

### PoC

N/A

### Mitigation

`odosAssembledData` and `signature` should only be valid for one borrower's specific borrowing index.
