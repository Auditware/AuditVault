---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/lending
  - sector/oracle
protocol: "[[Notional]]"
auditors:
  - "[[mstpr-brainbot]]"
  - "[[rudhra1749]]"
report: "https://github.com/sherlock-audit/2025-06-notional-exponent-judging"
genome:
  - "[[stale-price]]"
  - "[[defi/price-manipulation]]"
  - "[[oracle-manipulation-resistance]]"
---
# H-4: When users borrow directly from Morpho price of the collateral will not be accurate

- id: 62485
- impact: HIGH
- protocol: [[Notional]] Exponent
- reporter: mstpr-brainbot (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found by two users in the code of the Morpho lending platform. The issue occurs when a user requests a withdrawal and then borrows directly from Morpho, bypassing the lending router. In this situation, the shares will be priced based on their raw share value instead of the requested value, potentially leading to incorrect pricing and collateral valuation. The root cause of this issue is due to a variable not being set correctly when the user borrows directly. The impact of this bug is that the oracle will misprice the user's collateral, and the shares will not correspond to the yield tokens. A proof of concept is provided in the report, and a mitigation plan is yet to be determined. 

## Details


Source: https://github.com/sherlock-audit/2025-06-notional-exponent-judging/issues/450 

## Found by 
mstpr-brainbot, rudhra1749

### Summary

When users have a withdrawal request, the Morpho price oracle will price the request based on the requested value instead of the share amount. However, if users choose to borrow directly from Morpho bypassing the lending router the shares will be priced based on their raw share value, not the request value.



### Root Cause

As seen in the following lines:

* [`AbstractYieldStrategy.sol#L118-L120`](https://github.com/sherlock-audit/2025-06-notional-exponent/blob/82c87105f6b32bb362d7523356f235b5b07509f9/notional-v4/src/AbstractYieldStrategy.sol#L118-L120)
* [`AbstractSingleSidedLP.sol#L300-L303`](https://github.com/sherlock-audit/2025-06-notional-exponent/blob/82c87105f6b32bb362d7523356f235b5b07509f9/notional-v4/src/single-sided-lp/AbstractSingleSidedLP.sol#L300-L303)

If the transient `t_currentAccount` variable is set and the user has a withdrawal request, then the price will be based on the withdrawal request value. However, if the user is borrowing **directly** not via the lending router the `t_currentAccount` is never set. This causes the call to fall back to `super.convertToAssets(shares)`, which prices based on yield token holdings instead.

This introduces a discrepancy: a user with an active withdrawal request is not holding yield tokens, but their shares will still be priced as if they are-potentially leading to mispricing or incorrect collateral valuation.

### Internal Pre-conditions

1. Request a withdrawal and borrow from MORPHO directly not via lending router

### External Pre-conditions

None needed

### Attack Path

Happens naturally

### Impact

Oracle will misprice the users collateral. Users shares are not corresponding to yield tokens but withdrawal request underlying tokens but the oracle will price them wrong! 

### PoC

```solidity
// forge test --match-test test_price_Inconsistency -vv
    function test_price_Inconsistency() public {

        console.log("Asset is", IERC20Metadata(address(asset)).symbol());

        address tapir = msg.sender;
        // deal(address(asset), msg.sender, defaultDeposit); 
        _enterPosition(tapir, defaultDeposit, 0);
        uint256 balanceBefore = lendingRouter.balanceOfCollateral(tapir, address(y));

        vm.startPrank(tapir);
        lendingRouter.initiateWithdraw(tapir, address(y), getWithdrawRequestData(tapir, balanceBefore));

        MarketParams memory marketParams = MorphoLendingRouter(address(lendingRouter)).marketParams(address(y));
        Id idx = Id.wrap(keccak256(abi.encode(marketParams)));
        address oracle = marketParams.oracle;

        console.log("Price of the asset is", IOracle(oracle).price());
        console.log("Price of the vault is", y.price(tapir));
    }
```

Test Logs:
Ran 1 test for tests/TestSingleSidedLPStrategyImpl.sol:Test_LP_Curve_pxETH_ETH
[PASS] test_price_Inconsistency() (gas: 1904287)
Logs:
  Asset is WETH
  Price of the asset is 1001461263579509710000000000000
  Price of the vault is 1001459261273599425000000000000

### Mitigation

tbd
