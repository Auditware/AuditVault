---
tags:
  - lang/solidity
  - sector/oracle
  - platform/sigmaprime
  - has/github
  - severity/high
  - impact/mev/frontrun
protocol: "[[Chainlink]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/chainlink/chainlink-1/review.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[frontrun]]"
  - "[[chainlink-round-completeness]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
---
# Malicious Users Can DOS/Hijack Requests From Chainlinked Contracts

- id: 19294
- impact: HIGH
- protocol: [[Chainlink]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/chainlink/chainlink-1/review.pdf

## Summary


Chainlink is a smart contract that allows users to request data from external sources. However, malicious users can hijack or perform Denial of Service (DOS) attacks on these requests by replicating or front-running them. This is due to the fact that any request can specify an arbitrary callback address, allowing malicious requests to be fulfilled first with incorrect or malicious results. This can be prevented by localising callback addresses to the requester, or by including the original requester in the callbacks mapping in Oracle.sol. To solve this issue, the internalId within an Oracle has been changed to requestId which is a Keccak hash of the sender with the sender’s nonce. This effectively prevents malicious users from hijacking requests, as it requires the malicious request to be sent from the Chainlinked contract in order to generate an equivalent requestId.

## Details

## Description

Malicious users can hijack or perform Denial of Service (DOS) attacks on requests of Chainlinked contracts by replicating or front-running legitimate requests. The Chainlinked (`Chainlinked.sol`) contract contains the `checkChainlinkFulfillment()` modifier on line [145]. This modifier is demonstrated in the examples that come with the repository. In these examples, this modifier is used within the functions which contracts implement that will be called by the Oracle when fulfilling requests. It requires that the caller of the function be the Oracle that corresponds to the request being fulfilled.

Thus, requests from Chainlinked contracts are expected to only be fulfilled by the Oracle that they have requested. However, because a request can specify an arbitrary callback address, a malicious user can also place a request where the callback address is a target Chainlinked contract. If this malicious request gets fulfilled first (which can ask for incorrect or malicious results), the Oracle will call the legitimate contract and fulfill it with incorrect or malicious results. Because the known requests of a Chainlinked contract get deleted (see line [147]), the legitimate request will fail.

It could be such that the Oracle fulfills requests in the order in which they are received. In such cases, the malicious user could simply front-run the requests to be higher in the queue.

We further highlight this issue with a trivial example. Consider a simple contract that is using Chainlink to estimate the price of Ether relative to a random token, which users then purchase based off this price. A malicious user could front-run the price request, putting their own request in with a malicious price source that is significantly lower than the actual price. The callback address of the malicious request would be the simple contract, and once fulfilled, would set the price of the simple contract to the malicious one given in the source. An example of this attack is given in the test: `test_attack_can_hijack_request` that accompanies this report.

## Recommendations

This issue is related to LNK-01, LNK-07, and LNK-06 in that it arises due to the fact that any request can specify its own arbitrary callback address. A restrictive solution would be the same as given in LNK-01, where callback addresses are localized to the requester themselves.

A less restrictive approach may be to include `msg.sender` in the callbacks mapping in `Oracle.sol`. Then, when fulfilling the request, the Oracle could send the `msg.sender` as an extra parameter. The `checkChainlinkFulfillment()` modifier can then accept or reject the fulfillment based on the original requester, preventing malicious requests from being fulfilled.

## Resolution

The `internalId` within an Oracle has been modified to `requestId`, which is a Keccak hash of the sender with the sender’s nonce. This same id is used within the Chainlinked contracts, which is required to fulfill a request. Thus, a malicious user can no longer hijack requests, as doing so would require the malicious request to be sent from the Chainlinked contract in order to generate an equivalent `requestId`.
