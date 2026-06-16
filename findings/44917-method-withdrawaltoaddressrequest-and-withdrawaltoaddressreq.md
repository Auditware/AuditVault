---
tags:
  - blockchain/evm
  - blockchain/evm/base
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/vault
protocol: "[[Tradable]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-09-01-Tradable.md"
genome:
  - "[[wrong-condition]]"
  - "[[cross-contract-state-consistency]]"
  - "[[direct-drain]]"
---
# Method withdrawalToAddressRequest and withdrawalToAddressRequestForUser do not send tokens to the `receiver` address

- id: 44917
- impact: HIGH
- protocol: [[Tradable]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-09-01-Tradable.md

## Summary


The bug report is about a problem with two methods, withdrawalToAddressRequest and withdrawalToAddressRequestForUser, in the Contract TradableSideVault. These methods are used to withdraw tokens to a specific address, but they are not working properly. When these methods call another method, marginWithdrawalToAddress, on the base chain, the tokens are sent to the wrong address. This defeats the purpose of using these methods to withdraw tokens to a specific address. The recommendation is to update the marginWithdrawalToAddress method to fix this issue.

## Details

**Severity**: High

**Status**: Resolved

**Description**

In Contract TradableSideVault, methods withdrawalToAddressRequest and withdrawalToAddressRequestForUser are used to withdraw tokens to a `receiver` address.

These methods call the method `marginWithdrawalToAddress` in the contract TradableMarginHandler on the base chain.

Method `marginWithdrawalToAddress` further callback the side-chains side vault contract but without the `receiver` parameter. Instead, it encodes the `user` address, which means withdrawal tokens are sent to the `user` address instead of the `receiver` address.

This defeats the purpose of having methods withdrawalToAddressRequest and withdrawalToAddressRequestForUser for receiving withdrawal tokens in the receiver account.

**Recommendation**: 

Update the method `marginWithdrawalToAddress` in the TradableMarginHandler contract to encode the `receiver` address instead of the `user` address.
