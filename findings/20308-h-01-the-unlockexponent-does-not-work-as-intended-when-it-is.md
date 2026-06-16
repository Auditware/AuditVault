---
tags:
  - lang/solidity
  - platform/pashov-audit-group
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/variant
  - sector/streaming
protocol: "[[Zerem]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2022-11-01-Zerem.md"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
---
# [H-01] The `unlockExponent` does not work as intended when it is ≠ 1

- id: 20308
- impact: HIGH
- protocol: [[Zerem]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2022-11-01-Zerem.md

## Summary


A bug was discovered in the code of a protocol that was meant to allow users to claim their locked tokens after a certain delay. The documentation and chart in the README.md file showed that when the unlockExponent was set to 0, the user should be able to claim their whole locked amount immediately after the unlockDelaySec had passed. However, the code was not working as intended. 

When the unlockExponent was set to 0, the factor was always equal to 1, which was less than the precision of 1e8. This meant that the total amount to unlock was equal to the record.totalAmount divided by the precision, instead of the expected record.totalAmount. Every subsequent time the _getWithdrawableAmount function was called, the math would be the same, meaning that no user would be able to withdraw more than totalLockedAmount/1e8.

When the unlockExponent was greater than 1, the computed factor could easily be greater than or equal to the precision, resulting in 100% of the funds being unlocked too early.

The bug was classified as High severity as it affected the core functionality of the protocol and could result in stuck tokens or value loss for users. The recommendation was to either redesign the unlockExponent logic or hardcode it to always be linear (a value of 1). The client response was that the bug was fixed by removing the unlockExponent logic.

## Details

**Proof of Concept**

The documentation and the chart in `README.md` shows that it is expected that when `unlockExponent == 0` then immediately after funds `unlockDelaySec` the user can claim his whole locked amount. This is actually not working as intended, let’s look at the `_getWithdrawableAmount` function:

1. To calculate the amount to unlock, we have the following: `uint256 totalUnlockedAmount = (record.totalAmount * factor) / precision;`
2. `record.totalAmount` is the total locked amount, `precision` is a constant with a value of `1e8` and `factor` is calculated by this:

```solidity
uint256 factor = deltaTimeNormalized ** unlockExponent;

if (factor > precision) {
         factor = precision;
}
```

1. If we have `unlockExponent == 0` then `factor` is always equal to 1, which is less than `1e8` so `factor == 1`
2. Now if we go back to the total amount to unlock math, we will get `uint256 totalUnlockedAmount = (record.totalAmount * factor) / precision;` so `uint256 totalUnlockedAmount = record.totalAmount / precision`

The expected unlocked amount was equal to `record.totalAmount` but instead we got `record.totalAmount / precision` which is incorrect. Now every subsequent time the `_getWithdrawableAmount` function is called, the math will be the same and the code will basically think there is no newly unlocked amount. This means that no user that has locked funds in Zerem will be able to withdraw more than `totalLockedAmount / 1e8` ever, all of the other tokens will be stuck.

There is also a problem when `unlockExponent > 1` , because the computed `factor` can easily be `>= precision` which will result in 100% of funds being unlocked too early.

Here is the important math:

```solidity
uint256 deltaTimeNormalized = (deltaTimeDelayed * precision) / unlockPeriodSec;

uint256 factor = deltaTimeNormalized ** unlockExponent;

if (factor > precision) {
      factor = precision;
}
uint256 totalUnlockedAmount = (record.totalAmount * factor) / precision;
```

and let’s look at example scenario:

1. `unlockPeriodSec == 100 000`, `deltaTimeDelayed == 100` and `precision == 1e8` so `deltaTimeNormalized == 1e5`
2. if `unlockExponent > 1` for example when equal to 2, we will get `factor = 1e5 ** 2`, so `1e10` which is `> precision` that is `1e8` so now `factor = precision`
3. Now `totalUnlockedAmount = record.totalAmount * factor / factor` which is `record.totalAmount`
4. even though only 1/1000th of the unlock period has passed and the `unlockExponent` was just `2`, the user can already claim all of their locked tokens.

**Impact**

The protocol does not work as expected in its core functionality and can also result in stuck tokens (value loss) for users or tokens unlocked too early, so it is High severity.

**Recommendation**

Redesign the `unlockExponent` logic or just hardcode it to always be linear (a value of 1)

**Client response**

Fixed by removing the `unlockExponent` logic
