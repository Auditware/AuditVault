---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/bridge
  - sector/lending
  - sector/governance
  - platform/sherlock
protocol: "[[LEND]]"
auditors:
  - newspacexyz
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[reward-accounting]]"
  - "[[liquidation-incentives]]"
  - "[[dos/frozen-funds]]"
  - "[[loss-of-funds/locked-funds]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[redesign-logic]]"
  - "[[blast-radius/protocol-wide]]"
---
# H-2: Protocol rewards tokens permanently stuck

- id: 58371
- impact: HIGH
- protocol: LEND
- reporter: newspacexyz (Sherlock)
- source: N/A

## Summary


This bug report discusses a problem found in the code of a protocol used for lending. During the process of liquidation, where assets are seized from a borrower, the protocol takes a portion (2.8%) of the seized assets as a reward. However, these seized assets are never able to be withdrawn, causing them to be permanently stuck in the contract. This means that the protocol is losing out on potential revenue that could be used for various purposes such as treasury operations, development funding, and emergency reserves. The report suggests that the protocol team reassess the usage of these seized funds and implement mechanisms for their utilization, such as adding them to existing reserves or allowing governance-controlled usage. 

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/184 

## Found by 
0x15, 0xAlix2, Kvar, SarveshLimaye, Waydou, benjamin\_0923, chaos304, h2134, jokr, newspacexyz, patitonar, t.aksoy, wickie, xiaoming90, yaioxy, zxriptor

### Summary

During liquidations, the protocol seizes a portion of collateral tokens (2.8%) as protocol rewards. These seized tokens are tracked in the `protocolReward` mapping but have no mechanism for withdrawal, causing them to be permanently stuck in the contract.

### Root Cause

In `CoreRouter.sol`, the protocol [calculates and stores](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CoreRouter.sol#L300) its share of seized tokens during liquidations:

```solidity
uint256 currentReward = mul_(seizeTokens, Exp({mantissa: lendStorage.PROTOCOL_SEIZE_SHARE_MANTISSA()}));
lendStorage.updateProtocolReward(lTokenCollateral, lendStorage.protocolReward(lTokenCollateral) + currentReward);
```

The `PROTOCOL_SEIZE_SHARE_MANTISSA` is set to 2.8% (2.8e16), meaning the protocol claims 2.8% of all seized collateral. However, there are no functions in `LendStorage.sol`, `CoreRouter.sol`, or `CrossChainRouter.sol` that allow withdrawal or utilization of these accumulated rewards.

The only function that modifies `protocolReward` is `updateProtocolReward()`, which can only increase the balance but never decrease it.

### Internal Pre-conditions

None

### External Pre-conditions

None

### Attack Path

This is not an attack but a design flaw:

1. The user's position becomes liquidable due to market conditions
2. Liquidator calls `liquidateBorrowInternal()` 
3. Protocol calculates its 2.8% share: `currentReward = seizeTokens * 0.028`
4. Protocol share is added to `protocolReward[lTokenCollateral]` mapping
5. Remaining tokens (97.2%) go to the liquidator
6. Protocol's 2.8% share remains permanently stuck with no withdrawal mechanism

### Impact

**High** - Protocol loses access to earned revenue from liquidations. Over time, significant value accumulates in the contract that cannot be recovered, representing a permanent loss of protocol funds that could be used for:
- Treasury operations
- Development funding  
- Emergency reserves
- Governance token buybacks

### PoC

No response

### Mitigation

The protocol team should reassess the intended usage of liquidation-seized funds and implement appropriate mechanisms accordingly. Potential approaches include:

- Adding accumulated protocol rewards to existing reserve mechanisms.
- Establishing governance-controlled usage of these accumulated assets.
