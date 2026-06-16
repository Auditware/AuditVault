---
tags:
  - lang/solidity
  - sector/account
  - sector/bridge
  - sector/staking-pool
  - platform/shieldify
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/locked-funds
  - fix/use-reentrancy-guard
protocol: "[[Toki]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Toki-Bridge-Security-Review.md"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[use-reentrancy-guard]]"
  - "[[reentrancy-guard]]"
---
# [H-01] Recipient Bytes Silent Burn When Non-20-Byte Payloads Pass Validation

- id: 64067
- impact: HIGH
- protocol: [[Toki]] Bridge
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Toki-Bridge-Security-Review.md

## Summary


This bug report describes a high-risk issue in the code of a bridge between two blockchains. The issue affects all user-facing entrypoints and occurs when a user tries to transfer tokens to a destination address that is not a 20-byte EVM address. This can happen due to a mistake made by the user, such as typing in an incorrect address. The problem is that the code does not properly check if the address is valid before initiating the transfer, which can result in the tokens being permanently lost. The report includes the location of the affected code and provides a proof of concept for how the bug can be exploited. The recommendation is to enforce a check for a 20-byte address or to provide a separate path for non-address transfers. The team has responded that they have fixed the issue.

## Details


## Severity

High Risk

## Description

All user-facing bridge entrypoints (`transferPool()`, `transferToken()`, `withdrawRemote()`, etc.) invoke `_validateToLength(to)` before constructing the packet, but this helper merely enforces that the payload is non-empty and at most 1 KB. It never ensures the bytes represent a 20-byte EVM address, nor does it attempt to decode them on the source chain. Once the packet reaches the destination, `onRecvPacket()` immediately calls `IBCUtils.decodeAddress(p.to)`. The assembly decoder succeeds only if the calldata word equals 20, otherwise, it returns `(address(0), false)`. Whenever decoding fails, the bridge emits `Unrecoverable` and executes `_handlePoolRecvFailure()` (which just unlocks accounting state) without persisting any `revertReceive()` payload. Because the source pool already burned or escrowed the user’s tokens, the transfer becomes irrecoverable due solely to a malformed `to` length.

## Location of Affected Code

File: [src/bridge/v1.1/BridgeV1_1.sol#L200-L204](https://github.com/datachainlab/toki-bridge-evm-contracts-poc/blob/8a6dc6ce8b8efaaca793b4e87a7371459c4d5395/src/bridge/v1.1/BridgeV1_1.sol#L200-L204)

```solidity
function transferPool(..., bytes calldata to, ...) external payable nonReentrant {
    // code
    _validateToLength(to);
    _validatePayloadLength(externalInfo.payload);
    _validateDstOuterGas(externalInfo.dstOuterGas);
    uint256 dstChainId = getChainId(srcChannel, true);
    // code
}
```

File: [src/bridge/v1.1/BridgeV1_1.sol#L891-L898](https://github.com/datachainlab/toki-bridge-evm-contracts-poc/blob/8a6dc6ce8b8efaaca793b4e87a7371459c4d5395/src/bridge/v1.1/BridgeV1_1.sol#L891-L898)

```solidity
function _validateToLength(bytes calldata to) internal pure {
    if (to.length == 0) {
        revert TokiInvalidRecipientBytes();
    }
    if (to.length > MAX_TO_LENGTH) {
        revert TokiExceed("to", to.length, MAX_TO_LENGTH);
    }
}
```

File: [src/bridge/v1.1/BridgeV1_1.sol#L415-L464](https://github.com/datachainlab/toki-bridge-evm-contracts-poc/blob/8a6dc6ce8b8efaaca793b4e87a7371459c4d5395/src/bridge/v1.1/BridgeV1_1.sol#L415-L464)

```solidity
function onRecvPacket( Packet calldata packet, address /* relayer */ ) external override onlyRole(IBC_HANDLER_ROLE) nonReentrant returns (bytes memory acknowledgement) {
    uint8 messageType = IBCUtils.parseType(packet.data);
    if (messageType == MessageType._TYPE_TRANSFER_POOL) {
        IBCUtils.TransferPoolPayload memory p = IBCUtils.decodeTransferPool(packet.data);
        _updateCredit(...);
        (address recipient, bool success) = IBCUtils.decodeAddress(p.to);
        if (success) {
            _receivePool(... recipient ...);
        } else {
            _handlePoolRecvFailure(packet.destinationChannel, p.srcPoolId, p.dstPoolId, p.feeInfo);
            emit Unrecoverable(getChainId(packet.destinationChannel, false), packet.sequence);
        }
    }
    // code
}
```

File: [src/library/IBCUtils.sol#L731-L739](https://github.com/datachainlab/toki-bridge-evm-contracts-poc/blob/8a6dc6ce8b8efaaca793b4e87a7371459c4d5395/src/library/IBCUtils.sol#L731-L739)

```solidity
function decodeAddress(bytes memory data) internal pure returns (address addr, bool success) {
    assembly {
        success := eq(mload(data), 20)
        addr := mload(add(data, 20))
    }
}
```

## Impact

Any `transferPool()`, `transferToken()`, or `withdrawRemote()` call whose `to` parameter has a length other than 20 passes `_validateToLength()`, burns or escrows the tokens on the source chain, and sends an IBC packet. The destination bridge then fails to decode the bytes and chooses the `Unrecoverable` branch, which (a) never writes a retry payload, (b) leaves the funds debited, and (c) provides the user no actionable remediation path besides pleading with pool administrators. Simple user mistakes, therefore, escalate to permanent loss of the bridged amount.

## Proof of Concept

1. Call `transferPool(...)` with `to = hex"yash@123456789"` (4 bytes). `_validateToLength()` allows it because the payload is non-empty and below 1 KB, so the bridge burns LP tokens and emits the packet.
2. On the destination chain, `IBCUtils.decodeAddress(p.to)` finds `mload(data) = 4`, so `success = 0`.
3. The branch in `onRecvPacket()` falls through to `_handlePoolRecvFailure()` (which just restores internal accounting) and emits `Unrecoverable(...)` without persisting any data to `revertReceive()`.
4. The user attempts `retryOnReceive(...)`, but there is no payload to consume; the transfer remains stuck indefinitely while the source liquidity has already been reduced.

## Recommendation

Enforce `to.length == 20` (or decode to `address` in the source contract) for all entrypoints whose destination logic expects an EVM address. Alternatively, provide a dedicated path for arbitrary recipient payloads so that non-address transfers can be retried safely instead of being dropped.

## Team Response

Fixed.
