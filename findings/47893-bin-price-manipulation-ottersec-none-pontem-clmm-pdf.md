---
tags:
  - lang/move
  - sector/dex
  - sector/lending
  - platform/ottersec
  - has/poc
  - severity/high
  - impact/data-corruption/price-manipulation
  - trigger/flash-loan
  - trigger/price-manipulation
  - precondition/flash-loan-available
protocol: "[[Pontem (Liquidswap)]]"
auditors:
  - "[[Michał Bochnak]]"
report: "https://pontem.network/"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[flash-loan]]"
  - "[[trigger/price-manipulation]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
  - "[[oracle-manipulation-resistance]]"
---
# Bin Price Manipulation

- id: 47893
- impact: HIGH
- protocol: [[Pontem Clmm]]
- reporter: Michał Bochnak (OtterSec)
- source: https://pontem.network/

## Summary


This bug report discusses a vulnerability in a CLMM (Constant Product Automated Market Maker) system where a malicious user can manipulate the price of shares in a specific bin. This manipulation can result in artificially high share prices, making it difficult for other users to add liquidity and potentially monopolizing the bin. The user can profit by burning the last share in the manipulated bin. The report includes a proof of concept code and recommends implementing safeguards and checks to prevent this type of manipulation. The issue has been fixed in the latest patch.

## Details

## CLMM Vulnerability Overview

In this CLMM, there are multiple bins, each having its price range where users may add liquidity. This vulnerability allows a malicious user to manipulate the price of shares in a specific bin within the CLMM. This manipulation may be exploited to artificially inflate the price of shares in that bin to extremely high values, creating unfavorable conditions for other participants and potentially blocking or monopolizing that bin. The user may profit by burning the last share in the manipulated bin.

The user achieves this via flash loan payments, abusing this feature to perform swaps in a specific way to cause the price of shares in that bin to increase dramatically.

## Negative Consequences of High Share Price

This high share price may have several negative consequences:

- It may make it very difficult for other users to add liquidity to that specific bin because the price is now much higher than expected.
- If other users attempt to add liquidity to this manipulated bin, they may need to deposit a large amount of the other asset (asset Y) to match the inflated share price. This may be financially impractical for them.
- The bin with the manipulated share price effectively becomes unattractive for other users, creating a liquidity provider monopoly for the malicious user in that bin.

## Proof of Concept

1. We start with an initial state:
   - (a) The pool has no liquidity.
   - (b) Active bin: `ACTIVE_BIN_ID`.
   - (c) Price: `2.719640856168128406`.
2. The user adds liquidity to the bin: `ACTIVE_BIN_ID + 3000`, providing minimal possible value i.e., `1X`.
3. The user burns `53` tokens.
4. The user performs the flash loan attack to increase the one share price and make it impossible/harder for other users to add liquidity to this bin. The added token is `X`, as its price is pumped.
5. The pool is either blocked or users must drain the bin by performing swaps, which is highly unprofitable.
6. The user may burn the last share and profit.

Please find the proof-of-concept code in this section.

## Remediation

Implement safeguards and checks to prevent the artificial inflation of share prices within bins. Additionally, measures may be implemented to ensure fair and competitive conditions for liquidity providers and traders.

## Patch

Fixed in `55438a9`.
