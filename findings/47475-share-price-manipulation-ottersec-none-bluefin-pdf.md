---
tags:
  - lang/solidity
  - sector/lending
  - platform/ottersec
  - severity/high
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
protocol: "[[BlueFin]]"
auditors:
  - "[[Robert Chen]]"
report: "https://bluefin.io/"
genome:
  - "[[rounding-direction]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[integer-bounds]]"
  - "[[oracle-manipulation-resistance]]"
---
# Share Price Manipulation

- id: 47475
- impact: HIGH
- protocol: [[BlueFin]]
- reporter: Robert Chen (OtterSec)
- source: https://bluefin.io/

## Summary


The bluefin_vault protocol has a vulnerability where it can be attacked by manipulating the token-to-share conversion rate and exploiting rounding errors. This is caused by how rounding decisions are made in the protocol, resulting in unintended consequences on share evaluation. Additionally, there is an irregularity in the share calculation condition, where if the vault_total_balance is zero and the vault_total_balance is non-zero, the entire share calculation is omitted. This can result in users depositing funds and ending up with zero shares, effectively losing their money. The recommended solution is to lock a certain amount of shares and tokens during initialization and to ensure that shares and amounts are non-zero in deposit and withdrawal transactions. The issue has been fixed by adding a minimum share value of 0.1 USD to the vault and asserting that shares and amounts are non-zero in deposit and withdrawal transactions. This report was created by Otter Audits LLC and all rights are reserved. 

## Details

## Vulnerability Report: Bluefin Vault

**Description:**  
Bluefin Vault is vulnerable to a general class of rounding attacks against lending protocols concerning the conversion rate between tokens and shares in a lending pool. The attack involves manipulating the share value (token-to-share conversion rate) and abusing rounding errors. The root cause relates to how rounding decisions are determined in the protocol when dealing with fixed precision, resulting in unintended consequences on share valuation.

Additionally, an irregularity exists in the shares calculation condition. In cases where, for some reason, the `vault_total_balance` is zero and `vault_total_balance` is non-zero, the program omits the entire shares calculation. Consequently, users depositing funds under this condition may end up with zero shares, resulting in the effective loss of their money. Similarly, the same outcome occurs if `vault_total_balance` is non-zero and `vault_total_balance` is zero.

## Remediation
- Lock some amount of shares and tokens on initialization and also ensure that shares and amount are non-zero in `deposit_to_vault` and `withdraw_from_vault` respectively.
- Moreover, rather than solely examining `vault_total_balance`, check both `vault_total_balance` and `vault.total_shares` to confirm that neither is zero.

## Patch
Fixed the share rounding issue in A73625 by adding minimum shares of 0.1 USD to the vault which are reduced from the depositor’s shares and will always stay in the vault. Additionally, `deposit_to_vault` and `withdraw_from_vault` assert that the shares and amount are non-zero in 9c2cb9d.

© 2024 Otter Audits LLC. All Rights Reserved. 10/18
