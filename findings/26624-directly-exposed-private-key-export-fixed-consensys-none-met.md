---
tags:
  - lang/solidity
  - sector/wallet
  - platform/consensys
  - has/github
  - severity/high
  - precondition/insider
protocol: "[[MetaMask]]"
auditors:
  - "[[Dominik Muhs]]"
report: "https://consensys.net/diligence/audits/2023/08/metamask/partner-snaps-filsnap/"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[insider]]"
---
# Directly Exposed Private Key Export ✓ Fixed

- id: 26624
- impact: HIGH
- protocol: MetaMask/Partner Snaps - FilSnap
- reporter: Dominik Muhs
 (ConsenSys)
- source: https://consensys.net/diligence/audits/2023/08/metamask/partner-snaps-filsnap/

## Summary


A bug was reported in the Filecoin snap, which allows apps to access the BIP44 entropy for Filecoin's private keys. This could lead to heightened risk of users indiscriminately granting permission to malicious dapps. To address this issue, the development team has implemented a warning and only surfaces the user's private key in a secured dialogue. This is analogous to MetaMask's approach and will make users consider their actions carefully. Automated attacks without user intervention are no longer possible since users must copy-paste their keys. It is recommended that the development team reconsider providing such a sensitive functionality and instead use a dialog that prompts users to copy the private key manually. This approach is consistent with MetaMask's default and encourages users to deliberate their actions more thoroughly.

## Details

#### Resolution



While the `exportPrivateKey` function is still present and exposed via the `fil_exportPrivateKey` RPC call, it now displays a warning and only surfaces the user’s private key in a secured dialogue. This is analogous to MetaMask’s approach and will make users consider their actions carefully. Automated attacks without user intervention are no longer possible since users must copy-paste their keys.


This issue has been addressed in commit [`c88a9ee1359e9a35735ce5d7b18b4cfcd2de0326`](https://github.com/filecoin-project/filsnap/commit/c88a9ee1359e9a35735ce5d7b18b4cfcd2de0326).




#### Description


The snap can access the BIP44 entropy for Filecoin’s private keys, granting it considerable power over MetaMask’s private keys. Specifically, the `fil_exportPrivateKey` command lets dapps obtain the private key programmatically, pending user consent. However, there’s a heightened risk of users indiscriminately granting this permission. To maintain MetaMask’s security integrity, the snap should mirror the same rigorous security standards to mitigate the effect of phishing attacks and malicious dapps.


**packages/snap/src/rpc/export-private-key.ts:L19-L34**



```
export async function exportPrivateKey(
 ctx: SnapContext
): Promise<ExportPrivateKeyResponse> {
 const conf = await snapDialog(ctx.snap, {
 type: 'confirmation',
 content: panel([heading(`Do you want to export your private key?`)]),
 })

 if (conf) {
 return {
 result: base64pad.encode(ctx.account.privateKey),
 error: null,
 }
 }
 return serializeError('User denied private key export')
}

```
#### Recommendation


The development team should reconsider providing such a sensitive functionality. Instead of programmatically exposing the private key, use a dialog that prompts users to copy the private key manually. This approach, consistent with MetaMask’s default, encourages users to deliberate their actions more thoroughly.
