---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - impact/loss-of-funds/locked-funds
  - trigger/time-based/timelock-expiry
  - sector/escrow
protocol: "[[OpenBazaar]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/openbazaars-escrow-audit/"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[timelock-expiry]]"
  - "[[timelock-timestamp-bypass]]"
---
# Buyers can lock funds indefinitely

- id: 11899
- impact: HIGH
- protocol: [[OpenBazaar]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/openbazaars-escrow-audit/

## Summary


This bug report is about the OpenBazaar smart contracts, specifically the Escrow_v1_0 contract. This contract is used for transactions between buyers and sellers. One of the fields of the Transaction struct is the timeoutHours, which is used to set a timeout after which a seller can execute the transaction without the need for the buyer’s or the moderator’s signatures. The seller does this by calling the execute function, which calls the verifyTransaction function, which finally calls the isTimeLockExpired function. This last function verifies that the time elapsed since the last modification of the transaction is greater than the transaction’s time lock. 

However, a malicious buyer can prevent a transaction from being executed by periodically updating it by adding tiny amounts of Ether or tokens to its value. This will reset the lastModified field of the transaction, thus preventing it from ever reaching the time lock. If the transaction requires only two signatures, a seller can appeal to the moderator to execute it. If the transaction requires three signatures, however, the funds will be effectively locked until the buyer ceases to update it.

The bug report suggests keeping track of and limiting the number of times a transaction can be modified in order to prevent the indefinite locking of funds by buyers.

## Details

Transactions in the [`Escrow_v1_0`](https://github.com/OpenBazaar/smart-contracts/blob/c4f02cdd41cb85d28bba637a01f20a8ee8bb04bd/contracts/escrow/Escrow_v1_0.sol) contract are described by the [`Transaction struct`](https://github.com/OpenBazaar/smart-contracts/blob/c4f02cdd41cb85d28bba637a01f20a8ee8bb04bd/contracts/escrow/Escrow_v1_0.sol#L37). Among its fields, [`timeoutHours`](https://github.com/OpenBazaar/smart-contracts/blob/c4f02cdd41cb85d28bba637a01f20a8ee8bb04bd/contracts/escrow/Escrow_v1_0.sol#L44) is used to set a timeout after which a seller can execute the transaction without the need for the buyer’s or the moderator’s signatures. In order to do this, the seller calls the [`execute`](https://github.com/OpenBazaar/smart-contracts/blob/c4f02cdd41cb85d28bba637a01f20a8ee8bb04bd/contracts/escrow/Escrow_v1_0.sol#L324) function, which itself calls [`verifyTransaction`](https://github.com/OpenBazaar/smart-contracts/blob/c4f02cdd41cb85d28bba637a01f20a8ee8bb04bd/contracts/escrow/Escrow_v1_0.sol#L416), which finally calls [`isTimeLockExpired`](https://github.com/OpenBazaar/smart-contracts/blob/c4f02cdd41cb85d28bba637a01f20a8ee8bb04bd/contracts/escrow/Escrow_v1_0.sol#L552). This last function verifies that the time elapsed since the last modification of the transaction, tracked by the [`lastModified`](https://github.com/OpenBazaar/smart-contracts/blob/c4f02cdd41cb85d28bba637a01f20a8ee8bb04bd/contracts/escrow/Escrow_v1_0.sol#L40) field in the `Transaction struct`, is greater than the transaction’s time lock.


A malicious buyer trying to prevent a transaction from being executed can periodically update it by adding tiny amounts of Ether or tokens to its value through the [`addFundsToTransaction`](https://github.com/OpenBazaar/smart-contracts/blob/c4f02cdd41cb85d28bba637a01f20a8ee8bb04bd/contracts/escrow/Escrow_v1_0.sol#L261) or [`addTokensToTransaction`](https://github.com/OpenBazaar/smart-contracts/blob/c4f02cdd41cb85d28bba637a01f20a8ee8bb04bd/contracts/escrow/Escrow_v1_0.sol#L295) functions respectively. These calls will [reset the](https://github.com/OpenBazaar/smart-contracts/blob/c4f02cdd41cb85d28bba637a01f20a8ee8bb04bd/contracts/escrow/Escrow_v1_0.sol#L261) [`lastModified`](https://github.com/OpenBazaar/smart-contracts/blob/c4f02cdd41cb85d28bba637a01f20a8ee8bb04bd/contracts/escrow/Escrow_v1_0.sol#L261) field of the transaction, thus preventing it from ever reaching the time lock. If the transaction requires only two signatures, a seller can appeal to the moderator to execute it. If the transaction requires three signatures, however, the funds will be effectively locked until the buyer ceases to update it.


Consider keeping track of, and limiting, the number of times a transaction can be modified in order to prevent the indefinite locking of funds by buyers.
