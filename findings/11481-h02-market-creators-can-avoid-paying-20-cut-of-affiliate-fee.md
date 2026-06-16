---
tags:
  - lang/solidity
  - sector/prediction
  - platform/openzeppelin
  - has/github
  - severity/high
  - impact/mev/frontrun
protocol: "[[Augur]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/augur-core-v2-audit-components/"
genome:
  - "[[fee-calculation]]"
  - "[[frontrun]]"
  - "[[antisybil]]"
  - "[[frontrun-exposure]]"
---
# [H02] Market creators can avoid paying 20% cut of affiliate fees to traders

- id: 11481
- impact: HIGH
- protocol: [[Augur]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/augur-core-v2-audit-components/

## Summary


The bug report describes a vulnerability in the Market contract of Augur, a decentralized prediction market platform. The vulnerability allows market creators to avoid paying fees owed to individual traders by front-running transactions and changing their account's fingerprint. This is possible because the fingerprint protection can be easily bypassed and the fingerprint mechanism is not as effective at preventing Sybil attacks as an identity-based scheme. Augur has decided to accept this risk, but the report keeps reservations on whether this is the right decision.

## Details

The [`recordMarketCreatorFees`](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/reporting/Market.sol#L337) function of the `Market` contract determines under which circumstances a portion of the market’s creator fees gets distributed to affiliates. When there is an affiliate associated with the `_sourceAccount` address, the fingerprint of the affiliate’s address is [compared](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/reporting/Market.sol#L342) against the fingerprint passed as an argument. If both fingerprints match, then [the affiliate’s address is set to zero](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/reporting/Market.sol#L344). As a result, no fees are paid to the affiliate nor the source account (who is expecting to receive 20% of the affiliate’s fees). These fees are taken from the total amount of market creator fees.


When a user trading in a market has been referred by the market creator, then the market creator should receive the corresponding affiliate fees from the user’s trading operations. In this case, to avoid paying 20% of the affiliate fees to the user, the market creator can execute front-running transactions that will cause the following trading operation to pay zero fees to affiliates. Specifically, the market creator should:


1. See in advance which fingerprint the user set when submitting the trading transaction.
2. Front-run with a call to the [`setFingerprint` function](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/reporting/Affiliates.sol#L17), aiming to change her account’s fingerprint to the one used by the user.


If the front-run succeeds, then the stored fingerprint and the one submitted by the user should match. As a consequence, the execution of `recordMarketCreatorFees` will not pay the 20% of the affiliate fees to the user (because the execution would never jump into the [`if` block in lines 347 to 355](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/reporting/Market.sol#L347-L355)). Note that this attack should only be profitable for a market creator when the amount to be paid to the user (i.e., 20% of the affiliate fees) is greater than the cost of submitting the front-running transaction to change the fingerprint.


This issue is related to another issue already anticipated by Augur: the fingerprint scheme is intended to prevent users from registering a different address that they control as their affiliate, but it can be easily bypassed by simply changing the fingerprint to a unique value per address. Any solution that can effectively prevent Sybil attacks (where individual users can gain an advantage by controlling multiple accounts) would typically involve identity-based schemes, such as the KYC process intended to be used with the `AffiliateValidator` contract.


Since the fingerprint protection can be easily bypassed and it also introduces the vulnerability described here, consider removing the fingerprint mechanism entirely.


Alternatively, one plausible course of action to be analyzed is restricting the amount of times an account can modify its fingerprint in the `Affiliates` contract. More importantly, if there are no reasons why an account should ever update its fingerprint, consider reverting all calls to the [`setFingerprint` function](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/reporting/Affiliates.sol#L17) if the caller has already registered a fingerprint in the contract.


**Update**: *Augur has decided to accept this risk because the market creator already chooses an affiliate validation contract, as well as the market creator fees that are distributed. While we understand Augur’s stance, we keep our reservations on whether this risk should be accepted, considering that it allows market creators to avoid paying fees owed to individual traders.*
