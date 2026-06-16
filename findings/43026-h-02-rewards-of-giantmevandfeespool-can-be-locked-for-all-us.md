---
tags:
  - lang/solidity
  - sector/staking
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[Stakehouse Protocol]]"
auditors:
  - "[[clems4ever]]"
report: "https://code4rena.com/reports/2022-11-stakehouse"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[reward-accounting]]"
---
# [H-02] Rewards of `GiantMevAndFeesPool` can be locked for all users

- id: 43026
- impact: HIGH
- protocol: [[Stakehouse Protocol]]
- reporter: clems4ever (Code4rena)
- source: https://code4rena.com/reports/2022-11-stakehouse

## Summary


The bug report discusses a potential vulnerability in the code for the GiantMevAndFeesPool and GiantLP contracts. The vulnerability could allow a malicious user to block access to rewards for other users. A proof of concept has been provided to demonstrate the issue. The recommended mitigation steps include protecting the inherited functions of the ERC20 tokens and addressing similar issues with LPToken and StakingFundsVault. The report has been confirmed by a member of the Stakehouse team.

## Details


<https://github.com/code-423n4/2022-11-stakehouse/blob/4b6828e9c807f2f7c569e6d721ca1289f7cf7112/contracts/liquid-staking/GiantMevAndFeesPool.sol#L172><br>
<https://github.com/code-423n4/2022-11-stakehouse/blob/4b6828e9c807f2f7c569e6d721ca1289f7cf7112/contracts/liquid-staking/GiantLP.sol#L8><br>

Any malicious user could make the rewards in GiantMevAndFeesPool inaccessible to all other users...

### Proof of Concept

<https://gist.github.com/clems4ever/9b05391cc2192c1b6e8178faa38dfe41>

Copy the file in the test suite and run the test.

### Tools Used

forge test

### Recommended Mitigation Steps

Protect the inherited functions of the ERC20 tokens (GiantLP and LPToken) because `transfer` is not protected and can trigger the `before` and `after` hooks. There is the same issue with LPToken and StakingFundsVault.

**[vince0656 (Stakehouse) confirmed](https://github.com/code-423n4/2022-11-stakehouse-findings/issues/33)**



***
