---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/oracle
  - sector/perpetuals
protocol: "[[GMX]]"
auditors:
  - "[[IllIllI]]"
report: "https://github.com/sherlock-audit/2023-02-gmx-judging"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[oracle-freshness]]"
---
# H-7: Limit orders are broken when there are price gaps

- id: 18633
- impact: HIGH
- protocol: [[GMX]]
- reporter: IllIllI (Sherlock)
- source: N/A

## Summary


This bug report is about Limit orders, which are orders that require all oracle-provided prices come from blocks after the order has been submitted, and the primary and secondary prices must straddle the trigger price. If the primary/secondary prices go past the trigger price (e.g. due to a price gap), then the order execution will revert, leaving the user exposed to their position, even if they had a valid stoploss set. The bug was found by IllIllI and was fixed by xvi10 in a Github commit. The recommendation is to not revert if both the primary and secondary prices are worse than the trigger price, and instead use the trigger price as the execution price.

## Details

Source: https://github.com/sherlock-audit/2023-02-gmx-judging/issues/140 

## Found by 
IllIllI

## Summary

Limit orders fail to execute when the price becomes worse for the order in the block after the order is submitted.


## Vulnerability Detail

Limit orders require that all oracle-provided prices come from blocks [_after_](https://github.com/sherlock-audit/2023-02-gmx/blob/main/gmx-synthetics/contracts/order/DecreaseOrderUtils.sol#L134-L156) the order has been submitted. In addition, limit orders's primary and secondary prices are required to straddle the trigger price.

## Impact

If the primary/secondary prices go well past the trigger price (e.g. due to a price gap), then the order execution will revert, leaving the user exposed to their position, even if they had a valid stoploss set.


## Code Snippet

Limit orders require prices to straddle the trigger price, and revert if they don't:
```solidity
// File: gmx-synthetics/contracts/order/BaseOrderUtils.sol : BaseOrderUtils.setExactOrderPrice()   #1

238            if (orderType == Order.OrderType.LimitIncrease ||
239                orderType == Order.OrderType.LimitDecrease ||
240                orderType == Order.OrderType.StopLossDecrease
241            ) {
242                uint256 primaryPrice = oracle.getPrimaryPrice(indexToken).pickPrice(shouldUseMaxPrice);
243                uint256 secondaryPrice = oracle.getSecondaryPrice(indexToken).pickPrice(shouldUseMaxPrice);
244    
...
258                if (shouldValidateAscendingPrice) {
259                    // check that the earlier price (primaryPrice) is smaller than the triggerPrice
260                    // and that the later price (secondaryPrice) is larger than the triggerPrice
261 @>                 bool ok = primaryPrice <= triggerPrice && triggerPrice <= secondaryPrice;
262                    if (!ok) {
263                        revert InvalidOrderPrices(primaryPrice, secondaryPrice, triggerPrice, shouldValidateAscendingPrice);
264                    }
...
270                } else {
271                    // check that the earlier price (primaryPrice) is larger than the triggerPrice
272                    // and that the later price (secondaryPrice) is smaller than the triggerPrice
273 @>                 bool ok = primaryPrice >= triggerPrice && triggerPrice >= secondaryPrice;
274                    if (!ok) {
275                        revert InvalidOrderPrices(primaryPrice, secondaryPrice, triggerPrice, shouldValidateAscendingPrice);
276                    }
...
282:               }
```
https://github.com/sherlock-audit/2023-02-gmx/blob/main/gmx-synthetics/contracts/order/BaseOrderUtils.sol#L228-L288


## Tool used

Manual Review


## Recommendation

Don't [revert](https://github.com/sherlock-audit/2023-02-gmx/blob/main/gmx-synthetics/contracts/exchange/OrderHandler.sol#L253) if both the primary and secondary prices are worse than the trigger price. Use the trigger price as the execution price.




## Discussion

**xvi10**

Fix in https://github.com/gmx-io/gmx-synthetics/commit/ec586b87cd677d6e0426000fb746613537027160#diff-d3ac89c96efb4157bb20ef7f24459de430ab4f29ffa8b39d92db13843e92c5a5
