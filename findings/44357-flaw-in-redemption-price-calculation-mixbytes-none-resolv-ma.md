---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/stable

protocol: "[[Resolv]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Resolv/PoR%20Oracles/README.md#1-flaw-in-redemption-price-calculation"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
---
# Flaw in Redemption Price Calculation

- id: 44357
- impact: HIGH
- protocol: [[Resolv]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Resolv/PoR%20Oracles/README.md#1-flaw-in-redemption-price-calculation

## Summary


Critical issue in the `redeem` function of the `UsrRedemptionExtension` contract. The `redeemPrice` is calculated incorrectly, leading to incorrect calculations and potential financial loss for the protocol or users. The issue is classified as critical and it is recommended to modify the code to divide by `redeemPrice` instead of multiplying it to align with market fluctuations.

## Details

##### Description
A critical issue was uncovered in the `redeem` function of the `UsrRedemptionExtension` contract. The flaw lies in the way the `redeemPrice` is determined. The current code fetches the `redeemPrice` as the cost of 1 USDC in USR, mistakenly multiplying this price by the USR amount, which leads to incorrect calculations and loss for the protocol or users. For instance, if the USDC market price rises to $1.03, for 100 burned USR, the user will receive 103 USDC, which at the new market price would be approximately $106. This flaw can lead to users receiving more than intended or less in cases of USDC price decrese. The issue is classified as of **critical** severity due to its potential for financial impact.

##### Recommendation
We recommend modifying the code to divide by `redeemPrice` instead of multiplying it, thereby ensuring the price calculation aligns with potential market fluctuations of USDC.
