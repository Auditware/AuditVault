---
tags:
  - lang/solidity
  - platform/cantina
  - has/poc
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
  - sector/lending
protocol: "[[ZeroLend]]"
auditors:
  - "[[Sujith Somraaj]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_zerolend_jan2024.pdf"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[access-roles]]"
  - "[[bridge-sender-auth]]"
  - "[[reward-accounting]]"
---
# Missing accesscontrol in afterlockupdate 

- id: 40821
- impact: HIGH
- protocol: [[ZeroLend]]
- reporter: Sujith Somraaj (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_zerolend_jan2024.pdf

## Summary


The ZLRewardsController contract has a vulnerability in the afterLockUpdate function, which is used to update a user's balance after locking, unlocking, or modifying a lock. This vulnerability allows any user to manipulate their balance and potentially receive rewards they are not entitled to. The lack of access control in this function also means that rewards may be unfairly distributed. A proof of concept is provided to show how this vulnerability can be exploited. The report recommends implementing access control checks to ensure the function can only be called by authorized contracts involved in the locking process. This will help mitigate the risk of unauthorized balance manipulation and unfair reward distribution. 

## Details

## Vulnerability Analysis of afterLockUpdate in ZLRewardsController.sol

## Context
**File:** `ZLRewardsController.sol`  
**Lines:** 588-590

## Description
The `afterLockUpdate` function in the provided `ZLRewardsController.sol` contract is intended to update a user's registered balance after locking, unlocking, or modifying a lock. However, a critical security vulnerability arises from the absence of sufficient access control mechanisms in this function. Without proper restrictions, any user, regardless of their interaction with the locking mechanism, can call `afterLockUpdate` to update their balance, potentially manipulating their eligibility for rewards.

The lack of access control in `afterLockUpdate` has several severe implications:
1. **Unauthorized Balance Manipulation:** Any user can call `afterLockUpdate` to update their balance, even if they haven't engaged in any lock-related activities. This loophole allows for potential manipulation of reward eligibility and distribution.
2. **Distortion of Reward Distribution:** The vulnerability can lead to an unfair distribution of rewards. Users who haven't locked any tokens or aren't entitled to rewards could falsely inflate their balance, thereby claiming rewards that they aren't entitled to.

## Proof of Concept
The vulnerability is evident in the implementation of `afterLockUpdate`:
1. The function is meant to be called post-locking activities like creating locks, unlocking, or increasing amounts through the `ZeroLocker` contract.
2. However, it lacks any checks to ensure that it is only called by these locking mechanisms (like `ZeroLocker`).
3. As a result, any user can call this function directly, updating their balance and potentially becoming eligible for rewards without actually locking any tokens.
4. It becomes evident after looking at the Natspec.

## Recommendation
Consider introducing access control checks in the `afterLockUpdate` function to ensure that it can only be called by authorized contracts (like `ZeroLocker`). This can be achieved by using modifiers that restrict function calls to known, trusted contracts involved in the locking process:

```solidity
modifier onlyZeroLocker() {
    require(msg.sender == address(locker), "Unauthorized: caller is not ZeroLocker");
    _;
}

function afterLockUpdate(address _user) external onlyZeroLocker {
    _updateRegisteredBalance(_user);
}
```
