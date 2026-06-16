---
tags:
  - lang/solidity
  - platform/pashov-audit-group
  - has/github
  - severity/high
  - sector/gaming
protocol: "[[Bearcave]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-03-01-BearCave.md"
genome:
  - "[[single-source]]"
  - "[[direct-drain]]"
  - "[[weak-randomness]]"
---
# [C-04] Re-requesting randomness from VRF is a security anti-pattern

- id: 20532
- impact: HIGH
- protocol: [[Bearcave]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-03-01-BearCave.md

## Summary


This bug report is about the `forceHoneyJarSearch` method used in VRF (Verifiable Random Function) service provider. This method allows the service provider to "kick off another VRF request". This goes against the security standards in using VRF, as it is easily detectable on-chain and can be exploited. The impact of this bug is high, as the VRF service provider has control over who wins the game, and the likelihood is also high, as there is an incentive for a VRF provider to exploit this and it is not hard to do from his side. The recommendation for this bug is to remove the `forceHoneyJarSearch` method as it is exploitable.

## Details

**Impact:**
High, as the VRF service provider has control over who wins the game

**Likelihood:**
High, as there is an incentive for a VRF provider to exploit this and it is not hard to do from his side

**Description**

The `forceHoneyJarSearch` method is used to "kick off another VRF request", as mentioned in its NatSpec. This goes against the security standards in using VRF, as stated in the [docs](https://docs.chain.link/vrf/v2/security#do-not-re-request-randomness):

```
Re-requesting randomness is easily detectable on-chain and should be avoided for use cases that want to be considered as using VRFv2 correctly.
```

Basically, the service provider can withhold a VRF fulfillment until a new request that is favorable for them comes.

**Recommendations**

Remove the `forceHoneyJarSearch` method as it is exploitable.
