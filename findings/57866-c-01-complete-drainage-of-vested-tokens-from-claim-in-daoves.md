---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/token
  - sector/governance
  - sector/streaming
  - platform/shieldify
protocol: "[[Daoslive]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/DaosLive-Security-Review.md"
genome:
  - "[[reward-accounting]]"
  - "[[reentrancy-guard]]"
  - "[[reentrancy/cross-contract]]"
  - "[[loss-of-funds/direct-drain]]"
  - "[[known-pattern]]"
  - "[[reentrancy-callback]]"
  - "[[use-reentrancy-guard]]"
  - "[[precondition/always]]"
  - "[[blast-radius/protocol-wide]]"
---
# [C-01] Complete Drainage of Vested Tokens from `claim()` in `DaoVesting`

- id: 57866
- impact: HIGH
- protocol: Daoslive
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/DaosLive-Security-Review.md

## Summary


The report describes a critical vulnerability in the `DaosVesting::claim()` function that allows attackers to drain tokens from legitimate DAOs. The issue is caused by insufficient validation of the DAO contract address and its state. This can be exploited by deploying a fake malicious contract and manipulating the vesting schedules to receive tokens from the legitimate DAO's vesting contract. The affected code is located in the `DaosVesting.sol` file and can result in a complete loss of tokens for the affected DAOs. To fix this issue, the team recommends restricting the caller to claim tokens only through the `DaosLive` contract function and validating the legitimacy of the DAO contract. The team has responded that the issue has been fixed.

## Details

## Severity

Critical Risk

## Description

The `DaosVesting::claim()` function has a critical vulnerability that allows an attacker to drain tokens from legitimate DAOs. The issue stems from insufficient validation of the DAO contract address and its state.

Vulnerable code in `DaosVesting::claim()`:

```solidity
function claim(address dao, address user, uint256 index) external {
    IDaosLive daosLive = IDaosLive(dao);
@-> address token = daosLive.token();

@-> uint256 maxPercent = getClaimablePercent(dao, index);
    if (maxPercent > DENOMINATOR) revert InvalidCalculation();

    unchecked {
@->     uint256 totalAmount = daosLive.getContributionTokenAmount(user);
        uint256 maxAmount = (totalAmount * maxPercent) / DENOMINATOR;
        if (maxAmount < claimedAmounts[dao][user]) {
            revert InvalidCalculation();
        }
        uint256 amount = maxAmount - claimedAmounts[dao][user];

        if (amount > 0) {
            claimedAmounts[dao][user] += amount;
            totalClaimeds[dao] += amount;
@->         TransferHelper.safeTransfer(token, user, amount);
            observer.emitClaimed(dao, token, user, amount);
        }
    }
}
```

**Attack Vector:**

1. Attacker deploys fake malicious contract implementing `IDaosLive`
2. Sets `token` address to a legitimate DAO's token
3. Implements `getContributionTokenAmount()` to manually return the amount of legit `DaosLive` tokens locked in `DaoVesting.sol` contract.
4. Sets vesting schedules of that Fake `IDaosLive` implementation with 100% unlock for an `index`.
5. Calls `claim()` on the vesting contract with their Fake malicious `DoasLive` contract address
6. Receives tokens from the legitimate DAO's vesting contract

## Location of Affected Code

File: [contracts/DaosVesting.sol#L91](https://github.com/ED3N-Ventures/daoslive-sc/blob/9a1856db2060b609a17b24aa72ab35f2cdf09031/contracts/DaosVesting.sol#L91)

```solidity
function claim(address dao, address user, uint256 index) external {
    IDaosLive daosLive = IDaosLive(dao);
@-> address token = daosLive.token();

@-> uint256 maxPercent = getClaimablePercent(dao, index);
    if (maxPercent > DENOMINATOR) revert InvalidCalculation();

    unchecked {
@->     uint256 totalAmount = daosLive.getContributionTokenAmount(user);
        uint256 maxAmount = (totalAmount * maxPercent) / DENOMINATOR;
        if (maxAmount < claimedAmounts[dao][user]) {
            revert InvalidCalculation();
        }
        uint256 amount = maxAmount - claimedAmounts[dao][user];

        if (amount > 0) {
            claimedAmounts[dao][user] += amount;
            totalClaimeds[dao] += amount;
@->         TransferHelper.safeTransfer(token, user, amount);
            observer.emitClaimed(dao, token, user, amount);
        }
    }
}
```

## Impact

- Complete drain of tokens from legitimate DAOs
- Loss of all funds of vested tokens that should have been claimed by the real contributors of `DaosLive`
- Permanent loss of tokens
- Affects all DAOs using the vesting contract.

## Recommendation

- Restrict the caller to claim the tokens only through `DaosLive` contract function, claim only. Do not allow users to clam directly through the vesting contract.
- Validate that the DAO contract is legitimate or not.

## Team Response

Fixed.
