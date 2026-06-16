---
tags:
  - lang/solidity
  - sector/governance
  - sector/staking
  - platform/quantstamp
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Music Protocol (Token, Staking And DAO)]]"
auditors:
  - "[[Roman Rohleder]]"
report: "https://certificate.quantstamp.com/full/music-protocol-token-staking-and-dao/3cb260d9-3d7c-47a8-b247-6ca4ce733ab6/index.html"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[variant]]"
  - "[[reward-accounting]]"
---
# Redeeming Does Not Discount Tokens of Removed Artists, Leading to Inflated Rewards

- id: 59402
- impact: HIGH
- protocol: Music Protocol (Token, Staking and DAO)
- reporter: Roman Rohleder (Quantstamp)
- source: https://certificate.quantstamp.com/full/music-protocol-token-staking-and-dao/3cb260d9-3d7c-47a8-b247-6ca4ce733ab6/index.html

## Summary


This bug report is about an issue with the `FanToArtistStaking.sol` file, which is used for staking tokens in exchange for rewards from artists. The report explains that there was a problem with the `redeem()` function, which is used to remove a staked amount from an artist. The issue was that the function did not properly deduct redeemed amounts from artists who had been removed from the contract owner's list of verified artists. This meant that removed artists were receiving more rewards than they should have been. The report recommends making changes to the logic of the code to fix this issue. These changes include verifying the artist's status before allowing any stake increases or extensions, and updating the artist's staked amount when `redeem()` is called, regardless of their active status.

## Details

**Update**
The client fixed the issue in commit `992783e5724f7ee97a84004f8d556960dfbc9e0f` and provided the following explanation:

> The onlyVerifiedArtist modifier has been added on each of the functions that manipulate the stake. A check on the status of the artist was added to the function, so if it is not verified it will not be able to accumulate tokens. The artist removal operation now does not delete the artist's artistCheckpoint and before the change in the Boolean associated with the artist's state claims the award for the artist. Since the artistCheckpoint is not deleted, re-verification of a previously removed artist is now handled separately, so that the lastRedeem parameter is changed and tokens do not accrue during the removal period.

**File(s) affected:**`FanToArtistStaking.sol`

**Description:** Function `FanToArtistStaking.redeem()` removes a given staked amount from the target artist:

```
if (_verifiedArtists[artist]) {
      _calcSinceLastPosition(artist, _stake[artist][user].amount, false);
   }
```

However, this is only applied for still actively verified artists, not to artists that have been removed from the contract owner via `removeArtist()`.

This leads to the removed artists gaining inflated accumulated rewards, compared to existing artists.

This issue is further exacerbated by the fact that stakers may increase or extend stakes to removed artists, or redirect existing stakes of existing artists to removed artists: existing stakes may still be increased or extended via `increaseAmountStaked()`, `changeArtistStaked()` and `extendStake()`, as those functions do no verify the artist to still be verified.

Finally, the removed artist (or anyone else) may call `getReward()`, minting the inflated accumulated value of `RECORD` tokens to that artist.

**Recommendation:** We recommend changing the logic to also deduct redeemed amounts of removed artists. Consider:

1.   Verifying that the artist is still active when calling:
    *   `increaseAmountStaked()`
    *   `extendStake()`
    *   for `newArtist` in `changeArtistStaked()`

2.   Update the staked amount of the artist when `redeem()` is executed, regardless of his status (active or not).
