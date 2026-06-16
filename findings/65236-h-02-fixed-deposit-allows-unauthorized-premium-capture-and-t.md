---
tags:
  - lang/rust
  - lang/solidity
  - sdk/anchor
  - platform/pashov
  - has/github
  - severity/high
  - sector/staking
  - lang/anchor
protocol: "[[Saffron]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Saffron-security-review_2026-03-06.md"
genome:
  - "[[broken-logic]]"
  - "[[role-bypass]]"
  - "[[reward-accounting]]"
  - "[[commitment-uniqueness]]"
---
# [H-02] Fixed deposit allows unauthorized premium capture and tolerance bypass

- id: 65236
- impact: HIGH
- protocol: Saffron_2026-03-06
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Saffron]]-security-review_2026-03-06.md

## Summary


The bug report discusses an issue with the vault where fixed-side economic commitments are not enforced in the `deposit_fixed` function. This allows a fixed depositor to submit any same-Whirlpool position with liquidity greater than 0, overwrite vault terms, trigger start, and then claim the full premium. This bug also creates a false sense of protection for integrators, frontends, and off-chain pricing logic. The report provides code references and an attack path for this bug, as well as its impact and a recommendation for fixing it. The recommendation includes enforcing immutable fixed commitments, requiring an exact tick match, and keeping `fixed_side_capacity` immutable after initialization. 

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** Medium


## Description

The vault is initialized with fixed-side economic commitments, but `deposit_fixed` does not enforce those commitments. A fixed depositor can submit any same-Whirlpool position with `liquidity > 0`, overwrite vault terms, trigger start, and then claim the full premium.

The unused tolerance field also creates a false sense of protection for integrators, frontends, and off-chain pricing logic, since the contract stores a tolerance value but never enforces it in the production deposit path.

The existing `validate_liquidity_tolerance()` helper enforces two bounds: `actual_liquidity > expected * (MAX_BPS - deposit_tolerance_bps) / MAX_BPS` (reject if too low) and `actual_liquidity <= expected * (MAX_BPS + deposit_tolerance_bps) / MAX_BPS` (reject if too high). Neither check is invoked in `deposit_fixed`.

**Code references**

- Fixed-side commitment is set at initialization: [initialize.rs](https://github.com/saffron-finance/orca-saffron/blob/56b254ac8c19a640318e40b8b40e0240b36e5c9f/programs/saffron-vault/src/instructions/vault/initialize.rs#L140)
- Tolerance configuration is stored at vault creation: [create.rs](https://github.com/saffron-finance/orca-saffron/blob/56b254ac8c19a640318e40b8b40e0240b36e5c9f/programs/saffron-vault/src/instructions/vault/create.rs#L186)
- Tolerance validator exists but is not used in `deposit_fixed`: [vault.rs](https://github.com/saffron-finance/orca-saffron/blob/56b254ac8c19a640318e40b8b40e0240b36e5c9f/programs/saffron-vault/src/state/vault.rs#L243)
- Variable side must deposit full premium in one shot: [deposit_variable.rs](https://github.com/saffron-finance/orca-saffron/blob/56b254ac8c19a640318e40b8b40e0240b36e5c9f/programs/saffron-vault/src/instructions/vault/deposit_variable.rs#L122)
- `deposit_fixed` only checks whirlpool/mint/liquidity > 0: [deposit_fixed.rs](https://github.com/saffron-finance/orca-saffron/blob/56b254ac8c19a640318e40b8b40e0240b36e5c9f/programs/saffron-vault/src/instructions/vault/deposit_fixed.rs#L230), [deposit_fixed.rs](https://github.com/saffron-finance/orca-saffron/blob/56b254ac8c19a640318e40b8b40e0240b36e5c9f/programs/saffron-vault/src/instructions/vault/deposit_fixed.rs#L243)
- `deposit_fixed` overwrites ticks and fixed capacity from attacker position: [deposit_fixed.rs](https://github.com/saffron-finance/orca-saffron/blob/56b254ac8c19a640318e40b8b40e0240b36e5c9f/programs/saffron-vault/src/instructions/vault/deposit_fixed.rs#L268), [deposit_fixed.rs](https://github.com/saffron-finance/orca-saffron/blob/56b254ac8c19a640318e40b8b40e0240b36e5c9f/programs/saffron-vault/src/instructions/vault/deposit_fixed.rs#L273)
- Vault auto-starts when both NFTs exist (not economic quality): [deposit_fixed.rs](https://github.com/saffron-finance/orca-saffron/blob/56b254ac8c19a640318e40b8b40e0240b36e5c9f/programs/saffron-vault/src/instructions/vault/deposit_fixed.rs#L307)
- Claim is proportional to claim-token share; with supply = 1 holder gets all premium: [claim.rs](https://github.com/saffron-finance/orca-saffron/blob/56b254ac8c19a640318e40b8b40e0240b36e5c9f/programs/saffron-vault/src/instructions/vault/claim.rs#L31), [claim.rs](https://github.com/saffron-finance/orca-saffron/blob/56b254ac8c19a640318e40b8b40e0240b36e5c9f/programs/saffron-vault/src/instructions/vault/claim.rs#L123)

**Root cause**  
`fixed_side_capacity` and tolerance are treated as “initial values” but are not enforced at the economically binding step (`deposit_fixed`). `deposit_fixed` mutates the vault to the deposited position instead of validating the deposited position against prior commitments.

**Attack path**

1. Victim deposits full variable premium (`deposit_variable` requires full capacity).
2. Attacker deposits a dust/low-liquidity position from the same Whirlpool.
3. `deposit_fixed` accepts it, overwrites `fixed_side_capacity`, mints the sole claim token, and starts the vault.
4. Attacker calls `claim`; since claim supply is 1, the attacker receives the entire vault premium.
5. Attacker later exits/withdraws position value separately.

**Impact**

- Direct premium extraction from variable side (theft/extraction).
- Economic integrity break: advertised fixed terms are not binding.
- Per-vault loss bounded by `variable_side_capacity`.
- Repeatable across eligible vaults.


## Recommendation

1. Enforce immutable fixed commitments in `deposit_fixed`.
2. Require exact tick match with committed ticks (`tick_lower`, `tick_upper`) instead of overwriting.
3. Keep `fixed_side_capacity` immutable after initialization, and validate deposited liquidity via `validate_liquidity_tolerance(expected, actual)` before minting claim token.
