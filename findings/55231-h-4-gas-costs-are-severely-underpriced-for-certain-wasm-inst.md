---
tags:
  - lang/rust
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/oracle
protocol: "[[SEDA]]"
auditors:
  - "[[tallo]]"
report: "https://github.com/sherlock-audit/2024-12-seda-protocol-judging"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# H-4: Gas costs are severely underpriced for certain WASM instructions which can lead to network DoS

- id: 55231
- impact: HIGH
- protocol: [[SEDA]] Protocol
- reporter: tallo (Sherlock)
- source: N/A

## Summary


The report highlights a bug found in the SEDA Protocol related to gas pricing for WebAssembly operations. This bug can be exploited by malicious actors to consume disproportionate computational resources while paying minimal gas fees, causing a denial of service (DoS) vulnerability. The root cause of the bug is the use of a flat cost model for all instructions, except for accounting operations and MemoryGrow. This creates an imbalance between the gas paid and computational resources consumed, making it easy for attackers to exploit. To exploit this bug, the attacker needs to craft a malicious Oracle Program and submit it to the SEDA Protocol through a data request. This can lead to a DoS attack on the network, causing nodes to crash and disrupting operations. The suggested mitigation is to target each of the affected WebAssembly instructions and apply more granular gas cost measurements. The protocol team has already fixed this issue in their code. It is important to address this bug to ensure the robustness and stability of the SEDA Protocol.

## Details

Source: https://github.com/sherlock-audit/2024-12-seda-protocol-judging/issues/183 

## Found by 
tallo

### Summary

Insufficient gas pricing for complex WebAssembly operations will cause a denial of service vulnerability for the SEDA Protocol as malicious actors will exploit underpriced operations like TableGrow, MemoryFill, and complex math functions to consume disproportionate computational resources while paying minimal gas fees.


### Root Cause

```metering.rs``` uses a flat cost model for all instructions except for accounting operations and MemoryGrow.
https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-wasm-vm/runtime/core/src/metering.rs#L51
```rust
pub fn get_wasm_operation_gas_cost(operator: &Operator) -> u64 {
    if is_accounting(operator) {
        return GAS_PER_OPERATION * GAS_ACCOUNTING_MULTIPLIER;
    }

    match operator {
        Operator::MemoryGrow { mem, mem_byte: _ } => {
            GAS_MEMORY_GROW_BASE + ((WASM_PAGE_SIZE as u64 * *mem as u64) * GAS_PER_BYTE)
        }
        _ => GAS_PER_OPERATION,
    }
}
```
The absence of specific, higher gas costs for computationally expensive operations like TableGrow, MemoryFill, TableCopy, and complex mathematical functions creates a significant imbalance between the gas paid and computational resources consumed.


### Internal Pre-conditions

1. User oracle program needs to be registered with the blockchain
2. A data request needs to be made which makes use of the oracle program

### External Pre-conditions

None

### Attack Path

1. Attacker crafts a malicious Oracle Program that heavily utilizes underpriced operations (e.g., repeated TableGrow, MemoryFill, or computationally intensive mathematical functions)
2. Attacker submits this Oracle Program to the SEDA Protocol through a data request
3. Oracle Program executes on the SEDA Network, consuming disproportionate computational resources while paying minimal gas fees
4. Each execution consumes only GAS_PER_OPERATION (115) gas units despite potentially requiring orders of magnitude more computational resources
5. Multiple malicious requests can be submitted to amplify the attack's impact, causing significant resource exhaustion across the network

### Impact

The impact changes depending on the instruction:
1. TableGrow: this instruction will allocate new table entries in WebAssembly, a malicious program could call this with a large size parameter and force the host environment to allocate a large amount of memory until the node crashes
2. MemoryFill/MemoryFill: These operations allows for filling a range of memory with a specific value. A malicious program could call this repeatedly call this to consume all computation resources and delay program execution termination indefinitely
3. MemoryInit/TableInit: similar to MemoryFill
4. Sin/cos/exp/log/div/sqrt: much more expensive than the more basic operations and should have a higher gas price

Considering that all these operations are done in the context of Endblock, each one of these can severely DoS the entire network and cause nodes to crash. At a price of 115 gas for each instruction, its essentially free for a malicious program to severely harm the network.

> Tally WASM VM Robustness: The robustness of the Tally WASM VM is critical to ensuring uninterrupted operations. Possible denial-of-service (DoS) vectors or unexpected behavior could lead to operational disruptions, affecting data request execution and overall system stability.


### Mitigation

Target each of the discussed wasm instructions and apply more granular gas cost measurements

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/sedaprotocol/seda-wasm-vm/pull/59
