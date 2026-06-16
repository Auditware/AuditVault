---
tags:
  - lang/solidity
  - platform/codehawks
  - has/poc
  - severity/high
  - sector/nft
protocol: "[[Tadle]]"
auditors:
  - "[[p0wd3r]]"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
  - "[[bridge-sender-auth]]"
  - "[[timestamp-dependence]]"
---
# `DeliveryPlace::settleAskTaker` Has Incorrect Access Control

- id: 38066
- impact: HIGH
- protocol: [[Tadle]]
- reporter: p0wd3r (Codehawks)
- source: N/A

## Summary


This report highlights a bug in the `settleAskTaker` function of the `DeliveryPlace` contract. This function is meant to allow a stock owner to finalize a transaction by transferring points tokens to the buyer. However, the current implementation checks if the caller is the offer authority instead of the stock authority, which contradicts the intended behavior and can lead to unintended consequences. This bug prevents stock owners from properly finalizing transactions and can result in loss of points. To fix this issue, the access control check should be corrected to verify the caller against the stock authority.

## Details

## \[H-05] `DeliveryPlace::settleAskTaker` Has Incorrect Access Control

## Summary

The `settleAskTaker` function is designed to allow a stock owner to finalize a transaction by transferring points tokens from the stock owner to the buyer. According to the documentation, only the stock authority should be able to call this function. However, the current implementation checks if the caller is the offer authority, which contradicts the documented behavior and intended functionality. This discrepancy prevents the stock owner from finalizing transactions and can lead to unintended consequences if the offer owner mistakenly calls this function.

## Vulnerability Details

The core issue lies in the access control check within the `settleAskTaker` function, where the caller is incorrectly verified against the offer authority instead of the stock authority. This misalignment between the documentation and code leads to incorrect authorization checks.

```javascript
    /**
     * @notice Settle ask taker
@>   * @dev caller must be stock authority
     * @dev market place status must be AskSettling
     * @param _stock stock address
     * @param _settledPoints settled points
     * @notice _settledPoints must be less than or equal to stock points
     */
    function settleAskTaker(address _stock, uint256 _settledPoints) external {
        IPerMarkets perMarkets = tadleFactory.getPerMarkets();
        StockInfo memory stockInfo = perMarkets.getStockInfo(_stock);

        (
            OfferInfo memory offerInfo,
            MakerInfo memory makerInfo,
            MarketPlaceInfo memory marketPlaceInfo,
            MarketPlaceStatus status
        ) = getOfferInfo(stockInfo.preOffer);

        if (stockInfo.stockStatus != StockStatus.Initialized) {
            revert InvalidStockStatus();
        }

        if (marketPlaceInfo.fixedratio) {
            revert FixedRatioUnsupported();
        }
        if (stockInfo.stockType == StockType.Bid) {
            revert InvalidStockType();
        }
        if (_settledPoints > stockInfo.points) {
            revert InvalidPoints();
        }

@>      if (status == MarketPlaceStatus.AskSettling) {
@>          if (_msgSender() != offerInfo.authority) {
@>              revert Errors.Unauthorized();
            }
        } else {
            if (_msgSender() != owner()) {
                revert Errors.Unauthorized();
            }
            if (_settledPoints > 0) {
                revert InvalidPoints();
            }
        }
        .
        .
        .
    }
```

## Impact

This flaw prevents stock owners from properly finalizing transactions, leading to potential loss of points. Additionally, if an offer owner mistakenly calls this function, they could lose points instead of acquiring them.
note that the current exsiting test `test_create_bid_offer_turbo_usdc` is completly wrong but still works because of lack of assertations and checks. the correct version of test exists in POC.

## Proof of Concept

in original test, user makes both offer and calls createTaker which is wrong since you cant both buy and sell points, in edited version user2 is the one selling the points as a result he should be the called of settleAskTaker which you can see as a result of this the call will revert with unAuthorized.
The provided test case demonstrates the incorrect behavior when a user attempts to finalize a bid offer instead of a stock sale, highlighting the need for correcting the access control logic.
Here is the corrected version of `test_create_bid_offer_turbo_usdc` test:

```javascript
    function test_create_bid_offer_turbo_usdc() public {
        vm.prank(user);
        preMarktes.createOffer(
            CreateOfferParams(
                marketPlace,
                address(mockUSDCToken),
                1000,
                0.01 * 1e18,
                12000,
                300,
                OfferType.Bid,
                OfferSettleType.Turbo
            )
        );
        address offerAddr = GenerateAddress.generateOfferAddress(0);

        vm.prank(user2);
        preMarktes.createTaker(offerAddr, 1000);

        address stock1Addr = GenerateAddress.generateStockAddress(1);

        vm.prank(user1);
        systemConfig.updateMarket(
            "Backpack",
            address(mockPointToken),
            0.01 * 1e18,
            block.timestamp - 1,
            3600
        );

        vm.startPrank(user2);
        uint256 PointsBalanceBefore = mockPointToken.balanceOf(user2);
        mockPointToken.approve(address(tokenManager), 10000 * 10 ** 18);
        vm.expectRevert(Errors.Unauthorized.selector);
        deliveryPlace.settleAskTaker(stock1Addr, 1000);
    }
```

## Tools Used

Manual Review

## Recommendations

To address this issue, the access control check should be corrected to verify the caller against the stock authority, aligning with the intended functionality and documentation.

```diff
    function settleAskTaker(address _stock, uint256 _settledPoints) external {
        IPerMarkets perMarkets = tadleFactory.getPerMarkets();
        StockInfo memory stockInfo = perMarkets.getStockInfo(_stock);

        (
            OfferInfo memory offerInfo,
            MakerInfo memory makerInfo,
            MarketPlaceInfo memory marketPlaceInfo,
            MarketPlaceStatus status
        ) = getOfferInfo(stockInfo.preOffer);

        if (stockInfo.stockStatus != StockStatus.Initialized) {
            revert InvalidStockStatus();
        }

        if (marketPlaceInfo.fixedratio) {
            revert FixedRatioUnsupported();
        }
        if (stockInfo.stockType == StockType.Bid) {
            revert InvalidStockType();
        }
        if (_settledPoints > stockInfo.points) {
            revert InvalidPoints();
        }

        if (status == MarketPlaceStatus.AskSettling) {
-           if (_msgSender() != offerInfo.authority) {
+           if (_msgSender() != stockInfo.authority) {

                revert Errors.Unauthorized();
            }
        } else {
            if (_msgSender() != owner()) {
                revert Errors.Unauthorized();
            }
            if (_settledPoints > 0) {
                revert InvalidPoints();
            }
        }
        .
        .
        .
    }
```
