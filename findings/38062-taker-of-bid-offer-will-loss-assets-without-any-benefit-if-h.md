---
tags:
  - lang/solidity
  - platform/codehawks
  - has/github
  - severity/high
  - sector/lending
  - sector/nft
  - sector/stable
protocol: "[[Tadle]]"
auditors:
  - "[[inzinko]]"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[timestamp-dependence]]"
---
# Taker of bid offer will loss assets without any benefit if he calls the DeliveryPlace::settleAskMaker() for partial settlement.

- id: 38062
- impact: HIGH
- protocol: [[Tadle]]
- reporter: inzinko (Codehawks)
- source: N/A

## Summary


The bug report discusses a vulnerability in the code of a smart contract. The severity of the bug is classified as high risk. The issue is related to the `settleAskMaker()` function in the `DeliveryPlace` contract, which can result in the loss of `collateralFee` and Point token for the taker of a bid offer if they attempt a partial settlement. The report provides details on how to reproduce the bug and suggests two fixes to correct the issue. The impact of the bug is that the taker of the bid offer will lose their tokens without receiving any benefit. The report recommends either allowing partial settlements or reverting the call immediately to prevent loss of tokens. The report was reviewed manually and with the help of the Foundry tool. A link to the relevant code in the contract is provided for further reference.

## Details

## Summary

Taker of bid offer will loss point token &  `collateralFee` without any benefit if he calls the `DeliveryPlace::settleAskMaker()` for partial settlement.

## Vulnerability Details

Nothing stops a taker of a bid offer to do partial settlement by calling `settleAskTaker()`, but partial settlement results loss of `collateralFee` and Point token for the taker.
**NOTE**: To execute the PoC given below properly we need to fix 2 issue of this code, I already submitted the report regarding that issue, you can find that issue with this title: _Call to settleAskTaker() will fail every time due to wrong authority check._ In short you need to correct the authority check in `settleAskTaker()` by changing it from `offerInfo.authority` to `stockInfo.authority`, [here](https://github.com/Cyfrin/2024-08-tadle/blob/04fd8634701697184a3f3a5558b41c109866e5f8/src/core/DeliveryPlace.sol#L361).
And change the token type from `makerInfo.tokenAddress` to `marketPlaceInfo.tokenAddress`, [here](https://github.com/Cyfrin/2024-08-tadle/blob/04fd8634701697184a3f3a5558b41c109866e5f8/src/core/DeliveryPlace.sol#L387), I have already submitted the issue, you can find that with this title: _Wrong token is added to userTokenBalanceMap due to incorrect argument_.
I hope you fixed that issue, now lets run the PoC in Premarkets.t.sol contract:

```solidity
    function test_noBenefit() public {
        deal(address(mockPointToken), address(user4), 100e18);

        //@audit User creating a Bid offer, to buy 1000 point
        vm.startPrank(user);
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
        vm.stopPrank();

        //@audit User4 created a stock to sell 500 point to user's Bid offer
        vm.startPrank(user4);
        address offerAddr = GenerateAddress.generateOfferAddress(0);
        preMarktes.createTaker(offerAddr, 500);

        address stock1Addr = GenerateAddress.generateStockAddress(1);
        vm.stopPrank();

        //@audit updateMarket() is called to set the timestamp in 'settlementPeriod' i.e tge was done
        // & we are in now settlementPeriod
        vm.startPrank(user1);
        systemConfig.updateMarket(
            "Backpack",
            address(mockPointToken),
            0.01 * 1e18,
            block.timestamp - 1,
            3600
        );
        //@audit updating the marketPlaceStatus to AskSettling
        systemConfig.updateMarketPlaceStatus(
            "Backpack",
            MarketPlaceStatus.AskSettling
        );
        vm.stopPrank();

        //@audit Now the user came & closed the Bid offer
        vm.prank(user);
        deliveryPlace.closeBidOffer(offerAddr);
        vm.startPrank(user4);
        //@audit user4 tried to settle his Ask type stock so that he can sell points to the user
        mockPointToken.approve(address(tokenManager), 10000 * 10 ** 18);

        uint pointTokenBalancePrevious = mockPointToken.balanceOf(user4);
        uint usdcTokenBalancePrevious = mockUSDCToken.balanceOf(user4);
        console2.log(
            "Point token balance of user4 before settling: ",
            pointTokenBalancePrevious
        );
        console2.log(
            "USDC token balance of user4 before settling: ",
            usdcTokenBalancePrevious
        );
        console2.log(
            "USDC token balance of user before settling: ",
            mockUSDCToken.balanceOf(address(user))
        );
        console2.log(
            "Point token balance of user before settling: ",
            mockPointToken.balanceOf(address(user))
        );
        deliveryPlace.settleAskTaker(stock1Addr, 300);
        vm.stopPrank();
        uint ownerMakerRefund = tokenManager.userTokenBalanceMap(
            address(user),
            address(mockUSDCToken),
            TokenBalanceType.MakerRefund
        );
        uint totalUSDCTokenForUser = ownerMakerRefund +
            mockUSDCToken.balanceOf(address(user));
        uint ownerPointToken = tokenManager.userTokenBalanceMap(
            address(user),
            address(mockPointToken),
            TokenBalanceType.PointToken
        );
        uint totalPointTokenForUser = ownerPointToken +
            mockPointToken.balanceOf(address(user));
        console2.log(
            "USDC token balance of user after settling: ",
            totalUSDCTokenForUser
        );
        console2.log(
            "Point token balance of user after settling: ",
            totalPointTokenForUser
        );
        console2.log(
            "USDC token balance of user4 after settling: ",
            mockUSDCToken.balanceOf(address(user4))
        );
        console2.log(
            "Point token balance of user4 after settling: ",
            mockPointToken.balanceOf(address(user4))
        );
    }

```

Logs:

```Solidity
  Point token balance of user4 before settling:  100000000000000000000
  USDC token balance of user4 before settling:  99999999993825000000000000
  USDC token balance of user before settling:  99999999990000000000000000
  Point token balance of user before settling:  100000000000000000000000000
  USDC token balance of user after settling:  100000000001000000000000000
  Point token balance of user after settling:  100000003000000000000000000
  USDC token balance of user4 after settling:  99999999993825000000000000
  Point token balance of user4 after settling:  97000000000000000000
```

Here you can see as the user4 called the `settleAskTaker()` for partial settlement the Point was deducted from his balance, because before settlement his point token balance was: 100000000000000000000 but after settlement his point token balance came to: 97000000000000000000. But for this partial settlement he should have got USDC according to his settlement amount but he did not get anything, before settlement his USDC token balance was: 99999999993825000000000000 & after settlement his USDC token balance: 99999999993825000000000000 which is same. But if you notice the offer owner Point token balance and USDC token balance, both increased.

## Impact

The taker of a bid offer will loss his point token and `collateralFee` if he calls the `settleAskMaker()` for partial settlement.

## Tool Used

Manual review, Foundry

## Recommendation

It could be design decission to not allow any taker for partial settlement, but if so then the protocol should revert the call immediately if the settlement is partial, so that the taker do not loss his tokens.

## Related Links

<https://github.com/Cyfrin/2024-08-tadle/blob/04fd8634701697184a3f3a5558b41c109866e5f8/src/core/DeliveryPlace.sol#L335>
