---
tags:
  - lang/solidity
  - sector/nft
  - platform/cantina
  - severity/high
  - impact/loss-of-funds/direct-drain
  - novelty/variant
protocol: "[[Mellow]]"
auditors:
  - "[[Kaden]]"
report: "https://cdn.cantina.xyz/reports/cantina_mellow_apr2024.pdf"
genome:
  - "[[missing-owner-check]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[access-roles]]"
---
# Lack of input validation on callbackParams.gauge allows for theft of positions 

- id: 40577
- impact: HIGH
- protocol: [[Mellow]]
- reporter: Kaden (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_mellow_apr2024.pdf

## Summary


Summary:

The bug report discusses a vulnerability in the VeloAmmModule contract where the gauge parameter is not properly verified, allowing an attacker to steal positions that are up for rebalancing. The attacker can exploit this by setting their own fake gauge, getting back the NFT, and then rebalancing with another victim's position. The report recommends verifying that the gauge is a valid Velodrome gauge, which has since been fixed in a commit. However, it is still possible for users to prevent their positions from being rebalanced by changing the gauge, and for LpWrapper admins to disable deposits and withdrawals. 

## Details

## Vulnerability Report: Gauge Parameter Verification

**Context:** VeloAmmModule.sol#L39

**Description:** The gauge parameter is nowhere verified to be an actual Velodrome gauge. This would allow for an attacker to steal all positions which are up for rebalancing.

**Exploitation Steps:**
1. Attacker deposits position in Core.sol and sets `callbackParams.gauge` to his own 'fake' gauge.
2. Since the gauge is owned by the attacker, the attacker can immediately get back the NFT.
3. Attacker calls `rebalance` on a victim's position. The position with which it will be rebalanced is the attacker's position from above.
4. The attacker then calls `setPositionParams` and sets `callbackParams.gauge` to the victim's gauge.
5. The attacker can then call `withdraw` and get the position from the gauge.

**Recommendation:** Verify that `callbackParams.gauge` is a Velodrome gauge.

**Mellow:** Fixed in commit `736eef90`.

**Cantina:** Fixed in commit `736eef90`. VeloAmmModule now verifies that `callbackParams.gauge` is a valid Velodrome gauge.

**Note:** It does not, however, verify that it is the position's corresponding gauge. This could be used by users to prevent their position from being rebalanced (by calling `setPositionParams` on their position and changing the gauge). It could also be used by LpWrapper admins to disable deposits/withdrawals indefinitely.
