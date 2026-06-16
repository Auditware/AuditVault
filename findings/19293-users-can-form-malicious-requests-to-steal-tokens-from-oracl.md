---
tags:
  - lang/solidity
  - sector/oracle
  - sector/token
  - platform/sigmaprime
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Chainlink]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/chainlink/chainlink-1/review.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[chainlink-round-completeness]]"
---
# Users Can Form Malicious Requests to Steal Tokens From Oracles

- id: 19293
- impact: HIGH
- protocol: [[Chainlink]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/chainlink/chainlink-1/review.pdf

## Summary


This bug report discusses an issue with the Chainlink platform, where malicious users can steal tokens from Oracles by crafting and submitting specific requests. When the owner of the Oracle fulfils a request, it performs an external call on line 118, which can be manipulated by the user to transfer Link tokens from the Oracle to the attacker. To prevent this, the platform has implemented a blacklist to restrict callback.addr from being the LINK address. Additionally, a more restrictive approach would be to only allow callback addresses from the contracts that created the request, however this may be too restrictive for the purposes of the Chainlink platform.

## Details

## Description

Malicious users can steal tokens from Oracles by crafting and submitting specific requests. When the owner of the Oracle fulfills a request, it performs an external call on line [118] which is intended to supply the off-chain data to the calling contract. 

The current implementation is such that a user can manufacture any arbitrary address that the Oracle will call when fulfilling a request, along with any function signature and initial parameter. Thus, a user can craft a malicious request to the Link token contract, which when fulfilled, will transfer Link tokens from the Oracle to the attacker. 

To detail this further, the call on line [118] is:

```
return callback.addr.call(callback.functionId, callback.externalId, _data);
```

A malicious user can create a request, which sets `callback.addr` to the address of the Link token contract. They can set `callback.functionId` to the function signature of `transfer(address,uint)` and they can set `callback.externalId` to be a beneficiary address of their choosing. These variables are set when creating a request. The request’s data can be set to ask for a specific value (which is less than or equal to the available Link token balance of the Oracle, i.e., the current price of ether in wei). 

If an Oracle fulfills such a request and calls `fulfillData()` (line [101]) with `_data` being a value, i.e., `200e18` (and the Oracle has more than 200 Link tokens), the call on line [118] will send these tokens to the attacker’s beneficiary address. 

An example of this attack is given in the tests that accompany this report, specifically test `test_attack_can_steal_oracle_tokens`.

**Note:** This attack is not localized to just Link tokens but to all contracts and functions that do not require more than two parameters. See LNK-02 for a further example.

## Recommendations

There are a number of ways to address this issue, some more restrictive (in platform functionality) than others. The least restrictive is to blacklist addresses that `callback.addr` can take. For example, adding a require statement that ensures `callback.addr` is not the Link token address would be one approach. Although this resolves the immediate issue, it is typically dangerous to allow external users to set arbitrary addresses and function calls for a low-level call as LNK-02 illustrates.

A more restrictive approach would be to only allow callback addresses from the contracts that created the request. This solution would also address LNK-02, LNK-07, and LNK-06. This, however, may be too restrictive for the purposes of the Chainlink platform.

## Resolution

The callback address is now restricted from being the LINK address.
