---
tags:
  - lang/solidity
  - sector/perpetuals
  - platform/ottersec
  - severity/high
  - fix/add-access-control
protocol: "[[Vertex]]"
auditors:
  - "[[Shiva Shankar]]"
report: "https://vertexprotocol.io/"
genome:
  - "[[missing-modifier]]"
  - "[[add-access-control]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# Unauthorized Access To UpdateStates

- id: 48377
- impact: HIGH
- protocol: [[Vertex]] Protocol
- reporter: Shiva Shankar (OtterSec)
- source: https://vertexprotocol.io/

## Summary


This bug report discusses an issue with the updateStates functions in both spot and perp engines. These functions are responsible for updating the states of the engines based on changes in the market and time. However, they can currently be called by any user with any time value, which can be exploited by attackers to manipulate profits. To fix this vulnerability, the onlyEndpoint modifier needs to be added to these functions. This has been addressed and fixed in the latest patch.

## Details

## Spot and Perp Engines: State Update Functions

In both spot and perp engines, the `updateStates` functions update their respective states based on changes in the market and changes in time (`dt`). These functions should only be called from **EndPoint**, as it tracks the `lastUpdated` time of the engines and provides the correct `dt` value.

**However**, these functions are not restricted by the `onlyEndpoint` modifier, which means that any user can call them with any `dt` value. This creates a vulnerability that attackers can exploit to manipulate profits by using a manipulated `dt` value.

## Remediation

Add the `onlyEndpoint` modifier to `updateStates` of both spot and perp engines.

## Patch

The `onlyEndpoint` modifier was added to the `updateStates` functions. Fixed in #116.
