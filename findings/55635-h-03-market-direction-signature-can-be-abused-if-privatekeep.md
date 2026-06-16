---
tags:
  - lang/solidity
  - sector/perpetuals
  - sector/staking
  - platform/0x52
  - has/github
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[Buffer]]"
auditors:
  - "[[@IAm0x52]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/0x52/2023-07-26-Buffer-v2.5.md"
genome:
  - "[[signature-replay]]"
  - "[[locked-funds]]"
  - "[[cross-contract-state-consistency]]"
  - "[[reward-accounting]]"
---
# [H-03] Market direction signature can be abused if privateKeeperMode is disabled

- id: 55635
- impact: HIGH
- protocol: [[Buffer]]
- reporter: @IAm0x52 (0x52)
- source: https://github.com/solodit/solodit_content/blob/main/reports/0x52/2023-07-26-Buffer-v2.5.md

## Summary


This bug report discusses an issue with the Buffer Protocol v2_5 contract, specifically in the BufferRouter.sol file. The code in lines 233-246 allows users to change the market direction after exercising their options, which can lead to unfair wins or indefinite locking of funds. The report recommends using a different method of verifying the market direction, such as hashing it with a salt. The issue has been mitigated by removing the ability to disable privateKeeperMode.

## Details

**Details**

https://github.com/Buffer-Finance/Buffer-Protocol-v2_5/blob/84b6060b4447b2550de595202e8820c7f515988b/contracts/core/BufferRouter.sol#L233-L246

            if (
                !Validator.verifyMarketDirection(
                    params,
                    queuedTrade,
                    optionInfo.signer
                )
            ) {
                emit FailUnlock(
                    params.optionId,
                    params.targetContract,
                    "Router: Wrong market direction"
                );
                continue;
            }

When options are exercised, the market direction is revealed via a signature provided by the opener. This can cause 2 significant issues if privateKeeperMode is disabled:

1. User can change the direction of their trade after to guarantee they win
2. User can open trade and withhold direction signature to indefinitely lock LP funds

**Lines of Code**

[BufferRouter.sol#L233-L246](https://github.com/Buffer-Finance/Buffer-Protocol-v2_5/blob/84b6060b4447b2550de595202e8820c7f515988b/contracts/core/BufferRouter.sol#L233-L246)

[BufferRouter.sol#L300-L313](https://github.com/Buffer-Finance/Buffer-Protocol-v2_5/blob/84b6060b4447b2550de595202e8820c7f515988b/contracts/core/BufferRouter.sol#L300-L313)

**Recommendation**

Instead of using a signature at exercise, consider instead concatenating the direction with a salt then hashing storing that hash with the queued trade. Upon closure the salt and direction can be provided and the hash checked against the stored hash.

**Remediation**

Mitigated [here](https://github.com/Buffer-Finance/Buffer-Protocol-v2_5/pull/4/) by removing the ability to disable privateKeeperMode
