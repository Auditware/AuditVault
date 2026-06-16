---
tags:
  - lang/solidity
  - sector/stable
  - sector/staking
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/reward-calculation
  - impact/loss-of-funds/direct-drain
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Symmio]]"
auditors:
  - "[[0xBecket]]"
  - "[[0xCNX]]"
  - "[[A_Failures_True_Power]]"
  - "[[Artur]]"
  - "[[Audinarey]]"
  - "[[Breeje]]"
  - "[[CL001]]"
  - "[[Fortis_Audits]]"
  - "[[Kyosi]]"
  - "[[Pablo]]"
  - "[[SlayerSecurity]]"
  - "[[The_Rezolvers]]"
  - "[[Victor_TheOracle]]"
  - "[[X12]]"
  - "[[aslanbek]]"
  - "[[bladeee]]"
  - "[[durov]]"
  - "[[farismaulana]]"
  - "[[godwinudo]]"
  - "[[lls]]"
  - "[[newspacexyz]]"
  - "[[onthehunt]]"
  - "[[stuart_the_minion]]"
  - "[[wickie]]"
  - "[[zraxx]]"
report: "https://github.com/sherlock-audit/2025-03-symm-io-stacking-judging"
genome:
  - "[[reward-calculation]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[integer-bounds]]"
  - "[[reward-accounting]]"
---
# H-1: USDC rewards will not be distributed if `_updateRewardsStates` is triggered too often

- id: 55104
- impact: HIGH
- protocol: [[Symmio]], Staking and Vesting
- reporter: newspacexyz (Sherlock)
- source: N/A

## Summary


This bug report is about an issue with the distribution of USDC rewards in the SymmStaking contract. The problem is caused by the lack of upscaling for tokens with less than 18 decimals, which results in stakers not receiving their rewards. This can be exploited by an attacker who calls deposit, withdraw, or notifyRewardAmount with a small amount of SYMM every block, preventing other stakers from receiving their rewards. The impact of this bug is high, as stakers will not receive their rewards in tokens with low decimals, such as USDC and USDT. To mitigate this issue, the report suggests introducing a 1e12 multiplier for reward calculation and dividing the accumulated rewards by 1e12 when they are claimed.

## Details

Source: https://github.com/sherlock-audit/2025-03-symm-io-stacking-judging/issues/575 

## Found by 
0xBecket, 0xCNX, A\_Failures\_True\_Power, Artur, Audinarey, Breeje, CL001, Fortis\_Audits, Kyosi, Pablo, SlayerSecurity, The\_Rezolvers, Victor\_TheOracle, X12, aslanbek, bladeee, durov, farismaulana, godwinudo, lls, newspacexyz, onthehunt, stuart\_the\_minion, wickie, zraxx

### Summary


https://github.com/sherlock-audit/2025-03-symm-io-stacking/blob/main/token/contracts/staking/SymmStaking.sol#L402-L423

_updateRewardsStates can be triggered as often as each block (2 seconds) via deposit/withdraw/claim/notifyRewardAmount

e.g. if there's 1209.6e6 USDC rewards for one week (604800 seconds)


https://github.com/sherlock-audit/2025-03-symm-io-stacking/blob/main/token/contracts/staking/SymmStaking.sol#L374

rate = 1209_600000 / 604800 = 2000 "usdc units" per second


https://github.com/sherlock-audit/2025-03-symm-io-stacking/blob/main/token/contracts/staking/SymmStaking.sol#L194-L202

if SYMM total staked supply is 1_000_000e18 (~26560 usd), and we call `deposit` each block, then [`perTokenStored` will be increased by](https://github.com/sherlock-audit/2025-03-symm-io-stacking/blob/main/token/contracts/staking/SymmStaking.sol#L412):

2 * 2000 * 1e18 / 1_000_000e18 = 4_000 / 1_000_000 = 0

Therefore, `perTokenStored` will not increase, but [`lastUpdated` will be increased](https://github.com/sherlock-audit/2025-03-symm-io-stacking/blob/main/token/contracts/staking/SymmStaking.sol#L413), therefore users will not receive any USDC rewards for staking.

In this particular example, triggering `_updateRewardsStates` once in 249 blocks would be sufficient, as it would still result in rewards rounding down to zero.


### Root Cause

Lack of upscaling for tokens with less than 18 decimals for reward calculations.

### Attack Path

1. Attacker calls deposit/withdraw/notifyRewardAmount with any non-zero amount every block (or less often as long as the calculation will still round down to zero)

### Impact

High: stakers do not receive rewards in tokens with low decimals (e.g. USDC, USDT).

### PoC

1. SYMM total staked supply = 1_000_000e18
2. `notifyRewardAmount` is called with 1209.6 USDC
3. griefer calls `deposit/withdraw` 1 wei of SYMM each 249 blocks for 1 week
4. USDC rewards are stuck in the contract, instead of being distributed to stakers (but can be rescued by admin)

### Mitigation

Introduce 1e12 multiplier for reward calculation, and divide the accumulated rewards by 1e12 when they are being claimed.
