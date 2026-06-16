---
tags:
  - check/ton-end-parse
  - lang/func
  - blockchain/ton
---
Is end_parse() called after every message and storage deserialization? Missing end_parse() silently ignores trailing bytes that may indicate payload injection or format mismatch.
