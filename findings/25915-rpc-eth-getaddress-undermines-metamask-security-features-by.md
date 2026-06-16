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
# RPC eth_getAddress Undermines MetaMask Security Features by Exposing All Accounts W/O Explicit User Consent

- id: 25915
- impact: HIGH
- protocol: MetaMask/Partner Snaps - Shapeshift Snap
- reporter: Valentin Quelquejay (ConsenSys)
- source: https://consensys.net/diligence/audits/2023/07/metamask/partner-snaps-shapeshift-snap/

## Summary


MetaMask is a wallet that is designed to protect user wallet addresses from being exposed to connected websites. By default, a user must explicitly connect the address with the dapp website in order for it to be exposed. However, the ShapeShift snap has a RPC endpoint called `eth_getAddress` which can be used to bypass MetaMask security measures and enumerate all ethereum addresses, even if they are not connected to the dapp. This undermines the security of the main wallet, as it allows a dapp to access all wallet addresses without user consent.

In order to prevent this issue, it is important to ensure that the implemented security measures match those of the main wallet. Users should have the choice to decide which addresses they want to expose to the dapp. Additionally, low-level access to all wallet addresses should not be given without the user's consent.

## Details

#### Description


Metamask by default protects wallet addresses from being exposed to connected websites. A user wishing to expose a wallet address to a dapp must explicitly connect that address with the dapp website. Here is an example of MetaMask Flask with a random test wallet managing 2 accounts. `Account 1` is connected to metamask, `test2` is not.


![image]()![image](./img/253230181-22960a42-21a7-47cc-8180-ffe6fa2dfcfc.png)
The dapp can query for connected addresses via the MetaMask injected provider RPC method `eth_requestAccounts`. Other non-connected addresses will not be returned:



```
await window.ethereum.request({ method: 'eth\_requestAccounts' })
['0x3d0c4e58b3ff2516455f79c1147eb95f125d56ae']

```
In contrast, the shapeshift snap requests low-level access for the ethereum root key. The snap exposes a similar RPC endpoint named `eth_getAddress` that returns all ethereum addresses. Any connected dapp can query the snap to retrieve ethereum addresses. The dapp - not necessarily trusted - can even silently interact with the snap to enumerate all ethereum addresses, whether they’re ‘connected’ to the dapp or not. This effectively bypasses MetaMask security measures where the user defines the addresses to expose.


Via the ShapeShift snap `eth_getAddress` RPC endpoint, the dapp can effectively enumerate all addresses even though they’re not connected via the main wallet. This circumvents MetaMask security measures undermining established security principles of the wallet.


Note that all `*_getAddress` RPC endpoints exhibit this problem.


#### Examples


* MetaMask APO only exposes connected addresses



```
await window.ethereum.request({ method: 'eth\_requestAccounts' })
['0x3d0c4e58b3ff2516455f79c1147eb95f125d56ae']

```
* the same address can be retrieved via the ShapeShift snap RPC API



```
await window.ethereum.request({
 method: 'wallet\_invokeSnap',
 params: {
 snapId: "local:http://localhost:9000",
 request: { method: 'eth\_getAddress', params: {addressParams:{addressNList: [0x80000000 + 44, 0x80000000 + 60, 0x80000000 + 0, 0, 0]}, snapId: "local:http://localhost:9000" }},
 }});
'0x3D0C4e58b3fF2516455f79c1147eB95F125d56aE'

```
* MetaMask does not expose other addresses. However, the snap RPC API allows to enumerate non-connected addresses too, undermining the security of the main wallet.



```
await window.ethereum.request({
 method: 'wallet\_invokeSnap',
 params: {
 snapId: "local:http://localhost:9000",
 request: { method: 'eth\_getAddress', params: {addressParams:{addressNList: [0x80000000 + 44, 0x80000000 + 60, 0x80000000 + 0, 0, 1]}, snapId: "local:http://localhost:9000" }},
 }});
'0xBaB66CfA59757200c90c79BC6e2aEe4bFBe382Be'

```
#### Recommendation


Ensure that the implemented security measures match those of the main wallet. Allow users to choose which addresses they want to expose to the dapp. Do not give low-level access to all wallet addresses without user consent.
