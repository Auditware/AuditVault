---
tags:
  - lang/solidity
  - sector/lending
  - sector/staking
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - novelty/variant
protocol: "[[Mass]]"
auditors:
  - "[[Gustavo Grieco]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2023-02-nestedfinance-smartcontracts-securityreview.pdf"
genome:
  - "[[griefing]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
  - "[[vote-delegation-loop]]"
---
# Lack of contract existence checks on low-level calls

- id: 29664
- impact: HIGH
- protocol: [[Mass]]
- reporter: Gustavo Grieco (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2023-02-nestedfinance-smartcontracts-securityreview.pdf

## Summary


This bug report discusses a medium difficulty issue related to data validation in the codebases of a project. Specifically, it points out that several low-level/assembly calls do not check if their destinations have code before executing, which can lead to unexpected behavior and vulnerabilities. The report provides examples of code that lack contract existence checks and mentions a warning in the Solidity documentation about this issue. It also describes an exploit scenario where this vulnerability could be used to destroy a contract and cause financial loss for users. The report concludes with recommendations for both short-term and long-term solutions, including implementing contract existence checks before every low-level call and carefully reviewing the Solidity documentation and code optimizations. 

## Details

## Diﬃculty: Medium

## Type: Data Validation

## Description

Several of the low-level/assembly calls made in the codebases do not check that their destinations have code; these calls will succeed even if their destinations have no code. For example, all the low-level calls in `Proxy.huff` lack contract existence checks:

```huff
#define macro MAIN() = takes (0) returns (0) {
    LOAD_IMPLEMENTATION_RESOLVER_CALLDATA()
    // [gas, implementationResolverAddress, argsOffset, argsSize, retOffset, retSize]
    staticcall
    // [success]
}
```
*Figure 2.1: Proxy.huff#L129-L131*

```huff
// Delegate the call to the implementation. retOffset and retSize are
// 0x00 because we don't know the size yet.
delegatecall
// [success]
```
*Figure 2.2: Proxy.huff#L148-L150*

`CallHelper.sol`’s `functionDelegateCallUnverified` function also lacks such a check:

```solidity
function functionDelegateCallUnverified(address target, bytes memory data)
    internal
    returns (bytes memory)
{
    (bool success, bytes memory returndata) = target.delegatecall(data);
    if (success) {
        return returndata;
    }
    _revert(returndata);
}
```
*Figure 2.3: CallHelper.sol#L53-L62*

The Solidity documentation includes the following warning:

> The low-level functions `call`, `delegatecall`, and `staticcall` return true as their first return value if the account called is non-existent, as part of the design of the EVM. Account existence must be checked prior to calling if needed.
 
*Figure 2.4: A snippet of the Solidity documentation detailing unexpected behavior related to delegatecall*

As a result, any call made to a nonexistent contract will return success, even if no code was executed.

Note that `functionDelegateCallUnverified`’s documentation states that this check is not needed:

```solidity
///
///
///
///
We do not use verifyCallResultFromTarget as the HyVM will
practically never return anything. In the context of tetris, we know
that the target will always be a contract. Hence, removing this
check allows to reduce gas consumption.
```
*Figure 2.5: CallHelper.sol#L46-L49*

However, the vulnerability highlighted in issue TOB-NESTED-1 indicates that this optimization is unsafe.

## Exploit Scenario

Bob uses a Nested wallet for his portfolio. Bob has a $10 million position that is close to being liquidated. Eve uses the vulnerability described in TOB-NESTED-1 to destroy the HyVM contract. Bob tries to add liquidity through the execution of a HyVM payload; his transactions succeed, but no code is executed. As a result, Bob’s position is liquidated.

## Recommendations

- **Short term**: Implement a contract existence check before every low-level call.
- **Long term**: Carefully review the Solidity documentation, especially the “Warnings” section. Document every assumption made for code optimizations, and ensure that the underlying invariants hold. For example, if an invariant is that all the contracts that are used exist, extra care must be taken to ensure that all calls’ destinations always have code.
