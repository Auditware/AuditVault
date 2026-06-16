---
tags:
  - lang/solidity
  - has/github
  - severity/high
  - sector/bridge
protocol: "[[Across]]"
auditors:
  - OpenZeppelin
report: "https://blog.openzeppelin.com/across-audit"
genome:
  - "[[access-roles]]"
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[add-access-control]]"
  - "[[variant]]"
  - "[[cross-protocol]]"
  - "[[admin-is-honest]]"
---
# Missing Access Control for setDestinationSettler

- id: 56758
- impact: HIGH
- protocol: Across Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/across-audit

## Summary


The report discusses a bug found in the `ERC7683OrderDepositorExternal` contract, specifically in the `setDestinationSettler` function. This function allows for the mapping of chain IDs to their respective settler contract addresses. However, the issue is that there is no access control in place for this function, meaning that any account can change the `destinationSettler` address to a malicious one. This could lead to a malicious user stealing funds from the `filler` on the `destinationChain`. To fix this, the report suggests adding an `onlyOwner` modifier to the `setDestinationSettler` function, as the contract already inherits the `Ownable` contract. This issue has been resolved in a recent pull request.

## Details

The `ERC7683OrderDepositorExternal` contract contains the `setDestinationSettler` [function](https://github.com/across-protocol/contracts/blob/108be77c29a3861c64bdf66209ac6735a6a87090/contracts/erc7683/ERC7683OrderDepositorExternal.sol#L38-L42) which provides a mapping of chain ID to that chain's settler contract address. This value is accessed through the [`_destinationSettler`](https://github.com/across-protocol/contracts/blob/108be77c29a3861c64bdf66209ac6735a6a87090/contracts/erc7683/ERC7683OrderDepositorExternal.sol#L80-L82) function of the same contract and is used by the inherited `ERC7683OrderDepositor` contract when constructing the [fill instructions](https://github.com/across-protocol/contracts/blob/108be77c29a3861c64bdf66209ac6735a6a87090/contracts/erc7683/ERC7683OrderDepositor.sol#L216) inside the [`_resolveFor`](https://github.com/across-protocol/contracts/blob/108be77c29a3861c64bdf66209ac6735a6a87090/contracts/erc7683/ERC7683OrderDepositor.sol#L161) function.

The issue is that the `setDestinationSettler` function has [no access control](https://github.com/across-protocol/contracts/blob/108be77c29a3861c64bdf66209ac6735a6a87090/contracts/erc7683/ERC7683OrderDepositorExternal.sol#L38-L42) and can be changed to any arbitrary address by any account. Consequently, a malicious user could set the `destinationSettler` address to a malicious address which is used in constructing the fill instructions. The filler on the `destinationChain` would need to give token approvals to the `destinationSettler` to execute the `fill` call. A malicious `destinationSettler` would be thus able to steal funds from the `filler`.

Since the `ERC7683OrderDepositorExternal` contract already [inherits](https://github.com/across-protocol/contracts/blob/108be77c29a3861c64bdf66209ac6735a6a87090/contracts/erc7683/ERC7683OrderDepositorExternal.sol#L16) the `Ownable` contract, consider adding the `onlyOwner` modifier to its `setDestinationSettler` function.

***Update:** Resolved in [pull request #733](https://github.com/across-protocol/contracts/pull/733) at commit [8942780](https://github.com/across-protocol/contracts/pull/733/commits/8942780d8db73eee0f07ab62625d13f5faae3ad3).*
