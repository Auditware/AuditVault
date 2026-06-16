---
tags:
  - lang/solidity
  - sector/nft
  - sector/staking
  - platform/pashov
  - has/github
  - severity/high
  - vuln/dos/griefing
  - novelty/variant
protocol: "[[Hyperstable]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Hyperstable-security-review_2025-03-19.md"
genome:
  - "[[griefing]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[dos-resistance]]"
  - "[[vote-delegation-loop]]"
---
# [C-01] `delegate()` permits unauthorized vote delegation

- id: 57821
- impact: HIGH
- protocol: Hyperstable_2025-03-19
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Hyperstable]]-security-review_2025-03-19.md

## Summary


The `delegate()` function in the `vePeg` contract has a high impact and likelihood bug. This function allows anyone to delegate votes from one NFT to another, even if they are not the owner or operator of the NFT. This can lead to malicious actors stealing votes or causing a denial of service for certain functions. To fix this, the function should be updated to only allow the lock owner or operator to delegate votes.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

The `delegate()` function in the `vePeg` contract is intended to delegate votes from an NFT (lock) to another NFT/lock (delegatee). However, the issue is that this function allows anyone to delegate on behalf of any lock (NFT) owner, which should not be the case. Delegation should only be allowed from the owner or operator of the lock:

```solidity
function delegate(uint256 _from, uint256 _to) public {
        return _delegate(_from, _to);
    }
```

This results in the following risks:

- Malicious actors can delegate votes on behalf of any lock (NFT) owner, thus stealing their votes.
- Malicious actors can delegate votes on behalf of any owner to grief them, causing an increase in their checkpoints beyond the `MAX_DELEGATES` of 128, which leads to a DoS of all functions calling `_delegate()`, such as `lock_perpetually()`, `unlock_perpetual()`, and `delegateBySig()`.

## Recommendations

Update the `delegate()` function to ensure that only the lock owner or operator can delegate votes:

```diff
function delegate(uint256 _from, uint256 _to) public {
+      require(_isApprovedOrOwner(msg.sender, _from));
       return _delegate(_from, _to);
}
```
