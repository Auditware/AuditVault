---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/bridge
  - sector/lending
  - sector/token
protocol: "[[Threshold]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Threshold%20Network/tBTC%20v2/README.md#1-requestredemption-reverts-because-l1btcredeemerwormholes-bank-balance-is-not-credited"
genome:
  - "[[missing-check]]"
  - "[[permanent]]"
  - "[[bridge-stuck-asset]]"
---
# `requestRedemption()` Reverts Because `L1BTCRedeemerWormhole’s` Bank Balance Is Not Credited

- id: 63508
- impact: HIGH
- protocol: [[Threshold Network]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Threshold%20Network/tBTC%20v2/README.md#1-requestredemption-reverts-because-l1btcredeemerwormholes-bank-balance-is-not-credited

## Summary


The report describes a bug in the code for a feature called Wormhole, which allows users to transfer a type of currency called tBTC between different systems. The bug prevents the redemption of tBTC, meaning that users cannot recover their tBTC once it has been transferred. This is a serious issue that needs to be fixed before the feature can be used. The report recommends increasing the balance in a specific contract before making a certain call in the code, which should resolve the issue. The client has already fixed the bug, but did not inform the report writer.

## Details

##### Description
`L1BTCRedeemerWormhole.requestRedemption()` grants `thresholdBridge` an allowance to withdraw the satoshi-denominated balance, but it never credits that balance to the `Bank` contract. When `Bridge.requestRedemption()` later calls `bank.transferBalanceFrom()`, the call reverts because `L1BTCRedeemerWormhole` has a zero balance. As a result every redemption request sent through the Wormhole flow becomes stuck: the VAA remains un-redeemed, tBTC stays locked in the Wormhole bridge contract, and the redemption path is effectively disabled.

This issue is classified as **High** severity because it completely blocks the Wormhole redemption functionality and leaves users unable to recover their bridged tBTC until the deployed code is upgraded.

##### Recommendation
We recommend increasing the `L1BTCRedeemerWormhole` balance in the `Bank` contract before calling `thresholdBridge.requestRedemption()`.

> **Client's Commentary**
> MixBytes: The issue was identified during the audit, but the client had already fixed it independently prior to our reporting, without notifying us about the fix.
---
