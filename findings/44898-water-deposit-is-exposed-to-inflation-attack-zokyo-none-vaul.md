---
tags:
  - lang/solidity
  - has/github
  - platform/openzeppelin
  - severity/high
  - sector/vault
protocol: "[[Vaultka]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-08-30-Vaultka.md"
genome:
  - "[[precision-loss]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
---
# Water deposit is exposed to inflation attack

- id: 44898
- impact: HIGH
- protocol: [[Vaultka]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-08-30-Vaultka.md

## Summary


This bug report is about a security issue in a code called Water.sol. The problem is that the code is using a version of ERC4626 that is vulnerable to an attack. This allows attackers to use the "deposit()" function in the contract to gain money illegally. The report recommends following the instructions in a link to fix the issue. The status of the bug is marked as resolved.

## Details

**Severity**: High

**Status**: Resolved

**Description**

Water.sol - The ERC4626 version used is exposed to inflation attack. That leads to having function deposit() in the water contract to be exploited by attackers to achieve illegitimate gains. The description of the attack scenario as well as the mitigation is described: https://docs.openzeppelin.com/contracts/4.x/erc4626.

**Recommendation** 

Follow the mitigation suggested in the link.
