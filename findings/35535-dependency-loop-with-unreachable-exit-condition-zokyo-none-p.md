---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/options

protocol: "[[Provenance]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-05-01-Provenance.md"
genome:
  - "[[unbounded-loop]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# Dependency: Loop With Unreachable Exit Condition

- id: 35535
- impact: HIGH
- protocol: [[Provenance]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-05-01-Provenance.md

## Summary


A bug has been found in a package called `google.golang.org/protobuf` which can cause an infinite loop when trying to unmarshal invalid JSON. This can happen when using a specific function or setting an option. The package is used indirectly by another package called `github.com/regen-network/protobuf:v1.3.3-alpha.regen.1`. To fix this bug, it is recommended to update the dependency. The bug has been resolved and the severity is considered high. More information about the bug can be found in the report.

## Details

**Severity**: High

**Status**: Resolved

**Dependency**: github.com/regen-network/protobuf:v1.3.3-alpha.regen.1

**CWE**: 835

**CVE**: 2024-24786

**Details**: 

In the package `google.golang.org/protobuf` versions prior to 1.33.0, the "protojson.Unmarshal" function can enter an infinite loop when unmarshaling certain forms of invalid JSON. This condition can occur when unmarshaling into a message which contains a "google.protobuf.Any" value, or when the "UnmarshalOptions.DiscardUnknown" option is set. This package is an indirect dependency by the "github.com/regen-network/protobuf:v1.3.3-alpha.regen.1"

**Recommended strategy**: 

Update the dependency
