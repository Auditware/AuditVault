---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/unbounded-loop
  - impact/dos/permanent
  - novelty/known-pattern
  - sector/nft
protocol: "[[NextGen]]"
auditors:
  - "[[Hound]]"
report: "https://code4rena.com/reports/2023-10-nextgen"
genome:
  - "[[unbounded-loop]]"
  - "[[permanent]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
---
# [H-05] Permanent DoS due to non-shrinking array usage in an unbounded loop

- id: 29526
- impact: HIGH
- protocol: [[NextGen]]
- reporter: Hound (Code4rena)
- source: https://code4rena.com/reports/2023-10-nextgen

## Summary


This bug report discusses an issue found in the smart contract code of an auction platform. The report explains that there are certain arrays in the code that can grow indefinitely in size and never shrink. This can lead to a denial-of-service attack when these arrays are used in unbounded loops. The report provides a proof of concept and identifies four instances of this issue in the code. The report also includes a confirmation from a team member and a comment from a judge acknowledging the validity of the issue. 

## Details



*Note: this finding was reported via the winning [Automated Findings report](https://gist.github.com/code423n4/b979a00ee3ea3f7d36ee39e2a536ba8a). It was declared out of scope for the audit, but is being included here for completeness.*

There are some arrays that can grow indefinitely in size, as they never shrink. When these arrays are used in unbounded loops, they may lead to a permanent denial-of-service (DoS) of these functions.

### POC

1. Attacker calls `participateToAuction` N times with dust amounts until `returnHighestBid` reverts (out of gas).
2. When `claimAuction` is called by `WinnerOrAdminRequired`, the transaction will fail, as it calls `returnHighestBid`. As a result, `claimAuction` will be permanently DoS.

*There are 4 instances of this issue:*

[[69](https://github.com/code-423n4/2023-10-nextgen/blob/08a56bacd286ee52433670f3bb73a0e4a4525dd4/smart-contracts/AuctionDemo.sol#L69), [90](https://github.com/code-423n4/2023-10-nextgen/blob/08a56bacd286ee52433670f3bb73a0e4a4525dd4/smart-contracts/AuctionDemo.sol#L90), [110](https://github.com/code-423n4/2023-10-nextgen/blob/08a56bacd286ee52433670f3bb73a0e4a4525dd4/smart-contracts/AuctionDemo.sol#L110), [136](https://github.com/code-423n4/2023-10-nextgen/blob/08a56bacd286ee52433670f3bb73a0e4a4525dd4/smart-contracts/AuctionDemo.sol#L136)]

```solidity
File: smart-contracts/AuctionDemo.sol

// @audit function returnHighestBid is vulnerable as length grows in size but never shrinks
69: 		            for (uint256 i=0; i< auctionInfoData[_tokenid].length; i++) {

60: 		        auctionInfoData[_tokenid].push(newBid);

// @audit function returnHighestBidder is vulnerable as length grows in size but never shrinks
90: 		        for (uint256 i=0; i< auctionInfoData[_tokenid].length; i++) {

60: 		        auctionInfoData[_tokenid].push(newBid);

// @audit function claimAuction is vulnerable as length grows in size but never shrinks
110: 		        for (uint256 i=0; i< auctionInfoData[_tokenid].length; i ++) {

60: 		        auctionInfoData[_tokenid].push(newBid);

// @audit function cancelAllBids is vulnerable as length grows in size but never shrinks
136: 		        for (uint256 i=0; i<auctionInfoData[_tokenid].length; i++) {

60: 		        auctionInfoData[_tokenid].push(newBid);
```

**[a2rocket (NextGen) confirmed](https://gist.github.com/code423n4/b979a00ee3ea3f7d36ee39e2a536ba8a?permalink_comment_id=4797585#gistcomment-4797585)**

**[0xsomeone (judge) commented](https://gist.github.com/code423n4/b979a00ee3ea3f7d36ee39e2a536ba8a?permalink_comment_id=4797627#gistcomment-4797627):**
> Important and valid.

***
