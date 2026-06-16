---
tags:
  - lang/solidity
  - sector/options
  - sector/perpetuals
  - platform/0x52
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Buffer]]"
auditors:
  - "[[@IAm0x52]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/0x52/2023-07-26-Buffer-v2.5.md"
genome:
  - "[[wrong-condition]]"
  - "[[variant]]"
  - "[[timestamp-dependence]]"
  - "[[frontrun-exposure]]"
  - "[[direct-drain]]"
---
# [H-04] closeAnytime timestamp is never validated against current timestamp

- id: 55636
- impact: HIGH
- protocol: [[Buffer]]
- reporter: @IAm0x52 (0x52)
- source: https://github.com/solodit/solodit_content/blob/main/reports/0x52/2023-07-26-Buffer-v2.5.md

## Summary


The bug report discusses an issue with the BufferRouter contract in the Buffer Protocol v2.5. The problem occurs when a user exercises their option early, as the current implementation does not properly validate the timestamp used for unlocking. This means that if private keeper mode is disabled, a user could potentially exercise their option in the past and receive a better payoff. The report recommends validating the exercise timestamp to prevent this issue. The bug has been mitigated by removing the ability to disable private keeper mode, but it can still be exploited by a malicious or compromised keeper. 

## Details

**Details**

[BufferRouter.sol#L248-L258](https://github.com/Buffer-Finance/Buffer-Protocol-v2_5/blob/84b6060b4447b2550de595202e8820c7f515988b/contracts/core/BufferRouter.sol#L248-L258)

            try
                optionsContract.unlock(
                    params.optionId,
                    params.closingPrice,
                    publisherSignInfo.timestamp,
                    params.isAbove
                )
            {} catch Error(string memory reason) {
                emit FailUnlock(params.optionId, params.targetContract, reason);
                continue;
            }

When exercising early, the timestamp used for unlocking is extremely important. The current implementation doesn't ever validate the current timestamp is anywhere near the current timestamp. If private keeper mode is disabled, a user could exercise their option in the past when they would get a better payoff.

**Lines of Code**

[BufferRouter.sol#L167-L260](https://github.com/Buffer-Finance/Buffer-Protocol-v2_5/blob/84b6060b4447b2550de595202e8820c7f515988b/contracts/core/BufferRouter.sol#L167-L260)

**Recommendation**

Validate that exercise timestamp is within some margin of the current timestamp

**Remediation**

Mitigated [here](https://github.com/Buffer-Finance/Buffer-Protocol-v2_5/pull/4/) by removing the ability to disable privateKeeperMode. This has only been addressed for non-trusted actors and can still be exploited by a malicious/compromised keeper
