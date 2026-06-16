---
tags:
  - lang/solidity
  - platform/cantina
  - severity/high
  - sector/vault
protocol: "[[Royco]]"
auditors:
  - "[[Kurt Barry]]"
report: "https://cdn.cantina.xyz/reports/cantina_royco_august2024.pdf"
genome:
  - "[[fee-calculation]]"
  - "[[fee-theft]]"
  - "[[fee-accounting]]"
---
# Amount of protocol fees owed will be more than intended in ﬁrst claim 

- id: 46676
- impact: HIGH
- protocol: [[Royco]]
- reporter: Kurt Barry (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_royco_august2024.pdf

## Summary


The bug report mentions an issue with the ERC4626i claimProtocolFees function. The problem occurs when the function is called for the first time for a specific campaignId. The storage value for feeRewardsLastClaimed is set to 0, which causes the time elapsed variable to be assigned to the campaignData.end timestamp. This results in a significantly larger amount owed than intended by the campaign's protocolFeeRate. The recommendation is to assign lastUpdated to campaignData.start when feeRewardsLastClaimed is equal to 0. However, the developers have acknowledged the issue and stated that it will not be fixed as the ERC4626i is being rewritten entirely. 

## Details

## Context
(No context files were provided by the reviewer)

## Description
The `ERC4626i` `claimProtocolFees` has the following snippet:

```solidity
CampaignData storage _campaignData = campaignIdToData[campaignId];
uint256 lastUpdated = feeRewardsLastClaimed[campaignId];
uint256 elapsed = (_campaignData.end - lastUpdated);
uint256 amountOwed = (elapsed * _campaignData.protocolFeeRate);
```

The first time this function is called for a given `campaignId`, `feeRewardsLastClaimed[campaignId]` will be `0` (the default value) in storage. This will lead to the `elapsed` variable being assigned to the `_campaignData.end`'s timestamp. As a consequence, the `amountOwed` will be many orders of magnitude larger than the campaign's `protocolFeeRate` intends. This will impact every campaign created upon the first claim.

## Recommendation
When `feeRewardsLastClaimed[campaignId] == 0`, assign `lastUpdated` to `_campaignData.start`, which will set the appropriate floor on time elapsed.

## Responses
**Royco:** Acknowledged. Won't fix: `ERC4626i` is being rewritten entirely.

**Cantina Managed:** Acknowledged.
