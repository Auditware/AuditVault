---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - sector/lending
protocol: "[[Aptos Securitize]]"
auditors:
  - "[[Bartłomiej Wierzbiński]]"
report: "https://aptoslabs.com/"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[bridge-sender-auth]]"
---
# Absence of State Variable Update on Wallet Removal

- id: 46831
- impact: HIGH
- protocol: [[Aptos Securitize]]
- reporter: Bartłomiej Wierzbiński (OtterSec)
- source: https://aptoslabs.com/

## Summary


The bug report discusses a vulnerability in the registry_service::remove_wallet function that can lead to inaccurate calculations of wallet balances. This is caused by the failure to remove the wallet address from the investor.wallets structure, which affects the investor_wallet_balance_total function and other functions that rely on accurate balances. The bug has been fixed in the code and the issue can be resolved by ensuring that the wallet address is removed from investor.wallets in the remove_wallet function. The fix has been implemented in the code and the vulnerability has been resolved.

## Details

## Vulnerability in `registry_service::remove_wallet`

In `registry_service::remove_wallet`, the failure to remove `wallet_addr` from the `investor.wallets` structure introduces a significant vulnerability. This results in inaccurate calculations in `investor_wallet_balance_total`, which, in turn, impacts various other functions in the project that depend on accurate wallet balances. 

`investor_wallet_balance_total` calculates the total balance across all wallets associated with an investor by iterating through `investor.wallets`.

## Code Snippet
```rust
> _ move/sources/registry_service.move rust
public entry fun remove_wallet(
    authorizer: &signer, wallet_addr: address, id: String
) acquires InvestorInfo {
    [...]
    let investor_wallets_mut = &mut investor_info_mut().investors_wallets;
    smart_table::remove(investor_wallets_mut, wallet_addr);
    let investor = smart_table::borrow_mut(&mut investor_info_mut().investors, id);
    investor.wallet_count = investor.wallet_count - 1;
    event::emit(
        DSRegistryServiceWalletRemoved {
            wallet: wallet_addr,
            investorId: id,
            sender: authorizer_address
        }
    );
}
```

`remove_wallet` does not remove the `wallet_addr` from `investor.wallets`; it remains in this list even though it is reducing the `wallet_count` by one. `investor_wallet_balance_total` iterates over investor wallets until `wallet_count` is reached. However, since `wallet_count` was incorrectly reduced, the iteration may stop prematurely.

## Code Snippet
```rust
> _ move/sources/registry_service.move rust
public fun investor_wallet_balance_total(investor_id: String): u64 acquires InvestorInfo {
    [...]
    for (i in 0..investor.wallet_count) {
        let wallet = *vector::borrow(&investor.wallets, i);
        let pfs = primary_fungible_store::primary_store_inlined(wallet, asset);
        balance = balance + fungible_asset::balance(pfs);
    };
    balance
}
```

## Remediation
Ensure that the `wallet_addr` is also removed from `investor.wallets` in `remove_wallet`.

## Patch
Resolved in commits `06538b8` and `689014d`.
