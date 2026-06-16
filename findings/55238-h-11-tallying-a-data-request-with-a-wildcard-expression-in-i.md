---
tags:
  - severity/high
  - has/github
  - has/poc
  - sector/staking
  - platform/sherlock
  - lang/solidity
  - lang/rust
protocol: "[[SEDA Protocol]]"
auditors:
  - g
report: "https://github.com/sherlock-audit/2024-12-seda-protocol-judging"
genome:
  - "[[dos-resistance]]"
  - "[[logic/wrong-condition]]"
  - "[[dos/permanent]]"
  - "[[known-pattern]]"
  - "[[specific-state]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# H-11: Tallying a Data Request with a wildcard expression in its consensus filter will store non-deterministic data and cause a chain halt

- id: 55238
- impact: HIGH
- protocol: SEDA Protocol
- reporter: g (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue with the Tally module in the SEDA protocol. The problem occurs when a Data Request with a wildcard expression in its consensus filter is tallied, resulting in non-deterministic data being stored. This can cause a chain halt due to state divergence across validators. The root cause of the issue is that the system expects deterministic ordering of the results, but a wildcard expression can produce results in a non-deterministic order. A malicious user can exploit this by posting multiple valid Data Requests with a wildcard expression, causing a chain halt. The impact of this bug is a consensus failure and a chain halt. The protocol team has fixed this issue by sorting the results before getting the first element. 

## Details

Source: https://github.com/sherlock-audit/2024-12-seda-protocol-judging/issues/245 

## Found by 
g

### Summary

In Tally module's `EndBlock()`, all tallying Data Requests will be [processed](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/tally/keeper/endblock.go#L40). Each Data Request can have a [Consensus Filter](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/tally/keeper/endblock.go#L200), which will be [applied](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/tally/keeper/filter.go#L77) to every reveal object in the Data Request. 

When the filter type is [`FilterStdDev`](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/tally/types/filters.go#L190-L193) or [`FilterMode`](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/tally/types/filters.go#L80-L93), the consensus filter will be applied. The filter is treated as a path expression for querying data from a JSON object. One of the supported path expressions is the wildcard expression, which gets all the elements in the JSON object, but the results have a non-deterministic order. Due to this non-deterministic order, validators will [get different](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/tally/types/filters_util.go#L58-L61) `dataList`, `freq`, and `maxFreq`. This leads to a state divergence that will cause consensus failures, and ultimately, a chain halt.

### Root Cause

In [`filters_util.go:36-51`](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/tally/types/filters_util.go#L36-L51), any path expression is accepted and it expects that the results
will have a deterministic ordering. Only the 0th-index of `elems` is accessed.

```golang
    obj, err := parser.Parse(revealBytes)
    if err != nil {
      errors[i] = true
      continue
    }
    expr, err := jp.ParseString(dataPath)
    if err != nil {
      errors[i] = true
      continue
    }
    // @audit the path exression is applied here to query elements from the reveal JSON object
    elems := expr.GetNodes(obj)
    if len(elems) < 1 {
      errors[i] = true
      continue
    }
    // @audit only the first element is returned as data
    data := elems[0].String()
```

Below is an example of a wildcard expression used to query a JSON object.

```pseudocode
JSON: {"a": 1, "b": 2, "c": 3}
Expression: "$.*"
Results could be: [1,2,3] or [2,1,3] or [3,1,2] etc.
```

The [results](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/tally/keeper/filter.go#L77) of applying the filter will be in the form of `outliers` and `consensus`, which are a `[]bool` and `bool`. 

```golang
outliers, consensus := filter.ApplyFilter(reveals, res.Errors)
```

`outliers` and `consensus` can be different values for different validators. These values affect the output data results, which
will be [stored](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/tally/keeper/endblock.go#L109-L141).

```golang
    _, tallyResults[i] = k.FilterAndTally(ctx, req, params, gasMeter)
    // @audit the Result, ExitCode, and Consensus can be different across validators because of the non-deterministic
    // results of applying the filter
    dataResults[i].Result = tallyResults[i].Result
    dataResults[i].ExitCode = tallyResults[i].ExitCode
    dataResults[i].Consensus = tallyResults[i].Consensus
    // ... snip ...
  }

  processedReqs[req.ID] = k.DistributionsFromGasMeter(ctx, req.ID, req.Height, gasMeter, params.BurnRatio)

  dataResults[i].GasUsed = gasMeter.TotalGasUsed()
  dataResults[i].Id, err = dataResults[i].TryHash()
  // ... snip ...

// Store the data results for batching.
for i := range dataResults {
  // @audit the data results are stored, but since the data will be different across validators, there will be
  // state divergence.
  err := k.batchingKeeper.SetDataResultForBatching(ctx, dataResults[i])
```

### Internal Pre-conditions
None


### External Pre-conditions
None


### Attack Path

A malicious user can abuse this.
1. A malicious user can post multiple valid Data Requests with a wildcard expression `$.*` as consensus filter.
2. Once the valid Data Requests are in "Tallying Status", the Tally module will process them and store their corresponding
Data Results for batching. Every validator here will store different values for their data results.
3. There will be a Chain Halt because there will be no consensus on the state root across validators.


### Impact

Chain halt due to state divergence across validators.

### PoC
None


### Mitigation
Consider always sorting the [result](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/tally/types/filters_util.go#L46) of `expr.GetNodes(obj)` before getting the first element as the result.

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/sedaprotocol/seda-chain/pull/525
