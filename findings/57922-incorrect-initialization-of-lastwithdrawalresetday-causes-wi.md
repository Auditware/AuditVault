---
tags:
  - lang/solidity
  - sector/staking
  - has/github
  - severity/high
protocol: "[[DIA]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/DIA/Lumina%20Staking/README.md#5-incorrect-initialization-of-lastwithdrawalresetday-causes-withdrawal-limits-to-malfunction"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[precondition/uninitialized]]"
---
# Incorrect Initialization of `lastWithdrawalResetDay` Causes Withdrawal Limits to Malfunction

- id: 57922
- impact: HIGH
- protocol: DIA
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/DIA/Lumina%20Staking/README.md#5-incorrect-initialization-of-lastwithdrawalresetday-causes-withdrawal-limits-to-malfunction

## Summary


The `DIAExternalStaking` contract has a bug where the `lastWithdrawalResetDay` variable is not properly initialized, causing the daily withdrawal limits to not reset correctly. This means that users are not limited to daily withdrawals as intended. The bug is classified as high severity and the recommended solution is to initialize the variable correctly in the constructor. The bug has been fixed in a recent commit.

## Details

##### Description
This issue has been identified within the constructor of the `DIAExternalStaking` contract.
The `lastWithdrawalResetDay` variable is initialized with the current block timestamp, rather than the timestamp divided by `SECONDS_IN_A_DAY`. As a result, the daily withdrawal counters are never properly reset, causing the withdrawal limits to effectively become one-time limits rather than daily limits. This means the intended functionality of daily withdrawal restrictions does not work as designed, and the contract cannot be upgraded to fix this issue.
The issue is classified as **High** severity because it breaks a core security mechanism of the contract.
<br/>
##### Recommendation
We recommend initializing `lastWithdrawalResetDay` as `block.timestamp / SECONDS_IN_A_DAY` in the constructor to ensure the daily reset logic functions correctly.

> **Client's Commentary:**
> This has been fixed in commit https://github.com/diadata-org/lumina-staking/commit/c33748d84b0c60b64ea7b3e38379be9a9867942d
