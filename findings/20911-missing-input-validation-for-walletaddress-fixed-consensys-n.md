---
tags:
  - lang/solidity
  - platform/consensys
  - has/github
  - severity/high
  - novelty/variant
  - sector/wallet
protocol: "[[Wallet Guard]]"
auditors:
  - "[[ConsenSys]]"
report: "https://consensys.net/diligence/audits/2023/07/wallet-guard/"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[variant]]"
  - "[[access-roles]]"
---
# Missing Input Validation for WalletAddress ✓ Fixed

- id: 20911
- impact: HIGH
- protocol: [[Wallet Guard]]
- reporter: ConsenSys (ConsenSys)
- source: https://consensys.net/diligence/audits/2023/07/wallet-guard/

## Summary


This bug report is about an issue with Wallet Guard Snap, a client application. The issue is that the client prompts users to input a wallet address to be monitored, but does not sanitize the user input. This can lead to injection vulnerabilities such as markdown or control character injections that can break other components. The address is sent to the API as a URL query parameter, which can be used by malicious attackers to mount URL injection attacks.

The client acknowledged the issue and fixed it by implementing a regex validation in PR#25, which validates the address but not the checksum. The recommendation is to sanitize the address string input by the user and reject all addresses that do not adhere to the Ethereum address format.

## Details

#### Resolution



The client acknowledged the issue and fixed it by implementing a regex validation in PR#25 [here](https://github.com/wallet-guard/wallet-guard-snap/pull/25) - Snap shasum `YzN/+ty8xOTEacH19iYGw1a9+MBCgL7PUkU9d/Rf51E=`.
Note that the fix does not validate the address checksum, which is not critical considering the application.


#### Description


The snap prompts users to input the wallet address to be monitored. Users can set wallet addreses that do not adhere to the common Ethereum address format. The user input is not sanitized. This could lead to various injection vulnerabilities such as markdown or control character injections that could break other components.
In particular, the address is sent to the API as a URL query parameter. A malicious attacker could try using that to mount URL injection attacks.


**packages/snap/src/index.ts:L50-L61**



```
if (
 request.method === RpcRequestMethods.UpdateAccount &&
 'walletAddress' in request.params &&
 typeof request.params.walletAddress === 'string'
) {
 const { walletAddress } = request.params;

 if (!walletAddress) {
 throw new Error('no wallet address provided');
 }

 updateWalletAddress(walletAddress);

```
#### Recommendation


Sanitize the address string input by the user and reject all addresses that do not adhere to the Ethereum address format.
