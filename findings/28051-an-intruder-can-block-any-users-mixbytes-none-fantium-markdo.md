---
tags:
  - lang/solidity
  - sector/nft
  - platform/mixbytes
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Fantium]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Fantium/Fantium/README.md#3-an-intruder-can-block-any-users"
genome:
  - "[[missing-modifier]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# An intruder can block any users

- id: 28051
- impact: HIGH
- protocol: [[Fantium]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Fantium/Fantium/README.md#3-an-intruder-can-block-any-users

## Summary


This bug report is about the `FantiumMinterV1.mint()` function in the Fantium smart contracts. The function allows passing an `_to` parameter, which is not validated. This means that users can change the permit of some users without the `onlyPlatformManager` permission. The bug report suggests that the logic of the `allowList` should be rethought in order to prevent this from happening.

## Details

##### Description

`FantiumMinterV1.mint()` allows passing `_to`, which is not validated.

After this line (https://github.com/metaxu-art/fantium-smart-contracts/blob/cb2d97bc30c40321991fe5ab8fc798babba1610f/contracts/FantiumMinterV1.sol#L266), we can change the permit of some users. In a common way we need to have the `onlyPlatformManager` permission for this action.

##### Recommendation

We recommend that you rethink the logic of `allowList`.
