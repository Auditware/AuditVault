---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/multisig
  - sector/prediction
  - sector/staking
protocol: "[[Augur]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/augur-core-v2-audit-components/"
genome:
  - "[[missing-modifier]]"
  - "[[admin-takeover]]"
  - "[[account-ownership]]"
  - "[[frontrun-exposure]]"
  - "[[vote-delegation-loop]]"
---
# [C01] Anyone can register backdoored wallets for any owner in GnosisSafeRegistry contract

- id: 11479
- impact: HIGH
- protocol: [[Augur]]
- reporter: [[OpenZeppelin]]
- source: https://blog.openzeppelin.com/augur-core-v2-audit-components/

## Summary


The GnosisSafeRegistry contract is a single on-chain registry that keeps track of Augur users’ Gnosis Safe Multisig wallets. It is called upon creation of a Gnosis Safe Multisig so that Augur can quickly look up and verify a user’s wallet. The wallets are stored in the `accountSafes` mapping under the first address listed in the `owners` array of the `GnosisSafe` contract. There are restrictions in place to ensure that only wallets with a single owner and a threshold of 1 can be registered.

Unfortunately, it is possible for an attacker to register malicious Gnosis Safe Multisig wallets under any owner address. By leveraging Gnosis Safe modules, an attacker can craft, deploy and register wallets with any owner address and modules attached that comply with all requirements enforced by Augur’s registry. These wallets would appear to be legitimate and victim-controlled, but would actually contain a malicious backdoor that would give the attacker unrestricted control over it.

At least two sensitive attack vectors have been identified. For a user that has never registered a wallet in the registry, an attacker can simply register a wallet with the victim’s address as its owner and perform actions through the wallet. For a user that has already registered a wallet in the registry, an attacker could deploy and register a wallet with the victim’s address as its owner.

To prevent any attacker from registering backdoored wallets for any owner address in Augur’s registry, Augur’s development team should consider implementing further restrictions. Suggestions include further restricting the type of Gnosis Safe Multisig wallets that can be registered to only those without modules attached, and ensuring the caller of the registry’s `register` and `callRegister` functions is the address listed in the `owners` array of the `GnosisSafe` contract.

This vulnerability has been fixed in commit `7787dba1`. Now only Gnosis Safe Multisig wallets deployed with known parameters and no modules can be registered.

## Details

The `GnosisSafeRegistry` contract is intended to be a single on-chain registry to keep track of Augur users’ Gnosis Safe Multisig wallets. The registry is expected to be called upon creation of a Gnosis Safe Multisig so that Augur can quickly look up and verify a user’s wallet. `GnosisSafeRegistry` allows users to register one or more wallets through the [`register`](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/GnosisSafeRegistry.sol#L52) and [`callRegister`](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/GnosisSafeRegistry.sol#L33) functions. Calls to these functions are expected to always be executed from a user-controlled Gnosis Safe Multisig wallet. Wallets are stored in the [`accountSafes` mapping](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/GnosisSafeRegistry.sol#L14) under the first address listed in the `owners` array of the `GnosisSafe` contract. As a consequence, a single owner can have multiple wallets registered in Augur’s `GnosisSafeRegistry`.


`GnosisSafeRegistry` is implemented as a registry of proxy contracts pointing to a single known, legitimate, implementation of [`GnosisSafe`](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/GnosisSafe.sol#L596). All registered proxies must:


* Delegate to an implementation address equal to the [registry’s state variable `gnosisSafeMasterCopy`](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/GnosisSafeRegistry.sol#L19). This address is [queried](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/GnosisSafeRegistry.sol#L26) from the `Augur` contract during initialization of the registry.
* Be instances of the [`Proxy`](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/ProxyFactory.sol#L4) contract created through the [`ProxyFactory`](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/ProxyFactory.sol#L44) contract.


Additionally, to further restrict the type of valid wallets, all registered wallets can only have [a single owner](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/GnosisSafeRegistry.sol#L78) and a [threshold equal to 1](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/GnosisSafeRegistry.sol#L76).


In spite of all described restrictions, it is possible for an attacker to register malicious Gnosis Safe Multisig wallets under any owner address. By leveraging [Gnosis Safe modules](https://github.com/gnosis/safe-modules), an attacker can craft, deploy and register Gnosis wallets with any owner address and modules attached. Complying with all requirements programmatically enforced by Augur’s registry, these wallets would appear to be legitimate and victim-controlled, but would actually contain a malicious backdoor that would give the attacker unrestricted control over it. This undermines the fundamental assumption of the `GnosisSafeRegistry` contract, thus it should be considered a critical vulnerability. A step-by-step proof-of-concept exploit of this vulnerability can be found [in this private repository](https://github.com/OpenZeppelin/exploit-augur-gnosis-safe-registry).


At least two sensitive attack vectors have been identified:


* **For a user that has never registered a wallet in the registry:** an attacker can simply register a wallet with the victim’s address as its owner and perform actions through the wallet. To minimize unexpected side-effects, they could front-run a legitimate transaction intending to register a wallet. Upon querying the registry with the [`getSafe`](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/GnosisSafeRegistry.sol#L82) function, the victim would see a valid wallet registered under her address (and she would even be its sole owner). However, this wallet would have attached an attacker-controlled module that would grant the attacker unrestricted privileges over it. Thus, as [module actions do not require owners’ signatures](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/GnosisSafe.sol#L165-L178), the attacker would be able to trigger any kind of transactions *from* the wallet without requiring confirmation from its owner (i.e., the victim).
* **For a user that has already registered a wallet in the registry:** an attacker could deploy and register a wallet with the victim’s address as its owner. This wallet would be registered under the victim’s address in the registry, but would end up in the queue of the victim’s registered wallets. Only after de-registering her first wallet would the victim find out that there is another wallet registered under her address. Were she to start using it (as she would be its listed owner), the attacker would be able leverage the backdoor to execute malicious actions from it.


In both cases the attack leverages the fact that Augur’s registry tracks wallets under their owner addresses. As explained, in Gnosis Safe Multisig wallets with malicious modules attached, addresses listed as owners can be easily controlled by an attacker. Consider implementing further restrictions to prevent any attacker to register backdoored wallets for any owner address in Augur’s registry. As starting points to be further analyzed by Augur’s development team, we suggest:


* Further restricting the type of Gnosis Safe Multisig wallets that can be registered to only those *without* modules attached. This property can be checked by querying the [`getModules` public getter](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/GnosisSafe.sol#L182).
* Ensuring the caller of the registry’s `register` and `callRegister` functions is the address listed in the `owners` array of the `GnosisSafe` contract. This can be checked by requiring the owner’s signature or a transaction signed by the owner address.


**Update**: *Fixed in [commit `7787dba1`](https://github.com/AugurProject/augur/commit/7787dba1b0b0ba8b93e23e08be5540561c47dc6f). Now only Gnosis Safe Multisig wallets deployed with known parameters and no modules can be registered.*
