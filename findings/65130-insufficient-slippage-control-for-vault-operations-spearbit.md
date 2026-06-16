---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/governance
  - sector/lending
  - sector/options
  - sector/vault
protocol: "[[Aragon]]"
auditors:
  - "[[Joran Honig]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Aragon-Generic-Money-Spearbit-Security-Review-November-2025.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[fot-slippage]]"
---
# Insufficient slippage control for vault operations

- id: 65130
- impact: HIGH
- protocol: [[Aragon]] Generic Money
- reporter: Joran Honig (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Aragon-Generic-Money-Spearbit-Security-Review-November-2025.pdf

## Summary


This bug report discusses a high-risk issue in the RebalancingManager code, specifically in lines 99-111 and 128-161. The problem is that the code does not take into account the possibility of changes in asset values, which can lead to slippage. This can happen when using the ERC4626 standard, which does not guarantee that asset values will always increase. This can affect both user operations (deposits and withdrawals) and privileged operations (such as rebalancing assets between vaults). The report recommends restricting strategies to only those with increasing asset values. Aragon and Cantina Managed have acknowledged the issue and will work on addressing it.

## Details

## Severity: High Risk

**Context:** 
- RebalancingManager.sol#L99-L111
- RebalancingManager.sol#L128-L161

**Description:**  
Various aspects of the protocol effect a change in the amount of assets deployed in a strategy without accounting for slippage. The ERC4626 standard, while often used with an assumption of monotonically increasing share prices, does not guarantee that this is the case. A good example would be a vault/strategy that deposits assets in Curve's 3pool. In such cases, the protocol should account for the fact that operations that change the allocated collateral are potentially vulnerable to slippage. This affects both user operations (deposits and withdrawals) and privileged operations such as those used to rebalance assets between vaults.

**Recommendation:**  
The simplest option is to restrict the underlying strategies such that we can assume there would only be monotonically increasing share prices. The design space for completely autonomous implementation of deposits and withdrawals from a multi-vault protocol is large, and suggesting any particular solution is out of scope for this audit.

**Aragon:** Acknowledged. Protocol governance is responsible for managing available strategies and will restrict them to only those with monotonically increasing share prices.

**Cantina Managed:** Acknowledged.
