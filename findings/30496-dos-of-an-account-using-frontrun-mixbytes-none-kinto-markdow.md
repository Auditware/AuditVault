---
tags:
  - lang/solidity
  - sector/account
  - platform/mixbytes
  - has/github
  - severity/high
  - vuln/access-control/uninitialized-owner
  - impact/mev/frontrun
  - novelty/variant
  - misassumption/proxy-is-initialized
  - fix/add-access-control
protocol: "[[Kinto]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Kinto/README.md#3-dos-of-an-account-using-frontrun"
genome:
  - "[[uninitialized-owner]]"
  - "[[frontrun]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[account-ownership]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[initializer-auth]]"
---
# DoS of an account using frontrun

- id: 30496
- impact: HIGH
- protocol: [[Kinto]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Kinto/README.md#3-dos-of-an-account-using-frontrun

## Summary


The report describes a bug in the `KintoWalletFactory` code, where a hacker can create a valid `KintoWallet` without setting the `walletTs` value. This can lead to tokens being permanently blocked if accidentally sent to the wallet. It is recommended to prevent accounts from being created through the `deployContract` method to avoid potential problems for all members of the Kinto network.

## Details

##### Description

- https://github.com/KintoXYZ/kinto-core/blob/f7dd98f66b9dfba1f73758703b808051196e740b/src/wallet/KintoWalletFactory.sol#L130

In `KintoWalletFactory`, a hacker can make a `deployContract` frontrun before calling `createAccount`. Thus, `deployContract` will create a valid `KintoWallet` without configuring the `walletTs` value.

The following is an example:
```solidity
vm.prank(_hackerWithKYC);
bytes memory a = abi.encodeWithSelector(
    KintoWallet.initialize.selector,
    _owner,
    _owner
);                   
_walletFactory.deployContract(
    0,
    abi.encodePacked(
        type(SafeBeaconProxy).creationCode,
        abi.encode(address(_beacon), a)
    ),
    bytes32(someSalt)
);
vm.startPrank(_owner);

// create2 will not be called
_kintoWalletv1 = 
    _walletFactory.createAccount(
        _owner, _owner, someSalt);

// _walletFactory.getWalletTimestamp(
// address(_kintoWalletv1)
// ) == 0
```

If the user sends tokens to it by mistake, they will be permanently blocked.

Such a contract cannot be recovered in any way, and also the `Recovery` mechanism will not work, since there is no way to call `KintoWallet` via `EntryPoint` on any `owners`.

##### Recommendation
We recommend not allowing `KintoWallet` accounts to be created via the `deployContract` method. A single fake-KYC or leaked account can create potential problems for all members of the Kinto network.
