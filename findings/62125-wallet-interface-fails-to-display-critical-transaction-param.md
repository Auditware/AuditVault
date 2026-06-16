---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - severity/high
  - sector/wallet
protocol: "[[Gemini]]"
auditors:
  - "[[Coriolan Pinhas Trail of Bits PUBLIC]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-08-gemini-smartwallet-securityreview.pdf"
genome:
  - "[[unbounded-loop]]"
  - "[[permanent]]"
  - "[[frontrun-exposure]]"
---
# Wallet interface fails to display critical transaction parameters for user veriﬁcation

- id: 62125
- impact: HIGH
- protocol: [[Gemini]] Smart Wallet
- reporter: Coriolan Pinhas Trail of Bits PUBLIC (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-08-gemini-smartwallet-securityreview.pdf

## Summary


The report discusses a bug in the wallet interface that prevents users from seeing important transaction details before signing. This can make it difficult for users to verify the transaction and leaves them vulnerable to malicious attacks. The report recommends implementing a comprehensive display of transaction parameters and adding validation and warning features in the long term to help users identify potentially harmful transactions.

## Details

## Diﬃculty: Medium

## Type: Data Validation

## Description
The wallet interface does not display critical transaction parameters, including `data`, `gas limit`, `maxFeePerGas`, `maxPriorityFeePerGas`, and `nonce`, preventing users from manually verifying complete transaction details before signing. Users can see only basic information like `recipient address` and `amount`, but lack visibility into essential transaction mechanics that could indicate malicious behavior or allow for proper transaction verification. This represents a significant security gap compared to established wallets like MetaMask, which display all these parameters for user review.

**Figure 5.1:** Gemini wallet validation window (left) compared to Metamask (right)

## Exploit Scenario
A malicious dapp presents what appears to be a simple ETH transfer to the user, showing only the recipient address and amount in the wallet interface. However, the transaction includes a hidden data payload that contains smart contract function calls. Since the wallet does not display the transaction data field, the user believes they are making a simple ETH transfer and approves the transaction. The hidden data payload executes additional malicious actions beyond the apparent ETH transfer, potentially compromising the user’s entire wallet.

## Recommendations
**Short term:** Implement a comprehensive transaction parameter display in the wallet approval interface to show `data`, `gas limit`, `maxFeePerGas`, `maxPriorityFeePerGas`, and `nonce` fields matching industry standards.

**Long term:** Add transaction parameter validation and warnings for unusual values (such as extremely high gas limits or fees) to help users identify potentially malicious transactions before signing.
