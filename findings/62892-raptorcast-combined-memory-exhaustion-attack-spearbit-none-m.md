---
tags:
  - lang/rust
  - platform/spearbit
  - has/github
  - has/poc
  - severity/high
  - sector/staking
protocol: "[[Monad]]"
auditors:
  - "[[Haxatron]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf"
genome:
  - "[[missing]]"
  - "[[temporary]]"
  - "[[reward-accounting]]"
---
# RaptorCast Combined Memory Exhaustion Attack

- id: 62892
- impact: HIGH
- protocol: [[Monad]]
- reporter: Haxatron (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf

## Summary


A memory exhaustion vulnerability has been identified in RaptorCast, a program that allows for the transmission of data over a network. This vulnerability can be exploited by a malicious user to consume large amounts of memory by sending incomplete messages. This can lead to system crashes and performance degradation. The vulnerability can only be exploited by active validators with signature authority. The recommended solution is to implement a bounded cache with limits, add timeout-based cleanup, and implement per-validator rate limiting. A fix is being worked on by the developers.

## Details

## High Risk Vulnerability Report

## Severity
High Risk

## Context
(No context files were provided by the reviewer)

## Description
A memory exhaustion vulnerability exists by combining two separate RaptorCast weaknesses: an unbounded pending message cache and per-decoder memory allocation amplification. A malicious validator can leverage both vulnerabilities to achieve large memory consumption by flooding the system with incomplete messages that maximize per-decoder allocation while avoiding automatic cleanup mechanisms.

## Attack Synopsis
- **Unbounded cache issue**: Unlimited decoder instance creation via unbounded cache for incomplete messages.
- **Memory allocation amplification**: Maximizes memory consumption per decoder instance.
- **Combined effect**: Multiplicative memory exhaustion (Max per-decoder allocation × Unlimited incomplete decoder instances).
- **Cleanup bypass**: Incomplete messages never trigger successful decoding cleanup.

## Vulnerable Code Locations
```rust
// udp.rs:135 - Unbounded cache enabling unlimited decoder instances
pending_message_cache: LruCache::unbounded(),

// udp.rs:316-327 - Per-decoder memory allocation based on attacker-controlled app_message_len
let num_source_symbols = app_message_len.div_ceil(symbol_len).max(SOURCE_SYMBOLS_MIN);
let encoded_symbol_capacity = MAX_REDUNDANCY
    .scale(num_source_symbols)
    .expect("redundancy-scaled num_source_symbols doesn't fit in usize");
ManagedDecoder::new(num_source_symbols, encoded_symbol_capacity, symbol_len)
    .map(|decoder| DecoderState {
        decoder,
        recipient_chunks: BTreeMap::new(),
        encoded_symbol_capacity,
        seen_esis: bitvec![usize, Lsb0; 0; encoded_symbol_capacity], // Large per-decoder allocation
    });

// udp.rs:386-389 - Automatic cleanup only occurs on successful decoding
let decoded_state = self
    .pending_message_cache
    .pop(&key) // Cleanup only happens here, after successful decode
    .expect("decoder exists");
```

## Proof of Concept
**Prerequisite**: Attacker must be an active validator with signature authority.
```rust
let validator_keypair = malicious_validator_keys; // Requires validator stake
// Maximize per-decoder memory allocation
let maximized_app_message_len = u32::MAX; // 4,294,967,295 bytes
let minimal_symbol_len = 960; // Small symbol size for max division result

// Create unlimited incomplete decoder instances
for attack_iteration in 0..100_000 {
    let unique_message_content = format!("incomplete_attack_{}", attack_iteration);
    let unique_timestamp = base_timestamp + attack_iteration;
    let malicious_incomplete_packet = create_incomplete_chunk(
        &validator_keypair, // Valid validator signature
        maximized_app_message_len, // Memory amplification: Trigger max allocation
        minimal_symbol_len, // Memory amplification: Maximize division result
        unique_message_content, // Unbounded cache: Unique cache key
        unique_timestamp, // Unbounded cache: Unique cache key component
        current_epoch, // Must be active validator in epoch
        incomplete_chunk_design, // CRITICAL: Ensure message can NEVER complete
    );
    send_udp_packet_to_target(malicious_incomplete_packet);
}
```

## Attack Impact
- **Memory Consumption**:
  - Per-decoder allocation: ~8MB per decoder instance (worst case).
  - Attack scaling: 1,000 decoders = 8GB, 10,000 decoders = 80GB.
  - No automatic cleanup for incomplete messages.
  - Attack persists until manual intervention.
  
- **Network Impact**:
  - Memory exhaustion leading to OOM conditions.
  - Node performance degradation and potential crashes.
  - Multi-node attack possible.
  - Consensus participation degradation.

- **Attack Requirements**:
  - Active validator status (high barrier to entry).
  - UDP message access.

## Recommendation
1. Implement bounded cache with limits: Max decoders per validator and global memory bounds.
2. Add timeout-based cleanup: Automatically remove incomplete decoders after timeout period.
3. Per-validator rate limiting: Limit decoder creation rate per validator.
4. Memory monitoring: Alert on unusual memory allocation patterns.
5. Input validation: Reasonable limits on app_message_len and related parameters.

## Category Labs
Acknowledged. A fix is being worked on in monad issue 2092.

## Spearbit
Acknowledged.
