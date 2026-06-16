---
tags:
  - lang/solidity
  - sector/streaming
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[FairSide]]"
auditors:
  - "[[WATCHPUG]]"
report: "https://code4rena.com/reports/2021-11-fairside"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# [H-01] Anyone Can Arbitrarily Call `FSDVesting.updateVestedTokens()`

- id: 42324
- impact: HIGH
- protocol: [[FairSide]]
- reporter: WatchPug (Code4rena)
- source: https://code4rena.com/reports/2021-11-fairside

## Summary


The `updateVestedTokens()` function has a bug that allows anyone to add any amount to the vested contract by spoofing their identity. This can be used by attackers to increase their vested amount and withdraw it without waiting the full duration or block withdrawals from other vested contracts. The bug was found by multiple users and confirmed by the developer. To fix this, a role should be implemented to ensure that only the `FSD.sol` contract can call `updateVestedTokens()`.

## Details

_Submitted by leastwood, also found by cmichel, hickuphh3, hyh, rfa, and WatchPug_

#### Impact
The `updateVestedTokens()` function is intended to be called by the `FSD.sol` contract when updating a user's vested token amount. A check is performed to ensure that `_user == beneficiary`, however, as `_user` is a user controlled argument, it is possible to spoof calls to `updateVestedTokens()` such that anyone can arbitrarily add any amount to the vested contract. Additionally, there is no check to ensure that the call originated from a trusted/whitelisted source.

There are two main reasons as to why the beneficiary or an attacker would want to call this function:

*   To increase the vested amount such that `calculateVestingClaim()` allows them to withdraw their entire vested amount without waiting the entire duration.
*   An attacker wishes to block withdrawals from other vested contracts by preventing successful calls to `claimVestedTokens()` by the beneficiary account. This can be done by increasing the vested amount such that `safeTransfer()` calls fail due to insufficient token balance within the contract.

#### Proof of Concept
- <https://github.com/code-423n4/2021-11-fairside/blob/main/contracts/token/FSDVesting.sol#L147-L161>
- <https://github.com/code-423n4/2021-11-fairside/blob/main/contracts/token/FSDVesting.sol#L100-L115>
- <https://github.com/code-423n4/2021-11-fairside/blob/main/contracts/token/FSDVesting.sol#L125>
- <https://github.com/code-423n4/2021-11-fairside/blob/main/contracts/token/FSDVesting.sol#L134>

#### Tools Used
Manual code review.
Discussions with dev.

#### Recommended Mitigation Steps
Ensure that the `updateVestedTokens()` function is only callable from the `FSD.sol` contract. This can be done by implementing an `onlyFSD` role.

**[YunChe404 (FairSide) confirmed](https://github.com/code-423n4/2021-11-fairside-findings/issues/101#issuecomment-968272792)**
