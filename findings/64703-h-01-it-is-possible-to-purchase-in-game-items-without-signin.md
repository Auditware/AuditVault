---
tags:
  - lang/solidity
  - sector/gaming
  - sector/nft
  - sector/token
  - platform/shieldify
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Roots of Ember Vault]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/RootsofEmbervault-Ruyui-Security-Review.md"
genome:
  - "[[fee-calculation]]"
  - "[[fee-theft]]"
  - "[[variant]]"
  - "[[access-roles]]"
---
# [H-01] It Is Possible to Purchase In-Game Items Without Signing Up Which Results in Loss of Commission Fee for Referee

- id: 64703
- impact: HIGH
- protocol: Rootsofembervault Ruyui
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/RootsofEmbervault-Ruyui-Security-Review.md

## Summary


This bug report highlights a problem with the RuyuiShop contract where users can purchase items and a battle pass without signing up first. This can lead to incorrect state updates, the referee not receiving their commission, and users bypassing the signup fee. The team has recommended implementing a check to ensure that users have signed up before making a purchase. This issue has been fixed by the team.

## Details


## Severity

High Risk

## Description

When purchasing a shop item and a battle pass, it is not checked whether the user has signed up or not. Signing up before purchase is necessary because the referee is set for the user during sign-up and at the time of purchasing an item, the referee gets their commission.

Calling purchase functions without signing up is dangerous because those purchase functions (`RuyuiShop.purchaseBattlePass()` and `RuyuiShop.purchaseShopItem()`) update states for the user:

```solidity
userShopItemPurchases[msg.sender][itemId]++

hasPurchasedBattlePass[msg.sender][battlePassId] = true;
```

Those functions assume the caller is a user and update these mappings according to that. But without signing up, a caller can't be a user. If the protocol later plans some perks for users, for example, an airdrop, then the caller will get the airdrop without being a user of the game, additionally, he bypasses the signup fee payment.

## Location of Affected Code

File: [RuyuiShop.sol#L440-L463](https://github.com/adeelJaved-5/RuyuiMarketPlace/blob/66c6818e7765c74d6c16f887c1259411c09ad7a9/RuyuiShop.sol#L440-L463)

File: [RuyuiShop.sol#L383-L438](https://github.com/adeelJaved-5/RuyuiMarketPlace/blob/66c6818e7765c74d6c16f887c1259411c09ad7a9/RuyuiShop.sol#L383-L438)

## Impact

- The referee will not get his commission.
- Incorrect state update.
- Avoids signup fee.
- Breaks the rules of the game, where signing up is important.

## Recommendation

Consider implementing this check in `purchaseBattlePass()` and `purchaseShopItem()` functions:

```solidity
require(hasSignedUp(msg.sender), "Has not signed up yet");
```

## Team Response

Fixed.
