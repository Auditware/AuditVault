---
tags:
  - has/github
  - severity/high
  - lang/solidity
  - sector/oracle
protocol: "[[XPress]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/XPress/Liquidity%20Vault/README.md#1-zero-address-rfqordersigner-allows-unrestricted-order-execution"
genome:
  - "[[access-roles]]"
  - "[[direct-drain]]"
---
# Zero-Address `rfqOrderSigner` Allows Unrestricted Order Execution

- id: 56822
- impact: HIGH
- protocol: XPress
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/XPress/Liquidity%20Vault/README.md#1-zero-address-rfqordersigner-allows-unrestricted-order-execution

## Summary


A critical issue has been found in the `_swapWithRfqOrder` functions of the `RfqProxyLOB` contract. This issue can bypass the signature security and allow anyone to execute unauthorized orders, potentially leading to significant loss of funds. To fix this, it is recommended to ensure that `rfqOrderSigner` is never set to the zero address. This can be done by validating in the setter function and initializer, as well as adding an additional check in the signature verification logic.

## Details

##### Description
This issue has been identified within the `_swapWithRfqOrder` functions of the `RfqProxyLOB` contract. 

If `rfqOrderSigner` is set to `address(0)`, the signature verification logic will treat any invalid signature as signed correctly, because `signer == rfqOrderSigner` trivially matches when both are zero. This effectively disables signature checks, permitting anyone to execute unauthorized orders and drain the contract’s funds.

The issue is classified as **high** severity because it entirely bypasses RFQ signature security and can lead to significant fund loss if misconfigured.

##### Recommendation
We recommend enforcing a strict requirement that `rfqOrderSigner` must never be the zero address. Specifically:
1. Validate in the setter function and initializer that reverts if `rfqOrderSigner == address(0)`. 
2. Add an additional check in the signature verification logic to prevent any orders from processing if the signer address is zero.
