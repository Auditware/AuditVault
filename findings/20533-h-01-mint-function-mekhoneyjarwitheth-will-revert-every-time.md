---
tags:
  - lang/solidity
  - platform/pashov-audit-group
  - has/github
  - severity/high
  - sector/options
  - sector/token
protocol: "[[Bearcave]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-03-01-BearCave.md"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# [H-01] Mint function `mekHoneyJarWithETH` will revert every time

- id: 20533
- impact: HIGH
- protocol: [[Bearcave]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-03-01-BearCave.md

## Summary


This bug report is about a contract called `HoneyBox` which exposes a way for users to mint `HoneyJar` NFTs with `ETH` in a public sale by the `mekHoneyJarWithETH` method. The impact of this bug is medium, as there is an option to mint with ERC20 tokens too, and the likelihood is high, as the function will just revert every time. 

The issue is that the method uses `msg.value` to calculate the expected price, as the name suggest, that would have been paid with ETH, but the method is missing the `payable` keyword. Every call with `msg.value != 0` to the method will revert. The recommendation to solve this issue is to add the `payable` keyword to the `mekHoneyJarWithETH` method. This will ensure that the function works as intended and users can mint `HoneyJar` NFTs with `ETH` without any issue.

## Details

**Impact:**
Medium, as there is an option to mint with ERC20 tokens too

**Likelihood:**
High, as the function will just revert every time

**Description**

The `HoneyBox` contract exposes a way for users to mint `HoneyJar` NFTs with `ETH` in a public sale by the `mekHoneyJarWithETH` method. The problem is that the method uses `msg.value` to calculate the expected price, as the name suggest, that would have been paid with ETH, but the method is missing the `payable` keyword. Every call with `msg.value != 0` to the method will revert.

**Recommendations**

```diff
-    function mekHoneyJarWithETH(uint8 bundleId_, uint256 amount_) external returns (uint256) {
+    function mekHoneyJarWithETH(uint8 bundleId_, uint256 amount_) external payable returns (uint256) {
```
