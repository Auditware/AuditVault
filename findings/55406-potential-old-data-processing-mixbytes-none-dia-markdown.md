---
tags:
  - lang/solidity
  - sector/lending
  - sector/oracle
  - has/github
  - severity/high
protocol: "[[DIA]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/DIA/Multi%20Scope/README.md#1-potential-old-data-processing"
genome:
  - "[[dos-resistance]]"
  - "[[unbounded-loop]]"
  - "[[known-pattern]]"
  - "[[cross-protocol]]"
---
# Potential Old Data Processing

- id: 55406
- impact: HIGH
- protocol: DIA
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/DIA/Multi%20Scope/README.md#1-potential-old-data-processing

## Summary


The `handle` function in the `PushOracleReceiver` contract has a bug that could lead to incorrect pricing information and potentially harmful consequences. This is due to the possibility of old data being processed if it was previously reverted due to an out of gas error. To fix this, it is recommended to check the timestamp of the data in the `handle` function to ensure that only the most recent and accurate data is used. This is classified as a critical issue that could affect liquidations and integrated protocols.

## Details

##### Description
An issue has been discovered within the `handle` function of the `PushOracleReceiver` contract. The function is responsible for processing incoming oracle data messages. The issue arises due to the potential for an old message to be processed if it was previously reverted due to an out of gas error. If this happens, the oracle price will be updated, not with the most recent value, but with the old one, which could have potentially significant negative consequences on liquidations and integrated protocols.
This issue is classified as **Critical** severity as it could induce misleading pricing information, which could lead to inaccurate liquidation decisions or manipulation of integrated protocols.

##### Recommendation
We recommend checking the timestamp of the data in the `handle` function to further verify the recency of the oracle message. This would ensure that the data being processed represents the most current and thereby accurate market conditions, minimizing the chance that old, now-obsolete data will be used.
