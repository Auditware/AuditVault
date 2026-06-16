---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/vault
protocol: "[[Superform]]"
auditors:
  - "[[MiloTruck]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Superform-v2-periphery-Spearbit-Security-Review-June-2025.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# Fee handling locks fees in SuperVaultAggregator

- id: 63078
- impact: HIGH
- protocol: [[Superform]] v2 Periphery
- reporter: MiloTruck (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Superform-v2-periphery-Spearbit-Security-Review-June-2025.pdf

## Summary


The report discusses a bug in the SuperVaultAggregator contract, specifically in the `depositUpkeep` function. This function is responsible for transferring upkeep fees into the contract and recording a balance for the strategist. However, when the `forwardPPS` function is called, the balance may be reduced if the caller is not exempt. This results in an inconsistency in the strategist's balance and there is no mechanism for a fee recipient to claim the fees from the contract. The recommendation is to update the contract's global accounting and implement access control for a claiming function for fee recipients.

## Details

## High Risk Report

## Severity
**Severity:** High Risk

## Context
**Context:** SuperVaultAggregator.sol#L904

## Description
Upkeep fees are transferred into the SuperVaultAggregator using the `depositUpkeep` function. The function records a balance for the strategist `_strategistUpkeepBalance[strategist]`. When `forwardPPS` is called, the balance may be reduced if the caller is not exempt. The strategist-level accounting is updated, but there is no transfer of funds out of the contract or a global accounting update to allow a fee recipient to pull the fees out of the SuperVaultAggregator.

## Recommendation
Update global accounting to record how many up tokens a fee recipient may claim, and implement access control for a claiming function for them to call.
