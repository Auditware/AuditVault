---
tags:
  - lang/move
  - sector/stable
  - platform/ottersec
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Juiced]]"
auditors:
  - "[[Harrison Green]]"
report: "https://juiced.fi/"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[account-discriminator-check]]"
---
# Mango-exclusive instructions accept Mercurial strategies

- id: 48718
- impact: HIGH
- protocol: [[Juiced]]
- reporter: Harrison Green (OtterSec)
- source: https://juiced.fi/

## Summary


This bug report discusses a vulnerability in the Juiced Audit 04 protocol. The bug allows an attacker to withdraw 20,000 pool tokens and receive 13,330 USDC, resulting in a net profit of 3,330 USDC. The suggested solution is to explicitly require the strategy to be either BtcMangoFunding or SolMangoFunding in the deposit and withdraw instructions, and BtcMangoMercurial or SolMangoMercurial in the deposit_mercurial and withdraw_mercurial instructions. The bug has been fixed in issue #579.

## Details

## Juiced Audit 04 | Vulnerabilities

2. The attacker invokes `withdraw_mercurial` and burns 20,000 pool tokens. The protocol calculates the notional value to be 19,995 USDC. This corresponds with 30,000 pool tokens, so it transfers ≈ 13,330 USDC to the attacker.  
   The attacker’s net profit is ≈ 3,330 USDC.

## Remediation
In the deposit and withdraw instructions, explicitly require the strategy to be `BtcMangoFunding` or `SolMangoFunding`. In the `deposit_mercurial` and `withdraw_mercurial` instructions, explicitly require the strategy to be `BtcMangoMercurial` or `SolMangoMercurial`.

## Patch
Fixed in #579.

© 2022 OtterSec LLC. All Rights Reserved. 12 / 23
