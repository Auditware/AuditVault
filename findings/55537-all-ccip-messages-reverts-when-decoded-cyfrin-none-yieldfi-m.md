---
tags:
  - lang/solidity
  - sector/bridge
  - sector/oracle
  - platform/cyfrin
  - has/github
  - severity/high
protocol: "[[Yieldfi]]"
auditors:
  - Immeas
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-04-24-cyfrin-yieldfi-v2.0.md"
genome:
  - "[[bridge-message-validation]]"
  - "[[direct-drain]]"
  - "[[known-pattern]]"
---
# All CCIP messages reverts when decoded

- id: 55537
- impact: HIGH
- protocol: Yieldfi
- reporter: Immeas (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-04-24-cyfrin-yieldfi-v2.0.md

## Summary


The bug report discusses an issue with the integration of Chainlink CCIP on the YieldFi platform. This integration allows for cross-chain token transfers using multiple messaging protocols. However, there is a problem with the decoding logic for a custom message payload used to indicate the token transfer. This decoding logic is not compatible with the format used by Chainlink, resulting in all CCIP messages failing to be processed. This can lead to permanent loss of funds as the contract is not upgradeable and failed messages cannot be retried. The bug has been fixed by updating the type of the affected variable, and the fix has been verified by a third party. 

## Details

**Description:** YieldFi has integrated Chainlink CCIP alongside its existing LayerZero support to enable cross-chain token transfers using multiple messaging protocols. To support this, a custom message payload is used to indicate the token transfer. This payload is decoded in [`Codec::decodeBridgeSendPayload`](https://github.com/YieldFiLabs/contracts/blob/40caad6c60625d750cc5c3a5a7df92b96a93a2fb/contracts/libs/Codec.sol#L22-L51) as follows:
```solidity
(uint32 dstId, address to, address token, uint256 amount, bytes32 trxnType) = abi.decode(_data, (uint32, address, address, uint256, bytes32));
```
This same decoding logic is reused for CCIP message processing.

However, Chainlink uses a `uint64` for `dstId`, and their chain IDs (e.g., [Ethereum mainnet](https://docs.chain.link/ccip/directory/mainnet/chain/mainnet)) all exceed the `uint32` range. For instance, Ethereum’s CCIP chain ID is `5009297550715157269`, which is well beyond the limits of `uint32`.

**Impact:** All CCIP messages will revert during decoding due to the overflow when casting a `uint64` value into a `uint32`. Since the contract is not upgradeable, failed messages cannot be retried, resulting in permanent loss of funds-tokens may be either locked or burned depending on the sending logic.

**Proof of Concept:** Attempting to process a message with `dstId = 5009297550715157269` in the `CCIP Receive: Should handle received message successfully` test causes the transaction to revert silently. The same behavior is observed when manually decoding a 64-bit value as a 32-bit integer using Remix.

**Recommended Mitigation:** Consider updating the type of `dstId` to `uint64` to match the Chainlink format. This change should be safe, as `dstId` is not used after decoding in the current LayerZero integration.

**YieldFi:** Fixed in commit [`14fc17a`](https://github.com/YieldFiLabs/contracts/commit/14fc17a46702bf0db0efb199c48e52530221612b)

**Cyfrin:** Verified. `dstId` is now a `uint64` in `Codec.BridgeSendPayload`.
