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
  - "[[fake-account-substitution]]"
  - "[[role-bypass]]"
  - "[[cross-contract-state-consistency]]"
---
# Signing Request Fails to Display Origin and User Account on Confirmation Message

- id: 25916
- impact: HIGH
- protocol: MetaMask/Partner Snaps - Shapeshift Snap
- reporter: Valentin Quelquejay (ConsenSys)
- source: https://consensys.net/diligence/audits/2023/07/metamask/partner-snaps-shapeshift-snap/

## Summary


This bug report is about the signing request message not displaying the user account used to sign the message. This may allow malicious dapps to pretend to sign a message with one account while issuing an RPC call for a different account. It is recommended that the signing account should be displayed in a human-readable and expected format on the signing request and the origin of the RPC call should also be displayed. This is important to ensure that users are aware of the account that they are signing transactions with and to avoid them being tricked into signing transactions they did not intend to sign. The team also hopes that this issue will be addressed for all snaps in the future.

## Details

#### Description


The signing request message does not display the user account used to sign the message. A malicious dapp may pretend to sign a message with one account while issuing an RPC call for a different account.


ShapeShift snap signing requests should implement similar security measures to how MetaMask signing requests work. Being fully transparent on “who signs what”, and displaying the origin of the request. This is especially important on multi-dapp snaps to avoid users being tricked into signing transactions they did not intend to sign (wrong signer; dapp race condition).


Please note that we have also reported to the MM Snaps team that dialogs do not, by default, hint at the origin of the action. We hope this will be addressed commonly for all snaps in the future.


#### Recommendation


Display the signing account in a human-readable and expected format on the signing request. Also, display the origin of the RPC call.
