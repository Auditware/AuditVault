---
tags:
  - lang/solidity
  - sector/token
  - platform/cantina
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Royco]]"
auditors:
  - "[[Kurt Barry]]"
report: "https://cdn.cantina.xyz/reports/cantina_royco_august2024.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[proposal-state-check]]"
---
# Unintended behavior in recipe orderbook for null Weiroll Markets 

- id: 46675
- impact: HIGH
- protocol: [[Royco]]
- reporter: Kurt Barry (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_royco_august2024.pdf

## Summary


The bug report states that there is an issue with the code when filling an order with a fillAmount of 0. This causes the code to continue running and potentially result in the loss of funds for the user. The report suggests adding a check to ensure the order has not been cancelled or fully filled before proceeding. The bug has been fixed in the latest commit. 

## Details

## Review of Order Processing Logic

## Context
(No context files were provided by the reviewer)

## Description
If the provided order to `fillLPOrder` has a `fillAmount == 0`, any order will proceed past the following code block:

```solidity
bytes32 orderHash = getOrderHash(order);
if (fillAmount > orderHashToRemainingQuantity[orderHash]) revert NotEnoughRemainingQuantity();
orderHashToRemainingQuantity[orderHash] -= fillAmount;
```

If the `targetMarketId` was never created, the market struct read from storage will take the default value (0):

```solidity
WeirollMarket memory market = marketIDToWeirollMarket[order.targetMarketID];
```

Then, for each `order.tokensRequested`, the following code block will be entered because `market.RewardStyle == 0 == RewardStyle.Upfront`:

```solidity
if (market.rewardStyle == RewardStyle.Upfront) {
    if (PointsFactory(POINTS_FACTORY).isPointsProgram(order.tokensRequested[i])) {
        Points(order.tokensRequested[i]).award(order.lp, order.tokenAmountsRequested[i], msg.sender);
    } else {
        // safetransfer the token to the LP
        ERC20(order.tokensRequested[i]).safeTransferFrom(
            msg.sender, order.lp, order.tokenAmountsRequested[i]
        );
    }
}
```

Though this seems to only cause a loss of funds for the `msg.sender`, poorly formed order structs may include market identifiers which do not exist inadvertently.

## Recommendation
Add a check:

```solidity
require(orderHashToRemainingQuantity[orderHash] > 0);
```

to ensure the order has been created and not yet cancelled or fully filled.

## Updates
- **Royco**: Added a check to not fill orders with no quantity remaining in commit `8b0d931d`.
- **Cantina Managed**: Fixed.
