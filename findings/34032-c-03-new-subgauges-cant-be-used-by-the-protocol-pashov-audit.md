---
tags:
  - lang/solidity
  - platform/pashov-audit-group
  - has/github
  - severity/high
  - sector/governance
protocol: "[[Vetenet]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov Audit Group/2023-12-01-veTenet.md"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# [C-03] New `subGauge`s can't be used by the protocol

- id: 34032
- impact: HIGH
- protocol: [[Vetenet]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov Audit Group/2023-12-01-veTenet.md

## Summary


This bug report discusses an issue with the `createSubGauge` method in the `GaugeFactory` contract. This method is supposed to create a new `subGauge`, but it does not add it to the `GaugeProxy` as it should. This means that while it is possible to create new `subGauges`, there is currently no way to add them to the `GaugeProxy`. The severity of this bug is high, as it affects important protocol functionality and is likely to happen every time. The recommendation is to change the `createSubGauge` method to include the necessary code to add the `subGauge` to the `GaugeProxy`.

## Details

**Severity**

**Impact:**
High, as important protocol functionality is not working

**Likelihood:**
High, as the bug will happen every time

**Description**

The `createSubGauge` method in `GaugeFactory` creates a new `subGauge` but does not actually add the `subGauge` to the `GaugeProxy` as it is done in `createGaugeProxyAndSubGauges`. Even though the `GaugeProxy` contract has an `addSubGauge` method, it is only callable by the `gaugeFactory` or by the `TLSDFactory`. Neither contracts have an actual way to directly call the `addSubGauge` method, which means that even though you can create new `subGauge`s you can't actually add them to the `GaugeProxy` in any way.

**Recommendations**

Change the `createSubGauge` method to execute the same `GaugeProxy(_gaugeProxy).addSubGauge(_stakingTokens[i], subGauge);` call as in `createGaugeProxyAndSubGauges` with the given `_stakingToken` argument.
