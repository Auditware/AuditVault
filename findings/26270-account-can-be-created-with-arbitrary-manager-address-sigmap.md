---
tags:
  - lang/solidity
  - sector/lending
  - sector/nft
  - sector/options
  - platform/sigmaprime
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/variant
protocol: "[[Lyra Finance]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/lyra-finance/review.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[liquidation-underwater]]"
---
# Account Can Be Created With Arbitrary Manager Address

- id: 26270
- impact: HIGH
- protocol: [[Lyra Finance]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/lyra-finance/review.pdf

## Summary


This bug report is about the risk of funds being locked due to allowing SubAccounts to be set up with arbitrary manager addresses. When creating an account through SubAccounts::createAccount(), a user can specify any address as the manager. This can lead to a situation where the SubAccount is unable to interact normally with legitimate assets in the Lyra protocol. It can also cause the SubAccount to become non-liquidatable and unable to change its manager. This risk is not only limited to SubAccounts created with a malicious manager address; it can also occur when a malicious user sells a SubAccount NFT, which holds a non-supported asset, in the open market. 

The development team has implemented a solution in pull request #264 to validate all assets transferring, allowing any manager changes to revert with SRM_UnsupportedAsset when the asset is not approved. This behaviour appears intentional. The original issue had a focus on manager whitelisting, and the development team indicated that the behaviour of arbitrary manager whitelisting is the intended behaviour. To prevent this issue, the development team has recommended implementing a whitelist of managers that SubAccounts are allowed to use.

## Details

Description
Funds can be locked due to allowing SubAccounts to be setup with arbitrary manager addresses.
When creating an account through SubAccounts::createAccount() , a user can specify an arbitrary address as the
manager. This allows the account to receive and hold assets that are not supported by Lyra protocol.
Although this will prevent the SubAccount from interacting normally with legitimate assets in the Lyra protocol, if the
manager is later switched to a supported manager, the SubAccount would be able to receive non risk adding assets.
This results in a situation where:
1. Assets in the SubAccount will be stuck as risk checks performed on the account will revert
2.SubAccount will no longer be liquidatable as the non-supported asset cannot be transferred
3.SubAccount will no longer be able to change their manager
This risk is not only limited to SubAccounts created with a malicious manager address. SubAccounts which use Portfolio
Manager Risk Manager (PMRM) could risk receiving these non-supported assets through a call to mergeAccounts() .
A situation where this might occur is where a malicious user sells a SubAccount NFT, which holds a non-supported
asset, in the open market and the buyer, after purchasing the SubAccount and merging the assets into their legitimate
account, end up locking up their legitimate assets.
Recommendations
Implement a whitelist of managers that SubAccounts are allowed to use.
Resolution
The original issue had a focus on manager whitelisting, and the development team indicated in pull request #264 that
the behaviour of arbitrary manager whitelisting is the intended behaviour.
What is not desired is that an unsupported asset can be accepted as valid after manager changes. The development
team has implemented an asset delta check in pull request #264 to all manager transfers, which validates all assets
transferring, allowing any manager changes to revert with SRM_UnsupportedAsset when the asset is not approved.
It is worth mentioning that it is on the Manager itself to revert when unsupported asset deltas are provided, however,
this behaviour appears intentional.
Page | 12
Lyra V2 Detailed Findings
LYRA-06 Fully Liquidated Auctions Cannot Be Terminated
