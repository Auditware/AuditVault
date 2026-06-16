---
tags:
  - lang/solidity
  - sector/bridge
  - sector/gaming
  - platform/shieldify
  - has/github
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Onchain Heroes]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/OnchainHeroes-S2(Phase2)-Security-Review.md"
genome:
  - "[[reward-calculation]]"
  - "[[permanent]]"
  - "[[variant]]"
  - "[[reward-accounting]]"
---
# [H-02] Hero Owner With Mythical Weapon Can Never Receive Weapon Shard Rewards

- id: 61819
- impact: HIGH
- protocol: Onchainheroes S2(Phase2)
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/OnchainHeroes-S2(Phase2)-Security-Review.md

## Summary


The report identifies a vulnerability in the reward calculation for a game's weapon system. The issue occurs when calculating rewards for the rarest weapon type, Mythical weapons, as the function does not properly account for their rarity level. This results in players who own these premium weapons receiving zero weapon shards, which creates an unfair disadvantage for them. The team has acknowledged and fixed the issue by updating the constant used for weapon shard probability data to include data for Mythical weapons. 

## Details


## Severity

High Risk

## Description

The vulnerability exists in the weapon shard reward calculation within the `_calculateBonusRewards()` function. The contract uses a packed constant `WEAPON_SHARD_TABLE (0xD282321E140A)` to store weapon shard probability values for different weapon rarities. This constant contains data for six rarity levels (Common through Legendary, rarities 0-5), with each rarity occupying 8 bits of data.

However, the weapon system supports seven rarity levels, including `Mythical weapons (rarity 6)`. When calculating weapon shard rewards for Mythical weapons, the function performs a bit shift operation `(WEAPON_SHARD_TABLE >> (6 * 8))` which shifts the constant right by 48 bits. Since the `WEAPON_SHARD_TABLE` constant only contains 48 bits of meaningful data, this shift operation results in accessing undefined data beyond the constant's scope, effectively returning zero.

The subsequent calculation `weaponShardChance = (0 * (25 + (zone * 25))) / 10` always evaluates to zero for Mythical weapons, causing the `guaranteedMint` to be zero and the conditional random chance check `if (weaponShardChance != 0)` to be skipped entirely. This results in Mythical weapon holders receiving zero weapon shards regardless of their attack zone or battle outcome.

## Location of Affected Code

File: [src/Dragma/Dragma.sol#L608](https://github.com/onchain-heroes/och-contracts/blob/6bc8f2a5782b8f92a32cae10cdf42a3887028e1d/src/Dragma/Dragma.sol#L608)

```solidity
function _calculateBonusRewards(uint256 heroId, uint256 requestId, uint256 randomNumber_) internal returns (uint256, uint256) {
  // code
  uint256 weaponShardChance = (((WEAPON_SHARD_TABLE >> (rarity * 8)) & 0xff) * (25 + (zone * 25))) / 10;

  uint256 guaranteedMint = weaponShardChance / 1000;

  if (weaponShardChance != 0) {
      uint256 chance = weaponShardChance - (guaranteedMint * 1000);
      randomNumber_ = uint256(keccak256(abi.encode(randomNumber_, requestId)));
      if ((randomNumber_ % 1000) < chance) {
          guaranteedMint += 1;
      }
  }
  if (guaranteedMint > 0) {
      items.mint(hero.owner, 1, guaranteedMint);
  }
  return (gachaTokenId, guaranteedMint);
}
```

## Impact

This vulnerability creates a significant imbalance in the reward distribution system, particularly affecting players who have invested in the highest-tier weapons. Mythical weapons, being the rarest and presumably most valuable weapons in the game, should logically provide the best or at least competitive weapon shard rewards. Instead, holders of these premium weapons receive no weapon shard rewards at all, creating a counterintuitive penalty for owning superior equipment.

## Recommendation

The immediate fix requires updating the `WEAPON_SHARD_TABLE` constant to include weapon shard probability data for Mythical weapons (rarity 6). The current constant should be expanded from 48 bits to 56 bits to accommodate the seventh rarity level.

## Team Response

Fixed.
