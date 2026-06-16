---
tags:
  - lang/anchor
  - lang/rust
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - sector/rwa
protocol: "[[Reserve Protocol Solana DTFs]]"
auditors:
  - Samuel Moelius
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-04-reserve-solana-dtfs-securityreview.pdf"
genome:
  - "[[cpi-program-id-validation]]"
  - "[[missing-seeds-check]]"
  - "[[variant]]"
  - "[[add-check]]"
---
# Trade instructions do not require a dtf_pogram_signer account

- id: 55594
- impact: HIGH
- protocol: Reserve Protocol Solana DTFs
- reporter: Samuel Moelius (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-04-reserve-solana-dtfs-securityreview.pdf

## Summary


The report describes a bug in the Solana implementation where an attacker could pretend to be the dtfs program and call trade instructions without the required account. This could lead to unauthorized trades being approved. The report recommends requiring a dtf_program_signer account in each trade instruction to prevent this exploit. In the long term, the report suggests leaning towards requiring this account for any new instructions added to the Solana implementation.

## Details

## Difficulty: Low

## Type: Undefined Behavior

## Description
The Solana implementation uses a `dtf_program_signer` account (figure 6.1) to prove that the dtfs program is calling the folio program. However, none of the trade instructions require this account. An attacker could call folio program trade instructions while pretending to be the dtfs program.

```rust
3    /// PDA Seeds ["dtf_program_signer"]
4    #[account]
5    #[derive(Default, InitSpace)]
6    pub struct DtfProgramSigner {
7        pub bump: u8,
8    }
```
*Figure 6.1: Definition of the DtfProgramSigner struct*  
*(dtfs-solana/programs/dtfs/src/state.rs#3–8)*

## Exploit Scenario
Alice approves a trade that Mallory does not want to occur. Just after the trade begins, Mallory pretends to be the dtfs program and calls `kill_trade` to end the trade.

## Recommendations
- **Short term:** Require a `dtf_program_signer` account in each trade instruction. This will make it more difficult for an attacker to pretend to be the dtfs program and call trade instructions.
- **Long term:** If new instructions must be added to the Solana implementation, lean toward requiring a `dtf_program_signer` account. Aside from initialization and certain administrative instructions, it is difficult to imagine a folio instruction that should not be called from the dtfs program.
