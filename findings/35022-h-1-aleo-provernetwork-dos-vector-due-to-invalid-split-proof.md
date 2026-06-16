---
tags:
  - lang/rust
  - platform/sherlock
  - has/github
  - severity/high
  - sector/lending
  - sector/privacy
  - sector/zk
protocol: "[[ALEO]]"
auditors:
  - "[[DTheo]]"
report: "https://github.com/sherlock-audit/2024-05-aleo-judging"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[circuit-dos-invalid-proof]]"
---
# H-1: [[ALEO]] prover/network DOS vector due to invalid `split` proofs being free to abuse

- id: 35022
- impact: HIGH
- protocol: ALEO
- reporter: dtheo (Sherlock)
- source: N/A

## Summary


This bug report discusses a vulnerability in the Aleo network that allows for malicious actors to disrupt the network by using invalid proofs in split transactions. These transactions do not require a fee commitment, making it easy for attackers to waste CPU cycles and slow down or stop the creation of new blocks. The impact of this bug is significant, as it can be used to DOS Aleo provers and disrupt the network. The code snippet and tool used for this report are provided, and the recommendation is to require a fee commitment outside of the split transaction to prevent this vulnerability. The discussion section invites a response from the developer to share their thoughts on the issue.

## Details

Source: https://github.com/sherlock-audit/2024-05-aleo-judging/issues/34 

## Found by 
dtheo
## Summary

Split transactions that contain only 1 transition (the entire transaction is a single `split` transaction and nothing else) do not require a fee commitment. This allows for a malicious entity to grieve provers by forcing them to attempt and verify invalid proofs with no monetary loss. This can be used by competing provers to DOS their competition and waste CPU cycles that would otherwise be used towards the "mining/proving" the next block. A malicious actor attack multiple provers can significantly slow or stop aleo blocks from being created.

## Vulnerability Detail

Aleo has `fee`, `deploy` and `execute` transaction types. If a `deploy` or an `execute` transaction type is broadcasted with an invalid proof or if the `finalize` fails then their corresponding `fee` transaction will be consumed instead. This is a DOS prevention feature that Aleo uses to prevent the network from having to verify proofs without some amount of collateral fee on the side.

Single split transactions, when called by users directly, are [a special case where the there is no fee commitment required](https://github.com/sherlock-audit/2024-05-aleo/blob/main/snarkVM/synthesizer/src/vm/verify.rs#L225-L248). Aleo attempts to charge the fee directly in the split function by burning it. The issue is that if there is not sufficient funds to pay the fee and the proof fails then their is no backup fee commitment to seize. This opens up the Aleo network to a DOS vector that that is nearly free to abuse. 

An attacker must only pay the initial fees to make a large number of private records with at least 1 microcredit each. As long as they only use each credit once per block , they can reuse the records to to make invalid proofs that will pass all of the transaction prechecks in `check_fee`, `check_transaction`, etc. until the [proof verification is attempted](https://github.com/sherlock-audit/2024-05-aleo/blob/main/snarkVM/synthesizer/process/src/trace/mod.rs#L226-L227) and CPU cycles are wasted.

## Impact

This can be used to DOS Aleo provers by other provers competing to solve the Aleo Coinbase Puzzle (and gain rewards). If a malicious entity attacked all provers at the same time the Aleo network would stop producing blocks during this time. 

## Code Snippet
[snarkVM/synthesizer/src/vm/verify.rs#L225-L248](https://github.com/sherlock-audit/2024-05-aleo/blob/main/snarkVM/synthesizer/src/vm/verify.rs#L225-L248)

[snarkVM/synthesizer/program/src/resources/credits.aleo#L947-L972)](https://github.com/sherlock-audit/2024-05-aleo/blob/main/snarkVM/synthesizer/program/src/resources/credits.aleo#L947-L972)

## Tool used

Manual Review

## Recommendation

Require a fee commitment outside of the split transaction than can be verified quickly in the transaction precheck/speculation flow. 



## Discussion

**sammy-tm**

@evanmarshall 

Can you tell us your thoughts about this issue?
