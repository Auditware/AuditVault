---
tags:
  - lang/solidity
  - platform/0x52
  - has/github
  - severity/high
  - sector/options
  - sector/perpetuals
protocol: "[[Buffer]]"
auditors:
  - "[[@IAm0x52]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/0x52/2023-07-26-Buffer-v2.5.md"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[timestamp-dependence]]"
---
# [H-05] closeAnyTime timestamp is never validated against pricing timestamp

- id: 55637
- impact: HIGH
- protocol: [[Buffer]]
- reporter: @IAm0x52 (0x52)
- source: https://github.com/solodit/solodit_content/blob/main/reports/0x52/2023-07-26-Buffer-v2.5.md

## Summary


This bug report is about a potential issue in the BufferRouter.sol code, which is used in the Buffer Protocol v2.5. When an option is exercised early, the code does not check the timestamp of the closeAnytime signature, which can lead to two problems: the user may receive less than expected and transactions may be intercepted and used by someone else with a different timestamp. The code should be updated to require the pricing data timestamp and closeAnytime timestamp to match. A fix has been made to remove the ability to disable privateKeeperMode, but this may still be exploited by a malicious or compromised keeper. 

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

When an option is exercised early, it uses the timestamp of the pricing data without ever checking the timestamp of the closeAnytime signature. This can lead to 2 potential issues:

1. The user may receive less than expected due to the actual exercise timestamp being different than when they signed
2. If private keeper mode is disabled then transactions may be intercepted and the signature used by someone else to close the position with a much different timestamp

**Lines of Code**

[BufferRouter.sol#L167-L260](https://github.com/Buffer-Finance/Buffer-Protocol-v2_5/blob/84b6060b4447b2550de595202e8820c7f515988b/contracts/core/BufferRouter.sol#L167-L260)

**Recommendation**

Pricing data timestamp and closeAnytime timestamp should be required to match

**Remediation**

Mitigated [here](https://github.com/Buffer-Finance/Buffer-Protocol-v2_5/pull/4/) by removing the ability to disable privateKeeperMode. This has only been addressed for non-trusted actors and can still be exploited by a malicious/compromised keeper
