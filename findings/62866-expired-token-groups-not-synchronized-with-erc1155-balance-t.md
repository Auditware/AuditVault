---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - severity/high
  - sector/nft
protocol: "[[Radius Technology]]"
auditors:
  - "[[Quan Nguyen Trail of Bits PUBLIC]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-10-radiustechnology-evmauth-securityreview.pdf"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[timestamp-dependence]]"
---
# Expired token groups not synchronized with ERC1155 balance tracking

- id: 62866
- impact: HIGH
- protocol: [[Radius Technology]] EVMAuth
- reporter: Quan Nguyen Trail of Bits PUBLIC (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-10-radiustechnology-evmauth-securityreview.pdf

## Summary


This bug report discusses a problem with the *pruneGroups* function in a custom group tracking system. When tokens expire, the function correctly removes them from the group tracking system but does not update the underlying ERC1155 balance tracking. This means that expired tokens can still be transferred, creating a data inconsistency. The report recommends modifying the function to call the parent contract's burn function and implementing comprehensive unit tests to prevent this issue in the future.

## Details

## Diﬃculty: Low

## Type: Data Validation

## Description
The *pruneGroups* function removes expired token groups from the custom group tracking system but fails to update the underlying ERC1155 balance tracking. This creates a data inconsistency where expired tokens can still be transferred despite being removed from the expiration tracking system. 

The contract maintains two separate balance tracking systems: the standard ERC1155 *balances* mapping and a custom *group* array system for expiration management. When tokens expire, the *pruneGroups* function correctly removes expired groups from the *group* array and emits an `ExpiredTokensBurned` event, but it does not call the parent contract's burn function to update the ERC1155 balance tracking. This means that the underlying ERC1155 balance remains unchanged, allowing expired tokens to be transferred to other addresses.

### Function
```solidity
function _pruneGroups(address account, uint256 id) internal {
    Group[] storage groups = _group[account][id];
    uint256 _now = block.timestamp;
    // Shift valid groups to the front of the array
    uint256 index = 0;
    uint256 expiredAmount = 0;
    for (uint256 i = 0; i < groups.length; i++) {
        bool isValid = groups[i].balance > 0 && groups[i].expiresAt > _now;
        if (isValid) {
            if (i != index) {
                groups[index] = groups[i];
            }
            index++;
        } else {
            expiredAmount += groups[i].balance;
        }
    }
    // Remove invalid groups from the end of the array
    while (groups.length > index) {
        groups.pop();
    }
    // If any expired groups were removed, emit an event with the total amount of expired tokens
    if (expiredAmount > 0) {
        emit ExpiredTokensBurned(account, id, expiredAmount);
    }
}
```
*Figure 2.1: ERC1155 balance is not updated in _pruneGroups function*

## Exploit Scenario
Alice has 100 authentication tokens with a 60-second expiration time. After the tokens expire, the *pruneGroups* function correctly removes the expired token groups, but the underlying ERC1155 balance tracking still shows 100 tokens. Alice can then transfer 50 of these “expired” tokens to Bob. After the transfer, both Alice and Bob have 50 tokens in their ERC1155 balance, but the group tracking system shows 0 tokens for both accounts.

## Recommendations
- **Short term:** Modify the *pruneGroups* function to call the parent contract’s burn function when expired tokens are detected, ensuring that both balance tracking systems remain synchronized.
- **Long term:** Implement comprehensive unit tests that cover all token operations with various expiration scenarios, including edge cases where tokens expire during transfers, and ensure that both balance tracking systems remain consistent throughout all operations.
