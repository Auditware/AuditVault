---
tags:
  - lang/rust
  - sector/multisig
  - platform/trailofbits
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
protocol: "[[Squads]]"
auditors:
  - "[[Vara Prasad Bandaru]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2023-10-squadsv4-securityreview.pdf"
genome:
  - "[[missing-seeds-check]]"
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[account-ownership]]"
  - "[[frontrun-exposure]]"
  - "[[pda-derivation]]"
---
# Attacker can front-run multisig creation transaction

- id: 28929
- impact: HIGH
- protocol: [[Squads]] v4
- reporter: Vara Prasad Bandaru (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2023-10-squadsv4-securityreview.pdf

## Summary


This bug report is about an undefined behavior in the Squads protocol, where a multisig account is derived from an unauthenticated create_key. This means that an attacker can front-run a user’s multisig creation transaction and create the multisig with their own parameters, allowing them to perform transactions from that multisig and potentially steal tokens from the multisig vaults.

To illustrate the exploit scenario, Alice is a user of the Squads protocol who tries to create a multisig, but Eve creates the multisig using Alice's create_key with a modified members list. Alice notices the modification and tries to create another multisig account, but Eve constantly front-runs Alice’s transactions and hinders her experience. Bob, another user of the Squads protocol, tries to create a multisig with threshold set to three and members to 10 keys. Eve creates the multisig using Bob’s create_key with a modified members list containing three of her own keys. Bob does not notice the modification and his team continues to use the multisig. After some time, the tokens in the multisig vaults accumulate to one million USD. Eve uses her keys in the members list and steals the tokens.

The recommendation is to check that the create_key account has signed the multisig_create instruction, which will allow only the owner of the create_key to create the corresponding multisig. In the long term, the authentication requirements for the instructions in the program should be considered, and negative tests should be used to ensure the program meets those requirements.

## Details

## Vulnerability Report: Multisig Account Creation

## Diﬃculty
**Low**

## Type
**Undefined Behavior**

## File Location
`programs/squads_multisig_program/src/instructions/multisig_create.rs`

## Description
A multisig account is derived from an unauthenticated `create_key`. An attacker can front-run a user’s multisig creation transaction and create the multisig with their own parameters, allowing them to perform transactions from that multisig. The attacker can steal tokens from the multisig vaults if the user is unaware of the front-running and continues to use the multisig.

A multisig account is a PDA derived from the key of the `create_key` account (see Figure 7.1).

```rust
#[derive(Accounts)]
#[instruction(args: MultisigCreateArgs)]
pub struct MultisigCreate<'info> {
    #[account(
        init,
        payer = creator,
        space = Multisig::size(args.members.len()),
        seeds = [SEED_PREFIX, SEED_MULTISIG, create_key.key().as_ref()],
        bump
    )]
    pub multisig: Account<'info, Multisig>,
    /// A random public key that is used as a seed for the Multisig PDA.
    /// CHECK: This can be any random public key.
    pub create_key: AccountInfo<'info>,
}
```
*Figure 7.1: Accounts struct for the multisig_create instruction in `programs/squads_multisig_program/src/instructions/multisig_create.rs` (lines 20–34)*

The `create_key` account is not authenticated; any user can call the `multisig_create` instruction with any `create_key` account and initialize the corresponding multisig account. As a result, an attacker monitoring new transactions can check for multisig creation transactions and front-run these transactions by copying the `create_key` account and then creating the multisig account themselves.

Because the attacker is creating the multisig, they can set their own values for members. The attacker could make minimal changes to the members list that go unnoticed and then perform operations on the multisig (e.g., transfer tokens from the vaults) after some activity by the original users.

## Exploit Scenario
1. **Alice**, a user of the Squads protocol, tries to create a multisig. **Eve** creates the multisig using Alice's `create_key` with a modified members list. Alice notices the modification and tries to create another multisig account. However, Eve constantly front-runs Alice’s transactions and hinders her experience of using the Squads protocol.
  
2. **Bob**, another user of the Squads protocol, tries to create a multisig with a threshold set to three and members to 10 keys. Eve creates the multisig using Bob’s `create_key` with a modified members list containing three of her own keys. Bob does not notice the modification and his team continues to use the multisig. After some time, the tokens in the multisig vaults accumulate to one million USD. Eve uses her keys in the members list and steals the tokens.

## Recommendations
- **Short Term**: Check that the `create_key` account has signed the `multisig_create` instruction. This allows only the owner of the `create_key` to create the corresponding multisig.
  
- **Long Term**: Consider the front-running risks while determining the authentication requirements for the instructions in the program. Use negative tests to ensure the program meets those requirements.
