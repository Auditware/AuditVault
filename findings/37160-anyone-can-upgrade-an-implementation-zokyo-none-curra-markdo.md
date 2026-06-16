---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/account
protocol: "[[Curra]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-01-04-Curra.md"
genome:
  - "[[upgradeable-contract]]"
  - "[[admin-takeover]]"
  - "[[upgrade-safety]]"
---
# Anyone can upgrade an implementation

- id: 37160
- impact: HIGH
- protocol: [[Curra]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-01-04-Curra.md

## Summary


A critical bug was found in the file "src/ERC1967Factory.sol" where the admin was no longer being checked, allowing anyone to call the functions "upgrade" and "upgradeAndCall" and change the implementation. The bug has since been resolved, but it is recommended that the "upgradeAndCall" function is made private or internal, while the "upgrade" function remains internal.

## Details

**Severity**: Critical

**Status**: Resolved

**File**: src/ERC1967Factory.sol

**Details**:

While the admin is not checked anymore, and both functions upgrade and upgradeAndCall have become public, anyone could call them and change the implementation.

**Recommendation**:

Make sure the upgradeAndCall function is either private or internal while the upgrade function is internal.
