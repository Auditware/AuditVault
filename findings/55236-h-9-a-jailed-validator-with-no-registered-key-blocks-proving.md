---
tags:
  - sector/staking
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - lang/solidity
  - lang/rust
protocol: "[[SEDA Protocol]]"
auditors:
  - g
report: "https://github.com/sherlock-audit/2024-12-seda-protocol-judging"
genome:
  - "[[dos-resistance]]"
  - "[[variant]]"
---
# H-9: A jailed validator with no registered key blocks proving scheme activation

- id: 55236
- impact: HIGH
- protocol: SEDA Protocol
- reporter: g (Sherlock)
- source: N/A

## Summary


This bug report is about an issue with the SEDA protocol, specifically with the activation of a proving scheme. The bug was found by a user named "zxriptor" and it causes the `EndBlock()` function to return early without activating the proving scheme. This is because there is no check to see if a validator is already jailed before jailing them. This can lead to the proving scheme never being activated and batches not being produced. To fix this, the team suggests checking if the validator is already jailed before jailing them. The issue has been fixed in the protocol's code.

## Details

Source: https://github.com/sherlock-audit/2024-12-seda-protocol-judging/issues/239 

## Found by 
g, zxriptor

### Summary

When a proving scheme is ready for activation, all validators without registered keys will be jailed. However, there is no check
that a validator is currently jailed before jailing, which raises an error and causes the `EndBlock()` to return early without
activating the proving scheme. 

### Root Cause

- In Pubkey module's `EndBlock()`, a validator without keys will get [jailed](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/pubkey/keeper/endblock.go#L135-L144) without first checking if it is already jailed.
- `slashingKeeper.Jail()` eventually calls [`jailValidator()`](https://github.com/cosmos/cosmos-sdk/blob/v0.50.11/x/staking/keeper/val_state_change.go#L309-L311), which returns an error when a validator is already jailed.
```golang
if validator.Jailed {
  return types.ErrValidatorJailed.Wrapf("cannot jail already jailed validator, validator: %v", validator)
}
```

### Internal Pre-conditions
None


### External Pre-conditions
None


### Attack Path
1. A validator has no registered keys. It is [optional](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/staking/keeper/msg_server.go#L65-L76) to register keys while the scheme is not activated.
2. This validator with no keys gets permanently Jailed for double-signing.
3. The Pubkey module's `EndBlock()` always [returns early](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/pubkey/keeper/endblock.go#L40-L43), because `JailValidators()` always fails.


### Impact

The Proving Scheme will not be activated at the configured activation height and will remain inactive while the validator is jailed
and has no registered key. A validator can be jailed permanently, leading to the Proving Scheme never getting activated.

A validator can prevent [batches](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/batching/keeper/endblock.go#L36-L42) from ever getting produced because the SEDAKeyIndexSecp256k1 proving scheme never gets activated.


### PoC
None


### Mitigation
Consider checking first if the Validator is Jailed before jailing it.

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/sedaprotocol/seda-chain/pull/522
