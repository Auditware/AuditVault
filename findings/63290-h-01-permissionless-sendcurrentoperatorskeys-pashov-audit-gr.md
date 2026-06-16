---
tags:
  - lang/rust
  - lang/solidity
  - sector/bridge
  - sector/staking
  - platform/pashov
  - has/github
  - severity/high
  - vuln/dos/griefing
  - novelty/variant
protocol: "[[Tanssi]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Tanssi-security-review_2025-04-30.md"
genome:
  - "[[griefing]]"
  - "[[ownership-takeover]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[reward-accounting]]"
---
# [H-01] Permissionless `sendCurrentOperatorsKeys()`

- id: 63290
- impact: HIGH
- protocol: Tanssi_2025-04-30
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Tanssi]]-security-review_2025-04-30.md

## Summary


The report states that there is a bug in the `Middleware.sendCurrentOperatorsKeys()` function which allows anyone to call it without permission. This function triggers the `Gateway.sendOperatorsData()` function on the Ethereum side of the bridge, which can cause problems such as griefing, resource exhaustion, or race conditions. Additionally, the report mentions that there is an edge case where the first `OperatorsKeys` submitted by a user within a block is included in an old era on the Tanssi chain, while the second or subsequent OperatorsKeys are included in the next era. This can result in an incorrect epoch and incorrect values for slashing and rewards. The report recommends restricting access to the function or introducing a rate-limiting mechanism or fee.

## Details


## Severity

**Impact:** High

**Likelihood:** Medium

## Description

### The First impact

The `Middleware.sendCurrentOperatorsKeys()` function is permissionless, meaning any external actor can call it. This function triggers the `Gateway.sendOperatorsData()` function on the Ethereum side of our bridge, which:
- Emits an OutboundMessageAccepted event.
- Increments the outboundNonce of the channel.
- Submits a message to the outbound channel of the bridge infrastructure.

```solidity
// Middleware.sol
    function sendCurrentOperatorsKeys() external returns (bytes32[] memory sortedKeys) {
        address gateway = getGateway();
        if (gateway == address(0)) {
            revert Middleware__GatewayNotSet();
        }

        uint48 epoch = getCurrentEpoch();
        sortedKeys = IOBaseMiddlewareReader(address(this)).sortOperatorsByPower(epoch);
        IOGateway(gateway).sendOperatorsData(sortedKeys, epoch);
    }
```
Now, let’s see how `Gateway::sendOperatorsData()` works:
```solidity
    function sendOperatorsData(bytes32[] calldata data, uint48 epoch) external onlyMiddleware {
        Ticket memory ticket = Operators.encodeOperatorsData(data, epoch);
        _submitOutboundToChannel(PRIMARY_GOVERNANCE_CHANNEL_ID, ticket.payload);
    }
```
The creation of the ticket for this outbound is done with 0 cost, so it will be fee-less and free to send this outbound message. As we can see in the `Operators` lib:
```solidity
        // TODO: This is a type from Snowbridge, do we want our own simplified Ticket type?
        ticket.dest = ParaID.wrap(0);
        // TODO For now mock it to 0
@>        ticket.costs = Costs(0, 0);

        ticket.payload = OSubstrateTypes.EncodedOperatorsData(operatorsKeys, uint32(validatorsKeysLength), epoch);
```
So, as we can see, anyone will be able to permissionlessly and free of cost, spam the infrastructure nodes of the bridge and DoS them. We can expect this will cause serious problems in the bridge operations such as griefing, resource exhaustion, or race conditions.

### The Second impact

`Middleware.sendCurrentOperatorsKeys()` allows users to send the current validator set to the Tanssi consensus layer. If this function is called exactly at `epochStartTs`, it may return different results within the same block. For example, if a user `deposit`s stake, it might cause a new validator to join the queue; if a user `withdraw`s stake, it might cause a validator to leave the queue.

When a new validator set is processed through the `process_message` function of the `SymbioticMessageProcessor`, it calls [`pallet_external_validators::Pallet::<T>::set_external_validators_inner`](https://github.com/moondance-labs/tanssi/blob/3e0b626af0b234e768c6a31c8b0fcb0963b62224/pallets/external-validators/src/lib.rs#L386) to set the new validator set.

Each time a new validator set is received, it overwrites the previously stored validator set information, and waits until the next era to be officially written into the validator set.

There is an edge case where the first `OperatorsKeys` submitted by a user within a block is included in an old era on the Tanssi chain, while the second or subsequent OperatorsKeys are included in the next era. This can result in an incorrect epoch: the first era of the epoch uses an incorrect operator set (which does not match the one on the Ethereum side), while the remaining eras use the correct operator set. Since the slashing and reward logic on the Ethereum side relies entirely on the correct validator set from the latter eras, the first era will use incorrect values for slashing and rewards.

## Recommendations

Restrict access to `sendCurrentOperatorsKeys()` by requiring a specific role (like `FORWARDER_ROLE`), or introduce a rate-limiting mechanism based on epoch timing, or introduce a small fee.
