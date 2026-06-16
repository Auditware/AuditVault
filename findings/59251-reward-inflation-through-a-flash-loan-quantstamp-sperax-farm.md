---
tags:
  - lang/solidity
  - sector/farm
  - sector/lending
  - platform/quantstamp
  - severity/high
  - vuln/dos/frozen-funds
  - vuln/logic/reward-calculation
  - impact/loss-of-funds/locked-funds
  - trigger/flash-loan
  - precondition/flash-loan-available
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Sperax Farms]]"
auditors:
  - "[[Gereon Mendler]]"
report: "https://certificate.quantstamp.com/full/sperax-farms/e6f8e3b1-d55d-4c05-91da-30d4a4bb7633/index.html"
genome:
  - "[[frozen-funds]]"
  - "[[reward-calculation]]"
  - "[[locked-funds]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[flashloan-callback-auth]]"
  - "[[reward-accounting]]"
---
# Reward Inflation Through a Flash Loan

- id: 59251
- impact: HIGH
- protocol: Sperax - Farms
- reporter: Gereon Mendler (Quantstamp)
- source: https://certificate.quantstamp.com/full/sperax-farms/e6f8e3b1-d55d-4c05-91da-30d4a4bb7633/index.html

## Summary


A bug has been reported in the `Rewarder.sol` and `Farm.sol` files where users are able to deposit and withdraw funds in the same block, leading to potential exploitation through a Flash Loan. This allows users to inflate their rewards by depositing a large amount of farm tokens and immediately withdrawing them, resulting in a higher reward payout. To fix this issue, a deposit timestamp has been added to the `Deposit` struct and a time delay has been implemented to prevent deposits and withdrawals from occurring in the same block. This will help prevent potential exploitation and ensure fair distribution of rewards. 

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `e1359d81959883d4485f09e48e28afa970627d89`. The client provided the following explanation:

> Added a depositTs in struct Deposit, it is updated in deposit() and increaseDeposit() and validated in withdraw() and decreaseDeposit()

This has been fixed as users can no longer deposit or withdraw in the same block.

**File(s) affected:**`Rewarder.sol`, `Farm.sol`

**Description:** As deposits and withdrawals are allowed to occur within the same block, it is possible for a user to significantly inflate the rewards through a Flash Loan. The exploit scenario below describes specifics. This attack is more feasible for smaller farms.

**Exploit Scenario:**

1.   The attacker makes an initial deposit, which will later be needed to claim rewards.
2.   The attacker receives a flash loan, from which they receive a large amount of farm tokens. 
3.   The attacker deposits these farm tokens, calibrates the rewards, and immediately withdraws their deposit, and repays the flash loan.
4.   Time passes.
5.   The attacker claims rewards at a highly inflated rate due to the rewards being calibrated at a time when there were substantial funds in the farm.

**Recommendation:** To mitigate this risk, consider disallowing deposits and withdrawals to occur in the same block. This can be done by including a deposit timestamp in the `Deposit` struct, and ensuring that some time has passed when a withdrawal is processed, or a deposit is decreased.
