---
tags:
  - check/ton-raw-reserve-usage
  - lang/func
  - blockchain/ton
---
Does every contract that sends messages call raw_reserve() with correct mode and minimum value before sending? Missing raw_reserve allows storage-fee freezing attacks.
