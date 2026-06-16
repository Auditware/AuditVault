---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/bridge
  - sector/infra
  - sector/lending
  - sector/stable
  - sector/token
protocol: "[[Blueberry]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Blueberry-security-review_2025-03-12.md"
genome:
  - "[[wrong-condition]]"
  - "[[indirect-loss]]"
  - "[[bridge-message-validation]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [H-03] Incorrect `erc20` transfer implementation between evm and core chains

- id: 61456
- impact: HIGH
- protocol: Blueberry_2025-03-12
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Blueberry]]-security-review_2025-03-12.md

## Summary


This bug report is about a problem in the VaultEscrow system where users' deposits are transferred from one chain to another. The issue is that the code uses a system address that is no longer valid due to changes made by HyperLiquid. The recommended solution is to update the code to use the correct system address based on the latest documentation. This will ensure that the transfer of tokens is done correctly.

## Details


## Severity

**Impact:** High

**Likelihood:** Medium

## Description

In VaultEscrow, we will transfer users' deposit from EVM Chain to Core Chain and deposit into the related vault.

In function deposit(), we will transfer USDC tokens to precompiled system address `0x2222222222222222222222222222222222222222`. The system address will help us to transfer USDC tokens from EVM chain to the Core chain.

The problem here is that HyperLiquid changes the transfer method according to [this](https://discord.com/channels/1029781241702129716/1208476333089497189/1348533264629104660).

Based on the [latest doc](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/hypercore-less-than-greater-than-hyperevm-transfers), every token has a specific system address on the Core, which is the address with first byte 0x20 and the remaining bytes all zeros, except for the token index encoded in big-endian format. For example, for token index 200, the system address would be 0x20000000000000000000000000000000000000c8 .


```solidity
    /// @notice The address of the hyperliquid spot bridge, used for sending tokens to L1.
    address public constant HYPERLIQUID_SPOT_BRIDGE = 0x2222222222222222222222222222222222222222;

    function deposit(uint64 amount) external onlyVaultWrapper {
        ERC20Upgradeable(_asset).safeTransfer(HYPERLIQUID_SPOT_BRIDGE, amount);
    }
```
So we should no use this legacy system address `0x2222222222222222222222222222222222222222`.

## Recommendations

Refactor the implementation based on the latest doc. Transfer the related token to the related system address.
