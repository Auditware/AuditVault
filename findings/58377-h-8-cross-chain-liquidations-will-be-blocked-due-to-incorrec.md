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
  - future
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[liquidation-underwater]]"
  - "[[bridge/missing-validation]]"
  - "[[liquidation-logic]]"
  - "[[variant]]"
  - "[[bridge-is-secure]]"
  - "[[math-is-safe]]"
  - "[[add-check]]"
  - "[[redesign-logic]]"
  - "[[cross-chain-message]]"
---
# H-8: Cross-chain liquidations will be blocked due to incorrect maxLiquidatable amount calculation.

- id: 58377
- impact: HIGH
- protocol: LEND
- reporter: future (Sherlock)
- source: N/A

## Summary


The report discusses a bug found in a cross-chain liquidation function in a lending platform. The function incorrectly calculates the maximum amount that can be repaid during a liquidation, resulting in valid cross-chain liquidations being rejected. This is due to the function not including borrow amounts where the current chain is the destination chain. The bug can be exploited by a user who has a cross-chain borrow originating from another chain. The impact of this bug is that valid cross-chain liquidations will be blocked. To mitigate this issue, a new function should be introduced to accurately calculate the maximum amount that can be repaid during a cross-chain liquidation.

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/578 

## Found by 
0xc0ffEE, coin2own, future, h2134, jokr, wickie

### Summary

During cross-chain liquidations, the `_validateAndPrepareLiquidation` function verifies that `repayAmount <= maxLiquidationAmount`. However, the computed `maxLiquidationAmount` from the `getMaxLiquidationRepayAmount()` function is incorrect if we want to calculate cross-chain collaterals.

```solidity
function getMaxLiquidationRepayAmount(address borrower, address lToken, bool isSameChain)
    external
    view
    returns (uint256)
{
    uint256 currentBorrow = 0;

    currentBorrow += isSameChain
        ? borrowWithInterestSame(borrower, lToken)
        : borrowWithInterest(borrower, lToken);

    uint256 closeFactorMantissa = LendtrollerInterfaceV2(lendtroller).closeFactorMantissa();
    uint256 maxRepay = (currentBorrow * closeFactorMantissa) / 1e18;

    return maxRepay;
}
```

https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/LendStorage.sol#L573-L591

https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/LendStorage.sol#L478-L504



The issue lies in the use of `borrowWithInterest()`, which returns the sum of cross-chain borrows *originating from* the current chain. It **does not** include borrow amounts where the current chain is the **destination chain**.

As a result, if a user has a cross-chain borrow ( originated from another chain), it will not be considered in the liquidation cap calculation. Consequently, valid cross-chain liquidations can be incorrectly rejected.

### Root Cause

The `borrowWithInterest()` function only returns borrows initiated from the current chain, not borrows whose destination chain is current chain (cross-chain collaterals)

Using it to calculate liquidation cap of cross-chain borrows on destination chain leads wrong `maxLiquidationAmount` reverting valid liquidations.

### Internal Pre-conditions


1. User has cross-chain collateral on this chain.
2. No (or less)  cross-chain borrows of that token initiated from this chain.

### External Pre-conditions


### Attack Path

1. Alice has a $1,000 borrow position on Chain B (destination chain), which originated from Chain A.
2. The borrow is undercollateralized and should be liquidated.
3. A liquidator tries to initiate cross-chain liquidation for $500 of Alice’s borrow on Chain B.
4. Since Alice has no borrows of that token initiated from Chain B, both `borrowWithInterest()` returns 0.
5. As a result, `maxLiquidationAmount` is calculated as 0.
6. The liquidation fails due to this incorrect cap check:

```solidity
require(params.repayAmount <= maxLiquidationAmount, "Exceeds max liquidation");
```

### Impact

Valid cross-chain liquidations will be blocked 

### PoC

_No response_

### Mitigation

Introduce a new function that accurately aggregates all cross-chain collaterals of a given token for a user whose destination chain is current chain. Use this function instead of `borrowWithInterest()` when calculating `maxLiquidationAmount` during cross-chain liquidations.
