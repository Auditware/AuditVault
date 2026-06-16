---
tags:
  - lang/rust
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/infra
  - sector/oracle
protocol: "[[SEDA]]"
auditors:
  - "[[Boy2000]]"
  - "[[g]]"
  - "[[gxh191]]"
  - "[[tallo]]"
  - "[[zxriptor]]"
report: "https://github.com/sherlock-audit/2024-12-seda-protocol-judging"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[oracle-freshness]]"
---
# H-3: ExecuteTallyVM has a memory leak which will lead to nodes eventually crashing

- id: 55230
- impact: HIGH
- protocol: [[SEDA]] Protocol
- reporter: tallo (Sherlock)
- source: N/A

## Summary


The bug report discusses a memory leak in the `execute.go` file of the SEDA protocol, which can cause nodes to eventually crash. The leak is caused by a continuous allocation of memory without freeing it, leading to a depletion of resources over time. The root cause is identified as the `configDirC` C string not being freed in the `ExecuteTallyVm` function. This issue can only occur if the node is running and processing blocks, the `ExecuteTallyVm` function is called, and the `LogDir` global variable is set to a non-empty string path. The attack path involves the `EndBlock` function automatically calling `ProcessTallies`, which then calls `FilterAndTally` and ultimately executes `ExecuteTallyVm`. The impact of this bug is a continuous memory leak that can lead to degraded performance and potential crashes. To mitigate the issue, the suggested solution is to add a line to free the memory in the `ExecuteTallyVm` function. The protocol team has already fixed this issue in their recent PRs/commits.

## Details

Source: https://github.com/sherlock-audit/2024-12-seda-protocol-judging/issues/182 

## Found by 
Boy2000, g, gxh191, tallo, zxriptor

### Summary

The continuous memory allocation without freeing in `execute.go` will cause a memory leak for node operators as each block will lose a small amount of memory, eventually depleting the node's resources over extended operation periods.


### Root Cause


In `execute.go` the `configDirC` C string is allocated with `C.CString(LogDir)` but never freed with `C.free(unsafe.Pointer(configDirC))`, unlike all other C string allocations in the same function.

https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-wasm-vm/tallyvm/execute.go#L27

### Internal Pre-conditions

1. The SEDA node is running and processing blocks
2. The `ExecuteTallyVm` function is called from the `EndBlock` function
3. The `LogDir` global variable is set to a non-empty string path

### External Pre-conditions

None

### Attack Path

1. The Tally module's `EndBlock` function is called automatically at the end of each block
2. This calls `ProcessTallies` which processes data requests ready for tallying
3. For each tally operation, the `FilterAndTally` method is invoked
4. This ultimately executes the `ExecuteTallyVm` function in `execute.go`
5. Each execution allocates memory for `configDirC` without freeing it
6. The allocated memory accumulates over time as each block is processed
7. Eventually, after running for an extended period, the node will run out of memory

### Impact

The SEDA node operators suffer a continuous memory leak that will eventually lead to degraded performance and potential node crashes. The amount of memory leaked per block is equal to the length of the `LogDir` string plus 1 byte (for the null terminator).
For a typical path length of ~30 bytes, `/home/seda/.seda/tally-logs\00`, a default MaxTalliesPerBlock of 100, and an average of 20 data requests per block, this will add up to ~3gb of allocated memory that is leaked each year. Longer paths, more data requests per block will result in a faster leakage and result in an eventual crash for all systems. Systems with lower specs will crash sooner rather than later

### Mitigation

just like with all the other C.Cstring initializations in the function, add the line:
```go
defer C.free(unsafe.Pointer(configDirC)
```

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/sedaprotocol/seda-wasm-vm/pull/60
