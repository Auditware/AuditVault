---
tags:
  - lang/solidity
  - sector/governance
  - has/github
  - severity/high
protocol: "[[KittenSwap]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-05-07.md"
genome:
  - "[[governance-voting-power-snapshot]]"
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# [H-07] Inconsistent rounding of lock time causes voting power errors

- id: 58018
- impact: HIGH
- protocol: KittenSwap_2025-05-07
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-05-07.md

## Summary


The VotingEscrow contract has a bug that causes incorrect voting power calculations. This is because the lock end times are not consistently rounded down to week boundaries. This inconsistency disrupts the checkpoint system and can result in inflated voting power and incorrect reward distributions. To fix this, the split function should be modified to align lock end times with weekly boundaries, like the rest of the codebase. 

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

In the VotingEscrow contract, lock end times are consistently rounded down to week boundaries (Thursday 00:00 UTC) in all functions except for `split`. This inconsistency disrupts the checkpoint system and causes incorrect voting power calculations.

In `_create_lock` and `increase_unlock_time`, lock end time is explicitly rounded to weekly boundaries. However, in the `split` function, this rounding is missing:

```solidity
    function split(
        uint _from,
        uint _amount
    ) external returns (uint _tokenId1, uint _tokenId2) {
        ...
        // set max lock on new NFTs
        _locked.end = block.timestamp + MAXTIME; // @audit the _locked.end isn't rounded down to week
        ...
    }
```

This inconsistency has severe implications because the contract's checkpoint mechanism relies on week aligned timestamps when applying slope changes:

```solidity
    uint t_i = (last_checkpoint / WEEK) * WEEK;
    for (uint i = 0; i < 255; ++i) {
        t_i += WEEK;
        int128 d_slope = 0;
        if (t_i > block.timestamp) {
            t_i = block.timestamp;
        } else {
            d_slope = slope_changes[t_i]; // @audit t_i is aways on Thursday
        }
        // ...voting power calculations continue...
}
```

When a lock expires, its slope should be removed from the total slope to decrease voting power. However, if the lock expiration time is not aligned with a weekly boundary, the checkpoint system will never process the slope change at the exact expiration time. The global slop will always be wrong.

Users or attackers can call `split` to break the checkpoint calculation of the contract. This results in inflated voting power and incorrect reward distributions based on overstated voting weights.

## Recommendations

Modify the split function to align lock end times with weekly boundaries, consistent with the rest of the codebase:

```diff
    function split(
        uint _from,
        uint _amount
    ) external returns (uint _tokenId1, uint _tokenId2) {
        ...
        // set max lock on new NFTs
-        _locked.end = block.timestamp + MAXTIME;
+        _locked.end = ((block.timestamp + MAXTIME) / WEEK) * WEEK;
        ...
    }
```
