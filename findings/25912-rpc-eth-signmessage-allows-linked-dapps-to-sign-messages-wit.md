---
tags:
  - lang/solidity
  - platform/consensys
  - severity/high
  - sector/options
  - sector/wallet
protocol: "[[MetaMask]]"
auditors:
  - "[[Valentin Quelquejay]]"
report: "https://consensys.net/diligence/audits/2023/07/metamask/partner-snaps-shapeshift-snap/"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[account-ownership]]"
  - "[[merkle-tree-overflow]]"
---
# RPC eth_signMessage Allows Linked Dapps to Sign Messages With Any Wallet Account and W/O Explicit User Consent

- id: 25912
- impact: HIGH
- protocol: MetaMask/Partner Snaps - Shapeshift Snap
- reporter: Valentin Quelquejay (ConsenSys)
- source: https://consensys.net/diligence/audits/2023/07/metamask/partner-snaps-shapeshift-snap/

## Summary


A bug is reported in the MetaMask wallet that allows a dapp to bypass user consent when signing an arbitrary message. This means that the user is not notified of what is being signed on their behalf and does not have the option to reject it. The bug is related to the RPC endpoint for Ethereum and an undocumented one for AVAX, which allows the `eth_signMessage` RPC method to sign the message right away, without requiring consent. This is a serious security issue as it undermines the MetaMask restrictions that ensure that the user has full control over what is being signed. 

The code for the bug can be found in the `EVMSigner.ts` and `handlers.ts` files, and an example of how a dapp can invoke `eth_signMessage` is provided. The recommendation is to follow the same flow that MetaMask has already implemented when signing arbitrary messages. This includes logging signing requests, surfacing them to the user, asking for confirmation, and rejecting them by default. The origin of the signing request should be displayed, and the data to be signed and the account should be presented in a human-readable and understandable way, while also showing the original data to be signed.

## Details

#### Description


When a normal dapp requests MetaMask to sign an arbitrary message, the message is displayed to the user for confirmation before signing it. Requiring explicit user consent and displaying the message to be signed is crucial to ensure that the user has full control over what messages are signed on their behalf.


The shapeshift snap exposes an RPC endpoint for ethereum (and an undocumented one for AVAX) that allows bypassing user consent. When invoking the shapeshift snap with the `eth_signMessage` RPC method, the snap signs the message right away, silently, without requiring consent from the wallet owner or notifying them of the fact that the dapp is signing with a HD wallet account on their behalf. This severely undermines security restrictions by the MetaMask that ensure that the end-user has full control over what is being signed, giving them the option to reject signing.


For comparison, `eth_signTransaction` ask for user confirmation while `eth_signMessage` does not a.


The relevant code can be found here:


**packages/snap/src/rpc/evm/common/EVMSigner.ts:L37-L47**



```

async signMessage({ message }: SignMessageParamsType<T>): Promise<SignMessageResponseType<T>> {
 try {
 return (await this.signer.ethSignMessage(
 message as SignerSignMessageType<T>,
 )) as SignMessageResponseType<T>
 } catch (error) {
 this.logger.error(message, { fn: 'ethSignMessage' }, error)
 return Promise.reject(error)
 }
}

```
It also affects the `avax` implementation:


**packages/snap/src/rpc/evm/avalanche/handlers.ts:L34-L45**



```
export const avalancheSignMessage = async (
 params: AvalancheSignMessageParams,
): Promise<AvalancheSignMessageResponse> => {
 try {
 const avalancheSigner = new AvalancheSigner()
 await avalancheSigner.initialize()
 return await avalancheSigner.signMessage(params)
 } catch (error) {
 moduleLogger.error({ fn: 'avalancheSignMessage' }, error)
 return Promise.reject(error)
 }
}

```
#### Examples


A dapp can invoke `eth_signMessage` which will not require user confirmation and silently return a message that is signed with any of the users HD wallet accounts.



```
await window.ethereum.request({
 method: 'wallet\_invokeSnap',
 params: {
 snapId: "local:http://localhost:9000",
 request: { method: 'eth\_signMessage', params: {message: {addressNList: [0x80000000 + 44, 0x80000000 + 60, 0x80000000 + 0, 0, 1], message:"hi"}, snapId: "local:http://localhost:9000" }},
 }});
{address: '0xBaB66CfA59757200c90c79BC6e2aEe4bFBe382Be', signature: '0x5c04bcc1ca73e9f9d4bf3642150407c01c189d784dd90349…e03ca8ec026ec6062b3d708c5fedbca0f2427282620be8c1b'}

```
#### Recommendation


Follow exactly the same flow MetaMask already implemented when signing arbitrary messages. Log signing requests, surface them to the user, ask for confirmation, and reject them by default (timeout). Display the origin on signing request dialogues and present the data to be signed and the account in a human-readable, understandable way while showing the original data to be signed, too.
