---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - vuln/access-control/proxy-storage-collision
  - vuln/dependency/upgradeable-contract
  - novelty/variant
  - misassumption/external-call-is-safe
  - misassumption/proxy-is-initialized
  - fix/upgrade-dependency
  - sector/nft
protocol: "[[ink!]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/security-review-ink-cargo-contract/"
genome:
  - "[[proxy-storage-collision]]"
  - "[[upgradeable-contract]]"
  - "[[variant]]"
  - "[[admin-takeover]]"
  - "[[access-roles]]"
  - "[[upgrade-safety]]"
---
# Potential contract storage layout overlap in upgradable contracts

- id: 10299
- impact: HIGH
- protocol: Security Review – ink! & cargo-contract
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/security-review-ink-cargo-contract/

## Summary


Ink! is a programming language for writing Ethereum smart contracts. By default, Ink! tries to store all storage struct fields under a single storage cell, which can cause an issue for upgradable contracts. When both the proxy and the implementation write their Packed fields to the same storage key (`0x00000000`) unless the developer explicitly sets manual keys for the variables inside the implementation contract, overwrites of the storage can happen. This can lead to unexpected behavior and potential malfunctioning of the contract, and can cause confusion in values or failure in the correct reading of storage. 

To mitigate these problems, developers should define a set of standard slots to store variables present on the proxy code, use the Lazy collection to set the storage keys, and consider adding documentation and examples to illustrate how to use the Lazy collection. Additionally, the ‘cargo contract upgrade’ command should be implemented to retain the storage layout of the implementation and check that it was not corrupted between upgrades.

The progress of these mitigations can be tracked on issues 1679 and 1680 of the “ink” repository.

## Details

By default, ink! tries to store all storage struct fields under a single storage cell. This behavior causes an issue for upgradable contracts because both the proxy and the implementation write their Packed fields to the same storage key (`0x00000000`) unless the developer explicitly sets manual keys for the variables inside the implementation contract. As a result, overwrites of the storage could happen.


If the first variable in the implementation is modified, it will change the first variable in the proxy storage layout or some of its bytes, depending on the variable size. The same happens the other way around.


Without sufficient information, developers may fail to properly modify the storage of the implementation contract, which can result in unexpected behavior and potential malfunctioning of the contract. Additionally, this may lead to an unpredictable storage layout, further complicating the matter. Therefore, it is important for developers to ensure they have all the necessary information and take the proper steps to modify storage in order to prevent such issues


Also, there are no validations between upgrades to check whether the storage layout changed. The [documentation specified](https://use.ink/basics/upgradeable-contracts#storage-compatibility) that developers should not change the order in which the contract state variables are declared, nor their type.


Even if the restriction is violated, the compilation process will still succeed, but it may cause confusion in values or failure in the correct reading of storage. These issues can result in severe errors in the application that is using the contract.


Some mitigations to these problems could be:


* To avoid clashes, define a set of standard slots to store variables present on the proxy code. The [EIP-1967](https://eips.ethereum.org/EIPS/eip-1967) defined in Ethereum can serve as an inspiration.
* Consider adding documentation and examples to illustrate that one of either the implementation or proxy variables needs to use the [Lazy collection](https://github.com/paritytech/ink/tree/master/crates/storage/src/lazy). The Lazy collection sets the storage keys used for each variable, ensuring that they do not overlap with other variables in the contract.
* Implement the `cargo contract upgrade` command mentioned in the suggestions section. This will retain the storage layout of the implementation and checks that it was not corrupted between upgrades, and check that the variables defined in the proxy were defined using manual keys instead of automatic keys, or that the first position of each variable defined in the proxy does not collide with any of the variables defined in the implementation.


***Update:** Acknowledged, will resolve. The progress can be tracked on issues [1679](https://github.com/paritytech/ink/issues/1679) and [1680](https://github.com/paritytech/ink/issues/1680) of the “ink” repository.*
