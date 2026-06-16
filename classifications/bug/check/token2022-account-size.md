---
tags:
  - check/token2022-account-size
  - lang/rust
  - blockchain/solana
---
Is token account space dynamically computed from mint extensions rather than hardcoded to 165 bytes? Token-2022 mints with extensions (MetadataPointer, MintCloseAuthority, etc.) require more than the legacy SPL size.
