---
tags:
  - lang/solidity
  - sector/lending
  - sector/token
  - platform/trailofbits
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Reserve]]"
auditors:
  - "[[Felipe Manzano]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2022-08-reserve-protocol-securityreview.pdf"
genome:
  - "[[griefing]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# All auction initiation attempts may fail

- id: 57069
- impact: HIGH
- protocol: [[Reserve]]
- reporter: Felipe Manzano (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2022-08-reserve-protocol-securityreview.pdf

## Summary


This bug report discusses a potential security issue with the token auction platform used by the Reserve protocol. The issue is related to insufficient token allowance, which may prevent auctions from occurring if the owner of the EasyAuction contract changes the fee. This could have negative effects on the value of RToken, rewards paid to RSR stakers, and the system's capitalization. The report suggests short-term and long-term solutions to address the issue.

## Details

## Security Assessment Report

## Difficulty: High

## Type: Data Validation

### Description
The token auction platform used by the Reserve protocol, the Gnosis Auction platform, may not be provided with a large enough allowance of the token to be auctioned. As of this writing, the fee imposed by the EasyAuction contract is set to zero. However, if the owner of the EasyAuction contract changes the fee, this issue will immediately pose a severe risk, as it will prevent any auctions from occurring.

The Reserve protocol relies on token auctions to increase the value of an RToken, to increase the amount of rewards paid to RSR stakers, and to recapitalize the system if one or more collateral tokens have defaulted.

The GnosisTrade contract initiates auctions by calling the `initiateAuction` function in the EasyAuction contract (an external Gnosis-created contract). Before calling `initiateAuction`, the GnosisTrade contract approves the EasyAuction contract to transfer `sellAmount` of sell tokens (Figure 4.1). This allows the `initiateAuction` function to transfer the number of sell tokens necessary for it to start the auction.

```solidity
function init(
    IBroker broker_,
    address origin_,
    IGnosis gnosis_,
    uint32 auctionLength,
    uint256 minBidSize,
    TradeRequest memory req
) external stateTransition(TradeStatus.NOT_STARTED, TradeStatus.OPEN) {
    // == Interactions ==
    IERC20Upgradeable(address(sell)).safeIncreaseAllowance(address(gnosis), sellAmount);
    
    auctionId = gnosis.initiateAuction(
        sell,
        buy,
        endTime,
        endTime,
        uint96(sellAmount),
        uint96(req.minBuyAmount),
        minBidSize,
        req.minBuyAmount, // TODO to double-check this usage of gnosis later
        false,
        address(0),
        new bytes(0)
    );
}
```
*Figure 4.1: Part of the init function in `GnosisTrade.sol#L53-94`*

However, the number of sell tokens that need to be transferred from the GnosisTrade contract to the EasyAuction contract is actually more than the `sellAmount`. This is because the EasyAuction contract takes a fee, which is capped at 1.5%, in exchange for running the auction (Figure 4.2). Thus, the token allowance may be insufficient and cause the `initiateAuction` call to revert.

```solidity
function initiateAuction(
    IERC20 _auctioningToken,
    IERC20 _biddingToken,
    uint256 orderCancellationEndDate,
    uint256 auctionEndDate,
    uint96 _auctionedSellAmount,
    uint96 _minBuyAmount,
    uint256 minimumBiddingAmountPerOrder,
    uint256 minFundingThreshold,
    bool isAtomicClosureAllowed,
    address accessManagerContract,
    bytes memory accessManagerContractData
) public returns (uint256) {
    // withdraws sellAmount + fees
    _auctioningToken.safeTransferFrom(
        msg.sender,
        address(this),
        _auctionedSellAmount.mul(FEE_DENOMINATOR.add(feeNumerator)).div(FEE_DENOMINATOR) //[0]
    );
    // [...]
}
```
*Figure 4.2: Part of the initiateAuction function in `EasyAuction.sol#L152-227`*

### Exploit Scenario
The protocol initiates an auction to sell COMP tokens in exchange for RTokens. However, because the EasyAuction contract’s token allowance is insufficient, the call to `initiateAuction` reverts, and the token auction does not occur.

### Recommendations
**Short term:** Create a `uint256` value called `actualSellAmount` (or a similar name) that is equal to `sellAmount` divided by 1 plus the EasyAuction fee. Have the GnosisTrade contract call `initiateAuction` with `actualSellAmount` instead of `sellAmount`, but continue to approve the EasyAuction contract to transfer `sellAmount`.

**Long term:** Ensure that all mock contracts that are used for testing closely resemble the corresponding original contracts. Additionally, ensure that all upstream computations that rely on `sellAmount` are updated to account for the fee.
