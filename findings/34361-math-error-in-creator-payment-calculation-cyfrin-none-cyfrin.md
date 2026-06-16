---
tags:
  - lang/solidity
  - sector/oracle
  - sector/stable
  - platform/cyfrin
  - has/github
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Tunnl]]"
auditors:
  - "[[Hans]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2024-07-01-cyfrin-tunnl-v2.0.md"
genome:
  - "[[fee-calculation]]"
  - "[[variant]]"
  - "[[fee-theft]]"
  - "[[chainlink-round-completeness]]"
  - "[[fee-accounting]]"
  - "[[timestamp-dependence]]"
---
# Math error in creator payment calculation

- id: 34361
- impact: HIGH
- protocol: [[Tunnl]]
- reporter: Hans (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2024-07-01-cyfrin-tunnl-v2.0.md

## Summary


Tunnl protocol has 3 types of fees: flat fee, advertiser percentage fee, and creator percentage fee. The maximum offer amount is calculated by multiplying the flat fee and advertiser fee with the maximum offer amount set by the advertiser. However, in the function `TunnlTwitterOffers::sendFunctionsRequest()`, the wrong fee percentage is used which results in incorrect payment to the creator. This can lead to two problems: if the creator fee percentage is lower, the payment distribution will fail and if the creator fee percentage is higher, the creator will receive less than the offered amount. This is a critical issue as it affects the functionality of the protocol and the creator's payment. A fix has been proposed and implemented in the Tunnl protocol. 

## Details

**Description:** The Tunnl protocol applies 3 kinds of fees.
- **Flat Fee**: The advertiser pays a flat fee and it is charged on acceptance of offers.
- **Advertiser Percentage Fee**: The advertiser percentage fee is the percentage fee that is charged to the advertiser. It is an extra amount added to the offer value.
- **Creator Percentage Fee**: The creator percentage fee is the percentage fee that is charged to the creator. It is charged based on the amount the creator is paid.

The advertisers create offers starting from a maximum offer amount $maxOfferAmount$ and the total amount including all posssible fees are calculated as $maxOfferAmount * (1 + advertiserFee)+flatFee$.
This amount is stored in the `Offer::maxValueUsdc` and used in many places for accounting.

After a successful verification, `TunnlTwitterOffers::sendFunctionsRequest()` is called to get the actual amount that should be paid to the creator.
This function calls a function `FunctionClient::_sendRequest()` with the request and the maximum offer amount is encoded in the request arguments.
But in the calculation of `maxCreatorPayment`, `s_config.creatorFeePercentageBP` is used instead of `s_config.advertiserFeePercentageBP`.
```solidity
        uint256 maxCreatorPayment = uint256((s_offers[offerId].maxValueUsdc - s_offers[offerId].flatFeeUsdc) * 10000)
            / uint256(10000 + s_config.creatorFeePercentageBP);//@audit-issue this should be 10000+s_config.advertiserFeePercentageBP

        console.log("maxCreatorPayment: %s", maxCreatorPayment);//@audit-info

        bytes[] memory bytesArgs = new bytes[](4);
        bytesArgs[0] = abi.encode(offerId);
        bytesArgs[1] = abi.encodePacked(s_offers[offerId].creationDate);
        bytesArgs[2] = abi.encodePacked(maxCreatorPayment);//@audit-info maximum offer amount relayed
        bytesArgs[3] = abi.encodePacked(s_offers[offerId].offerDurationSeconds);
        req.setBytesArgs(bytesArgs);

        bytes32 requestId = _sendRequest(
            req.encodeCBOR(),
            s_config.functionsSubscriptionId,
            s_config.functionsCallbackGasLimit,
            s_config.functionsDonId
        );
```
The current implementation does not change the payment according to the performance of the content (e.g. likes, views, ... ) and the relayed maximum amount is fully paid to the creator. Hence, the final payment to the creator is being wrong.

This error can lead to two kinds of problems.
- If `creatorFeePercentageBP<advertiserFeePercentageBP`, `maxCreatorPayment` becomes larger than the actual maximum offered amount and the payment distribution in the function `TunnlTwitterOffers::fulfillRequest` will revert with `Exceeds max` error.
- If `creatorFeePercentageBP>advertiserFeePercentageBP`, `maxCreatorPayment` becomes less than the actual maximum offered amount and the creator gets paid less amount.

Note that the current test suite belongs to the first case but the errors are not caught because request fulfillment is simulated with an artificial value rather than the actual value that is set by the nodes using the `calculatepayment.js` script.
```solidity
    function test_PayOut() public {
        // Define the amount to be paid in USDC
        uint256 amountPaidUsdc = uint256(uint256(100e6));
        test_Verification_Success();
        // Warp time for payout and perform Chainlink automation
        vm.warp(block.timestamp + (1 weeks - 100));
        performUpkeep();
        // Fulfill request for payout  with PayOutamount
        mockFunctionsRouter.fulfill(
            address(tunnlTwitterOffers),
            functionsRequestIds[offerId],
            abi.encode(amountPaidUsdc),//@audit-info should be same to the maxCreatorPayout in the current implementation
            ""
        );

        // Assert balances after payout
        assertEq(mockUsdcToken.balanceOf(advertiser), 0);
        assertEq(mockUsdcToken.balanceOf(address(tunnlTwitterOffers)), (0));
        assertEq(
            mockUsdcToken.balanceOf(contentCreator),
            amountPaidUsdc - (amountPaidUsdc * tunnlTwitterOffers.getConfig().creatorFeePercentageBP) / 10000
        );
    }
```

**Impact:** We evaluate the impact to be CRITICAL because the protocol will not function at all or the creator gets less amount than offered systematically.

**Proof Of Concept:**
Because it is not easy to check the actual `maxCreatorPayment` value that is set as a request argument, we inserted a line to log its value in the function `TunnlTwitterOffers::sendFunctionsRequest()`.

```solidity
console.log("maxCreatorPayment: %s", maxCreatorPayment);
```
Running the test case `test_PayOut()` outputs as below.

```bash
[PASS] test_PayOut() (gas: 531524)
Logs:
  100000000 110000000 <- Max offered amount and maxValueUsdc
  maxCreatorPayment: 102439024 <- This must be the same to the offered amount 100e6
  maxCreatorPayment: 102439024
```
**Recommended Mitigation:** Fix the `sendFunctionsRequest()` function as below. Note that the team reported another issue in using the fee percentage value from `s_config` instead of the `s_offers[offerId]` and the mitigiation below reflects that as well.
```diff
        uint256 maxCreatorPayment = uint256((s_offers[offerId].maxValueUsdc - s_offers[offerId].flatFeeUsdc) * 10000)//@audit-info why not use the percentage directly - (s_offers[offerId].maxValueUsdc - s_offers[offerId].flatFeeUsdc) * (10000 - s_config.creatorFeePercentageBP) / 10000
--            / uint256(10000 + s_config.creatorFeePercentageBP);
++           / uint256(10000 + s_offers[offerId].advertiserFeePercentageBP);
```
**Tunnl:** Fixed in [PR 37](https://github.com/tunnl-io/Tunnl-Contracts/pull/37/files).

**Cyfrin:** Verified.

\clearpage
