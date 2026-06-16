---
tags:
  - lang/rust
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/staking
protocol: "[[SEDA]]"
auditors:
  - "[[tallo]]"
report: "https://github.com/sherlock-audit/2024-12-seda-protocol-judging"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# H-5: Malicious WASM program can cause denial of service attack against [[SEDA]] validators through unbounded stdout/stderr

- id: 55232
- impact: HIGH
- protocol: SEDA Protocol
- reporter: tallo (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue (H-5) found by a user named "tallo" on the SEDA protocol. The bug is related to the absence of size limits on WebAssembly (WASM) stdout/stderr outputs, which can lead to a denial of service vulnerability for SEDA validators. Attackers can exploit this vulnerability by creating data requests with WASM modules that generate excessive terminal output, causing node memory exhaustion and potential crashes. The root cause of this issue is the lack of size limit enforcement in the `runtime.rs` file for stdout/stderr buffers. The bug can only be triggered if an attacker submits a data request with a custom WASM program that writes excessive amounts of data to stdout/stderr. The impact of this bug can be amplified by submitting multiple malicious data requests, as each stdout/stderr will be stored in memory and can cause significant performance degradation. To mitigate this issue, the protocol team has implemented size limits for stdout and stderr in a recent PR.

## Details

Source: https://github.com/sherlock-audit/2024-12-seda-protocol-judging/issues/206 

## Found by 
tallo

### Summary

The absence of size limits on WASM stdout/stderr outputs will cause a denial of service vulnerability for SEDA validators as attackers can exhaust node memory by creating data requests with WASM modules that generate excessive terminal output.


### Root Cause

In `runtime.rs` there is no size limit enforcement for stdout/stderr buffers, unlike the explicit limit that exists for VM execution results:
```rust
// Add size check for execution result
if execution_result.len() > MAX_VM_RESULT_SIZE_BYTES {
    stderr.push(format!(
        "Result size ({} bytes) exceeds maximum allowed size ({} bytes)",
        execution_result.len(),
        MAX_VM_RESULT_SIZE_BYTES
    ));
    return Err(VmResultStatus::ResultSizeExceeded);
}
```

### Internal Pre-conditions

1. Attacker needs to submit a data request with a custom WASM program that writes excessive amounts of data to stdout/stderr

### External Pre-conditions

None

### Attack Path

1. Attacker creates a malicious WASM module that repeatedly writes large chunks of data to stdout and stderr, potentially using a loop to generate several gigabytes of output
2. Attacker submits this module as part of a legitimate data request to the SEDA network with sufficient gas limit
3. When validators process this request during the tally phase in endblock.go, the WASM module executes and generates excessive stdout/stderr output
4. These outputs are collected without size limits and passed through multiple layers of memory allocation and copying
5. The outputs are then included in blockchain events, and written to consuming substantial memory and processing resources
6. Validator nodes experience memory exhaustion, potentially causing crashes and significant performance degradation

### Impact

To cause the most impact a malicious user can submit multiple data requests to the same malicious program, these can all be processed in the same batch. Each stdout/stderr will be stored in memory:
https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/tally/keeper/endblock.go#L80
```go
tallyResults := make([]TallyResult, len(tallyList))
dataResults := make([]batchingtypes.DataResult, len(tallyList))

for i, req := range tallyList {
    // [...]
    _, tallyResults[i] = k.FilterAndTally(ctx, req, params, gasMeter)
    // [...]
}
```
And allows for a max of u32 (4gb) according to the wasmer fd_write syscall:
https://github.com/wasmerio/wasmer/blob/475f335cb5a84ef6a8179699d322ca776c1bd26b/lib/wasix/src/syscalls/wasi/fd_write.rs#L11C1-L32C32
```rust
/// ### `fd_write()`
/// Write data to the file descriptor
/// Inputs:
/// - `Fd`
///     File descriptor (opened with writing) to write to
/// - `const __wasi_ciovec_t *iovs`
///     List of vectors to read data from
/// - `u32 iovs_len`
///     Length of data in `iovs`
/// Output:
/// - `u32 *nwritten`
///     Number of bytes written
/// Errors:
///
#[instrument(level = "trace", skip_all, fields(%fd, nwritten = field::Empty), ret)]
pub fn fd_write<M: MemorySize>(
    mut ctx: FunctionEnvMut<'_, WasiEnv>,
    fd: WasiFd,
    iovs: WasmPtr<__wasi_ciovec_t<M>, M>,
    iovs_len: M::Offset,
    nwritten: WasmPtr<M::Offset, M>,
) -> Result<Errno, WasiError> {
```
meaning a single data request with stderr/stdout of 8gb total will be copied across rust strings, converted to Vec<string>, serialized to C-compatible FFI structures, copied to Go data structures via CGO, formatted and joined for event attributes all while being stored in tallyResults. Since this is all executed in Endblocker, and multiple malicious data requests can be submitted, all validators will face extremely degraded performance and OOM crashes

### Mitigation

Implement size limits for stdout and stderr similar to those already in place for execution results

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/sedaprotocol/seda-wasm-vm/pull/65
