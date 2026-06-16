---
tags:
  - blockchain/evm
  - blockchain/evm/mantle
  - lang/solidity
  - sector/infra
  - sector/staking
  - platform/sigmaprime
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Mantle]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/reports/mantle/review.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
  - "[[merkle-tree-overflow]]"
---
# No Mechanism To Flag Sequencer Fraud

- id: 19465
- impact: HIGH
- protocol: [[Mantle]] Network
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/reports/mantle/review.pdf

## Summary


This bug report is related to Mantle L2 Rollup. There is a feature in Mantle L2 that is intended to allow a challenger to flag a data storage submission by the sequencer that is invalid. However, this feature currently only checks for the inclusion of a dummy string and cannot be used to flag sequencer fraud. This means that a sequencer can submit an invalid transaction or invalid state transition data to the Eigen Data Availability nodes with no repercussions. To resolve this issue, the fraud prooﬁng system needs to be fully implemented and tested prior to decentralising the sequencer role on Mantle. The development team has acknowledged this issue and implemented a solution at PR-1138. For the Merkle Tree implementation, the out-of-bounds error encountered when processing sets with a large number of elements exceeding 131,072 is resolved by assigning 0x00 value instead of default values to padded leafs. Additionally, this will also eliminate out-of-bounds panics. Lastly, the bug report also mentions that elected TSS nodes can avoid slashing by having insufficient deposits.

## Details

## Description

Note, while Mantle are aware of this and have intentionally structured the code as such, it was deemed important to comment on a feature that will eventually need to be enabled in Mantle L2.

There are currently no means of challenging a bad input from a sequencer into the Eigen Data Availability layer. The `BVM_EigenDataLayrChain` contract contains a function `proveFraud()` that is intended to be used by any challenger to flag a data storage submission by the sequencer that is invalid. However, this currently only checks for the inclusion of a dummy string and cannot be used to flag sequencer fraud.

While the sequencer is currently a centralised role controlled by Mantle, this role will be decentralised at a later date. If the fraud proving system is not implemented, it will be possible for a sequencer to submit an invalid transaction or invalid state transition data to the Eigen Data Availability nodes with no negative repercussions. As an optimistic rollup, Mantle relies on the ability to flag incorrect state transitions to deliver the security of the Mantle network.

## Recommendations

The fraud proofing system needs to be fully implemented and tested prior to decentralising the sequencer role on Mantle.

## Resolution

The issue has been acknowledged by the development team with the comment:

>This is an EigenDA feature. The onchain proof of custody (DA fraud proof) won’t be enabled upon launch. We have the `fraud_proof_string` as a placeholder for later when we enable it. Without proof of custody, we use `dl-retriever` to detect if data is effective, and `dl-dispeser` to detect if a DA node is live. If `da-retriever` detects data is ineffective, the record will be logged on L1 smart contract `recordSlash`, and a new data batch will be submitted to replace the previous data. A DA node will be removed from the network if it repeats to fail the detects.

---

## MNT-03 Default Values & Out-of-Bounds Panics In Merkle Tree Implementation

**Asset:** tss/common/merkle_tree.go  
**Status:** Resolved: See Resolution  
**Rating:** Severity: High | Impact: High | Likelihood: Medium

## Description

The Merkle Tree implementation encounters an out-of-bounds error when processing sets with a large number of elements exceeding 131,072. Additionally, the utilization of default hashes to fill odd-sized trees allows for the default values to then be used to successfully pass verification.

From `tss/common/merkle_tree.go` line [72]:

```go
if rowSizeIsOdd {
    leftSibling = elements[rowSize-1]
    bz, _ := hexutil.Decode(defaults[depth]) // @audit, this should be assigned 0x00 instead of a default value, otherwise default values will pass as valid. Also it will panic with out-of-bounds error for large arrays as `len(defaults) == 16`.
    copy(buf[0:32], leftSibling[:])
    copy(buf[32:64], bz)
    elements[halfRowSize] = crypto.Keccak256Hash(buf)
}
```

## Recommendations

Instead of assigning default values to padded leafs, assign `0x00` value. This would also eliminate out-of-bounds panics, which root cause is an insufficient number of default values to use.

## Resolution

The issue has been addressed at PR-1138. Development team has also advised:

> We use defaults in `tss/common/merkle_tree.go` to be consistent with `Lib_MerkleTree.sol`, so that the same stateroots can produce the same Merkle root.
