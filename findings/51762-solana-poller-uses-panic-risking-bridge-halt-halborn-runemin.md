---
tags:
  - lang/solidity
  - severity/high
  - platform/halborn
  - sector/bridge
protocol: "[[Off-chain Bridge]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/RuneMine/off-chain-bridge-full-re-assessment"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[bridge-message-validation]]"
---
# Solana Poller Uses Panic, Risking Bridge Halt

- id: 51762
- impact: HIGH
- protocol: Off-chain (Bridge) Full Re-Assessment
- reporter: Halborn
- source: https://www.halborn.com/audits/RuneMine/off-chain-bridge-full-re-assessment

## Summary


The Solana poller currently uses panic for error handling in multiple places, which can cause the entire bridge process to stop working if a single error occurs. This is due to the use of a function that panics on error, direct use of panic, and lack of a panic recovery mechanism. This can lead to goroutine leaks and partial system failure. The RuneMine team has accepted the risk of this issue.

## Details

##### Description

The current implementation of the Solana poller uses panic for error handling in several places. This approach can cause the entire bridge process to halt when a single error occurs.  
  
Problematic Code Example  
  
1. In the poll function:  
  
  
`util.Check(err) // This function panics on error`  
  
2. Direct use of panic:  
  
  
`if fee < 50000000 {  
panic(fmt.Sprintf("sol fee paid to small to cover transaction cost: %d", fee))  
}`  
  
  
3. In utility functions:  
  
  
`func Check(err error) {  
if err != nil {  
panic(err)  
}  
}`

##### BVSS

[AO:A/AC:L/AX:L/C:N/I:N/A:M/D:M/Y:N/R:N/S:C (7.8)](/bvss?q=AO:A/AC:L/AX:L/C:N/I:N/A:M/D:M/Y:N/R:N/S:C)

##### Recommendation

There's no visible panic recovery mechanism in the main function to catch panics from goroutines. This could lead to goroutine leaks and partial system failure.

##### Remediation

**RISK ACCEPTED:** The **RuneMine team** accepted the risk of the issue.
