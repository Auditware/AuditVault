---
tags:
  - lang/solidity
  - platform/pashov-audit-group
  - has/github
  - severity/high
  - impact/mev/frontrun
  - precondition/uninitialized
  - sector/insurance
protocol: "[[Bearcave]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-03-01-BearCave.md"
genome:
  - "[[wrong-condition]]"
  - "[[frontrun]]"
  - "[[data/uninitialized]]"
  - "[[frontrun-exposure]]"
  - "[[initializer-auth]]"
  - "[[timestamp-dependence]]"
---
# [C-03] Anyone can mint all NFTs through the public mint before it has even started

- id: 20531
- impact: HIGH
- protocol: [[Bearcave]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-03-01-BearCave.md

## Summary


This bug report describes an attack vector that allows users to front-run the games and mint the maximum available `HoneyJar` configured in the `mintConfig`. This happens when both the `mekHoneyJarWithERC20` and `mekHoneyJarWithETH` methods are called before the first bundle was added. This means that anyone can call these methods and supply `bundleId_ == 0` to either method, all of the values in the `slumberParties[bundleId_]` mapping will have a default value, passing all of the checks in the methods and in the `_canMintHoneyJar` method. The impact of this bug is high, as it breaks an important protocol invariant and the way the protocol should work overall. The likelihood of this bug is also high, as it does not need any preconditions and can be executed easily at the deployment of `HoneyBox`. 

The recommendation to fix this bug is to revert if `slumberParties[bundleId_].publicMintTime == 0` in the `_canMintHoneyJar` method. This means that this bundle is not initialized yet and will cover this attack vector and any other `bundleId == 0` attack as well.

## Details

**Impact:**
High, as it breaks an important protocol invariant and the way the protocol should work overall

**Likelihood:**
High, as it does not need any preconditions, can be executed easily at the deployment of `HoneyBox`

**Description**

Both the `mekHoneyJarWithERC20` and `mekHoneyJarWithETH` methods are ways for the players to mint `HoneyJar` NFTs, but they should work only when general mint is open, as shown in this check that is present in both methods:

```solidity
if (slumberParties[bundleId_].publicMintTime > block.timestamp) revert GeneralMintNotOpen(bundleId_);
```

The problem is that anyone can call both methods anytime before the first bundle was added. If there were no bundles, this means that if a user supplied `bundleId_ == 0` to either method, all of the values in the `slumberParties[bundleId_]` mapping will have a default value, passing all of the checks in the methods and in the `_canMintHoneyJar` method. This essentially means anyone can front-run the games and mint the maximum available `HoneyJar` configured in the `mintConfig`.

**Recommendations**

In `_canMintHoneyJar`, revert if `slumberParties[bundleId_].publicMintTime == 0`, this means that this bundle is not initialized yet. This will cover this attack vector and any other `bundleId == 0` attack as well.
