---
tags:
  - lang/solidity
  - platform/sigmaprime
  - has/github
  - severity/high
  - vuln/dependency/upgradeable-contract
  - impact/privilege-escalation/ownership-transfer
  - novelty/variant
  - misassumption/external-call-is-safe
  - fix/upgrade-dependency
  - sector/account
protocol: "[[BLS Wallet]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/reports/bls-wallet/review.pdf"
genome:
  - "[[upgradeable-contract]]"
  - "[[ownership-transfer]]"
  - "[[variant]]"
  - "[[upgrade-safety]]"
---
# Ownership of ProxyAdmin May Be Transferred To Any Wallet

- id: 19280
- impact: HIGH
- protocol: [[BLS Wallet]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/reports/bls-wallet/review.pdf

## Summary


The function walletAdminCall() is used by BLS wallets to call functions in ProxyAdmin. It is meant to allow a wallet to call ProxyAdmin.upgrade() or ProxyAdmin.changeProxyAdmin(). However, it may be hijacked to transfer ownership of ProxyAdmin to the wallet. This is due to the lack of checks on which ProxyAdmin functions are being called. The first parameter of transferOwnership() is address newOwner, which is the wallet itself. As a result, the ownership is transferred to the calling BLSWallet contract, posing a critical risk as ProxyAdmin is the same for all wallets. It would allow the attacker to call the admin functions of the ProxyAdmin with arbitrary data, which includes changing the implementation address of the BLSWallet, draining all assets. To mitigate this issue, two restrictions can be implemented in walletAdminCall(), either blacklisting the Ownable functions or whitelisting the ProxyAdmin functions.

## Details

## Description

The function `walletAdminCall()` is used by BLS wallets to call functions in `ProxyAdmin`. However, it may be hijacked to transfer ownership of `ProxyAdmin` to the wallet.

`walletAdminCall()` propagates calls from a `BLSWallet` to `ProxyAdmin`. The intention is to allow a wallet to call `ProxyAdmin.upgrade()` or `ProxyAdmin.changeProxyAdmin()`. Each of the functions listed in `ProxyAdmin.sol` has `TransparentUpgradeableProxy` as the first parameter.

`walletAdminCall()` checks that the first parameter of the call to `ProxyAdmin` is the `BLSWallet` (i.e., `msg.sender`). The check ensures that a wallet cannot change the admin or implementation logic of other wallets, only itself. However, there are no checks on which `ProxyAdmin` functions are being called; hence a user may call `transferOwnership()` which `ProxyAdmin` inherits from `Ownable`. The first parameter of `transferOwnership()` is `address newOwner`. Since the first parameter of a `ProxyAdmin` call must be a `BLSWallet`, the `newOwner` field will be the wallet.

As `VerificationGateway` owns `ProxyAdmin`, this call passes the `onlyOwner` modifier, and ownership is transferred to the calling `BLSWallet` contract.

This poses a critical risk as `ProxyAdmin` is the same for all wallets using the `VerificationGateway`. Once the ownership is hijacked by a malicious `BLSWallet` instance, it would be possible to call the admin functions of the `ProxyAdmin` with arbitrary data. These functions include the ability to change the implementation address of the `BLSWallet` that the proxy points to. Changing the implementation contract would allow the attacker to call arbitrary functions on the wallet and drain all assets.

## Recommendations

To prevent this issue, there are two mitigations in `walletAdminCall()` which limit the functions that can be called in `ProxyAdmin`. The restrictions are to either blacklist the `Ownable` functions or whitelist the `ProxyAdmin` functions.
