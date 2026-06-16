---
tags:
  - lang/solidity
  - sector/dex
  - sector/staking
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - novelty/variant
protocol: "[[Primitive]]"
auditors:
  - "[[Simone Monica]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/Primitive.pdf"
genome:
  - "[[unchecked-return-value]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[vote-delegation-loop]]"
---
# Transfer operations may silently fail due to the lack of contract existence checks

- id: 18260
- impact: HIGH
- protocol: [[Primitive]]
- reporter: Simone Monica (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/Primitive.pdf

## Summary


This bug report describes an issue with the pool failing to check the existence of a contract before performing transfers. As a result, the pool may assume that failed transactions involving destroyed tokens or tokens that have not yet been deployed were successful. The bug is caused by the use of low-level calls to perform transfers without confirming the contract's existence. The Solidity documentation includes a warning about the necessity of executing existence checks before performing low-level calls.

The exploit scenario involves Bob swapping 1,000 B tokens for A tokens, successfully transferring 1,000 B tokens to the pool but not receiving any A tokens in return. As a result, Bob loses 1,000 B tokens.

To fix the issue in the short term, a contract existence check should be implemented before the low-level calls in Transfer.safeTransfer, TransferHelper.safeTransfer, and TransferHelper.safeTransferFrom. This will ensure that a swap will revert if the token to be bought no longer exists, preventing the pool from accepting the token to be sold without returning any tokens in exchange.

In the long term, it is advised to avoid implementing low-level calls. If such calls are unavoidable, the Solidity documentation should be carefully reviewed, particularly the “Warnings” section, before implementing them to ensure that they are implemented correctly.

## Details

## Security Assessment Report

## Difficulty: Low

## Type: Patching

## Target
- `rmm-core/contracts/libraries/Transfers.sol`
- `rmm-manager/contracts/libraries/TransferHelper.sol`

## Description
The pool fails to check that a contract exists before performing transfers. As a result, the pool may assume that failed transactions involving destroyed tokens or tokens that have not yet been deployed were successful.

`Transfers.safeTransfer`, `TransferHelper.safeTransfer`, and `TransferHelper.safeTransferFrom` use low-level calls to perform transfers without confirming the contract’s existence:

```solidity
internal {
    bool success, bytes memory returnData = address(token).call(
        abi.encodeWithSelector(token.transfer.selector, to, value)
    );
    require(success && (returnData.length == 0 || abi.decode(returnData, (bool))), "Transfer fail");
}
```
*Figure 1.1: rmm-core/contracts/libraries/Transfers.sol#16-21*

The Solidity documentation includes the following warning:

> The low-level functions call, delegatecall, and staticcall return true as their first return value if the account called is non-existent, as part of the design of the EVM. Account existence must be checked prior to calling if needed.

*Figure 1.2: The Solidity documentation details the necessity of executing existence checks before performing low-level calls.*

Therefore, if the tokens to be transferred have not yet been deployed or have been destroyed, `safeTransfer` and `safeTransferFrom` will return success even though the transfer was not executed.

## Exploit Scenario
The pool contains two tokens: A and B. The A token has a bug, and the contract is destroyed. Bob is not aware of the issue and swaps 1,000 B tokens for A tokens. Bob successfully transfers 1,000 B tokens to the pool but does not receive any A tokens in return. As a result, Bob loses 1,000 B tokens.

## Recommendations
- **Short term:** Implement a contract existence check before the low-level calls in `Transfer.safeTransfer`, `TransferHelper.safeTransfer`, and `TransferHelper.safeTransferFrom`. This will ensure that a swap will revert if the token to be bought no longer exists, preventing the pool from accepting the token to be sold without returning any tokens in exchange.
  
- **Long term:** Avoid implementing low-level calls. If such calls are unavoidable, carefully review the Solidity documentation, particularly the “Warnings” section, before implementing them to ensure that they are implemented correctly.

*Trail of Bits*  
*Primitive Security Assessment*  
*PUBLIC*
