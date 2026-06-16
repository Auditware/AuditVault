---
tags:
  - lang/solidity
  - sector/governance
  - platform/sherlock
  - has/github
  - severity/high
  - vuln/arithmetic/precision-loss
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Nouns Builder]]"
auditors:
  - "[[0x52]]"
  - "[[Bauer]]"
  - "[[Brenzee]]"
  - "[[HHK]]"
  - "[[Kow]]"
  - "[[KupiaSec]]"
  - "[[SilentDefendersOfDeFi]]"
  - "[[coffiasd]]"
  - "[[cu5t0mPe0]]"
  - "[[dany.armstrong90]]"
  - "[[ggg_ttt_hhh]]"
  - "[[gqrp]]"
  - "[[pontifex]]"
  - "[[unforgiven]]"
  - "[[xAriextz]]"
report: "https://github.com/sherlock-audit/2023-09-nounsbuilder-judging"
genome:
  - "[[precision-loss]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[reward-accounting]]"
---
# H-2: Adversary can permanently brick auctions due to precision error in Auction#_computeTotalRewards

- id: 29424
- impact: HIGH
- protocol: [[Nouns Builder]]
- reporter: xAriextz (Sherlock)
- source: N/A

## Summary


This bug report focuses on an issue found in the ProtocolRewards.sol and Auction.sol files of the Zora Protocol. When batch depositing to ProtocolRewards, the msg.value is expected to match the sum of the amounts array EXACTLY. Due to precision loss in Auction#_computeTotalRewards, this call can be engineered to always revert which completely bricks the auction process. In the Auction.sol file, the sum of the percentages are used to determine the totalRewards. Meanwhile, the amounts are determined using the broken out percentages of each, leading to unequal precision loss. This can cause totalRewards to be off by a single wei, which causes the batch deposit to revert and the auction to be bricked. When this happens, the DAO may have to redeploy the protocol to resolve the issue and continue auctions. The bug was fixed in a pull request on the Zora Protocol Github.

## Details

Source: https://github.com/sherlock-audit/2023-09-nounsbuilder-judging/issues/251 

## Found by 
0x52, Bauer, Brenzee, HHK, Kow, KupiaSec, SilentDefendersOfDeFi, coffiasd, cu5t0mPe0, dany.armstrong90, ggg\_ttt\_hhh, gqrp, pontifex, unforgiven, xAriextz
## Summary

When batch depositing to ProtocolRewards, the msg.value is expected to match the sum of the amounts array EXACTLY. The issue is that due to precision loss in Auction#_computeTotalRewards this call can be engineered to always revert which completely bricks the auction process.

## Vulnerability Detail

[ProtocolRewards.sol#L55-L65](https://github.com/ourzora/zora-protocol/blob/8d1fe9bdd79a552a8f74b4712451185f6aebf9a0/packages/protocol-rewards/src/ProtocolRewards.sol#L55-L65)

        for (uint256 i; i < numRecipients; ) {
            expectedTotalValue += amounts[i];

            unchecked {
                ++i;
            }
        }

        if (msg.value != expectedTotalValue) {
            revert INVALID_DEPOSIT();
        }

When making a batch deposit the above method is called. As seen, the call with revert if the sum of amounts does not EXACTLY equal the msg.value.

[Auction.sol#L474-L507](https://github.com/sherlock-audit/2023-09-nounsbuilder/blob/main/nouns-protocol/src/auction/Auction.sol#L474-L507)

        uint256 totalBPS = _founderRewardBps + referralRewardsBPS + builderRewardsBPS;

        ...

        // Calulate total rewards
        split.totalRewards = (_finalBidAmount * totalBPS) / BPS_PER_100_PERCENT;

        ...

        // Initialize arrays
        split.recipients = new address[](arraySize);
        split.amounts = new uint256[](arraySize);
        split.reasons = new bytes4[](arraySize);

        // Set builder reward
        split.recipients[0] = builderRecipient;
        split.amounts[0] = (_finalBidAmount * builderRewardsBPS) / BPS_PER_100_PERCENT;

        // Set referral reward
        split.recipients[1] = _currentBidRefferal != address(0) ? _currentBidRefferal : builderRecipient;
        split.amounts[1] = (_finalBidAmount * referralRewardsBPS) / BPS_PER_100_PERCENT;

        // Set founder reward if enabled
        if (hasFounderReward) {
            split.recipients[2] = founderReward.recipient;
            split.amounts[2] = (_finalBidAmount * _founderRewardBps) / BPS_PER_100_PERCENT;
        }

The sum of the percentages are used to determine the totalRewards. Meanwhile, the amounts are determined using the broken out percentages of each. This leads to unequal precision loss, which can cause totalRewards to be off by a single wei which cause the batch deposit to revert and the auction to be bricked. Take the following example:

Assume a referral reward of 5% (500) and a builder reward of 5% (500) for a total of 10% (1000). To brick the contract the adversary can engineer their bid with specific final digits. In this example, take a bid ending in 19. 

    split.totalRewards = (19 * 1,000) / 100,000 = 190,000 / 100,000 = 1

    split.amounts[0] = (19 * 500) / 100,000 = 95,000 / 100,000 = 0
    split.amounts[1] = (19 * 500) / 100,000 = 95,000 / 100,000 = 0

Here we can see that the sum of amounts is not equal to totalRewards and the batch deposit will revert. 

[Auction.sol#L270-L273](https://github.com/sherlock-audit/2023-09-nounsbuilder/blob/main/nouns-protocol/src/auction/Auction.sol#L270-L273)

    if (split.totalRewards != 0) {
        // Deposit rewards
        rewardsManager.depositBatch{ value: split.totalRewards }(split.recipients, split.amounts, split.reasons, "");
    }

The depositBatch call is placed in the very important _settleAuction function. This results in auctions that are permanently broken and can never be settled.

## Impact

Auctions are completely bricked

## Code Snippet

[Auction.sol#L244-L289](https://github.com/sherlock-audit/2023-09-nounsbuilder/blob/main/nouns-protocol/src/auction/Auction.sol#L244-L289)

## Tool used

Manual Review

## Recommendation

Instead of setting totalRewards with the sum of the percentages, increment it by each fee calculated. This way they will always match no matter what.



## Discussion

**nevillehuang**

Contrary to #103 which only affects bidding, this causes a complete DoS of settlement of auctions, forcing the DAO to possibly have to redeploy to resolve the issue and continue auctions, so I believe high severity is fair.

**neokry**

Fixed here: https://github.com/ourzora/nouns-protocol/pull/123
