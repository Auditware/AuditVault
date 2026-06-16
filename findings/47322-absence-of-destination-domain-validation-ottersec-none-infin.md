---
tags:
  - lang/rust
  - sdk/anchor
  - sector/stable
  - platform/ottersec
  - severity/high
  - novelty/variant
protocol: "[[Infinex]]"
auditors:
  - "[[Robert Chen]]"
report: "https://infinex.xyz/"
genome:
  - "[[missing-modifier]]"
  - "[[variant]]"
  - "[[role-bypass]]"
  - "[[account-discriminator-check]]"
---
# Absence Of Destination Domain Validation

- id: 47322
- impact: HIGH
- protocol: [[Infinex]]
- reporter: Robert Chen (OtterSec)
- source: https://infinex.xyz/

## Summary


The deposit_for_burn instruction in the wallet transfers USDC to an EVM address. Currently, the authorize function only validates the discriminator and mint_recipient, but does not validate the destination_domain parameter. This could allow malicious actors to invoke the instruction with arbitrary destination domains, resulting in unintended transfers of USDC to addresses other than the EVM address. To fix this, a validation step should be added in the authorize function to ensure the destination_domain parameter matches the expected domain for EVM transfers. This vulnerability has been patched in version 7b2be22.

## Details

## Deposit for Burn Instruction

The `deposit_for_burn` instruction transfers USDC from the wallet’s associated token account to `wallet_info.uca` (EVM address). Currently, `authorize` validates only the discriminator and the `mint_recipient` of the incoming instruction, but it does not validate the `destination_domain` parameter.

```rust
> _programs/authorizer/src/invoke_rules/cctp.rs
pub fn authorize<'info>(
    [...]
) -> anchor_lang::Result<()> {
    [...]
    // check if ix is depositForBurn
    if discriminator != DEPOSIT_FOR_BURN_DISCRIMINATOR {
        return Err(AuthorizerError::InvalidWalletInstruction.into());
    }
    // deserialize the instruction data
    let mint_recipient: [u8; 20] = instruction.instruction_data[32..52]
        .try_into()
        .map_err(|_| AuthorizerError::InvalidWalletInstruction)?;
    // check this is the same as uca
    let wallet_uca = fixed_accounts.wallet_info.uca;
    require!(
        mint_recipient == wallet_uca,
        AuthorizerError::InvalidWalletInstruction
    );
    Ok(())
}
```

Without validating the `destination_domain`, there is a risk that malicious actors may invoke the `deposit_for_burn` instruction with arbitrary destination domains, even if those domains are not intended for the EVM. This may result in unintended transfers of USDC to destinations other than the EVM address.

## Remediation

Add a validation step in `authorize` to ensure that the `destination_domain` parameter matches the expected domain for EVM transfers.

---

© 2024 Otter Audits LLC. All Rights Reserved. 13/28  
Infinex Audit 04 - Vulnerabilities  
Patch  
Resolved in 7b2be22.  
© 2024 Otter Audits LLC. All Rights Reserved. 14/28
