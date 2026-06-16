---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - sector/oracle
  - platform/spearbit
  - has/github
  - severity/high
  - impact/data-corruption/price-manipulation
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
  - impact/mev/sandwich
  - trigger/price-manipulation
  - trigger/sandwich-attack
protocol: "[[Aragon]]"
auditors:
  - "[[Joran Honig]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Aragon-Generic-Money-Spearbit-Security-Review-November-2025.pdf"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[sandwich]]"
  - "[[trigger/price-manipulation]]"
  - "[[defi/sandwich-attack]]"
  - "[[frontrun-exposure]]"
  - "[[oracle-manipulation-resistance]]"
---
# Vault price manipulation allows yield manager to mint tokens

- id: 65131
- impact: HIGH
- protocol: [[Aragon]] Generic Money
- reporter: Joran Honig (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Aragon-Generic-Money-Spearbit-Security-Review-November-2025.pdf

## Summary


The report highlights a high risk vulnerability in the YieldManager smart contract, specifically lines 51-61. The issue is related to the method for determining the current value of backing assets, which can be manipulated by an attacker. This can lead to the protocol mistakenly minting additional tokens, allowing the attacker to steal funds. The report suggests implementing measures such as limiting strategies and using an oracle to mitigate this vulnerability. The issue has been acknowledged by the Aragon team and the Cantina Managed team. 

## Details

## High Risk Vulnerability Report

## Severity
High Risk

## Context
YieldManager.sol#L51-L61

## Description
The yield manager can mint additional tokens whenever the value of the backing assets is higher than the total amount of shares. The method for determining the current value of backing assets relies on a call to the underlying `vault_additionalOwnedAssets()` function. However, the return value of this function is potentially manipulable.

Issue #1 describes a scenario which leverages this same property. 

Take for example a vault that deposits in Curve 3pool. In normal cases, `additionalOwnedAssets()` returns the correct value of the LP position that the vault holds. However, if an attacker manipulates the pool by selling a lot of the vault asset (increasing its balance in the pool), then the generic protocol will assume the vault's LP position is much more valuable.

If an attacker is able to manipulate the perceived amount of backing assets, then they're also able to make the protocol (temporarily) think it has more yield than the safety buffer. As a result, anyone could sandwich a `distributeYield` call to make the system erroneously mint shares. This includes the periphery manager who could front-run and update the yield distributor address, thereby stealing funds beyond the excess yield.

## Recommendation
One solution to this problem is to limit the vaults/strategies such that vaults have monotonically increasing share prices. Alternatively, you might leverage an oracle to get a true value of the surplus yield.

## Aragon
Acknowledged. The Yield Manager is a trusted role in the protocol. We limit the strategies to lending markets that satisfy the requirement of monotonically increasing share prices, though this is enforced via governance rather than in the code.

## Callout in docs
Diversification.

## Cantina Managed
Acknowledged.
