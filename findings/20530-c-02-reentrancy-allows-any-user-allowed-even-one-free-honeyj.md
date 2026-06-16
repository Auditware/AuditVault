---
tags:
  - lang/solidity
  - sector/gaming
  - platform/pashov-audit-group
  - has/github
  - severity/high
  - vuln/access-control/missing-modifier
  - vuln/reentrancy/single-function
  - fix/add-access-control
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/admin-is-honest
  - misassumption/external-call-is-safe
  - trigger/reentrancy-callback
protocol: "[[Bearcave]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-03-01-BearCave.md"
genome:
  - "[[missing-modifier]]"
  - "[[single-function]]"
  - "[[add-access-control]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[reentrancy-guard]]"
---
# [C-02] Reentrancy allows any user allowed even one free `HoneyJar` mint to mint the max supply for himself for free

- id: 20530
- impact: HIGH
- protocol: [[Bearcave]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-03-01-BearCave.md

## Summary


This bug report describes a vulnerability in the `HoneyBox` contract that allows a user to claim all `HoneyJar` NFTs without paying anything. This vulnerability is caused by the `claim` method in the `HoneyBox` contract, which calls `honeyJar::batchMint`, which uses `safeMint`, which does an unsafe external call to the mint recipient. This call can reenter the `claim` method while the `claimed` accounting was still not done and actually claim all of the `HoneyJar` NFTs until `mintConfig.maxHoneyJar` is hit. The likelihood of this attack is high as reentrancy is a very common attack vector and easily exploitable.

To address this vulnerability, it is recommended to make sure the `claim` method is following the Checks-Effects-Interactions pattern or add a `nonReentrant` modifier to it. This would ensure that the `claimed` accounting is done before any external calls are made and prevent the attack.

## Details

**Impact:**
High, as the user will steal all `HoneyJar` NFTs, paying nothing

**Likelihood:**
High, as reentrancy is a very common attack vector and easily exploitable

**Description**

The `claim` method in `HoneyBox` (from its NatSpec) "Allows a player to claim free HoneyJar based on eligibility". Let's look at this part of its code:

```solidity
_canMintHoneyJar(bundleId_, numClaim); // Validating here because numClaims can change

// If for some reason this fails, GG no honeyJar for you
_mintHoneyJarForBear(msg.sender, bundleId_, numClaim);

claimed[bundleId_] += numClaim;
// Can be combined with "claim" call above, but keeping separate to separate view + modification on gatekeeper
gatekeeper.addClaimed(bundleId_, gateId, numClaim, proof);
```

Where you update the `claimed` mapping and account for the claim in the `Gatekeeper` contract after you actually do the minting itself. The problem is that the `_mintHoneyJarForBear` method calls `honeyJar::batchMint`, that uses `safeMint`, which does an unsafe external call to the mint recipient. This call can reenter the `claim` method while the `claimed` accounting was still not done and actually claim all of the `HoneyJar` NFTs until `mintConfig.maxHoneyJar` is hit, which will most likely make him the winner of the game so he will get all of the NFTs in it as well, paying nothing.

What makes it worse as well is that even though the `claim` method has protection because it accepts a `gateId` argument, and the gates themselves have a `maxClaimable` property, this is also broken since the `gatekeeper::addClaimed` call is also done after the unsafe external call, so multiple invariants can be broken here.

**Recommendations**

Make sure the `claim` method is following the Checks-Effects-Interactions pattern or add a `nonReentrant` modifier to it.
