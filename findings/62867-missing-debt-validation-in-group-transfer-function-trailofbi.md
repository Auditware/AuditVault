---
tags:
  - lang/solidity
  - sector/lending
  - sector/nft
  - sector/token
  - platform/trailofbits
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Radius Technology]]"
auditors:
  - "[[Quan Nguyen Trail of Bits PUBLIC]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-10-radiustechnology-evmauth-securityreview.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[variant]]"
  - "[[timestamp-dependence]]"
---
# Missing debt validation in group transfer function

- id: 62867
- impact: HIGH
- protocol: [[Radius Technology]] EVMAuth
- reporter: Quan Nguyen Trail of Bits PUBLIC (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-10-radiustechnology-evmauth-securityreview.pdf

## Summary


This bug report describes an issue with the `_transferGroups` function in an ERC1155 token contract. The function fails to properly account for expired tokens during transfers, leading to an inconsistency between the ERC1155 balance and the group array tracking. This means that a transfer may appear successful in the ERC1155 balance, but the group array will show incorrect data. The report suggests short-term and long-term solutions, including adding a check to verify the transfer was completed successfully and implementing comprehensive unit tests.

## Details

## Difficulty: Medium

## Type: Data Validation

## Description

The `_transferGroups` function fails to complete group transfers when expired tokens are present, creating an inconsistency between the ERC1155 balance tracking and the group array tracking. The function skips over expired token groups during transfer but does not verify that the transfer was completed successfully.

The `_transferGroups` function iterates through the sender’s token groups in the FIFO order to transfer the requested amount. However, it skips over expired token groups without accounting for them in the transfer calculation. When the loop completes, there is no verification that the debt variable has reached zero, meaning that the transfer may be incomplete. This creates a mismatch where the ERC1155 balance tracking correctly reflects the transfer, but the group arrays contain inconsistent data.

```solidity
function _transferGroups(address from, address to, uint256 id, uint256 amount)
internal {
    // Exit early if the transfer is to the same account or if the amount is zero
    if (from == to || amount == 0) return;
    Group[] storage groups = _group[from][id];
    uint256 _now = block.timestamp;
    uint256 debt = amount;

    // First pass: Reduce balances from sender's groups (FIFO order)
    for (uint256 i = 0; i < groups.length && debt > 0; i++) {
        // Skip token groups that are expired or have no balance
        if (groups[i].expiresAt <= _now || groups[i].balance == 0) {
            continue;
        }
        if (groups[i].balance > debt) {
            // Transfer partial token group
            _upsertGroup(to, id, debt, groups[i].expiresAt);
            groups[i].balance -= debt;
            debt = 0;
        } else {
            // Transfer entire token group
            _upsertGroup(to, id, groups[i].balance, groups[i].expiresAt);
            debt -= groups[i].balance;
            groups[i].balance = 0;
        }
    }

    // Clean up from account token groups that are expired or have zero balance
    _pruneGroups(from, id);
}
```

**Figure 3.1:** Missing debt validation in the `_transferGroups` function

## Exploit Scenario

Alice has five authentication tokens, including two expired tokens and three tokens that have not expired yet. Alice attempts to transfer four tokens to Bob. The ERC1155 balance tracking correctly updates to show Alice has one token and Bob has four tokens. However, the group transfer moves only three non-expired token groups from Alice to Bob, leaving the transfer incomplete. The group arrays now contain inconsistent data, where Alice’s group array shows fewer tokens than her ERC1155 balance, and Bob’s group array shows fewer tokens than his ERC1155 balance.

## Recommendations

- **Short term:** Add a check at the end of the `_transferGroups` function to verify that debt equals zero, ensuring that the transfer was completed successfully.
- **Long term:** Implement comprehensive unit tests that cover transfer scenarios with mixed valid and expired tokens, and consider redesigning the transfer logic to properly account for expired tokens during the transfer process.
