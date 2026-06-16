---
tags:
  - lang/solidity
  - sector/nft
  - platform/consensys
  - severity/high
  - novelty/variant
protocol: "[[Web3 Tickets]]"
auditors:
  - "[[ConsenSys]]"
report: "https://consensys.net/diligence/audits/2023/12/web3-tickets/"
genome:
  - "[[missing-modifier]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# Any Website Connected to the Snap Can Access the Address and API Key and Impersonate the User ✓ Fixed

- id: 29580
- impact: HIGH
- protocol: [[Web3 Tickets]]
- reporter: ConsenSys (ConsenSys)
- source: https://consensys.net/diligence/audits/2023/12/web3-tickets/

## Summary


The client has removed a function called `get_snap_state` and added a new security feature in the Snap. However, there is currently a vulnerability in the Snap that allows any dapp to access user information and potentially impersonate them. This is because the Snap does not validate the origin of RPC calls, meaning any connected dapp can call `get_snap_state` and access sensitive information. The report recommends implementing strict origin validation in the `onRpcRequest()` handler to prevent unauthorized access and potentially removing the `get_snap_state` function if it is not necessary.

## Details

#### Resolution



The client removed the `get_snap_state` RPC endpoint, and implemented origin validation in the Snap. Note that the whitelisted origin will still have to be updated to the production domain.


#### Description


Currently, there is no validation of the origin for RPC calls made to the Snap. Thus, any dapp connected to the Snap can call any RPC endpoint, which allows an attacker crafting a malicious dapp to access a user’s tickets and impersonate the user to support services. The vulnerability arises because the RPC call handler `onRpcRequest()` can be invoked by any dapp as it does not validate the origin of the call. This enables any connected dapp to call `get_snap_state`, exposing critical user information like its userID, API token, and ticket details.


#### Examples


**packages/snap/src/index.ts:L242-L247**



```
export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
 
 switch (request.method) {
 
 case 'set\_snap\_state':
 let allTicketCommentsCount: any = [];

```
#### Recommendation


Implement strict origin validation in the `onRpcRequest()` handler to ensure that only authorized and intended domains can invoke the Snap. Additionally, consider removing the `get_snap_state` RPC endpoint if it is not strictly needed.
