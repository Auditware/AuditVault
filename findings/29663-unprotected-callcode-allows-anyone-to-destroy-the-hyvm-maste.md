---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - sector/dex
  - sector/lending
  - sector/staking
protocol: "[[Mass]]"
auditors:
  - "[[Gustavo Grieco]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2023-02-nestedfinance-smartcontracts-securityreview.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# Unprotected callcode allows anyone to destroy the HyVM master contact

- id: 29663
- impact: HIGH
- protocol: [[Mass]]
- reporter: Gustavo Grieco (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2023-02-nestedfinance-smartcontracts-securityreview.pdf

## Summary


The report describes a bug in the HyVM contract that allows anyone to destroy the contract by executing the callcode opcode. This opcode has no restrictions and can be used to call a controlled address and execute selfdestruct, leading to the destruction of the HyVM contract. This issue is more severe when combined with another issue, as it can also affect Nested wallets that use delegatecall to call HyVM. An exploit scenario is also described, where a user's position is liquidated due to the destruction of the HyVM contract. The report recommends removing the callcode opcode in the short term and carefully reviewing all opcodes used in HyVM in the long term. 

## Details

## Diﬃculty: High

## Type: Data Validation

### Description
The HyVM contract allows unrestricted access to execute the `callcode` opcode, allowing anyone to destroy the contract. The HyVM is a virtual machine that simulates EVM execution. The opcodes to be executed are passed through the transaction’s calldata. Among other EVM opcodes, the HyVM contract allows the execution of `callcode`:

```
op_callcode:
    // takes
    // fix argsOffset
    swap3
    FIX_MEMOFFSET()
    swap3
    // fix retOffset
    swap5
    FIX_MEMOFFSET()
    retSize]
    swap5
    retSize]
    // check can call
    CHECK_CALLCODE()
    retSize]
    // [gas, address, value, argsOffset, argsSize, retOffset, retSize]
    // [argsOffset, address, value, gas, argsSize, retOffset, retSize]
    // [hyvmArgsOffset, address, value, gas, argsSize, retOffset, retSize]
    // [gas, address, value, hyvmArgsOffset, argsSize, retOffset, retSize]
    // [retOffset, address, value, hyvmArgsOffset, argsSize, gas, retSize]
    // [hyvmRetOffset, address, value, hyvmArgsOffset, argsSize, gas,
    // [gas, address, value, hyvmArgsOffset, argsSize, hyvmRetOffset,
    // [gas, address, value, hyvmArgsOffset, argsSize, hyvmRetOffset,
    callcode
    CONTINUE()
    // [success]
```
_Figure 1.1: HyVM.huff#L682-L698_

This opcode has no restriction. Therefore, anyone can execute `callcode` to a controlled address and execute `selfdestruct` to destroy the HyVM contract. Combined with issue TOB-NESTED-2, the impact of this issue is more severe: if HyVM is destroyed and Nested wallets use `delegatecall` to call HyVM, those calls will return success but will not execute any code. Note that the `delegatecall` opcode has the same risk, but this opcode is not executable through a direct call to HyVM.

### Exploit Scenario
Bob uses a Nested wallet for his portfolio. Bob has a $10 million position that is close to being liquidated. Eve notices the situation and calls `selfdestruct` through the `callcode` opcode to destroy the HyVM contract. Bob tries to add liquidity through the execution of a HyVM payload; his transactions succeed, but no code is executed. As a result, Bob’s position is liquidated.

### Recommendations
- **Short term:** Remove the `callcode` opcode and document the removal. The `callcode` opcode is deprecated and generally considered unsafe.  
- **Long term:** Carefully review the EVM yellow paper and be aware of the semantics of every opcode. Document every opcode used in HyVM and justify their presence.
