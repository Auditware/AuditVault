---
tags:
  - lang/solidity
  - platform/ottersec
  - has/poc
  - severity/high
  - sector/vault
protocol: "[[Abacus]]"
auditors:
  - "[[Robert Chen]]"
report: "https://abacus.wtf/"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[debt-accrual-update]]"
---
# Vault’s transferFrom is not Transferring Locked Ether . . . . .

- id: 48700
- impact: HIGH
- protocol: [[Abacus]]
- reporter: Robert Chen (OtterSec)
- source: https://abacus.wtf/

## Summary


The Vault contract has a bug in the transferFrom function where it only transfers positions and not the underlying ethLocked amount. This is because the totalTransferRequested variable is not being computed and always equals zero. This can be reproduced by following the steps of a user purchasing positions and then transferring them to another user, which leaves the ethLocked value unchanged for the original user and at zero for the recipient. To fix this, the totalTransferRequested variable needs to be calculated based on the positions being transferred. This bug has been patched in the latest version of the contract.

## Details

## Vault Contract Overview

In the Vault contract, the `transferFrom` function is used to transfer a position from one user to another user. However, the function only transfers positions, not the underlying `ethLocked` amount. There is an existing variable named `totalTransferRequested` used to store the ETH amount to transfer from sender to recipient, but this value is not actually computed (always equals zero).

## Code Snippet

```solidity
contracts/Vault.sol
traderFrom.comListOfTickets = _tempComTickets;
traderFrom.comAmountPerTicket = _tempComAmounts;
traderFrom.ethLocked -= totalTransferRequested * 0.001 ether / 100;
createNewPosition(
    from,
    to,
    totalTransferRequested * 0.001 ether / 1e18,
    _listOfTickets,
    _amountPerTicket
);
```

## Proof of Concept

To reproduce the issue, follow the steps below:

1. User A purchases positions.
2. User A transfers some positions to User B.
3. User A still has their `ethLocked` value unchanged.
4. For User B, the value of `ethLocked` is 0.

Only the positions are transferred, leaving `ethLocked` equal to zero. This will prevent the recipient from making adjustments, as some ETH is subtracted from `ethLocked` in the `internalAdjustment` function.

## Remediation

Calculate the equivalent `ethLocked` to transfer (`totalTransferRequested`) based on the positions being transferred.

## Patch

The `transferFrom` function was modified to transfer the entire trader profile to the new user. Fixed in commit `56e1ef8`.

© 2022 OtterSec LLC. All Rights Reserved.  
Abacus Audit 04 | Vulnerabilities
