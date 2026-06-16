---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/bridge
  - sector/lending
  - sector/stable
  - platform/sherlock
protocol: "[[LEND]]"
auditors:
  - newspacexyz
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[debt-accrual-update]]"
  - "[[cross-contract-state-consistency]]"
  - "[[logic/missing-check]]"
  - "[[loss-of-funds/direct-drain]]"
  - "[[known-pattern]]"
  - "[[cross-chain-message]]"
  - "[[add-check]]"
  - "[[blast-radius/single-user]]"
---
# H-6: Cross-chain borrow ignores existing debt in collateral validation

- id: 58375
- impact: HIGH
- protocol: LEND
- reporter: newspacexyz (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found by multiple users when initiating cross-chain borrows. The problem is that the source chain only sends the raw collateral value to the destination chain without accounting for existing borrows. This allows users to borrow more than their collateral should allow, potentially leading to systemic undercollateralization and protocol insolvency. The root cause is a miscalculation in the function `borrowCrossChain()`, which only extracts the collateral amount without considering existing borrows. The impact of this bug is considered high, as it can result in protocol losses and make risk assessment and recovery more difficult. The suggested mitigation is to send the net available borrowing capacity instead of the raw collateral value.

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/341 

## Found by 
0xEkko, 0xgh0st, JeRRy0422, Kirkeelee, Nlwje, Phaethon, TessKimy, Uddercover, Waydou, Z3R0, aman, dystopia, ggg\_ttt\_hhh, hgrano, jokr, mahdifa, mussucal, newspacexyz, oxelmiguel, stonejiajia, t.aksoy, theweb3mechanic, zxriptor

### Summary

When initiating cross-chain borrows, the source chain only sends the raw collateral value to the destination chain without accounting for existing borrows. This allows users to effectively double-spend their collateral by borrowing against the same collateral on multiple chains, creating systemic undercollateralization risks.

### Root Cause

In [`borrowCrossChain()`](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L139), the collateral calculation only extracts the collateral amount while ignoring existing borrows:

```solidity
(, uint256 collateral) = 
    lendStorage.getHypotheticalAccountLiquidityCollateral(msg.sender, LToken(_lToken), 0, 0);
```

The function `getHypotheticalAccountLiquidityCollateral` returns `(totalBorrowed, totalCollateral)`, but only the collateral value is sent to the destination chain via LayerZero message. The destination chain then validates only against this raw collateral value without knowing about existing borrows.

### Internal Pre-conditions

None

### External Pre-conditions

None

### Attack Path

1. User supplies 1000 USDC collateral on Chain A (worth $1000, 80% collateral factor = $800 borrowing capacity)
2. User borrows 600 USDT on Chain A (leaving $200 remaining capacity)
3. User calls `borrowCrossChain()` from Chain A → Chain B to borrow 700 USDT
4. Source chain calculates collateral as $800 and sends this value to Chain B
5. Destination chain receives collateral value of $800 and allows borrow of 700 USDT
6. **Result**: User has borrowed $1300 total against $800 collateral capacity (162.5% utilization)

The destination chain [validation incorrectly passes](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L621-L622) because:

```solidity
require(payload.collateral >= totalBorrowed, "Insufficient collateral");
```
Where `payload.collateral` is the raw $800 collateral value, not the available borrowing capacity after existing borrows.

### Impact

**High** - Systemic undercollateralization with potential for protocol insolvency:

1. Users can borrow more than their collateral should allow
2. Positions become unliquidatable when total borrows exceed collateral value
3. Protocol suffers losses when collateral cannot cover outstanding debts
4. Multiple users exploiting this can drain protocol reserves
5. Makes risk assessment and recovery mechanisms more difficult

Example with 1000 USDC collateral (80% factor):
- Available capacity: $800
- Source chain borrows: $600  
- Cross-chain borrow: $700
- **Total exposure**: $1300 vs $800 capacity (162.5% utilization)

### PoC

No response

### Mitigation

Send net available borrowing capacity instead of raw collateral value. The source chain should calculate the difference between total collateral and existing borrows, then send this available capacity to the destination chain for validation rather than the raw collateral amount.
