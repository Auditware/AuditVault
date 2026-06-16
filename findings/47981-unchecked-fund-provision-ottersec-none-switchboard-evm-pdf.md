---
tags:
  - lang/solidity
  - platform/ottersec
  - severity/high
  - sector/oracle
protocol: "[[Switchboard]]"
auditors:
  - "[[Woosun Song]]"
report: "https://switchboard.xyz/"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[oracle-freshness]]"
---
# Unchecked Fund Provision

- id: 47981
- impact: HIGH
- protocol: Switchboard_evm
- reporter: Woosun Song (OtterSec)
- source: https://[[Switchboard]].xyz/

## Summary


The bug is in a function called SbFunction.forward, which allows external calls with user-provided values without checking if there is enough money in the contract. This means that an attacker could steal all the money from the contract by sending a transaction with the same amount of money as the contract's balance. The code that needs to be fixed is in the SbFunction.sol file and the fix has been implemented in a specific version. To fix this issue, the code needs to be changed to disallow the transfer of funds through this function by setting the call value to zero. This has already been fixed in a specific version of the code.

## Details

## SbFunction.forward Vulnerability

`SbFunction.forward` allows external calls with user-provided `msg.values` without checking if sufficient funds are provided. An attacker may steal all Ether from the contract by forging a transaction with a value equal to the diamond balance.

## Code Reference

```solidity
// contracts/src/Switchboard/sbFunction/SbFunction.sol
function forward(
    TransactionLib.Transaction[] memory transactions,
    bytes[] memory signatures
) external guarded(257) {
    // Just run the functions and verify the signatures
    for (uint256 i = 0; i < transactions.length; i++) {
        TransactionLib.Transaction memory transaction = transactions[i];
        /* ... */
        // EIP2771: call the function with the encoded data and the from address
        (bool success, bytes memory returnData) = transaction.to.call{
            value: transaction.value
        }(abi.encodePacked(transaction.data, transaction.from));
    }
}
```

## Remediation

Disallow transfer of funds through `forward` by setting the call value to zero.

## Patch

Fixed in commit `e833e48`.
