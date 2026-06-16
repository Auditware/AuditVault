---
tags:
  - check/move-table-existence-check
  - lang/move
  - blockchain/sui
---
Is every `table::add` and `dynamic_field::add` call preceded by a `table::contains` / `dynamic_field::exists_` check to prevent DoS on duplicate entries?
