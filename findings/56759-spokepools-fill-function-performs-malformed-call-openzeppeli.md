---
tags:
  - lang/solidity
  - sector/staking
  - has/github
  - severity/high
protocol: "[[Across]]"
auditors:
  - OpenZeppelin
report: "https://blog.openzeppelin.com/across-audit"
genome:
  - "[[extcall-return-validation]]"
  - "[[cross-protocol]]"
---
# SpokePool's fill Function Performs Malformed Call

- id: 56759
- impact: HIGH
- protocol: Across Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/across-audit

## Summary


The `fill` function in the `SpokePool` contract is not working correctly because it is missing a parameter when calling the `fillV3Relay` function. This causes the entire execution to fail. To fix this, the code should be updated to use `encodeCall` instead of `encodeWithSelector` to ensure type safety and provide all necessary parameters. Additionally, the `SpokePool` contract should explicitly inherit from the `IDestinationSettler` interface as required by the `ERC-7683` standard. This issue has been resolved in a recent update to the code.

## Details

The `fill` [function](https://github.com/across-protocol/contracts/blob/108be77c29a3861c64bdf66209ac6735a6a87090/contracts/SpokePool.sol#L988) of the `SpokePool` contract is meant to adhere to the `IDestinationSettler` interface, as dictated by the latest update to the `ERC-7683` [specifications](https://github.com/across-protocol/ERCs/blob/d975d7b4b58fa3d1aa6db1763935cfa2ab1444b1/ERCS/erc-7683.md). The `fill` function is meant to internally call the `fillV3Relay` [function](https://github.com/across-protocol/contracts/blob/108be77c29a3861c64bdf66209ac6735a6a87090/contracts/SpokePool.sol#L864) in order to process the order data, and it does so by [making a `delegatecall` to its own `fillV3Relay` function](https://github.com/across-protocol/contracts/blob/108be77c29a3861c64bdf66209ac6735a6a87090/contracts/SpokePool.sol#L998-L999), passing `abi.encodePacked(originData, fillerData)` as the parameter.

However, the `fillV3Relay` function accepts two parameters, having the `repaymentChainId` as the second parameter. Since the call is constructed using `encodeWithSelector`, which is not type-safe, the compiler does not complain about the missing parameter. As an incorrect number of parameters is passed, the call to `fillV3Relay` will always revert when trying to decode the input parameters, breaking the entire execution flow. Moreover, the input data is encoded with `abi.encodePacked` the use of which is discouraged, especially when dealing with structs and dynamic types like arrays.

Consider using `encodeCall` instead of `encodeWithSelector` to ensure type safety, and providing the parameters required by the `fillV3Relay` function separately. In addition, consider explicitly making the `SpokePool` contract inherit from the `IDestinationSettler` interface as required by the `ERC-7683` standard.

***Update:** Resolved in [pull request #744](https://github.com/across-protocol/contracts/pull/744) at commit [9f54455](https://github.com/across-protocol/contracts/pull/744/commits/9f5445571a98f13248a21acba3ac3fe40c737abd).*
