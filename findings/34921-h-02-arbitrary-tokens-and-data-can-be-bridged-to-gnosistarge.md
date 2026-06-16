---
tags:
  - lang/solidity
  - sector/bridge
  - sector/staking
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - novelty/variant
protocol: "[[Olas]]"
auditors:
  - "[[Haxatron]]"
report: "https://code4rena.com/reports/2024-05-olas"
genome:
  - "[[missing-modifier]]"
  - "[[variant]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
  - "[[bridge-sender-auth]]"
---
# [H-02] Arbitrary tokens and data can be bridged to `GnosisTargetDispenserL2` to manipulate staking incentives

- id: 34921
- impact: HIGH
- protocol: [[Olas]]
- reporter: haxatron (Code4rena)
- source: https://code4rena.com/reports/2024-05-olas

## Summary


The GnosisTargetDispenserL2 contract has a bug that allows anyone to send any token to the contract on L2 with fake data for staking incentives. This can result in the redistribution of withheld funds or manipulation of staking targets. The recommended mitigation is to send tokens and staking data separately through the AMB. This bug is classified as an access control issue and has been confirmed by the project team.

## Details


The [`GnosisTargetDispenserL2`](https://github.com/code-423n4/2024-05-olas/blob/3ce502ec8b475885b90668e617f3983cea3ae29f/tokenomics/contracts/staking/GnosisTargetDispenserL2.sol) contract receives OLAS tokens and data from L1 to L2 via the Omnibridge, or just data via the AMB. When tokens are bridged, the `onTokenBridged()` callback is invoked on the contract. This callback processes the received tokens and associated data by calling the internal `_receiveMessage()` function.

However, the `onTokenBridged()` callback does not verify the sender of the message on the L1 side (or the token received).

This allows anyone to send any token to the `GnosisTargetDispenserL2` contract on L2 along with arbitrary data. The [`_receiveMessage()`](https://github.com/code-423n4/2024-05-olas/blob/3ce502ec8b475885b90668e617f3983cea3ae29f/tokenomics/contracts/staking/DefaultTargetDispenserL2.sol#L224) function in `DefaultTargetDispenserL2` will then process this data, assuming it represents valid staking targets and incentives.

### Impact

An attacker can bridge any tokens to the `GnosisTargetDispenserL2` contract on L2 with fake data for staking incentives. If the contract holds any withheld funds, these funds can be redistributed to arbitrary targets as long as they pass the [checks](https://github.com/code-423n4/2024-05-olas/blob/3ce502ec8b475885b90668e617f3983cea3ae29f/tokenomics/contracts/staking/DefaultTargetDispenserL2.sol#L160-L186) in `_processData()`.

Even if the contract doesn't hold any withheld funds, the attacker can cause the amounts to be [stored](https://github.com/code-423n4/2024-05-olas/blob/3ce502ec8b475885b90668e617f3983cea3ae29f/tokenomics/contracts/staking/DefaultTargetDispenserL2.sol#L199) in `stakingQueueingNonces` and redeem them at a later point.

### Proof of Concept

1. Attacker calls `relayTokensAndCall()` on the Omnibridge on L1 to send any tokens to the `GnosisTargetDispenserL2` contract on L2.
2. Attacker includes malicious staking data in the `payload` parameter.
3. `onTokenBridged()` is called on `GnosisTargetDispenserL2`, which invokes `_receiveMessage()` to process the data.
4. Since the L1 sender is not validated, the malicious data is accepted and fake staking incentives are distributed.

### Recommended Mitigation Steps

The Omnibridge contracts do not seem to provide a way to access the original sender's address on L1 when [executing the receiver callback](https://github.com/omni/omnibridge/blob/master/contracts/upgradeable_contracts/BasicOmnibridge.sol#L471) upon receiving tokens. Hence, the most sensible mitigation may be to send the bridged tokens and associated staking data separately:

1. When bridging tokens, only send the token amount without any data via `relayTokens()`.
2. Always transmit the staking data through the AMB via `requireToPassMessage()`.
3. Remove the `onTokenBridged()` callback from  `GnosisTargetDispenserL2`.

This way, an attacker cannot send fake data along with the bridged tokens. The staking data will be validated to come from the authentic source on L1.

### Assessed type

Access Control

**[kupermind (Olas) confirmed](https://github.com/code-423n4/2024-05-olas-findings/issues/22#issuecomment-2188220224)**

**[0xA5DF (judge) commented](https://github.com/code-423n4/2024-05-olas-findings/issues/22#issuecomment-2194772902):**
 > High severity seems appropriate, given that this can lead to the distribution of staking incentives to arbitrary targets.

**[Olas mitigated](https://github.com/valory-xyz/autonolas-tokenomics/pull/156)**

**[Varun_05 (warden) commented](https://github.com/code-423n4/2024-05-olas-findings/issues/22#issuecomment-2254186575):**
> Fixed.

***
