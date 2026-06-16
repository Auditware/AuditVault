---
tags:
  - lang/move
  - sector/dex
  - platform/ottersec
  - severity/high
  - impact/data-corruption/price-manipulation
  - impact/mev/frontrun
  - trigger/price-manipulation
protocol: "[[Emojicoin]]"
auditors:
  - "[[Robert Chen]]"
report: "https://x.com/EconiaLabs"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[frontrun]]"
  - "[[trigger/price-manipulation]]"
  - "[[frontrun-exposure]]"
  - "[[oracle-manipulation-resistance]]"
---
# Frontrunning Matched Funds for Unfair Gains

- id: 53231
- impact: HIGH
- protocol: [[Emojicoin]]
- reporter: Robert Chen (OtterSec)
- source: https://x.com/EconiaLabs

## Summary


The report discusses a potential issue with the allocation of matched funds in the emojicoin arena module. This issue can arise due to the way matched amounts are distributed. An attacker can exploit this by creating multiple pools with small amounts, increasing their chances of being selected during the crank scheduling. They can then manipulate the price of their own token and buy into the pool to capture the matched funds. To prevent this, it is recommended to limit the number of pools a single address can create.

## Details

## Potential for Frontrunning in Matching Funds

There is potential for frontrunning when matching funds are allocated. This issue arises due to the way matched amounts are distributed. The emojicoin arena module features a mechanism where users may lock in a portion of their contribution to receive matched funds from the vault. 

An attacker may create a large number of pools with small amounts, increasing the likelihood that one of their pools is chosen during the crank scheduling. Before the crank selects a melee, the attacker may buy a large amount of their own token, driving up its price, inflating its value relative to other tokens in the pool. Consequently, if their pool is selected, they may then buy into the pool and swap out their tokens to capture the matched funds.

## Remediation

- Limit the number of pools a single address may create to prevent spamming the crank with attacker’s pools.
