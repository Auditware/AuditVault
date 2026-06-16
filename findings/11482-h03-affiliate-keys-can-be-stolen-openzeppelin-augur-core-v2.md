---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/prediction
protocol: "[[Augur]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/augur-core-v2-audit-components/"
genome:
  - "[[signature-replay]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# [H03] Affiliate keys can be stolen

- id: 11482
- impact: HIGH
- protocol: [[Augur]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/augur-core-v2-audit-components/

## Summary


This bug report is about the `addKey` function of the `AffiliateValidator` contract. This function is used to associate a `key` with a user account. The `key` is expected to be derived from the user’s KYC information. However, the signature is not cryptographically tied to the caller’s address (i.e., the `msg.sender` address). This means that an attacker can obtain the signature before it is confirmed and later call the `addKey` function to associate the stolen key with the attacker’s account. This will allow the attacker to register a valid key without going through the mandatory KYC process. 

To fix this issue, the `addKey` function of the `AffiliateValidator` contract was modified to include the user’s address within the key hash. This ensures that the signature can only be redeemed by the intended account. This issue has been fixed in Pull Request #5564.

## Details

The [`addKey` function of the `AffiliateValidator` contract](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/AffiliateValidator.sol#L23) is used to associate a `key` with a user account. The `key` is expected to be derived from the user’s KYC information. The function first confirms that a given key-salt pair was signed by an operator and that the salt has not been used already. Then it associates the key with the sender’s account.


However, the signature is not cryptographically tied to the caller’s address (i.e., the `msg.sender` address). This means that an attacker can obtain the signature before it is confirmed (e.g., by reading it in a node’s public pool of pending transactions), and later call the `addKey` function to associate the stolen key with the attacker’s account. This will allow the attacker to register a valid key without going through the mandatory KYC process. Furthermore, it will also prevent the victim from using the signature.


Consider modifying the `addKey` function of the `AffiliateValidator` contract to include the user’s address within the key hash, so as to ensure the signature can only be redeemed by the intended account.


**Update**: *Fixed in [PR #5564](https://github.com/AugurProject/augur/pull/5564/files). The user’s address is included within the key hash.*
