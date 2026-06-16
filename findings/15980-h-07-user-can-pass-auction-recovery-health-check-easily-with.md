---
tags:
  - lang/solidity
  - sector/lending
  - sector/nft
  - sector/nft-lending
  - sector/options
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/reentrancy/single-function
  - trigger/flash-loan
  - precondition/flash-loan-available
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - trigger/reentrancy-callback
protocol: "[[ParaSpace]]"
auditors:
  - "[[Trust]]"
report: "https://code4rena.com/reports/2022-11-paraspace"
genome:
  - "[[single-function]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[flashloan-callback-auth]]"
  - "[[liquidation-underwater]]"
  - "[[reentrancy-guard]]"
  - "[[timestamp-dependence]]"
---
# [H-07] User can pass auction recovery health check easily with flashloan

- id: 15980
- impact: HIGH
- protocol: [[ParaSpace]]
- reporter: Trust (Code4rena)
- source: https://code4rena.com/reports/2022-11-paraspace

## Summary


This bug report is about an auction mechanism in the ParaSpace protocol that allows users to liquidate their NFT holdings and receive fair value. The issue is that users can bypass the recovery health check by borrowing a large amount of funds, depositing them as collateral, registering auction invalidation, removing the collateral and repaying the flash loan. This bug was found using manual audit and has been classified as a HIGH or MED level impact.

To mitigate this issue, it is recommended to implement a function that holds the user's assets for at least five minutes before releasing them back to the user and cancelling all their auctions. This will ensure that the user has definitely recovered and the auction invalidation is valid.

## Details


<https://github.com/code-423n4/2022-11-paraspace/blob/c6820a279c64a299a783955749fdc977de8f0449/paraspace-core/contracts/protocol/pool/PoolParameters.sol#L281>

ParaSpace features an auction mechanism to liquidate user's NFT holdings and receive fair value. User has the option, before liquidation actually happens but after auction started, to top up their account to above recovery factor (> 1.5 instead of > 1) and use `setAuctionValidityTime()` to invalidate the auction.

    require(
        erc721HealthFactor > ps._auctionRecoveryHealthFactor,
        Errors.ERC721_HEALTH_FACTOR_NOT_ABOVE_THRESHOLD
    );
    userConfig.auctionValidityTime = block.timestamp;

The issue is that the check validates the account is topped in the moment the TX is executed. Therefore, user may very easily make it appear they have fully recovered by borrowing a large amount of funds, depositing them as collateral, registering auction invalidation, removing the collateral and repaying the flash loan. Reentrancy guards are not effective to prevent this attack because all these actions are done in a sequence, one finishes before the other begins. However, it is clear user cannot immediately finish this attack below liquidation threshold because health factor check will not allow it.

Still, the recovery feature is a very important feature of the protocol and a large part of what makes it unique, which is why I think it is very significant that it can be bypassed.<br>
I am on the fence on whether this should be HIGH or MED level impact, would support judge's verdict either way.

### Impact

User can pass auction recovery health check easily with flashloan.

### Proof of Concept

1.  User places NFT as collateral in the protocol
2.  User borrows using the NFT as collateral
3.  NFT price drops and health factor is lower than liquidation threshold
4.  Auction to sell NFT initiates
5.  User deposits just enough to be above liquidation threshold
6.  User now flashloans 1000 WETH
    1.  supply 1000 WETH to the protocol
    2.  call setAuctionValidityTime(), cancelling the auction
    3.  withdraw the 1000 WETH from the protocol
    4.  pay back the 1000 WETH flashloan
7.  End result is bypassing of recovery health check

### Recommended Mitigation Steps

In order to know user has definitely recovered, implement it as a function which holds the user's assets for X time (at least 5 minutes), then releases it back to the user and cancelling all their auctions.

**[LSDan (judge) commented](https://github.com/code-423n4/2022-11-paraspace-findings/issues/478#issuecomment-1400967168):**
 > I agree with high risk for this. It's a direct attack on the intended functionality of the protocol that can result in a liquidation delay and potential loss of funds.



***
