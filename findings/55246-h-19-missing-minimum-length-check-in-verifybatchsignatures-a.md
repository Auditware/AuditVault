---
tags:
  - sector/staking
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - lang/solidity
  - lang/rust
protocol: "[[SEDA Protocol]]"
auditors:
  - dod4ufn
report: "https://github.com/sherlock-audit/2024-12-seda-protocol-judging"
genome:
  - "[[bridge-message-validation]]"
  - "[[variant]]"
---
# H-19: Missing Minimum Length Check in verifyBatchSignatures Allows Chain Halting Attack

- id: 55246
- impact: HIGH
- protocol: SEDA Protocol
- reporter: dod4ufn (Sherlock)
- source: N/A

## Summary


This bug report discusses a critical issue found by a group of individuals in the SEDA protocol. The issue involves missing validation of the minimum length of vote extensions, which can lead to a chain-halting attack by a malicious validator. The root cause of the issue is due to a lack of verification of the minimum required length before attempting to slice the first 65 bytes from the extension. This can cause a panic and halt the entire blockchain network. The impact of this vulnerability is a complete service interruption and it can be exploited by a malicious validator to bring down other validators. The protocol team has fixed this issue in their recent PRs/commits. No proof of concept or mitigation strategy has been provided in the report. 

## Details

Source: https://github.com/sherlock-audit/2024-12-seda-protocol-judging/issues/273 

## Found by 
0xHammad, 0xNirix, dod4ufn, g

### Summary

Missing validation of minimum vote extension length will cause a chain-halting panic for all network participants as a malicious validator will submit a vote extension smaller than 65 bytes, triggering a slice out-of-bounds panic during consensus.

### Root Cause


In `verifyBatchSignatures` method at https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/app/abci/handlers.go#L383 , the function checks for maximum length of vote extensions but fails to verify the minimum required length of 65 bytes before attempting to slice the first 65 bytes from the extension:

```go
// Only checks maximum length
if len(voteExtension) > MaxVoteExtensionLength {
    h.logger.Error("invalid vote extension length", "len", len(voteExtension))
    return ErrInvalidVoteExtensionLength
}

// This line will panic if voteExtension has fewer than 65 bytes
sigPubKey, err := crypto.Ecrecover(batchID, voteExtension[:65])
```


### Internal Pre-conditions

NA

### External Pre-conditions

NA

### Attack Path

1. A malicious validator creates an invalid vote extension with fewer than 65 bytes
2. The validator submits this malformed vote extension during the consensus process
3. When `verifyBatchSignatures` is called during either `VerifyVoteExtensionHandler` or `ProcessProposalHandler`, it attempts to access `voteExtension[:65]`
4. This causes a slice out-of-bounds panic because the slice doesn't have 65 elements
5. The panic can halt the entire chain

### Impact

The entire blockchain network suffers a complete service interruption. This is a critical denial-of-service vulnerability that a malicious validator can use to bring down all other validators.


### PoC

_No response_

### Mitigation

_No response_

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/sedaprotocol/seda-chain/pull/516
