---
tags:
  - lang/solidity
  - sector/stable
  - sector/token
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
protocol: "[[Otim Smart Wallet]]"
auditors:
  - Quan Nguyen
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-03-otim-smart-wallet-securityreview.pdf"
genome:
  - "[[dos-resistance]]"
  - "[[frozen-funds]]"
  - "[[variant]]"
---
# ERC-20 tokens cannot be withdrawn from Treasury contract

- id: 57056
- impact: HIGH
- protocol: Otim Smart Wallet
- reporter: Quan Nguyen (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-03-otim-smart-wallet-securityreview.pdf

## Summary


This report discusses a bug in the Treasury contract of the Otim protocol. The bug prevents users from withdrawing ERC-20 tokens from the Treasury contract, resulting in permanent loss of these tokens. This bug can cause financial losses for the protocol. The report recommends adding a function to withdraw ERC-20 tokens in the short term and developing test cases and reviewing fund flows in the long term to improve system security.

## Details

## Diﬃculty: Low

## Type: Undeﬁned Behavior

## Description
The Treasury contract currently lacks functionality for withdrawing ERC-20 tokens; any such tokens sent to the treasury would be permanently locked in the contract. The Otim protocol allows users to pay fees with either native ETH or any ERC-20 token registered by Otim. These fees are directed to the Treasury contract.

```solidity
function withdraw(address target, uint256 value) external onlyOwner {
    // check the target is not the zero address
    if (target == address(0)) {
        revert InvalidTarget();
    }

    // check the contract has enough balance to withdraw
    if (value > address(this).balance) {
        revert InsufficientBalance();
    }

    // withdraw the funds
    (bool success, bytes memory result) = target.call{value: value}("");
    
    // check if the withdrawal was successful
    if (!success) {
        revert WithdrawalFailed(result);
    }
}
```
*Figure 4.1: The withdraw function in Treasury.sol*

However, the Treasury contract currently supports only ETH withdrawals via the withdraw function; it lacks a function for withdrawing ERC-20 tokens.

## Exploit Scenario
The Otim protocol accepts USDC as a fee token; these fees accumulate in the Treasury contract over time. When the protocol team attempts to access these funds, they discover that there is no mechanism to withdraw ERC-20 tokens from the treasury. The USDC becomes permanently locked in the contract, resulting in financial losses for the protocol.

## Recommendations
- Short term: Add a function to withdraw ERC-20 tokens from the Treasury contract.
- Long term: Develop test cases specifically for token recovery scenarios. In addition, review how funds flow between users and components and document these flows comprehensively to improve system security.
