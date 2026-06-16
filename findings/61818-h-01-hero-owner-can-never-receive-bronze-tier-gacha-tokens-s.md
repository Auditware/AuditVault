---
tags:
  - lang/solidity
  - platform/shieldify
  - has/github
  - severity/high
  - sector/bridge
protocol: "[[Onchain Heroes]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/OnchainHeroes-S2(Phase2)-Security-Review.md"
genome:
  - "[[wrong-condition]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# [H-01] Hero Owner Can Never Receive Bronze Tier Gacha Tokens

- id: 61818
- impact: HIGH
- protocol: Onchainheroes S2(Phase2)
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/OnchainHeroes-S2(Phase2)-Security-Review.md

## Summary


This bug report is about a high-risk vulnerability in a contract's token distribution mechanism. The contract uses a data structure to store reward probabilities for different weapon rarities and token tiers. However, there is a mistake in the code that causes the lowest tier of tokens to never be distributed to players. This means that players who stake their heroes will never receive these tokens, regardless of their weapon rarity or zone selection. The recommended fix is to modify the code to include all four token tiers in the distribution loop. The team has responded and fixed the issue.

## Details


## Severity

High Risk

## Description

The vulnerability exists in the `_calculateBonusRewards()` function within the gacha token distribution mechanism. The contract uses a packed data structure `BONUS_REWARD_TABLE` to store reward probabilities for different weapon rarities and token tiers. According to the commented specification, the data structure should contain probability values for four token tiers: `Rainbow` (bits 0-7), `Gold` (bits 8-15), `Silver` (bits 16-23), and `Bronze` (bits 24-31). However, the token distribution loop in the `_calculateBonusRewards()` function only iterates through the first three positions (i=0, i=1, i=2), accessing bits 0-7, 8-15, and 16-23, respectively.

The token ID assignment follows the formula gachaTokenId = (4 - i), which means:

- i=0 accesses bits 0-7 and assigns token ID 4
- i=1 accesses bits 8-15 and assigns token ID 3
- i=2 accesses bits 16-23 and assigns token ID 2

This creates a critical mismatch where the Bronze token data stored in bits 24-31 is never accessed, and consequently, Bronze tokens (presumably the lowest tier) are never distributed to players. The loop terminates after checking the first three tiers and uses a break statement upon finding a successful reward, ensuring that only one token type can be awarded per unstaking operation.

## Location of Affected Code

File: [src/Dragma/Dragma.sol#L569](https://github.com/onchain-heroes/och-contracts/blob/6bc8f2a5782b8f92a32cae10cdf42a3887028e1d/src/Dragma/Dragma.sol#L569)

```solidity
function _calculateBonusRewards(uint256 heroId, uint256 requestId, uint256 randomNumber_) internal returns (uint256, uint256) {
    DragmaStorage storage $ = _getStorage();

    HeroInformation storage hero = $.heroInfo[heroId];

    // Get weapon id
    (, uint96 weaponId) = heroArmory.getArmory(heroId);

    // Get weapon data
    uint256 data = weaponData.getWeaponData(weaponId);

    // Extract `weaponData` from `data`.
    uint256 rarity = data & 0xff;

    uint256 zone = hero.attackZone;

    // gacha token rewards
    // accuracy upto 2dp
    uint256 rewards = (BONUS_REWARD_TABLE >> (rarity * 32)) & 0xffffffff;

    uint256 gachaTokenId;
    if (rewards != 0) {
        randomNumber_ = uint256(keccak256(abi.encode(randomNumber_, requestId)));
        // @audit bronze token doesnt get distributed
        for (uint256 i = 0; i < 3; i++) {
            uint256 chance = (((rewards >> (i * 8)) & 0xff) * (25 + (zone * 25))) / 10;
            if ((randomNumber_ % 10000) < chance) {
                // drop gacha token
                gachaTokenId = (4 - i);
                items.mint(hero.owner, gachaTokenId, 1);
                break;
            }
        }
    }

    // code
}
```

## Impact

This vulnerability results in a systematic exclusion of Bronze-tier gacha tokens from the reward distribution system. Players who stake heroes and successfully complete unstaking operations will never receive Bronze tokens, regardless of their weapon rarity or zone selection.

## Recommendation

The primary fix requires extending the reward distribution loop to include all four token tiers. Modify the loop condition in the `_calculateBonusRewards()` function from i < 3 to i < 4. This change will ensure that the Bronze token data stored in bits 24-31 of the `BONUS_REWARD_TABLE` is properly accessed and processed.

## Team Response

Fixed.
