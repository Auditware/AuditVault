---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - sector/insurance
protocol: "[[CAP Labs Covered Agent Protocol]]"
auditors:
  - Benjamin Samuels
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-05-caplabs-coveredagentprotocol-securityreview.pdf"
genome:
  - "[[frontrun-exposure]]"
  - "[[mev/frontrun]]"
---
# Fee auction allows buying zero assets, leading to front-running attacks

- id: 61536
- impact: HIGH
- protocol: CAP Labs Covered Agent Protocol
- reporter: Benjamin Samuels (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-05-caplabs-coveredagentprotocol-securityreview.pdf

## Summary


This bug report discusses a problem with the FeeAuction contract's buy function, which allows users to purchase a basket of assets at a given price. However, there is no way for users to specify which auction their buy transaction should be applied to, leading to a race condition where the loser of the race will pay and receive no tokens. This can be exploited by a malicious actor who can observe pending buy transactions and execute them first, depleting asset balances and forcing subsequent transactions to pay without receiving any assets. The report recommends adding a validation check in the code to prevent this exploit, and also suggests implementing a more robust auction system in the long term to prevent such attacks. 

## Details

## Diﬃculty: Low

## Type: Data Validation

## Description
The FeeAuction contract’s buy function allows users to purchase a basket of assets at a given price. However, there is no way for users to specify which auction their buy transaction should be applied to, leading to a race condition where the loser of the race will pay and receive no tokens.

```solidity
function _transferOutAssets(address[] calldata _assets, address _receiver)
internal
returns (uint256[] memory balances)
{
    uint256 assetsLength = _assets.length;
    balances = new uint256[](assetsLength);
    for (uint256 i; i < assetsLength; ++i) {
        address asset = _assets[i];
        balances[i] = IERC20(asset).balanceOf(address(this));
        if (balances[i] > 0) IERC20(asset).safeTransfer(_receiver, balances[i]);
    }
}
```

*Figure 13.1: Code snippet from the _transferOutAssets function (contracts/feeAuction/FeeAuction.sol#L113-L124)*

The `_transferOutAssets` function in the FeeAuction contract transfers assets to a receiver only if the asset balance is positive, but it does not revert if there is no balance for the asset or if the buy call was intended for a previous auction. This enables a front-running attack where a malicious actor can observe pending buy transactions in the mempool, execute them first to deplete asset balances, and force subsequent transactions to pay without receiving any assets. Since each successful transaction doubles the next auction’s starting price, victims end up paying double the price without receiving anything in return.

## Exploit Scenario
A malicious actor monitors the mempool for legitimate FeeAuction buy transactions. When one is detected, they front-run it with their own transaction to buy the same assets. When the victim’s transaction executes, the asset balances are already zero, but the payment is still taken. The victim receives nothing while paying double the price the attacker paid due to the price doubling after each successful purchase.

## Recommendations
Short term, add a validation check in the `_transferOutAssets` function to ensure that the sum of asset balances is greater than zero before accepting payment, reverting the transaction if zero assets would be transferred. 

Long term, implement a more robust auction system that reserves assets for specific bids during their processing, preventing front-running attacks. Additionally, consider adding comprehensive transaction simulation tests that verify that assets are actually transferred during an auction, and that edge cases like zero-balance transfers are properly handled.
