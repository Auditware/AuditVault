---
tags:
  - lang/rust
  - sector/nft
  - sector/options
  - platform/ottersec
  - severity/high
  - impact/privilege-escalation/ownership-transfer
protocol: "[[Mintbase]]"
auditors:
  - "[[James Wang]]"
report: "https://www.mintbase.xyz/"
genome:
  - "[[wrong-condition]]"
  - "[[ownership-transfer]]"
  - "[[account-ownership]]"
---
# NFT Not Transferred In Transfer With Call

- id: 48209
- impact: HIGH
- protocol: [[Mintbase]]
- reporter: James Wang (OtterSec)
- source: https://www.mintbase.xyz/

## Summary


The report discusses a bug in the MintbaseStore that does not follow the specifications of NEP-171, which is a standard for transferring ownership of non-fungible tokens (NFTs). The bug delays the transfer of NFTs until a callback function is called, causing confusion and potential loss of NFTs for the receiver. The suggested solution is to transfer the NFTs to the receiver before locking the token. The bug has been resolved in recent patches.

## Details

## NEP-171 Compliance Issue in MintbaseStore

## Overview

NEP-171 specifies that `nft_transfer_call` is required to transfer ownership of `token_id` NFTs from `previous_owner_id` to `receiver_id`. However, the MintbaseStore does not follow NEP-171’s specifications and delays the NFT transfer until the callback function `nft_resolve_transfer`. This results in confusion within calls to `nft_on_transfer` and potentially leads to a loss of NFTs for the receiver.

## Remediation

To remediate the issue, NFTs should be transferred to the receiver before locking the token.

### Code Diff

```rust
/// Transfer-and-call function as specified by [NEP-171](https://nomicon.io/Standards/Tokens/NonFungibleToken/Core).
#[payable]
pub fn nft_transfer_call(
    &mut self,
    receiver_id: AccountId,
    token_id: U64,
    approval_id: Option<u64>,
    msg: String,
) -> Promise {
    assert_one_yocto();
    let token_idu64 = token_id.into();
    let mut token = self.nft_token_internal(token_idu64);
    let pred = env::predecessor_account_id();
    assert_token_unloaned!(token);
    assert_token_owned_or_approved!(token, &pred, approval_id);
    // prevent race condition, temporarily lock-replace owner
    let owner_id = AccountId::new_unchecked(token.owner_id.to_string());
+    self.transfer_internal(&mut token, receiver_id.clone(), true);
+    log_nft_transfer(
+        &receiver_id,
+        token.id,
+        &None,
+        owner_id.to_string(),
+    );
    self.lock_token(&mut token);
    ext_nft_on_transfer::ext(receiver_id.clone())
        .with_static_gas(gas::NFT_TRANSFER_CALL)
        .nft_on_transfer(pred, owner_id.clone(), token_id, msg)
        .then(
            store_self::ext(env::current_account_id())
                .with_static_gas(gas::NFT_TRANSFER_CALL)
                .nft_resolve_transfer(
                    owner_id,
                    receiver_id,
                    token_id.0.to_string(),
                    None,
                ),
        )
}
```

## Patch

The issue has been resolved in commits `3563e5e` and `89f1661`.
