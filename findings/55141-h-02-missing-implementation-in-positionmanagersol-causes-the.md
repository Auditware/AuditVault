---
tags:
  - lang/solidity
  - platform/shieldify
  - has/github
  - severity/high
  - sector/bridge
protocol: "[[Surge]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Surge-Security-Review.md"
genome:
  - "[[dos-resistance]]"
  - "[[direct-drain]]"
---
# [H-02] Missing Implementation in `PositionManager.sol` Causes the Liquidity in Positions to Not Be Retrievable

- id: 55141
- impact: HIGH
- protocol: Surge
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Surge-Security-Review.md

## Summary


This bug report discusses a problem with the `PositionManager` code that can result in a high risk situation. The code allows for the collection of fees and addition of liquidity, but there is no way for the admin to transfer these positions or access the liquidity they hold. This can lead to a loss of funds and make it difficult for the admin to collect fees efficiently. The recommendation is to implement logic that allows for the transfer of LP positions or access to the underlying liquidity. The team has acknowledged the issue.

## Details

## Severity

High Risk

## Description

`PositionManager` can receive liquidity position NFTs, collect fees, and add liquidity to them but there is no way for the admin to transfer these positions outside the contract, access the liquidity they are holding, or burn them.

## Location of Affected Code

File: [PositionManager.sol]()

## Impact

As a result, the underlying liquidity will not be accessible anymore resulting in a loss of funds. Furthermore, these LP positions will be configured for a specific price range. Once the price goes outside of this price range it is normal for liquidity providers to be able to move the liquidity to another price range that is more profitable by decreasing the liquidity from their current LP position and to create a new position with a more relevant price range.

So over some time when the price moves the admin will not be able to collect fees efficiently as well.

## Recommendation

Consider implementing logic for either transferring the LP position out of the contract or logic that will be able to access the underlying liquidity of the LP positions that are in control of the `PositionManager`.

## Team Response

Acknowledged.
