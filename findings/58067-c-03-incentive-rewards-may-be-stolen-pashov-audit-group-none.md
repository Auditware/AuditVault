---
tags:
  - lang/solidity
  - sector/governance
  - sector/stable
  - has/github
  - severity/high
protocol: "[[KittenSwap]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-06-12.md"
genome:
  - "[[reward-accounting]]"
  - "[[reward-theft]]"
  - "[[use-reentrancy-guard]]"
---
# [C-03] Incentive rewards may be stolen

- id: 58067
- impact: HIGH
- protocol: KittenSwap_2025-06-12
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-06-12.md

## Summary


This bug report discusses a problem in a program called VotingReward, where users can receive rewards for voting. The issue is that users are able to get rewards for a future period, which they should not be able to do. This can happen if a user adds rewards for a future period and then votes for that period, allowing them to receive all the rewards. The recommendation is to add a check to prevent this from happening.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description
In VotingReward, voters can gain some rewards because of their vote. There are two kind of possible rewards in VotingReward.
1. Kitten token from voter.
2. Users can add some incentive tokens via function `incentivize`.

If users incentive some rewards via function `incentivize`, we will record these rewards in the next period. Users can vote for the related pool to get some rewards.

The problem here is that we miss one `_period` validation in function `getRewardForPeriod`. Users can get the future period's rewards.

Let's consider below scenario:
1. Alice incentives 500 USDC for next period, next period = X.
2. Bob as the first voter, votes for the related pool.
3. Bob gets rewards for the period X immediately. Currently, Bob is the only person who vote for this pool in this period. Bob will get all the rewards.
```solidity
    function incentivize(
        address _token,
        uint256 _amount
    ) external virtual nonReentrant {
        // Here we have one white list for token. So we cannot manipulate the token.
        if (voter.isWhitelisted(_token) == false)
            revert NotWhitelistedRewardToken();
        uint256 currentPeriod = getCurrentPeriod() + 1;
        uint256 amount = _addReward(currentPeriod, _token, _amount);
    }
    function _deposit(uint256 _amount, uint256 _tokenId) external onlyVoter {
        uint256 nextPeriod = getCurrentPeriod() + 1;

        tokenIdVotesInPeriod[nextPeriod][_tokenId] += _amount;
        totalVotesInPeriod[nextPeriod] += _amount;
    }
    function getRewardForPeriod(
        uint256 _period,
        uint256 _tokenId,
        address _token
    ) external nonReentrant {
        // Only owner or approved can get rewards.
        if (!veKitten.isApprovedOrOwner(msg.sender, _tokenId))
            revert NotApprovedOrOwner();
        _getReward(_period, _tokenId, _token, msg.sender);
    }
```

## Recommendations
Add one input parameter check, don't allow to get a reward from one future period.
