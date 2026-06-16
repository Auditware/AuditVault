---
tags:
  - lang/solidity
  - platform/consensys
  - severity/high
  - sector/wallet
protocol: "[[MetaMask]]"
auditors:
  - "[[Valentin Quelquejay]]"
report: "https://consensys.net/diligence/audits/2023/07/metamask/partner-snaps-shapeshift-snap/"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# Superfluous Permission endowment:network-access

- id: 25914
- impact: HIGH
- protocol: MetaMask/Partner Snaps - Shapeshift Snap
- reporter: Valentin Quelquejay (ConsenSys)
- source: https://consensys.net/diligence/audits/2023/07/metamask/partner-snaps-shapeshift-snap/

## Summary


This bug report is about a snap, which is a type of software package, requesting permission to interact with external entities over HTTP/fetch when it is not necessary. This is a security issue because it is following the principle of least privilege, which is requesting more permissions than are necessary. The example given is a line of code in the snap's manifest file that requests the permission `endowment:network-access`. The recommendation is to remove this superfluous permission.

## Details

#### Description


The snap requests permission `endowment:network-access` to interact with external entities over HTTP/fetch. While the sandbox/demo dapp may use the fetch API in its context as a web app, the requested permission is only relevant for the snap and the snap never calls the `fetch()` API. Hence, the permission is requested but never used.


Requesting more permissions than necessary should always be avoided following the principle of least privilege.


#### Examples


**packages/snap/snap.manifest.json:L69**



```
"endowment:network-access": {},

```
#### Recommendation


Remove superfluous permissions.
