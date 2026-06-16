---
tags:
  - lang/solidity
  - sector/governance
  - sector/staking
  - platform/shieldify
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Terplayer]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Terplayer-BVT-Staking&Distribution-Security-Review.md"
genome:
  - "[[underflow]]"
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[reentrancy-guard]]"
  - "[[vote-delegation-loop]]"
---
# [C-01] Withdrawal Calculation Causes Underflow, Locking All User Funds

- id: 62638
- impact: HIGH
- protocol: [[Terplayer]] Bvt Staking&Distribution
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Terplayer-BVT-Staking&Distribution-Security-Review.md

## Summary


This bug report is about a critical issue in the withdrawal function of a smart contract. The function includes the user in their own delegation list and uses a certain calculation method, which causes an underflow error and makes all withdrawals unsuccessful. The affected code is located in a specific file and line, and the impact of this bug is that it locks user funds permanently. The recommendation is to exclude the user from their delegation list and use a different calculation method to prevent similar issues in the future. The team has confirmed that they have fixed the bug.

## Details


## Severity

Critical Risk

## Description

The withdrawal function includes the user in their own delegation list and uses ceiling division for all calculations. This causes `totalDelegatedAmount` to exceed the requested withdrawal amount, resulting in an underflow when calculating `remainingAmount = amount - totalDelegatedAmount`, which renders all withdrawals unsuccessful.

## Location of Affected Code

File: [src/BvtRewardVault.sol#L155](https://github.com/batoshidao/berabtc-vault-token/blob/c68f412b3c7dfd99d3f6302a42bdf772ededb2a3/src/BvtRewardVault.sol#L155)

```solidity
function withdraw(uint256 amount) external nonReentrant {
  // code

  // Calculate and withdraw from delegated stakes
  for (uint256 i = 0; i < users.length; i++) {
      address user = users[i];
      uint256 delegatedAmount = delegatedStakes[msg.sender][user];
      if (delegatedAmount > 0) {
          uint256 withdrawAmount = (delegatedAmount * amount + stakes[msg.sender] - 1)  / stakes[msg.sender];
          if (withdrawAmount > 0) {
              totalDelegatedAmount += withdrawAmount;
              _delegateWithdraw(msg.sender, user, withdrawAmount);
          }
      }
  }
  // Calculate remaining amount to withdraw from user's own stake
  uint256 remainingAmount = amount - totalDelegatedAmount;
  if (remainingAmount > 0) {
      _delegateWithdraw(msg.sender, msg.sender, remainingAmount);
  }
  // code
}
```

## Impact

All withdrawals fail due to underflow, permanently locking user funds.

## Recommendation

Εxclude the user from their delegation list and handle their portion separately, and also, consider using floor division with remainder assignment to prevent over-calculation.

## Team Response

Fixed.



## Artifacts

- Raw capture: /Users/user/Desktop/crawlee-run/pages_capture.har
- Pages snapshot: /Users/user/Desktop/crawlee-run/all_findings_full.json
