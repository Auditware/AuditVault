---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - severity/high
  - sector/dex
  - sector/lending
  - sector/perpetuals
  - sector/vault
protocol: "[[Increment Finance]]"
auditors:
  - "[[Vara Prasad Bandaru]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2022-09-incrementprotocol-securityreview.pdf"
genome:
  - "[[liquidation-logic]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
---
# Funding payments are made in the wrong token

- id: 17366
- impact: HIGH
- protocol: [[Increment Finance]]: Increment Protocol
- reporter: Vara Prasad Bandaru (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2022-09-incrementprotocol-securityreview.pdf

## Summary


A bug has been found in the ClearingHouse.sol contract of Increment Protocol, which is causing incorrect calculations of users' profit-and-loss (PnL) values, increased risk of liquidations and delayed convergence of a Perpetual contract's value with that of the underlying base asset. 

The bug is caused by the protocol executing a trade or liquidity provision, which calls the _settleUserFundingPayments function in the ClearingHouse contract. This function sums the funding payments due to the user across all perpetual markets and should change the user's UA balance. However, the Vault contract's settlePnL function is instead changing the user's UA balance with the funding payments expressed in vBase, which is causing the discrepancy. 

The exploit scenario is that if the BTC/USD perpetual market's mark price is significantly higher than the index price, and a user holds a short position and decides to exit the market, the protocol calculates their funding payments in BTC and does not convert them to their UA equivalents before updating their balance, thus they make much less than expected. 

The recommendation is to use the vBase.indexPrice() function to convert vBase token amounts to UA before the call to vault.settlePnL in the short term, and to expand the unit test suite to cover additional edge cases and to ensure that the system behaves as expected in the long term.

## Details

## Difficulty: Medium

## Type: Data Validation

## Target: contracts/ClearingHouse.sol

## Description

The funding payments owed to users are made in vBase instead of UA tokens; this results in incorrect calculations of users’ profit-and-loss (PnL) values, an increased risk of liquidations, and a delay in the convergence of a Perpetual contract’s value with that of the underlying base asset.

When the protocol executes a trade or liquidity provision, one of its first steps is settling the funding payments that are due to the calling user. To do that, it calls the `_settleUserFundingPayments` function in the ClearingHouse contract (figure 6.1). The function sums the funding payments due to the user (as a trader and/or a liquidity provider) across all perpetual markets. Once the function has determined the final funding payment due to the user (`fundingPayments`), the Vault contract’s `settlePnL` function changes the UA balance of the user.

```solidity
function _settleUserFundingPayments(address account) internal {
    int256 fundingPayments;
    uint256 numMarkets = getNumMarkets();
    for (uint256 i = 0; i < numMarkets;) {
        fundingPayments += perpetuals[i].settleTrader(account) +
                          perpetuals[i].settleLp(account);
        unchecked {
            ++i;
        }
    }
    if (fundingPayments != 0) {
        vault.settlePnL(account, fundingPayments);
    }
}
```
**Figure 6.1:** The `_settleUserFundingPayments` function in `ClearingHouse.sol#L637-651`

Both the `Perpetual.settleTrader` and `Perpetual.settleLp` functions internally call `_getFundingPayments` to calculate the funding payment due to the user for a given market (figure 6.2).

```solidity
function _getFundingPayments(
    bool isLong,
    int256 userCumFundingRate,
    int256 globalCumFundingRate,
    int256 vBaseAmountToSettle
) internal pure returns (int256 upcomingFundingPayment) {
    [...]
    if (userCumFundingRate != globalCumFundingRate) {
        int256 upcomingFundingRate = isLong
            ? userCumFundingRate - globalCumFundingRate
            : globalCumFundingRate - userCumFundingRate;
        // fundingPayments = fundingRate * vBaseAmountToSettle
        upcomingFundingPayment = upcomingFundingRate.wadMul(vBaseAmountToSettle);
    }
}
```
**Figure 6.2:** The `_getFundingPayments` function in `Perpetual.sol#L1152-1173`

However, the `upcomingFundingPayment` value is expressed in vBase, since it is the product of a percentage, which is unitless, and a vBase token amount, `vBaseAmountToSettle`. Thus, the `fundingPayments` value that is calculated in `_settleUserFundingPayments` is also expressed in vBase. However, the `settlePnL` function internally updates the user’s balance of UA, not vBase. As a result, the user’s UA balance will be incorrect, since the user’s profit or loss may be significantly higher or lower than it should be. This discrepancy is a function of the price difference between the vBase and UA tokens.

The use of vBase tokens for funding payments causes three issues. First, when withdrawing UA tokens, the user may lose or gain much more than expected. Second, since the UA balance affects the user’s collateral reserve total, the balance update may increase or decrease the user’s risk of liquidation. Finally, since funding payments are not made in the notional asset, the convergence between the mark and index prices may be delayed.

## Exploit Scenario

The BTC/USD perpetual market’s mark price is significantly higher than the index price. Alice, who holds a short position, decides to exit the market. However, the protocol calculates her funding payments in BTC and does not convert them to their UA equivalents before updating her balance. Thus, Alice makes much less than expected.

## Recommendations

Short term, use the `vBase.indexPrice()` function to convert vBase token amounts to UA before the call to `vault.settlePnL`.

Long term, expand the unit test suite to cover additional edge cases and to ensure that the system behaves as expected.
