---
tags:
  - platform/ottersec
  - lang/move
  - severity/high
  - sector/rwa
protocol: "[[Aptos Securitize]]"
auditors:
  - "[[Bartłomiej Wierzbiński]]"
report: "https://aptoslabs.com/"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[bridge-sender-auth]]"
---
# Utilization of Proper Assertions for Wallet Creation

- id: 46838
- impact: HIGH
- protocol: [[Aptos Securitize]]
- reporter: Bartłomiej Wierzbiński (OtterSec)
- source: https://aptoslabs.com/

## Summary


This bug report discusses an issue where the function "add_wallet" and "add_wallet_by_investor" are unable to add a new primary store for a wallet if it already has one. This is because the function "create_primary_store" is currently permissionless and will fail if the address already has a primary store. Additionally, there is an incorrect assertion in "add_wallet_by_investor" which unintentionally only allows special wallets to be added. The suggested solution is to update the functions to call "ensure_primary_store_exists" instead of "create_primary_store" and to add an assertion to prevent the registration of special wallets. The bug has been resolved in the latest patches.

## Details

## Registry Service Wallet Management

`registry_service::add_wallet` directly utilizes `create_primary_store` to create a new primary store for a specified `wallet_addr`. However, this function will fail if the address already has a primary store. Thus, when calling `add_wallet` or `add_wallet_by_investor`, if the wallet already has a primary store, it will not be added, and the execution will fail. Moreover, `create_primary_store` is currently permissionless.

## Code Example

```rust
/// Adds a wallet to an investor. Only callable by issuer or transfer agent or above.
public entry fun add_wallet(
    authorizer: &signer, 
    investor_id: String, 
    wallet_addr: address
) acquires InvestorInfo {
    [...]
    primary_fungible_store::create_primary_store(wallet_addr, asset);
    event::emit(
        DSRegistryServiceWalletAdded {
            wallet: wallet_addr,
            investorId: investor_id,
            sender: signer::address_of(authorizer)
        }
    );
}
```

Additionally, there is an incorrect assertion in `add_wallet_by_investor`, which verifies if `wallet_addr` is a special wallet, unintentionally allowing only special wallets to be added. This behavior may expose the system to risks. The intended functionality, however, is to prevent the registration of special wallets. Therefore, the assertion should check that `wallet_addr` is not a special wallet. A similar assertion should also be added to `add_wallet` to prevent the registration of special wallets.

## Code Example

```rust
/// Allows an investor to add a wallet to their own account.
public entry fun add_wallet_by_investor(
    authorizer: &signer, 
    wallet_addr: address
) acquires InvestorInfo, WalletTypesRegistry {
    assert!(is_special_wallet(wallet_addr), EWALLET_SPECIAL);
    [...]
}
```

## Remediation

Update `add_wallet` and `add_wallet_by_investor` to call `ensure_primary_store_exists` instead of `create_primary_store`, to ensure that if a primary store already exists for the given address, `create_primary_store` will not be called for that address. Also, modify the assertion in `add_wallet_by_investor` to ensure that the `wallet_addr` is not a special wallet, and add a similar assertion in `add_wallet`.

## Patch

Resolved in commits `06538b8` and `8932cf1`.
