---
tags:
  - lang/solidity
  - sector/governance
  - sector/staking
  - platform/pashov-audit-group
  - has/github
  - severity/high
  - impact/mev/frontrun
  - precondition/uninitialized
protocol: "[[Vetenet]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov Audit Group/2023-12-01-veTenet.md"
genome:
  - "[[uninitialized-owner]]"
  - "[[frontrun]]"
  - "[[data/uninitialized]]"
  - "[[frontrun-exposure]]"
  - "[[initializer-auth]]"
---
# [C-01] Cloning a `subGauge` can result in an uninitialized proxy

- id: 34030
- impact: HIGH
- protocol: [[Vetenet]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov Audit Group/2023-12-01-veTenet.md

## Summary


The bug report states that there is a high severity and likelihood of a bug in the `subGauge` initialization process in the `GaugeFactory::createSubGauge` function. This can result in a front-running attack, where an attacker can control the `subGauge` by initializing it with their own arguments. The report recommends that the `subGauge` should be initialized in the same way as it is done in the `GaugeFactory::createGaugeProxyAndSubGauges` function.

## Details

**Severity**

**Impact:**
High, as `subGauge` initialization can be front-ran

**Likelihood:**
High, as every new `subGauge` will be vulnerable

**Description**

In `GaugeFactory::createSubGauge`, the `Clones::cloneDeterministic` method is used to deploy a new `subGauge`. The problem is, in contrast to `GaugeFactory::createGaugeProxyAndSubGauges`, in `createSubGauge` the `subGauge` is not initialized after cloning, which leaves it vulnerable to a front-running attack. Example scenario:

1. Alice calls `GaugeFactory::createSubGauge` to deploy a new `subGauge`
2. The `subGauge` is added to a `GaugeProxy` by calling `GaugeProxy::addSubGauge`
3. Now Alice sends a transaction to call `initialize` on the `subGauge`
4. Bob sees Alice's transaction and front-runs it, initializing it with his own supplied arguments (`stakingToken`, `governance` etc), so he controls it

**Recommendations**

Initialize a newly cloned `subGauge` in `GaugeFactory::createSubGauge` in the same way that it is done in `GaugeFactory::createGaugeProxyAndSubGauges`.
