---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/nft
protocol: "[[Freeverse]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/freeverse-audit/"
genome:
  - "[[missing-owner-check]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# Operators are implicitly trusted

- id: 10571
- impact: HIGH
- protocol: [[Freeverse]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/freeverse-audit/

## Summary


The bug report focuses on the misuse of power by an operator in the current design of the payment system. An operator is implicitly trusted to be a good actor in the system, but there are four scenarios where they could behave maliciously. Firstly, an operator could act as a buyer and defraud a seller by obtaining a refund even though the asset was received. Secondly, an operator could act as a seller and receive payment for an asset that was never delivered. Thirdly, an operator could collude with a buyer to obtain a refund for a transferred asset. Lastly, an operator could collude with a seller who owns an item of value. 

To prevent misuse of power by an operator, checks should be added which ensure that the buyer and seller addresses in the PaymentInput struct can never be the same as the operator address for the same payment transaction. Additionally, trust assumptions should be revisited that allow an operator entity to independently vouch for the success or failure of an asset transfer via the AssetTransferResult mechanism.

After discussing with the Freeverse team, it was concluded that the system is designed with a trust assumption that the role of operator will always be in the favor of the system. Fixes were applied in the codebase to ensure that an operator cannot be a buyer or a seller, this is fixed as of commit 714e99e of PR #2.

## Details

In the current design of the payment system, the operator role wields a significant amount of power. A buyer cannot initiate a payment without the approval of an operator, and a seller must rely on an operator to vouch for the transfer of their asset. Operators are implicitly trusted to be good actors in the system. However, there are four possible scenarios where operators could behave maliciously:


* *Operator as a buyer*: Both the buyer and operator need to agree upon the `PaymentInput` data. But there’s nothing restricting an operator from also acting as a buyer, in which case they can approve their own transactions. More importantly, acting as a buyer an operator could defraud a seller by obtaining a refund even though the asset was received. After the seller’s asset is transferred, the operator could either create a signed `AssetTransferResult` with the `wasSuccessful` field set to `false`, or not sign an `AssetTransferResult` at all. The operator could then call [`refund`](https://github.com/freeverseio/PaymentsERC20Public/blob/a95f0f6499be396c0a245f0183009b98cc72f123/contracts/Payments/PaymentsERC20.sol#L183) or [`refundAndWithdraw`](https://github.com/freeverseio/PaymentsERC20Public/blob/a95f0f6499be396c0a245f0183009b98cc72f123/contracts/Payments/PaymentsERC20.sol#L188) after the payment window has expired, and obtain their full payment amount even though the seller’s item was successfully transferred.
* *Operator as a seller*: The contracts do not restrict an operator from also being a seller in a transaction they are responsible for monitoring. In this case, an operator could register as a seller and post an item for sale. After a buyer initiates payment, the operator could craft an `AssetTransferResult` with the `wasSuccessful` field set to `true`, but then choose not to transfer the asset. The operator could then call [`finalize`](https://github.com/freeverseio/PaymentsERC20Public/blob/a95f0f6499be396c0a245f0183009b98cc72f123/contracts/Payments/PaymentsERC20.sol#L166) or [`finalizeAndWithdraw`](https://github.com/freeverseio/PaymentsERC20Public/blob/a95f0f6499be396c0a245f0183009b98cc72f123/contracts/Payments/PaymentsERC20.sol#L174) with the signed `AssetTransferResult`, prior to the payment window expiring, thus receiving payment for an asset that was never delivered.
* *Operator colluding with a buyer*: Similar to the case where the operator and the buyer are the same, an operator could work together with a buyer in an attempt to obtain a refund for a transferred asset. As before, the operator could create a signed `AssetTransferResult` with `wasSuccessful` set to `false`, even though the asset was transferred.
* *Operator colluding with a seller*: Similar to the case where the operator and the seller are the same, an operator could work in conjunction with a seller who owns an item of value. As before, the operator would create a signed `AssetTransferResult` with `wasSuccessful` set to `true`, even though the seller did not transfer the asset.


An operator should always be an observer of transactions and never participate as a buyer or seller. To prevent misuse of the power granted to an operator, consider adding checks which ensure that the `buyer` and `seller` addresses in the [`PaymentInput`](https://github.com/freeverseio/PaymentsERC20Public/blob/a95f0f6499be396c0a245f0183009b98cc72f123/contracts/Payments/IEIP712Verifier.sol#L15) struct can never be the same as the `operator` address for the same payment transaction. Also consider revisiting the trust assumptions that allow an operator entity to independently vouch for the success or failure of an asset transfer via the `AssetTransferResult` mechanism, and how the system can guarantee that an asset transfer result is always produced.


***Update:** Not an issue. After discussing with the Freeverse team, we have concluded that the system is designed with a trust assumption that the role of operator will always be in the favor of the system. Additionally, the team has applied the fixes in the codebase to ensure that an operator cannot be a buyer or a seller, this is fixed as of [commit `714e99e` of PR #2](https://github.com/freeverseio/PaymentsERC20Public/pull/2/commits/714e99efb5e5bb17e7cc7b569ddcbbfdb422f517).*
