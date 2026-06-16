---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/governance
protocol: "[[XDAO]]"
auditors:
  - "[[István Böhm]]"
report: "https://certificate.quantstamp.com/full/xdao/2670863d-2e1c-42e6-a15c-5572dd4fef85/index.html"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# Incorrect Storage Overwrite in `recv_external()` Corrupts Plugin State

- id: 61877
- impact: HIGH
- protocol: [[XDAO]]
- reporter: István Böhm (Quantstamp)
- source: https://certificate.quantstamp.com/full/xdao/2670863d-2e1c-42e6-a15c-5572dd4fef85/index.html

## Summary


The team has fixed a bug in the `contracts/walletV4_plugin.fc` file that caused misaligned storage. This could lead to incorrect data being read and potentially freezing or unauthorized operations in the wallet. The bug occurs when a plugin is removed and the contract's state is not saved correctly. To fix this, the team recommends updating the storage writing and parsing logic in the `recv_external()` function and all affected get-methods. This includes ensuring the `master_dao_address` is correctly loaded and stored, and updating the `set_data()` calls to write the full storage state. 

## Details

**Update**
The team addressed the issues in the following commits: `6afdbdeb7722fc01f8ecb3b9a33fe6e75a0ec69e`, `ef79ab0f1a1754149d4bc6f836b8bf50f81abea8`, `925319a5547311890384aead846d1fb5f8e331bd`, `c1f4f87a8699d69fbfb007b81ad186dc20588b55`, and, `5e64e41414bf616bf21997ea78096f7829ddb462`.

**File(s) affected:**`contracts/walletV4_plugin.fc`

**Description:** In `walletV4_plugin.recv_external()`, two calls to `set_data()` rebuild the contract state but omit the `is_initialized` flag and conditional `master_dao_address`, causing misaligned storage. Subsequent parsing (e.g., in get-methods like `seqno()`, `get_subwallet_id()`) will read incorrect offsets, leading to parse errors or unintended behaviors.

**Exploit Scenario:**

1.   After initialization, the DAO removes a plugin via `recv_external()`.
2.   The first call to `set_data()` drops the initialization flag and DAO address.
3.   Subsequent calls to methods like `is_plugin_installed()` or `get_subwallet_id()` fail or return incorrect data, potentially freezing the wallet or exposing it to unauthorized operations.

**Recommendation:** Correct the storage writing logic in `recv_external()` to ensure the contract’s state is saved in the exact same format from which it is read. Additionally, the parsing logic in all get-methods should be updated to correctly handle the conditional storage layout.

This involves:

1.   In `recv_external()`, ensuring the `master_dao_address` is correctly loaded into a local variable and re-stored back.
2.   In `recv_external()`, updating both calls to `set_data()` to write the full storage state, including the `is_initialized` flag and the conditional `master_dao_address`.
3.   In all affected get-methods, updating the data-loading logic to correctly skip the `master_dao_address` based on the `is_initialized` flag: `seqno()`, `get_subwallet_id()`, `get_public_key()`, `is_plugin_installed()`, and, `get_plugin_list()`.
