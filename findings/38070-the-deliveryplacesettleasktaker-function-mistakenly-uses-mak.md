---
tags:
  - lang/solidity
  - platform/codehawks
  - has/github
  - has/poc
  - severity/high
  - sector/nft
protocol: "[[Tadle]]"
auditors:
  - "[[pontifex]]"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[timestamp-dependence]]"
---
# The `DeliveryPlace::settleAskTaker()` function mistakenly uses `makerInfo.tokenAddress` to update the `TokenBalanceType.PointToken` in the `userTokenBalanceMap` mapping, leading to a critical error.

- id: 38070
- impact: HIGH
- protocol: [[Tadle]]
- reporter: pontifex (Codehawks)
- source: N/A

## Summary


This bug report discusses a critical error in the `DeliveryPlace::settleAskTaker()` function. The function mistakenly uses `makerInfo.tokenAddress` instead of `marketPlaceInfo.tokenAddress` to update the `TokenBalanceType.PointToken` in the `userTokenBalanceMap` mapping. This leads to an incorrect balance being recorded, which could result in serious errors during settlement. The report includes a PoC (Proof of Concept) and code snippets to demonstrate the issue. The impact and recommendations for fixing the bug are also provided. Manual review was used to identify the issue. The report recommends using `marketPlaceInfo.tokenAddress` when updating the `TokenBalanceType.PointToken` balance. 

## Details

## Summary

The `DeliveryPlace::settleAskTaker()` function mistakenly uses `makerInfo.tokenAddress` to update the `TokenBalanceType.PointToken` in the `userTokenBalanceMap` mapping, leading to a critical error.

## Vulnerability Details

When UserA creates a `Bid.offer`, the transaction process unfolds as follows:

1. UserA creates a `Bid.offer` by calling `PreMarkets::createOffer()`.
2. UserB calls `PreMarkets::createTaker()` using the `Bid.offer.offerAddr` and a specified amount.
3. The administrator updates the market by calling `SystemConfig::updateMarket`.
4. UserB then calls `DeliveryPlace::settleAskTaker()` to settle the transaction. During this step, UserB transfers `mockPointToken` to the contract, fulfilling the amount promised in step 2, and updates the balance information in `userTokenBalanceMap`.

Below is the relevant code from `DeliveryPlace::settleAskTaker()`:

```js
    function settleAskTaker(address _stock, uint256 _settledPoints) external {
        IPerMarkets perMarkets = tadleFactory.getPerMarkets();
        StockInfo memory stockInfo = perMarkets.getStockInfo(_stock);


        (
            OfferInfo memory offerInfo,
            MakerInfo memory makerInfo,
            MarketPlaceInfo memory marketPlaceInfo,
            MarketPlaceStatus status
        ) = getOfferInfo(stockInfo.preOffer);

        // SNIP...


        uint256 settledPointTokenAmount = marketPlaceInfo.tokenPerPoint *
            _settledPoints;
        ITokenManager tokenManager = tadleFactory.getTokenManager();
        if (settledPointTokenAmount > 0) {
            tokenManager.tillIn(
                _msgSender(),
                marketPlaceInfo.tokenAddress,
                settledPointTokenAmount,
                true
            );


            tokenManager.addTokenBalance(
                TokenBalanceType.PointToken,
@>                offerInfo.authority,
@>                makerInfo.tokenAddress,
                settledPointTokenAmount
            );
        }
        // SNIP...
    }
```

In the above code, `tokenManager.addTokenBalance()` incorrectly uses `makerInfo.tokenAddress` when updating the `TokenBalanceType.PointToken` balance for the user. Instead, the `marketPlaceInfo.tokenAddress` should be used. This misstep leads to an incorrect balance being recorded in the `userTokenBalanceMap`, which could result in serious errors during settlement.

### Poc

To demonstrate the issue, add the following test code to `test/PreMarkets.t.sol` and run it:

Note: Before running the PoC, address the issue related to the incorrect permission check in the `DeliveryPlace::settleAskTaker()` function, where the caller's address is mistakenly validated against the wrong authority.

```js
    function test_DeliveryPlace_settleAskTaker_addTokenBalance_error() public {

        ///////////////////////////
        // user create Bid.Offer //
        ///////////////////////////
        vm.prank(user);
        // transfer mockUSDCToken 1e16 to capitalPool
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

        // Cache user's offer address
        address offerAddr = GenerateAddress.generateOfferAddress(0);
        ////////////////////////
        // user2 create Taker //
        ////////////////////////
        vm.prank(user2);
        // transfer mockUSDCToken 1.235e16 to capitalPool
        preMarktes.createTaker(offerAddr, 1000);

        // Cache user2's stock address
        address user2StockAddr = GenerateAddress.generateStockAddress(1);
        

        ////////////////////////
        // admin updateMarket //
        ////////////////////////
        vm.prank(user1);
        systemConfig.updateMarket(
            "Backpack",
            address(mockPointToken),
            0.01 * 1e18,
            block.timestamp - 1,
            3600
        );

        //////////////////////////
        // user2 settleAskTaker //
        //////////////////////////       
        vm.startPrank(user2);
        mockPointToken.approve(address(tokenManager), 10000 * 10 ** 18);

        // transfer mockPointToken 1e19 to capitalPool
        deliveryPlace.settleAskTaker(user2StockAddr, 1000);
        vm.stopPrank();

        //////////////////////////
        //  check user balance  //
        //////////////////////////
        // user
        uint256 usermockPointTokenAmount_PointToken = tokenManager.userTokenBalanceMap(
            address(user),
            address(mockPointToken),
            TokenBalanceType.PointToken
        );
        console2.log("usermockPointTokenAmount_PointToken:",usermockPointTokenAmount_PointToken);

        uint256 usermockUSDCTokenAmount_PointToken = tokenManager.userTokenBalanceMap(
            address(user),
            address(mockUSDCToken),
            TokenBalanceType.PointToken
        );
        console2.log("usermockUSDCTokenAmount_PointToke:",usermockUSDCTokenAmount_PointToken);
    }
    // [PASS] test_DeliveryPlace_settleAskTaker_addTokenBalance_error() (gas: 1116914)
    //     Logs:
    //     usermockPointTokenAmount_PointToken: 0
    //     usermockUSDCTokenAmount_PointToke: 10000000000000000000
```

The test logs will show that the `userTokenBalanceMap` was updated incorrectly.

### Code Snippet

<https://github.com/Cyfrin/2024-08-tadle/blob/04fd8634701697184a3f3a5558b41c109866e5f8/src/core/DeliveryPlace.sol#L335-L433>

## Impact

The incorrect use of `makerInfo.tokenAddress` when updating the `TokenBalanceType.PointToken` balance in `userTokenBalanceMap` leads to a serious error

## Tools Used

Manual Review

## Recommendations

Please use `marketPlaceInfo.tokenAddress` when updating the balance for `TokenBalanceType.PointToken`:

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

        // SNIP...


        uint256 settledPointTokenAmount = marketPlaceInfo.tokenPerPoint *
            _settledPoints;
        ITokenManager tokenManager = tadleFactory.getTokenManager();
        if (settledPointTokenAmount > 0) {
            tokenManager.tillIn(
                _msgSender(),
                marketPlaceInfo.tokenAddress,
                settledPointTokenAmount,
                true
            );


            tokenManager.addTokenBalance(
                TokenBalanceType.PointToken,
                offerInfo.authority,
-                makerInfo.tokenAddress,
+                marketPlaceInfo.tokenAddress,
                settledPointTokenAmount
            );
        }
        // SNIP...
    }
```
