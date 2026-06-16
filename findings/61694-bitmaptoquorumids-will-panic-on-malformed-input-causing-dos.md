---
tags:
  - lang/solidity
  - sector/governance
  - sector/infra
  - sector/restaking
  - platform/spearbit
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[EigenDA]]"
auditors:
  - "[[DTheo]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Eigenlayer-Spearbit-vCISO-February-2025.pdf"
genome:
  - "[[underflow]]"
  - "[[temporary]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
---
# BitmapToQuorumIds() will panic on malformed input causing DOS in multiple services

- id: 61694
- impact: HIGH
- protocol: [[EigenDA]] vCISO
- reporter: DTheo (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Eigenlayer-Spearbit-vCISO-February-2025.pdf

## Summary


This bug report discusses a critical risk issue found in the code for handling transactions. The issue is similar to one previously found and can cause a panic when given a specific input. The panic occurs due to an underflow when a certain function is called. This can be exploited by crafting a malicious input, which can be done through deserialization from protobuf or a specific library. The recommendation is to either handle the situation with a `recover()` function or to add an explicit check to prevent this from happening.

## Details

## Severity: Critical Risk

## Context
core/eth/tx.go#L783

## Description
This is a similar issue to the one found in `bitmapToBytesArray()`. `BitmapToQuorumIds()` will panic: underflow when given `-0` as the `big.Int` to return a bitmap for. This happens when `bitmap.Bit()` is called:

```go
func BitmapToQuorumIds(bitmap *big.Int) []core.QuorumID {
    quorumIds := make([]core.QuorumID, 0, maxNumberOfQuorums)
    for i := 0; i < maxNumberOfQuorums; i++ {
        // This call to bitmap.Bit() will panic when bitmap == -0 and i == 1
        if bitmap.Bit(i) == 1 {
            quorumIds = append(quorumIds, core.QuorumID(i))
        }
    }
    return quorumIds
}
```

The panic happens in `/usr/local/go/src/math/big/nat.go` in `(z nat) sub()`. The issue here is that there is no way to create a valid `-0` `big.Int` in regular practice, but deserialization from protobuf or `github.com/ethereum/go-ethereum/accounts/abi.ConvertType()` takes in raw byte data and assigns values to underlying struct fields. This allows someone to craft a malicious `Big.Int` like this:

```go
// here is what a big.Int looks like in its struct definition
type Int struct {
    neg bool // sign
    abs nat  // absolute value of the integer
}

// here is a malicious big.Int that is set to -0
// an attacker would have to make special code to set these
// fields directly before sending or would need to send
// a raw byte array with this payload
var malicious_bitmap big.Int
bitmap.neg = true
bitmap.abs = 0
// this call would trigger the panic: underflow
bitmap.bit(1)
```

## Recommendation
There is no way to check the subfields directly since they are private, so it is best to either add `recover()` handlers to handle this situation or add an explicit check like this:

```go
// it is impossible for a big int to be less than 0 AND greater than -1
if bitmap.Cmp(big.NewInt(0)) == -1 && bitmap.Cmp(big.NewInt(-1)) == 1 {
    fmt.Println("Invalid bitmap")
    // error in some way
}
```
