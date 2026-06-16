---
tags:
  - has/github
  - severity/high
  - lang/solidity
  - sector/oracle
protocol: "[[Hanji]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/Hanji/Liquidity%20Vault/README.md#1-zero-address-rfqordersigner-allows-unrestricted-order-execution"
genome:
  - "[[access-roles]]"
  - "[[direct-drain]]"
---
# Zero-Address `rfqOrderSigner` Allows Unrestricted Order Execution

- id: 55153
- impact: HIGH
- protocol: Hanji
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Hanji/Liquidity%20Vault/README.md#1-zero-address-rfqordersigner-allows-unrestricted-order-execution

## Summary


The report describes a bug in the `_swapWithRfqOrder` functions of the `RfqProxyLOB` contract. This bug allows anyone to execute unauthorized orders and drain the contract's funds by setting the `rfqOrderSigner` to `address(0)`. This effectively disables signature checks, which can lead to significant fund loss if not fixed. The report recommends enforcing a strict requirement that `rfqOrderSigner` must never be set to the zero address. This can be done by validating it in the setter function and initializer and adding an additional check in the signature verification logic.

## Details

##### Description
This issue has been identified within the `_swapWithRfqOrder` functions of the `RfqProxyLOB` contract. 

If `rfqOrderSigner` is set to `address(0)`, the signature verification logic will treat any invalid signature as signed correctly, because `signer == rfqOrderSigner` trivially matches when both are zero. This effectively disables signature checks, permitting anyone to execute unauthorized orders and drain the contract’s funds.

The issue is classified as **high** severity because it entirely bypasses RFQ signature security and can lead to significant fund loss if misconfigured.

##### Recommendation
We recommend enforcing a strict requirement that `rfqOrderSigner` must never be the zero address. Specifically:
1. Validate in the setter function and initializer that reverts if `rfqOrderSigner == address(0)`. 
2. Add an additional check in the signature verification logic to prevent any orders from processing if the signer address is zero.
