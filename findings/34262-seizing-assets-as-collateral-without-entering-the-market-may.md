---
tags:
  - lang/solidity
  - sector/lending
  - sector/oracle
  - platform/mixbytes
  - has/github
  - severity/high
  - vuln/logic/liquidation-logic
  - fix/add-circuit-breaker
  - novelty/variant
  - misassumption/math-is-safe
  - fix/redesign-logic
protocol: "[[DForce]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/dForce/Lending%20v2/README.md#5-seizing-assets-as-collateral-without-entering-the-market-may-result-in-incorrect-value-calculation"
genome:
  - "[[liquidation-logic]]"
  - "[[add-circuit-breaker]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
---
# Seizing assets as collateral without entering the market may result in incorrect value calculation

- id: 34262
- impact: HIGH
- protocol: [[DForce]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/dForce/Lending%20v2/README.md#5-seizing-assets-as-collateral-without-entering-the-market-may-result-in-incorrect-value-calculation

## Summary


Report Summary:

The bug report states that during liquidation, collateral can be seized even if the borrower did not use it in the market. This is a high priority issue as it can result in incorrect payments to the liquidator. The code related to this issue is provided and a recommendation is made to prevent seizure of assets that were not explicitly listed by the borrower.

## Details

##### Description
During liquidation, collateral may be seized even if the borrower has not entered the market with it. Sanity checks regarding the price oracle status for the seized asset will be skipped if the market has not been entered for this asset.

This issue is labeled as `high` since an outdated or inaccurate `iTokenCollateral` price could result in either excessive or insufficient payments to the liquidator.

Related code:
 - the `liquidateCalculateSeizeTokensV2` function: https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/ControllerV2ExtraImplicit.sol#L477
 - `_liquidateBorrowInternal` https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/iTokenV2.sol#L76
 - `beforeLiquidateBorrow` https://github.com/dforce-network/LendingContracts/blob/6f3a7b6946d8226b38e7f0d67a50e68a28fe5165/contracts/ControllerV2.sol#L346
##### Recommendation
We recommend prohibiting the seizure of assets that are not explicitly listed by the borrower as allowed collateral through `enterMarket`.
