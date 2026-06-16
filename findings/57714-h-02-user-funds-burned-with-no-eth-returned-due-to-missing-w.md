---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/staking
protocol: "[[Mystic Finance]]"
auditors:
  - Kann
report: "https://github.com/Kann-Audits/Kann-Audits/blob/main/reports/md-format/private-audits-reports/Mystic Finance.md"
genome:
  - "[[reward-accounting]]"
  - "[[logic/state-update]]"
  - "[[loss-of-funds/direct-drain]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/single-user]]"
---
# [H-02] User Funds Burned With No ETH Returned Due to Missing withdrawalRequests[msg.sender]Assignment After Unstake

- id: 57714
- impact: HIGH
- protocol: Mystic Finance
- reporter: Kann
- source: https://github.com/Kann-Audits/Kann-Audits/blob/main/reports/md-format/private-audits-reports/Mystic Finance.md

## Summary


The bug report describes a high severity issue related to the unstaking process. When a user initiates the unstaking process, the contract attempts to unstake from a validator. However, there is a problem with the fallback logic that handles the unstaking, which causes the contract to return the unstaked amount without saving it in a necessary mapping. This results in a critical failure in the withdrawal flow, meaning that users who unstake in this way will have their tokens burned without receiving any ETH in return. The withdraw function, which is meant to handle withdrawals, relies on the mapping that is not being saved, leading to a loss of user funds with no way to recover them. The team has since fixed the issue.

## Details

## Severity

High

## Description

The unstaking process is executed in two steps:
The user initiates unstake().
If currentWithheldETH is insufficient, the contract attempts to unstake from the Plume validator.
However, during the fallback logic that handles validator unstaking, the contract returns amountUnstaked without saving it in the withdrawalRequests[msg.sender] mapping. This causes a critical failure in the withdrawal flow.
Users who unstake in this path will have their frxETH tokens burned but will receive no ETH in return because
no withdrawalRequest is saved.
The withdraw() function depends on withdrawalRequests[msg.sender] being populated.

This effectively results in loss of user funds with no means of recovery through the intended withdraw
flow.

## Team Response

Fixed.
