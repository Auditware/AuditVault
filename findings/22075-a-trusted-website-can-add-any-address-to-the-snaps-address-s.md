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
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# A Trusted Website Can Add Any Address to the Snaps Address Storage; No Control Over Added Addresses; Confirmation Is a Notification ✓ Fixed

- id: 22075
- impact: HIGH
- protocol: [[Push Protocol Snap For MetaMask]]
- reporter: Martin Ortner
 (ConsenSys)
- source: https://consensys.net/diligence/audits/2023/07/push-protocol-snap-for-metamask/

## Summary


This bug report concerns a vulnerability in the Ethereum Push Notification Service’s Push Protocol Snaps. Trusted websites can add addresses to the list of addresses the user wants to receive notifications for, but the user has no control over the addresses, and the user is not required to confirm the addition of new addresses. This could lead to a self-DoS situation if too many addresses are added to the extension. Additionally, any connected dapp may set configuration settings, such as `togglepopup`, which could be problematic in multi-dapp scenarios. 

The resolution to this issue was partially addressed in the Push Protocol Snaps by only allowing trusted origins to interact with the snap. Furthermore, user confirmation for address management (add/remove current account) was added. 

The recommendation is to always notify the wallet owner of important state changes and allow them to reject them or manage addresses that’ve been added previously. Additionally, consider checking the origin in `onRPC` if this dapp is only meant to be called from a specific dapp address.

## Details

#### Resolution



partially addressed in [ethereum-push-notification-service/push-protocol-snaps@1a6a32ef760088ca59f73e555f41b5b5d871f761](https://github.com/ethereum-push-notification-service/push-protocol-snaps/tree/1a6a32ef760088ca59f73e555f41b5b5d871f761) by only allowing trusted origins to interact with the snap.


**Update**: user confirmation for address management (add/remove current account) added with [ethereum-push-notification-service/push-protocol-snaps@7ee018947303014e8c14e9413a5edd9fd29f9829](https://github.com/ethereum-push-notification-service/push-protocol-snaps/commit/7ee018947303014e8c14e9413a5edd9fd29f9829)




#### Description


Trusted websites can add addresses to the list of addresses the user wants to receive notifications for. However, the user has no control over the addresses, and even though the code suggests that the snap user must confirm new address addition, this confirmation is merely a notification that the address has been added.


The lack of address management may lead to a self-DoS when too many addresses are added to the extension.



```
await window.ethereum?.request({
 method: "wallet\_invokeSnap",
 params: {
 snapId: "local:http://localhost:8080",
 request: { method: 'hello', params: { address: "\nhi\nho" } },
 }})

```
**push-snap-site/components/buttons/ConfirmButton.tsx:L6-L35**



```
export default function ConfirmButton() {
 const { address, isConnecting, isDisconnected } = useAccount();
 const defaultSnapOrigin = `local:http://localhost:8080`;

 const sendHello = async (address: string) => {
 await window.ethereum?.request({
 method: "wallet\_invokeSnap",
 params: {
 snapId: defaultSnapOrigin,
 request: { method: 'hello', params: { address: address } },
 },
 });
 };

 const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
 message:
 `Confirm your Address ${address}, \n this will be added to MetaMask for sending notifications`,
 });

 function sleep(ms: number) {
 return new Promise((resolve) => setTimeout(resolve, ms));
 }

 const confirmAddition=async()=>{
 signMessage();
 if(isSuccess){
 await sleep(5000);
 await sendHello(String(address));
 }
 }

```
The same is true for configuration settings. Any connected dap may set `togglepopup`. This may be problematic in multi-dapp scenarios where multiple dapps request to set `togglepopup`.


#### Recommendation


Note that dapps are not necessarily completely trusted. They can be modified, or malicious behavior may be added later by the dapp deployer (unless used locally or via IPFS). Therefore, the snap should always notify the wallet owner of important state changes and allow them to reject them or, in this case, manage addresses that’ve been added previously.


Consider checking the origin in `onRPC` if this dapp is only meant to be called from a specific dapp address. Otherwise, any connected dapp may change configuration settings.
