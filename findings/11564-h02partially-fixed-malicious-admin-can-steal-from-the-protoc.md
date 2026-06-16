---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/lending
  - sector/multisig
  - sector/options
  - sector/oracle
protocol: "[[Opyn]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/opyn-contracts-audit/"
genome:
  - "[[missing-owner-check]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
---
# [H02][Partially Fixed] Malicious Admin can steal from the protocol

- id: 11564
- impact: HIGH
- protocol: [[Opyn]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/opyn-contracts-audit/

## Summary


This bug report is about the Event Oversight Administrator (EOA) who has a lot of privileges over the control of the whole protocol. This includes setting up initial variables and updating critical values such as Oracles and market parameters. This design puts the whole protocol at risk of being hacked or manipulated by a malicious admin. To solve this issue, the team has implemented restrictions on the parameter update function and is working on a multi-sig solution to further protect the admin account.

## Details

Currently an EOA (*Event Oversight Administrator*) has a lot of privileges over the control of the whole protocol, from setting up initial variables to updating critical values like Oracles and market parameters. For instance, `liquidationIncentive`, `liquidationFactor`,`liquidationFee`,`transactionFee`, and `collateralizationRatio`.


These privileges render the admin with exceptional power over general users, where it could override parameters set up in the deployment. This design puts the whole protocol in a vulnerable state if the admin account is hacked or an internal admin becomes malicious. For example, a malicious admin could easily steal from the protocol by setting a high `liquidationFee`.


Consider the use of an multi-sig account and time-locks to improve the safety of the contract against the powers of a malicious admin.


**Update**: *Partially Fixed in the follow-up commit [`3adfd9afa6d463869d9e0a78cc7f316ae34eb89e`](https://github.com/opynfinance/Convexity-Protocol/commit/3adfd9afa6d463869d9e0a78cc7f316ae34eb89e). The team has put some restrictions on the [parameter update function](https://github.com/opynfinance/Convexity-Protocol/blob/3adfd9afa6d463869d9e0a78cc7f316ae34eb89e/contracts/OptionsContract.sol#L235) which restricts admin power when assigning values. The team has also indicated they are working on a multi-sig solution to further protect the admin account.*
