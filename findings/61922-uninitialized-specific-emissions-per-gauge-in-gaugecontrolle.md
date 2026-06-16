---
tags:
  - lang/vyper
  - sector/governance
  - platform/mixbytes
  - has/github
  - severity/high
  - impact/mev/backrun
  - precondition/uninitialized
protocol: "[[Yield Basis]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Yield%20Basis/DAO/README.md#1-uninitialized-specific_emissions_per_gauge-in-gaugecontrolleradd_gauge"
genome:
  - "[[data/uninitialized]]"
  - "[[wrong-state]]"
  - "[[backrun]]"
  - "[[data/uninitialized]]"
  - "[[initializer-auth]]"
  - "[[frontrun-exposure]]"
  - "[[timestamp-dependence]]"
---
# Uninitialized `specific_emissions_per_gauge` in `GaugeController.add_gauge()`

- id: 61922
- impact: HIGH
- protocol: [[Yield Basis]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Yield%20Basis/DAO/README.md#1-uninitialized-specific_emissions_per_gauge-in-gaugecontrolleradd_gauge

## Summary


This bug report discusses an issue with new gauges not initializing a specific variable, which can potentially allow attackers to claim excess rewards in the same block. The report recommends initializing the variable in question to prevent this issue.

## Details

##### Description

New gauges don't initialize `specific_emissions_per_gauge[gauge]`, allowing attackers to backrun `add_gauge()`, vote, and claim excess rewards in the same block, due to the extra difference between `specific_emissions - self.specific_emissions_per_gauge[gauge]` (which is `specific_emissions - 0`):
```
if block.timestamp > t:
    
    self.weighted_emissions_per_gauge[gauge] += 
      (specific_emissions - self.specific_emissions_per_gauge[gauge]) 
      * aw // 10**18
    
    self.specific_emissions_per_gauge[gauge] = specific_emissions
```
https://github.com/yield-basis/yb-core/blob/3352c612fc33e48f1a106da41f63810f31bc38be/contracts/dao/GaugeController.vy#L187

##### Recommendation

We recommend initializing `specific_emissions_per_gauge[gauge]` in `add_gauge()`.



---
