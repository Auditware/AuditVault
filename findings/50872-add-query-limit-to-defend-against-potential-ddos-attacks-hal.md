---
tags:
  - lang/solidity
  - platform/halborn
  - has/github
  - severity/high
  - sector/oracle
protocol: "[[CoreDAO]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/coredao/109-upgrade-release"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# Add query limit to defend against potential DDoS attacks

- id: 50872
- impact: HIGH
- protocol: 1.0.9 Upgrade Release
- reporter: Halborn
- source: https://www.halborn.com/audits/coredao/109-upgrade-release

## Summary


The `FeeHistory` function in the Oracle struct is experiencing a bug that could potentially lead to Denial-of-Service (DDoS) attacks. This is because there is currently no limit on the number of percentiles that can be specified in the `rewardPercentiles` parameter. An attacker could exploit this vulnerability by sending requests with an excessively large number of percentiles, causing the server to become overwhelmed and potentially leading to degraded performance or service unavailability. To fix this issue, the CoreDAO team has implemented a constant `maxQueryLimit` to limit the number of percentiles allowed in a single request. They have also added a check in the `FeeHistory` function to validate the length of the `rewardPercentiles` parameter against the `maxQueryLimit`. This bug has been solved and the changes can be found on the CoreDAO GitHub repository. 

## Details

##### Description

The `FeeHistory` function in the Oracle struct is responsible for retrieving historical fee data based on the provided parameters. However, the current implementation lacks a limit on the number of percentiles that can be specified in the `rewardPercentiles` parameter. This absence of a limit makes the function vulnerable to potential Denial-of-Service (DDoS) attacks.

An attacker could exploit this vulnerability by sending requests with an excessively large number of percentiles in the `rewardPercentiles` parameter. Processing a large number of percentiles can consume significant computational resources and potentially overwhelm the server, leading to degraded performance or even service unavailability.

##### BVSS

[AO:A/AC:L/AX:L/C:H/I:H/A:H/D:N/Y:N/R:P/S:C (7.0)](/bvss?q=AO:A/AC:L/AX:L/C:H/I:H/A:H/D:N/Y:N/R:P/S:C)

##### Recommendation

Define a constant `maxQueryLimit` to represent the maximum number of percentiles allowed in a single request.

* Define a constant `maxQueryLimit` to represent the maximum number of percentiles allowed in a single request. For example:

```
const maxQueryLimit = 100
```

* Add a check in the `FeeHistory` function to validate the length of the `rewardPercentiles` parameter against the `maxQueryLimit`. If the length exceeds the limit, return an error indicating that the query exceeds the maximum allowed limit. For example:

```
if len(rewardPercentiles) > maxQueryLimit {
    return common.Big0, nil, nil, nil, fmt.Errorf("%w: over the query limit %d", errInvalidPercentile, maxQueryLimit)
}
```

  

### Remediation Plan

**SOLVED:** The **CoreDAO team** solvedthe issue by implementing the suggested recommendation.

##### Remediation Hash

<https://github.com/coredao-org/core-chain/commit/96abe9d1c72baac567020a20f4fdb3538bef32f5>

##### References

[coredao-org/core-chain/eth/gasprice/feehistory.go#L44](https://github.com/coredao-org/core-chain/blob/branch_v1.0.9/eth/gasprice/feehistory.go#L44)

[bnb-chain/bsc/pull/2423](https://github.com/bnb-chain/bsc/pull/2423/files)
