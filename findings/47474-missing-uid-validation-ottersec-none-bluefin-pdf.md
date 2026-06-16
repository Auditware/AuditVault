---
tags:
  - lang/solidity
  - sector/perpetuals
  - sector/stable
  - platform/ottersec
  - has/poc
  - severity/high
  - novelty/variant
protocol: "[[BlueFin]]"
auditors:
  - "[[Robert Chen]]"
report: "https://bluefin.io/"
genome:
  - "[[wrong-condition]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# Missing UID Validation

- id: 47474
- impact: HIGH
- protocol: [[BlueFin]]
- reporter: Robert Chen (OtterSec)
- source: https://bluefin.io/

## Summary


The report identifies a vulnerability in the use of BankV2 objects in the bluefin_vault function, specifically in the withdraw_from_vault and deposit_to_vault functions. These functions assume that the provided BankV2 objects are properly initialized and refer to the intended instances, without explicitly specifying their unique identifiers (UIDs). This could potentially lead to interactions with unintended or malicious BankV2 objects. The report suggests implementing validation checks and explicitly specifying the UID or another unique identifier in function parameters to prevent this vulnerability. The issue has been fixed in the code.

## Details

## Vulnerability in BankV2 Utilization within `bluefin_vault`

The vulnerability revolves around the utilization of BankV2 objects within `bluefin_vault`, specifically in `withdraw_from_vault` and `deposit_to_vault`. In these functions, the program employs BankV2 objects without explicitly specifying their unique identifiers (UIDs). Instead, the functions presume that the provided BankV2 objects are appropriately initialized and refer to the intended instances.

> _sources/bluefin_vault.mover_

```rust
entry fun deposit_to_vault<USDC>(
    bluefin_perpetual: &BluefinPerpetual, 
    bluefin_bank: &mut BluefinBank<USDC>, 
    bluefin_sequencer: &mut BluefinSequencer, 
    vault: &mut Vault<USDC>, 
    coin: &mut Coin<USDC>, 
    amount: u64, 
    receiver: address, 
    ctx: &mut TxContext
) {
    // Ensure that the vault matches the current package version
    assert!(vault.version == constants::get_version(), errors::version_mismatch());
    
    // Ensure that deposits for the provided vault are not paused
    assert!(!vault.deposit_paused, errors::deposit_paused());
    
    // Ensure that provided perpetual is the same as the one supported by the vault
    assert!(vault.perpetual_id == object::uid_to_inner(perpetual::id_v2(bluefin_perpetual)), errors::perp_not_supported());
    [...]
}
```

```rust
entry fun withdraw_from_vault<USDC>(
    bluefin_perpetual: &BluefinPerpetual, 
    bluefin_bank: &mut BluefinBank<USDC>, 
    vault: &mut Vault<USDC>, 
    shares: u64, 
    ctx: &TxContext
) {
    [...]
    // Calculate the USD amount to be given to the user based on the
    // shares they want to cash in + the total shares in the vault
    // and the vault's current balance

    // get vault's total bank balance
    let vault_total_balance = vault_balance(vault.bank_account, bluefin_bank, bluefin_perpetual);
    [...]
}
```

If the underlying exchange or system allows for the existence of multiple BankV2 objects, there may be a lack of validation checks to ensure that the correct BankV2 instance is used. Without the inclusion of UIDs or other identifiers, interactions with an unintended or potentially malicious BankV2 object may occur within the contract.

---

© 2024 Otter Audits LLC. All Rights Reserved. 8/18

## Bluefin Audit 04 - Vulnerabilities

### Proof of Concept

1. Assume a scenario where the exchange has multiple instances of BankV2 objects, each associated with different assets or purposes.
2. `bluefin_vault` assumes that the BankV2 objects passed to `withdraw_from_vault` and `deposit_to_vault` are correctly initialized and refer to the expected instances.
3. If an attacker is able to manipulate or control the initialization of BankV2 objects, they may provide a different BankV2 instance than intended when interacting with the vault.
4. This may result in the minting of shares at an incorrect price, resulting in loss of funds.

### Remediation

- Explicitly specify the UID or another unique identifier of the BankV2 objects in function parameters.
- Implement validation checks to ascertain that the provided BankV2 instances align with the expected ones.

### Patch

Fixed in 4a7d65fb by modifying the vaults to carry the bank identification and perform validation before deposit, withdrawal, or movement of funds to ensure the bank supported by the vault is the same as the one passed in parameters.

---

© 2024 Otter Audits LLC. All Rights Reserved. 9/18
