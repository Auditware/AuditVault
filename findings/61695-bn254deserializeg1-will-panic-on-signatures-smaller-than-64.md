---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/infra
  - sector/restaking
protocol: "[[EigenDA]]"
auditors:
  - "[[DTheo]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Eigenlayer-Spearbit-vCISO-February-2025.pdf"
genome:
  - "[[griefing]]"
  - "[[temporary]]"
  - "[[dos-resistance]]"
---
# bn254.DeserializeG1() will panic on signatures smaller than 64 bytes allowing multiple service

- id: 61695
- impact: HIGH
- protocol: [[EigenDA]] vCISO
- reporter: DTheo (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Eigenlayer-Spearbit-vCISO-February-2025.pdf

## Summary


The report describes a bug in the code that can cause the program to crash. This bug can be triggered by receiving a small amount of data from an external request. The bug is located in the `bn254.DeserializeG1()` function and can be reached through multiple external requests, including one from a DA node's response to a `StoreChunks` request. The bug occurs because there is no check for the length of the data received, and the program will panic if the data is less than 64 bytes. This can cause the program to crash and should be fixed by either sanitizing incoming data or adding a length check in the `bn254` deserialization methods. 

## Details

## DOS

**Severity:** Critical Risk  
**Context:** core/bn254/attestation.go#L111-L113  

**Description:**  
`bn254.DeserializeG1()` will panic if it receives a byte slice smaller than 64 bytes. This function is reachable with data from multiple external requests, most notably from a DA node's response to the disperser's `StoreChunks` request. When the disperser enters its dispersal flow, it will eventually make a `StoreChunks` request to each DA node.

```go
func (c *dispatcher) sendChunks(ctx context.Context, blobs []*core.BlobMessage, header *core.BatchHeader, op *core.IndexedOperatorInfo) (*core.Signature, error) {
    conn, err := grpc.Dial(
        core.OperatorSocket(op.Socket).GetDispersalSocket(),
        grpc.WithTransportCredentials(insecure.NewCredentials()),
    )
    // ...
    // ...
    // ...
    reply, err := gc.StoreChunks(ctx, request, opt)
    if err != nil {
        return nil, err
    }
    sigBytes := reply.GetSignature()
    sig := &core.Signature{G1Point: new(core.Signature).Deserialize(sigBytes)}
    return sig, nil
}
```

There is no length check in the reply's signature, so `sigBytes` can be any size from 0 to 64MBs. `G1Point.Deserialize()` will call `bn254utils.DeserializeG1()` with whatever data is returned from the DA node.

```go
func (p *G1Point) Deserialize(data []byte) *G1Point {
    return &G1Point{bn254utils.DeserializeG1(data)}
}
```

The following byte slice indexing in the `SetBytes()` arguments will panic if the signature is less than 64 bytes long:

```go
func DeserializeG1(b []byte) *bn254.G1Affine {
    p := new(bn254.G1Affine)
    p.X.SetBytes(b[0:32])
    p.Y.SetBytes(b[32:64])
    return p
}
```

This will bring down the sequencer.

**Recommendation:**  
Sanitize incoming signatures or provide a length check in your `bn254` deserialization methods.
