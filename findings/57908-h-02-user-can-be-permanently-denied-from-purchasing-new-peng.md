---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/gaming
  - platform/shieldify
protocol: "[[Penguingotchi]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/PenguinGotchi-Security-Review.md"
genome:
  - "[[integer-bounds]]"
  - "[[dos-resistance]]"
  - "[[logic/wrong-condition]]"
  - "[[dos/selective]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/single-user]]"
---
# [H-02] User Can Be Permanently Denied from Purchasing New Penguins Due to Incorrect Alive Penguin Count Validation

- id: 57908
- impact: HIGH
- protocol: Penguingotchi
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/PenguinGotchi-Security-Review.md

## Summary


This bug report describes a high-risk vulnerability in a game's penguin purchase mechanism. The issue is caused by incorrect validation logic that uses the wrong data structure to determine if a user can buy more penguins. This results in dead penguins being counted towards the limit of alive penguins, leading to a situation where users can no longer participate in the game. The recommended fix is to modify the validation logic to use the correct data structure for counting alive penguins. The team has responded that the issue has been fixed.

## Details

## Severity

High Risk

## Description

The vulnerability exists in the penguin purchase mechanism within the `buyPenguin()` function and its associated validation logic. The contract maintains two separate data structures to track penguin ownership: `playerOwnedPenguins` mapping, which stores all penguins ever owned by a player (including dead ones), and `alivePenguins` mapping, which should theoretically track only living penguins. However, the purchase validation logic incorrectly uses `playerOwnedPenguins` instead of `alivePenguins` to determine if a user can acquire additional penguins.

The `checkCanGetExtraPenguin` modifier calls `playerOwnedPenguins[owner].length` to count the user's penguins and compares this against `settings.limits.maxAlivePenguins`. This count includes all penguins that have ever been owned by the user, regardless of their current state. When penguins die during activities in the `doActivity()` function, they are correctly removed from the alivePenguins mapping via `alivePenguins[params.player].remove(params.penguinId)`, but they remain in the `playerOwnedPenguins` array permanently. This creates a discrepancy where the validation logic considers dead penguins as part of the alive count, effectively reducing the user's ability to purchase new penguins below the intended limit.

In extreme scenarios, if the `maximum alive penguin limit` is set to a relatively low number (such as `10` as mentioned in test cases), users could find themselves completely unable to participate in the game after a series of unfortunate activity outcomes, despite the game's intended design.

## Location of Affected Code

File: [src/PenguinManager.sol#L168](https://github.com/WebitLabs/pengu-sc/blob/cd9e0fd078f55dbd1067be0fd4b25002ac59a425/src/PenguinManager.sol#L168)

```solidity
modifier checkCanGetExtraPenguin(address owner) {
    uint256[] memory penguinIds = playerOwnedPenguins[owner];
    uint256 penguinCount = penguinIds.length;

    if (penguinCount >= settings.limits.maxAlivePenguins) {
        revert MaximumPenguinsAcquired(penguinCount, settings.limits.maxAlivePenguins);
    }
    _;
}
```

## Impact

This vulnerability creates a permanent denial of service condition that fundamentally breaks the core functionality of the penguin management system. Users who experience multiple penguin deaths through activities will progressively lose their ability to purchase replacement penguins, eventually reaching a state where they cannot acquire any new penguins despite having zero living ones. This effectively locks users out of the primary game mechanic permanently.

## Recommendation

The immediate fix requires modifying the `checkCanGetExtraPenguin()` modifier to use the correct data structure for counting alive penguins. Replace the current validation logic that uses `playerOwnedPenguins[owner].length` with `alivePenguins[owner].length()` since the `alivePenguins` mapping properly tracks only living penguins and is correctly maintained throughout the penguin lifecycle.

## Team Response

Fixed.
