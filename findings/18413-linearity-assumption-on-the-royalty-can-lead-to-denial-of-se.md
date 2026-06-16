---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - severity/high
  - sector/dex
  - sector/launchpad
  - sector/nft
  - sector/nft-marketplace
protocol: "[[Sudoswap]]"
auditors:
  - "[[Hans]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2023-06-01-Sudoswap.md"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[royalty-edge-cases]]"
---
# Linearity assumption on the royalty can lead to denial of service

- id: 18413
- impact: HIGH
- protocol: [[Sudoswap]]
- reporter: Hans (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2023-06-01-Sudoswap.md

## Summary


This bug report is about the `VeryFastRouter::swap` function in the Sudoswap protocol, which relies on two internal functions to find the maximum possible amount of tokens to be swapped via binary search. The protocol is designed to integrate various royalty info providers, which can be malicious and return a non-linear royalty amount. This can lead to the max fillable functions returning incorrect `priceToFillAt` and `numItemsToFill` values, which can cause legitimate swaps to fail. The bug is considered to be high severity.

The recommended mitigation for this bug is to use the actual royalty amount to calculate `priceToFillAt` and `numItemsToFill`, rather than relying on the assumption that the royalty amount is linear. Both Sudoswap and Cyfrin have acknowledged this bug.

## Details

**Description:**
`VeryFastRouter::swap` relies on the internal functions [`VeryFastRouter::_findMaxFillableAmtForSell`](https://github.com/sudoswap/lssvm2/blob/78d38753b2042d7813132f26e5573c6699b605ef/src/VeryFastRouter.sol#L556) and [`VeryFastRouter::_findMaxFillableAmtForBuy`](https://github.com/sudoswap/lssvm2/blob/78d38753b2042d7813132f26e5573c6699b605ef/src/VeryFastRouter.sol#L503) to find the maximum possible amount of tokens to be swapped via binary search as below:

```solidity
VeryFastRouter.sol
576:         // Perform binary search
577:         while (start <= end) {
578:             // We check the price to sell index + 1
579:             (
580:                 CurveErrorCodes.Error error,
581:                 /* newSpotPrice */
582:                 ,
583:                 /* newDelta */
584:                 ,
585:                 uint256 currentOutput,
586:                 /* tradeFee */
587:                 ,
588:                 /* protocolFee */
589:             ) = pair.bondingCurve().getSellInfo(
590:                 spotPrice,
591:                 // get delta from deltaAndFeeMultiplier
592:                 uint128(deltaAndFeeMultiplier >> 96),
593:                 (start + end) / 2,
594:                 // get feeMultiplier from deltaAndFeeMultiplier
595:                 uint96(deltaAndFeeMultiplier),
596:                 protocolFeeMultiplier
597:             );
598:             currentOutput -= currentOutput * royaltyAmount / BASE;//@audit-info assumes royalty amount is linear
599:             // If the bonding curve has a math error, or
600:             // if the current output is too low relative to our max output, or
601:             // if the current output is greater than the pair's token balance,
602:             // then we recurse on the left half (i.e. less items)
603:             if (
604:                 error != CurveErrorCodes.Error.OK || currentOutput < minOutputPerNumNFTs[(start + end) / 2 - 1] /* this is the max cost we are willing to pay, zero-indexed */
605:                     || currentOutput > pairTokenBalance
606:             ) {
607:                 end = (start + end) / 2 - 1;
608:             }
609:             // Otherwise, we recurse on the right half (i.e. more items)
610:             else {
611:                 numItemsToFill = (start + end) / 2;
612:                 start = (start + end) / 2 + 1;
613:                 priceToFillAt = currentOutput;
614:             }
615:         }
```
The protocol is designed to integrate various royalty info providers. Line 598 assumes the royalty amount is linear; however, this assumption can be violated, especially in the case of external royalty info providers who could be malicious and return a non-linear royalty amount.
For example, the royalty amount can be a function of the number of tokens to be swapped (e.g. greater/fewer royalties for a larger/smaller sale amount).
In this case, line 598 will be violated, and the max fillable functions will return incorrect `priceToFillAt` and `numItemsToFill`.

For example, `KODAV2` royalty calculation is NOT accurately linear to the input amount due to roundings.

```solidity
    function getKODAV2RoyaltyInfo(address _tokenAddress, uint256 _id, uint256 _amount)
        external
        view
        override
        returns (address payable[] memory receivers, uint256[] memory amounts)
    {
        // Get the edition the token is part of
        uint256 _editionNumber = IKODAV2(_tokenAddress).editionOfTokenId(_id);
        require(_editionNumber > 0, "Edition not found for token ID");

        // Get existing artist commission
        (address artistAccount, uint256 artistCommissionRate) = IKODAV2(_tokenAddress).artistCommission(_editionNumber);

        // work out the expected royalty payment
        uint256 totalRoyaltyToPay = (_amount / modulo) * creatorRoyaltiesFee;

        // Get optional commission set against the edition and work out the expected commission
        (uint256 optionalCommissionRate, address optionalCommissionRecipient) =
            IKODAV2(_tokenAddress).editionOptionalCommission(_editionNumber);
        if (optionalCommissionRate > 0) {
            receivers = new address payable[](2);
            amounts = new uint256[](2);

            uint256 totalCommission = artistCommissionRate + optionalCommissionRate;

            // Add the artist and commission
            receivers[0] = payable(artistAccount);
            amounts[0] = (totalRoyaltyToPay / totalCommission) * artistCommissionRate;//@audit-info rounding occurs here

            // Add optional splits
            receivers[1] = payable(optionalCommissionRecipient);
            amounts[1] = (totalRoyaltyToPay / totalCommission) * optionalCommissionRate;//@audit-info rounding occurs here
        } else {
            receivers = new address payable[](1);
            amounts = new uint256[](1);

            // Add the artist and commission
            receivers[0] = payable(artistAccount);
            amounts[0] = totalRoyaltyToPay;
        }

        return (receivers, amounts);
    }
```

If the royalty info provider returned higher royalty for a larger sale amount, the `priceToFillAt` will be higher than the actual sale.
Note that the `priceToFillAt` value calculated with the linearity assumption is used as a [minimum expected output parameter](https://github.com/sudoswap/lssvm2/blob/78d38753b2042d7813132f26e5573c6699b605ef/src/VeryFastRouter.sol#L351) for the function `ILSSVMPairERC721::swapNFTsForToken` within the swap sell logic. Similar reasoning holds for the swap-buy logic.

```solidity
VeryFastRouter.sol
345:                 // If we can sell at least 1 item...
346:                 if (numItemsToFill != 0) {
347:                     // If property checking is needed, do the property check swap
348:                     if (order.doPropertyCheck) {
349:                         outputAmount = ILSSVMPairERC721(address(order.pair)).swapNFTsForToken(
350:                             order.nftIds[:numItemsToFill],
351:                             priceToFillAt,//@audit-info min expected output
352:                             swapOrder.tokenRecipient,
353:                             true,
354:                             msg.sender,
355:                             order.propertyCheckParams
356:                         );
357:                     }
358:                     // Otherwise do a normal sell swap
359:                     else {
360:                         // Get subarray if ERC721
361:                         if (order.isERC721) {
362:                             outputAmount = order.pair.swapNFTsForToken(
363:                                 order.nftIds[:numItemsToFill], priceToFillAt, swapOrder.tokenRecipient, true, msg.sender
364:                             );
365:                         }
366:                         // For 1155 swaps, wrap as number
367:                         else {
368:                             outputAmount = order.pair.swapNFTsForToken(
369:                                 _wrapUintAsArray(numItemsToFill),
370:                                 priceToFillAt,
371:                                 swapOrder.tokenRecipient,
372:                                 true,
373:                                 msg.sender
374:                             );
375:                         }
376:                     }
377:                 }
```
Thus, the swap will fail if the `priceToFillAt` is calculated to be greater than the actual sale.

The Cyfrin team acknowledges that Sudoswap expects all collections to be ERC-2981 compliant, and EIP-2981 states that the royalty amount should be linear to the amount.
However, tokens can use a royalty lookup that is not compliant with EIP-2981 and can be abused to prevent honest users' valid transactions, so the protocol should not rely on the assumption that the royalty amount is linear.

**Impact:**
The linearity assumption can be violated, especially in the case of external royalty info providers (possibly malicious), and this can lead to protocol failing to behave as expected, as legitimate swaps will fail.
Due to these incorrect assumptions affecting the core functions, we evaluate the severity to HIGH.

**Recommended Mitigation:**
While we understand the protocol team intended to reduce gas costs by using the linearity assumption, we recommend using the actual royalty amount to calculate `priceToFillAt` and `numItemsToFill`.

**Sudoswap:**
Acknowledged. It is expected that the majority of NFTs will be ERC-2981 compliant.

**Cyfrin:**
Acknowledged.
