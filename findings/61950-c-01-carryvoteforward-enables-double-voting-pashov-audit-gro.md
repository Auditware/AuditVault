---
tags:
  - lang/solidity
  - sector/dex
  - sector/governance
  - sector/nft
  - platform/pashov
  - has/github
  - severity/high
  - vuln/access-control/missing-modifier
  - novelty/variant
  - misassumption/admin-is-honest
  - fix/add-access-control
protocol: "[[KittenSwap]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-07-31.md"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[timestamp-dependence]]"
---
# [C-01] `carryVoteForward()` enables double voting

- id: 61950
- impact: HIGH
- protocol: KittenSwap_2025-07-31
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[KittenSwap]]-security-review_2025-07-31.md

## Summary


This bug report is about a function called `Voter.carryVoteForward()` that allows voters to reuse their votes from the previous period for the next period. However, this function does not mark the token as voted for the next period, which can lead to potential security issues. The report suggests updating the function to fix this problem.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** High

## Description

The `Voter.carryVoteForward()` function allows voters to reuse their previous period's votes (pools and weights) for the upcoming period. However, this function does not mark the token as voted for the next period (does not set `period[nextPeriod].voted[_tokenId] = true`) :

```solidity
function carryVoteForward(uint256 _tokenId, uint256 _fromPeriod) public {
        IVoter.Period storage ps = period[_fromPeriod];
        uint256 nextPeriod = getCurrentPeriod() + 1;

        // fetch weights from previous period
        address[] memory _poolList = ps.tokenIdVotedList[_tokenId].values();
        uint256[] memory _weightList = new uint256[](_poolList.length);

        for (uint256 i; i < _poolList.length; i++) {
            address _gauge = gauge[_poolList[i]].gauge;
            _weightList[i] = ps.tokenIdVotes[_gauge][_tokenId];
        }

        // deposit votes to next period
        _vote(nextPeriod, _tokenId, _poolList, _weightList);
    }
```

As a result, when `carryVoteForward()` is used with a token that hasn't been used to vote via `vote()` function, `checkPeriodVoted(nextPeriod)` will return `false`, which allows bypassing the `notVoted` modifier in the `VotingEscrow` contract. This modifier is used in critical functions like `merge()`, `split()`,`withdraw()`, and the ERC721-overwridden `_update()` function to ensure that tokens participating in voting cannot be manipulated or transferred mid-vote:

```solidity
modifier notVoted(uint256 _tokenId) {
        if (
            IVoter(voter).checkPeriodVoted(
                PeriodLibrary.getPeriod(block.timestamp) + 1,
                _tokenId
            ) == true
        ) revert Voted();
        _;
    }
```

```solidity
    function _update(
        address _to,
        uint256 _tokenId,
        address _auth
    ) internal override notVoted(_tokenId) returns (address) {
        return ERC721EnumerableUpgradeable._update(_to, _tokenId, _auth);
    }
```
For example: a malicious actor can use their NFT to vote using `carryVoteForward()` , then split this NFT (will gain multiple NFTs with larger voting power as these will be locked for the maximum locking duration), then vote again with these new NFTs in the same period (where the user has already voted for using the original NFT).

## Recommendations

Update `carryVoteForward()` to set `period[nextPeriod].voted[_tokenId] = true`:

```diff
function carryVoteForward(uint256 _tokenId, uint256 _fromPeriod) public {
        IVoter.Period storage ps = period[_fromPeriod];
        uint256 nextPeriod = getCurrentPeriod() + 1;

        // fetch weights from previous period
        address[] memory _poolList = ps.tokenIdVotedList[_tokenId].values();
        uint256[] memory _weightList = new uint256[](_poolList.length);

        for (uint256 i; i < _poolList.length; i++) {
            address _gauge = gauge[_poolList[i]].gauge;
            _weightList[i] = ps.tokenIdVotes[_gauge][_tokenId];
        }

+       period[nextPeriod].voted[_tokenId] = true;
        // deposit votes to next period
        _vote(nextPeriod, _tokenId, _poolList, _weightList);
    }
```
