---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - sector/staking
protocol: "[[Yield Basis]]"
auditors:
  - "[[Natalie Chin]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/YieldV2.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[vote-delegation-loop]]"
---
# Use of delegatecall in a payable function inside a loop

- id: 16976
- impact: HIGH
- protocol: [[Yield V2]]
- reporter: Natalie Chin (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/YieldV2.pdf

## Summary


This bug report is about a potential exploit in the Ladle contract, which uses the delegatecall proxy pattern and a payable function within a loop. This means that each delegatecall within the loop will retain the msg.value of the transaction. If a future version or refactor of the core protocol introduced a more meaningful use of the msg.value, it could be exploited to tamper with the system arithmetic.

The exploit scenario is that an attacker, Eve, uses the batching functionality to increase her ETH balance without actually sending funds from her account, thereby stealing funds from the system.

The recommendation is to document the risks associated with the use of msg.value and detail the security implications of all functions in both the documentation and the code to ensure that potential attack vectors do not become exploitable when code is refactored or added.

## Details

## Diﬃculty: High

## Type: Data Validation

## Description
The Ladle contract uses the delegatecall proxy pattern (which takes user-provided call data) in a payable function within a loop. This means that each delegatecall within the for loop will retain the `msg.value` of the transaction:

```solidity
/// @dev Allows batched call to self (this contract).
/// @param calls An array of inputs for each call.
function batch(bytes[] calldata calls) external payable returns(bytes[] memory results) {
    results = new bytes[](calls.length);
    for (uint256 i; i < calls.length; i++) {
        (bool success, bytes memory result) = address(this).delegatecall(calls[i]);
        if (!success) revert(RevertMsgExtractor.getRevertMsg(result));
        results[i] = result;
    }
    // build would have populated the cache, this deletes it
    cachedVaultId = bytes12(0);
}
```

_Figure 2.1: vault-v2/contracts/Ladle.sol#L186-L197_

The protocol does not currently use the `msg.value` in any meaningful way. However, if a future version or refactor of the core protocol introduced a more meaningful use of it, it could be exploited to tamper with the system arithmetic.

## Exploit Scenario
Alice, a member of the Yield team, adds a new functionality to the core protocol that adjusts users’ balances according to the `msg.value`. Eve, an attacker, uses the batching functionality to increase her ETH balance without actually sending funds from her account, thereby stealing funds from the system.

## Recommendations
**Short term:** Document the risks associated with the use of `msg.value` and ensure that all developers are aware of this potential attack vector.

**Long term:** Detail the security implications of all functions in both the documentation and the code to ensure that potential attack vectors do not become exploitable when code is refactored or added.

## References
- “Two Rights Might Make a Wrong,” Paradigm
