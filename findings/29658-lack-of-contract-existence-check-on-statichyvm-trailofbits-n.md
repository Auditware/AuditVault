---
tags:
  - lang/solidity
  - sector/staking
  - platform/trailofbits
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Mass]]"
auditors:
  - "[[Richie Humphrey]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2023-06-nestedfinance-tetrishyvm-securityreview.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[vote-delegation-loop]]"
---
# Lack of contract existence check on StaticHyVM

- id: 29658
- impact: HIGH
- protocol: [[Mass]] - PRs review
- reporter: Richie Humphrey (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2023-06-nestedfinance-tetrishyvm-securityreview.pdf

## Summary


The StaticHyVM contract has a bug where it does not check if the hyvm contract has code before making a call to it. This means that even if the hyvm contract has been destroyed, the call will still succeed. This could potentially lead to incorrect actions being taken by a bot that relies on the call to StaticHyVM. The Solidity documentation warns about this behavior and recommends checking for contract existence before making a call. It is recommended to implement this check in the short term and to carefully review the documentation for any other potential issues in the long term. 

## Details

## Diﬃculty: Low

## Type: Conﬁguration

## Description
The call to `delegatecall` made in the `StaticHyVM` contract does not check that the `hyvm` contract has code; this call will succeed even if the `hyvm` contract was destroyed. The `doDelegateCall` function uses a low-level call to `delegatecall` to call `hyvm`:

```solidity
function doDelegateCall(bytes calldata payload) public returns (bytes memory) {
    if (msg.sender != address(this)) revert OnlySelf();
    (bool success, bytes memory data) = hyvm.delegatecall(payload);
    if (!success) _bubbleError(data, "StaticHyVM: delegatecall failed");
    return data;
}
```

_The above code is from StaticHyVM/StaticHyVM.sol#L30-L36._

The Solidity documentation includes the following warning:

> The low-level functions `call`, `delegatecall`, and `staticcall` return true as their first return value if the account called is non-existent, as part of the design of the EVM. Account existence must be checked prior to calling if needed.

_A snippet of the Solidity documentation detailing unexpected behavior related to `delegatecall`._

As a result, any call made to a nonexistent contract will return success, even if no code was executed. 

We acknowledge that the likelihood that the `hyvm` contract will be destroyed is low; however, the previous audit that we conducted on the Nested Finance codebases determined that this risk is not null. (Refer to finding TOB-NESTED-1 of the previous report.)

## Exploit Scenario
Bob creates a bot that takes actions following the execution of `StaticHyVM`. A bug is found in `hyvm`, and the contract is destroyed. However, all of the calls made to `StaticHyVM` continue to return success, leading Bob’s bot to take incorrect actions.

## Recommendations
- **Short term**: Implement a contract existence check before the call to `delegatecall` in `StaticHyVM`.
- **Long term**: Carefully review the Solidity documentation, especially the “Warnings” section. Document every assumption made for code optimizations, and ensure that the underlying invariants hold. For example, if an invariant states that all of the contracts that are used exist, extra care must be taken to ensure that all calls’ destinations always have code.
