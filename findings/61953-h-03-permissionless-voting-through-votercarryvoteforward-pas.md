---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/dex
  - sector/governance
  - sector/nft
protocol: "[[KittenSwap]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-07-31.md"
genome:
  - "[[centralization]]"
  - "[[ownership-takeover]]"
  - "[[access-roles]]"
---
# [H-03] Permissionless voting through `Voter::carryVoteForward()`

- id: 61953
- impact: HIGH
- protocol: KittenSwap_2025-07-31
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[KittenSwap]]-security-review_2025-07-31.md

## Summary


The bug report states that the issue has been resolved and its severity is medium with a high likelihood of occurrence. The report explains that the `carryVoteForward` function in `Voter.sol` lacks necessary access controls, which allows any user to manipulate votes for any NFT without the owner's authorization. This vulnerability allows anyone to call the function and vote for the next period for any `veKITTEN` by copying a previous vote without the owner's approval. The recommendation is to implement access control over the function to prevent unauthorized manipulation of votes.

## Details


_Resolved_

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The `carryVoteForward` function in `Voter.sol` lacks essential access controls, allowing any user to manipulate votes for any NFT without authorization from the owner of it.

```solidity
    /// @notice Carry forward votes from past period
    function carryVoteForward(uint256 _tokenId, uint256 _fromPeriod) public {
        IVoter.Period storage ps = period[_fromPeriod];
        uint256 nextPeriod = getCurrentPeriod() + 1;
```

The result of this vulnerability is that anyone can call `carryVoteForward()` for any `veKITTEN` and vote for the next period for it (by copying a previous vote of that `veKITTEN`) without this being approved by the original owner.

## Recommendations

Implement access control over the `carryVoteForward()` like this :

```solidity
        if (veKitten.isApprovedOrOwner(msg.sender, _tokenId) == false)
            revert NotApprovedOrOwner();
```
