---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - sector/oracle
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - trigger/low-liquidity
  - novelty/variant
protocol: "[[USG]]"
auditors:
  - "[[0xShoonya]]"
  - "[[0xdoichantran]]"
  - "[[ExtraCaterpillar]]"
  - "[[Orhukl]]"
  - "[[PratRed]]"
  - "[[covey0x07]]"
  - "[[greekfreakxyz]]"
  - "[[newspacexyz]]"
  - "[[theboiledcorn]]"
  - "[[tobi0x18]]"
  - "[[tyuuu]]"
  - "[[weblogicctf]]"
  - "[[yoooo]]"
report: "https://github.com/sherlock-audit/2025-08-usg-tangent-judging"
genome:
  - "[[slippage]]"
  - "[[indirect-loss]]"
  - "[[trigger/low-liquidity]]"
  - "[[variant]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
---
# H-1: Expired PT doesn't always redeems 1:1 for underlying token

- id: 63045
- impact: HIGH
- protocol: [[USG]] - Tangent
- reporter: newspacexyz (Sherlock)
- source: N/A

## Summary


The report discusses an issue with the `OraclePendlePT` contract, which assumes that expired Pendle Principal Tokens (PTs) will have a 1:1 value with the underlying asset. However, in reality, the redemption path for expired PTs may involve external DEX swaps, which can be affected by market conditions and result in an overvaluation of the tokens. This can cause incorrect borrowing positions for users and result in losses for the protocol. The root cause of this issue is that the contract does not validate market conditions or slippage during the redemption process. The team has acknowledged this issue, but it will not be fixed at this time. 

## Details


Source: https://github.com/sherlock-audit/2025-08-usg-tangent-judging/issues/51 

This issue has been acknowledged by the team but won't be fixed at this time.

## Found by 
0xShoonya, 0xdoichantran, ExtraCaterpillar, Orhukl, PratRed, covey0x07, greekfreakxyz, newspacexyz, theboiledcorn, tobi0x18, tyuuu, weblogicctf, yoooo

### Summary

The `OraclePendlePT` contract assumes that once a Pendle Principal Token (PT) expires, its value becomes exactly 1:1 with the underlying asset.
This is based on the assumption that 1 PT can be redeemed for exactly 1 unit of the underlying via the SY token mechanism. However, in practice, the redemption path of expired PT often involves external DEX swaps, which may be subject to MEV, low liquidity, or price impact - especially during volatile market conditions. As a result, the actual value of 1 PT at expiry may be less than 1 underlying token, leading to oracle overvaluation.

### Root Cause

https://github.com/sherlock-audit/2025-08-usg-tangent/blob/main/tangent-contracts/src/USG/Oracles/Pendle/OraclePendlePT.sol#L41-L43
The contract assumes a guaranteed 1:1 redemption of PT to underlying asset post-expiry, without validating the execution path's market conditions or slippage.

### Internal Pre-conditions

.

### External Pre-conditions

.

### Attack Path

.

### Impact

Mispriced expired PTs will cause incorrect borrowing position for users and protocol will lose funds

### PoC

_No response_

### Mitigation

_No response_
