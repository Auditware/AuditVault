---
tags:
  - has/github
  - platform/zokyo
  - severity/high
  - sector/vault
protocol: "[[Provenance]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-05-01-Provenance.md"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# Dependency: Uncontrolled Resource Consumption

- id: 35536
- impact: HIGH
- protocol: [[Provenance]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-05-01-Provenance.md

## Summary


The bug report is about a high severity issue in the `jose2go` component for Go. The bug causes a denial of service, which means it makes the system unusable, by consuming a lot of CPU resources. The bug has not been fixed yet and it is related to a specific version of the component (v1.5.0). This component is used by many other modules, including "github.com/cosmos/keyring:v1.2.0". The recommended solution is to update the dependencies, but this will have to wait for the libraries to update first.

## Details

**Severity**: High

**Status**: Unresolved

**Dependency**: github.com/dvsekhvalnov/jose2go:v1.5.0

**CWE**: 400

**CVE**: 2023-50658

**Details**: 

The `jose2go` component prior 1.6.0 for Go allows attackers to cause a denial of service (CPU consumption) via a large p2c (aka PBES2 Count) value.

This package is an indirect dependency by multiple modules, including the "github.com/cosmos/keyring:v1.2.0"

**Recommended strategy**: 

Update the dependencies

**Client comment**: 

We'll have to wait for upstream libraries to bump this
