---
tags:
  - lang/solidity
  - sector/wallet
  - platform/consensys
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Push Protocol Snap For MetaMask]]"
auditors:
  - "[[Martin Ortner]]"
report: "https://consensys.net/diligence/audits/2023/07/push-protocol-snap-for-metamask/"
genome:
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[event-manipulation]]"
---
# Lax Input Validation, Control Char, URI, and Markdown Injection ✓ Fixed

- id: 22076
- impact: HIGH
- protocol: [[Push Protocol Snap For MetaMask]]
- reporter: Martin Ortner
 (ConsenSys)
- source: https://consensys.net/diligence/audits/2023/07/push-protocol-snap-for-metamask/

## Summary


This bug report is regarding the lack of input validation on the address to be added in the Ethereum Push Notification Service. This could potentially lead to unwanted security issues and side effects. The resolution to this bug was addressed in a specific version of the Push Protocol Snaps, where the address was validated with `ethers.utils.isAddress`. The update 1 fixed the markdown rendering of newlines and re-introduced the markdown injection in the confirmation dialogue. Update 2 fixed the markdown injection in the confirmation dialogue. It was also noted that the rendered markdown list of addresses appear wrong, as markdown newlines require `\n\n` instead of `\n`.

The recommendation to address this bug is to strictly validate inputs from external origins. This includes ensuring that the provided address is a valid Ethereum address, checking the address checksum to detect typos, ensuring that inputs may not lead to renderable markdown, fixing the rendered list of addresses to properly display as a newline’d list, and ensuring untrusted inputs cannot inject context-sensitive information into fetch urls.

## Details

#### Resolution



addressed in [ethereum-push-notification-service/push-protocol-snaps@1a6a32ef760088ca59f73e555f41b5b5d871f761](https://github.com/ethereum-push-notification-service/push-protocol-snaps/tree/1a6a32ef760088ca59f73e555f41b5b5d871f761) validating the address with `ethers.utils.isAddress`.


**Update 1**:


* Markdown rendering of newlines fixed with: [ethereum-push-notification-service/push-protocol-snaps@7ee018947303014e8c14e9413a5edd9fd29f9829](https://github.com/ethereum-push-notification-service/push-protocol-snaps/commit/7ee018947303014e8c14e9413a5edd9fd29f9829)
* **Major:** Markdown Injection in Confirmation Dialogue re-introduced with [ethereum-push-notification-service/push-protocol-snaps@7ee018947303014e8c14e9413a5edd9fd29f9829](https://github.com/ethereum-push-notification-service/push-protocol-snaps/commit/7ee018947303014e8c14e9413a5edd9fd29f9829)


**Update 2**:


Markdown Injection in Confirmation Dialogue fixed with [ethereum-push-notification-service/push-protocol-snaps@b40e141243c77bfd7ec109408b326607b19314c8](https://github.com/ethereum-push-notification-service/push-protocol-snaps/commit/b40e141243c77bfd7ec109408b326607b19314c8)




#### Description


There is no input validation on the `address` to be added. The input may be an ethereum address but can be anything, potentially breaking security assumptions in the code and leading to unwanted side effects.


* `request.params` may be `null`, and
* `request.params.address` may not be an ethereum address.


**snap/src/index.ts:L18**



```
await addAddress(request.params.address || "0x0");

```
#### Example


![img]()![img](./img/246877719-5f85fba3-fa7c-47e6-9775-de39376ea486.png)



```
await window.ethereum?.request({
 method: "wallet\_invokeSnap",
 params: {
 snapId: "local:http://localhost:8080",
 request: { method: 'hello', params: { address: "Hi 🙌\n\n 🔸 \*\*boom\*\*" } },
 }})

```
* URI injection if address contains `?#/`


**snap/src/utils/fetchnotifs.ts:L3-L13**



```
export const getNotifications=async(address:string)=>{
 const url = `https://backend-prod.epns.io/apis/v1/users/eip155:5:${address}/feeds`;
 const response = await fetch(url, {
 method: 'get',
 headers: {
 'Content-Type': 'application/json',
 },
 });
 const data = await response.json();
 return data;
 }

```
* Injection in notifications


**snap/src/utils/popupHelper.ts:L3-L12**



```
export const popupHelper = (notifs: String[]) => {
 let msg = [];
 if (notifs.length > 0) {
 notifs.forEach((notif) => {
 let str = `\n🔔` + notif + "\n";
 msg.push(str);
 });
 }
 return msg;
};

```
* Markdown injection


**snap/src/utils/fetchAddress.ts:L45-L52**



```
const data = persistedData.addresses;
const popup = persistedData.popuptoggle;
let msg='';
for(let i = 0; i < data!.length; i++){
 msg = msg + '🔹' + data![i] + '\n';
}
return snap.request({
 method: 'snap\_dialog',

```
Also, note that the currently rendered markdown that lists addresses appears wrong, as markdown newlines require `\n\n` instead of `\n`.


#### Recommendation


Strictly validate inputs from external origins. Ensure that the provided address is a valid ethereum address. Optionally check the addresses checksum to detect typos. Ensure that inputs may not lead to renderable markdown. Fix the rendered list of addresses to properly display as a newline’d list. Ensure untrusted inputs cannot inject context-sensitive information into fetch urls.
