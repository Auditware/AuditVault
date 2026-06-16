---
tags:
  - lang/solidity
  - platform/consensys
  - has/github
  - severity/high
  - sector/wallet
protocol: "[[Push Protocol Snap For MetaMask]]"
auditors:
  - "[[Martin Ortner]]"
report: "https://consensys.net/diligence/audits/2023/07/push-protocol-snap-for-metamask/"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# Superfluous Permission endowment:ethereum-provider ✓ Fixed

- id: 22074
- impact: HIGH
- protocol: [[Push Protocol Snap For MetaMask]]
- reporter: Martin Ortner
 (ConsenSys)
- source: https://consensys.net/diligence/audits/2023/07/push-protocol-snap-for-metamask/

## Summary


This bug report is about a permission request in the snap.manifest.json file for the ethereum-provider that is not necessary. The permission is being requested but not used, and it was fixed by removing the ethereum provider permission from the manifest. The recommendation is to remove superfluous permissions in order to avoid future issues. The resolution was fixed in the ethereum-push-notification-service/push-protocol-snaps@1a6a32ef760088ca59f73e555f41b5b5d871f761 by removing the ethereum provider permission from the manifest.

## Details

#### Resolution



fixed in [ethereum-push-notification-service/push-protocol-snaps@1a6a32ef760088ca59f73e555f41b5b5d871f761](https://github.com/ethereum-push-notification-service/push-protocol-snaps/tree/1a6a32ef760088ca59f73e555f41b5b5d871f761) by removing the ethereum provider permission from the manifest.


#### Description


The snap requests permission `endowment:ethereum-provider` but `window.ethereum` is never accessed from within the snap’s context.


**snap/snap.manifest.json:L39**



```
"endowment:ethereum-provider": {}

```
#### Recommendation


Remove superfluous permissions.
