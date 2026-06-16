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
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[cross-contract-state-consistency]]"
---
# persistedData Race Where snap_manageState.get Returnsnull ✓ Fixed

- id: 22077
- impact: HIGH
- protocol: [[Push Protocol Snap For MetaMask]]
- reporter: Martin Ortner
 (ConsenSys)
- source: https://consensys.net/diligence/audits/2023/07/push-protocol-snap-for-metamask/

## Summary


This bug report is about an error that occurs when using Metamask. The error code is '-32603' and the message states that something went wrong and that it cannot read properties of null (reading 'addresses'). The issue was that `snap.request(, {method: 'snap_manageState', params: {operation: 'get'}})` may return `null`. Snap state is only initialized on rpc request method `hello` via `addAddress()`. 

The solution was to introduce a wrapper function that ensures that snapstate returns sane defaults. This function is not used everywhere, but in places where it is not, custom checks are employed. The function also obsoleted the need to check if `persistedData` is `null` as the new method ensures safe non-null defaults. This should also silence some of the type errors reported by tslint that warn that attributes of `persistentdata` are read while it might be null.

## Details

#### Resolution



addressed with [ethereum-push-notification-service/push-protocol-snaps@7ee018947303014e8c14e9413a5edd9fd29f9829](https://github.com/ethereum-push-notification-service/push-protocol-snaps/commit/7ee018947303014e8c14e9413a5edd9fd29f9829) by introducing a wrapper function that ensures that snapstate returns sane defaults. This function is not used everywhere, but in places where it is not, custom checks are employed.


#### Description


Metamask Error:



```
Oops! Something went wrong.
Snap Error: 'Cannot read properties of null (reading 'addresses')'. Error Code: '-32603'

```
`snap.request(, {method: 'snap_manageState', params: {operation: 'get'}})` may return `null`. Snap state is only initialized on rpc request method `hello` via `addAddress()`.


This is the only method that checks if the retrieved state is `null`:


**snap/src/utils/fetchAddress.ts:L5-L20**



```
export const addAddress = async (address:string) => {

 const persistedData = await snap.request({
 method: 'snap\_manageState',
 params: { operation: 'get' },
 });

 if(persistedData == null){
 const data = {
 addresses: [address],
 popuptoggle: 0,
 };
 await snap.request({
 method: 'snap\_manageState',
 params: { operation: 'update', newState:data },
 });

```
**snap/src/index.ts:L12-L21**



```
export const onRpcRequest: OnRpcRequestHandler = async ({
 origin,
 request,
}) => {
 switch (request.method) {
 case "hello": {
 await addAddress(request.params.address || "0x0");
 await confirmAddress();
 break;
 }

```
If the state was never initialized or there was a race where `rpc-hello()` was not called first, then the snap may run into a null deref exception (here `rpc-togglepopup`):


**snap/src/utils/toggleHelper.ts:L2-L12**



```
let persistedData = await snap.request({
 method: 'snap\_manageState',
 params: { operation: 'get' },
});

let popuptoggle = notifcount;

const data = {
 addresses: persistedData.addresses,
 popuptoggle: popuptoggle,
};

```
#### Recommendation


Wrap `snap_manageState` with a function that always falls back to safe defaults if the snap state was never set. This also obsoleted the future need to check if `persistedData` is `null` as the new method ensures safe non-null defaults.


This should also silence some of the type errors reported by tslint that warn that attributes of `persistentdata` are read while it might be null (see [issue 5.6](#typescript-errors) ).
