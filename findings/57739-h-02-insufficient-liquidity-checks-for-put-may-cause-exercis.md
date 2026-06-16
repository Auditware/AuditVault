---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/stable
protocol: "[[Hyperhyper]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Hyperhyper-security-review_2025-03-30.md"
genome:
  - "[[liquidation-underwater]]"
  - "[[integer-bounds]]"
  - "[[logic/liquidation-logic]]"
  - "[[loss-of-funds/direct-drain]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/single-user]]"
---
# [H-02] Insufficient liquidity checks for `PUT` may cause exercise failures

- id: 57739
- impact: HIGH
- protocol: Hyperhyper_2025-03-30
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Hyperhyper-security-review_2025-03-30.md

## Summary


The report describes a bug in the protocol that checks the value of stablecoins when opening and withdrawing from positions. This bug can cause issues with exercising PUT positions, even when the overall pool seems solvent. The report provides two scenarios to demonstrate the bug and recommends tracking individual balances to prevent this issue. 

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The protocol checks **total stablecoin value** when opening `PUT` positions and processing stablecoin withdrawals. However, **payouts during position exercise require a specific stablecoin (`pos.buyToken`)** to be available. This discrepancy can cause `PUT` positions to become unexercisable even when the overall pool appears solvent.

Consider the following scenarios:
Assume:

- `OperationalTreasury.baseSetUp.token`: `USDC` (`buyToken`)
- Pool's stablecoin: `USDC` (listed & reward), `USDXL` (listed)
- Stable coin price is 1:1

#### Scenario 1: PUT position opens with 0 reserved for its payout token

Assume:

- `poolAmount[USDC]` = 0 USDC -> 0 USD
- `poolAmount[USDXL]` = 3500 USDXL -> 3500 USD
- `_getPoolValue(true, false)` = 0 + 3500 = 3500 USD

1. User opens `PUT` position, resulting in `lockedUSD` = 3500 USD
   - The check passes: `availableStable = 3500 ≥ lockedUSD:0 + pos.sizeUSD: 3500`
   - This allows to create the `PUT` position that will pay `USDC` if position is profit but there are no `USDC` in the pool.

```solidity
function _checkEnoughLiquidity(
    //...
) internal pure {
    if (pos.opType == OptionType.CALL) {
        --- SNIPPED 
---
    } else if (pos.opType == OptionType.PUT) {
@>      if (lockedUSD + pos.sizeUSD > availableStable) {
            revert NotEnoughLiquidityPut(pos.sizeUSD, availableStable, lockedUSD);
        }
    }
}
```

2. User attempts to exercise their `PUT` position, but if at that time the `poolAmount[USDC]` still holds 0 `USDC`, the `_payout()` reverts.

```solidity
function _payout(Position memory pos, PositionClose memory close) internal returns (uint256 pnl) {
    --- SNIPPED 
---
@>  strg.ledger.state.poolAmount[pos.buyToken] -= pnl;
    _doTransferOut(pos.buyToken, msg.sender, pnl);
}
```

#### Scenario 2: LP withdrawal drains payout token after the position opened

Assume:

- `poolAmount[USDC]` = 2000 USDC -> 2000 USD
- `poolAmount[USDXL]` = 3500 USDXL -> 3500 USD
- `_getPoolValue(true, false)` = 2000 + 3500 = 5500 USD

1. User opens `PUT` position, resulting in `lockedUSD` = 3500 USD
   - The check passes: `availableStable = 5500 ≥ lockedUSD:0 + pos.sizeUSD: 3500`
2. Liquidity provider removes their liquidity and requests token output as `USDC`
   - LP amount worth 2000 `USDC` equivalent
   - `_checkWithdrawlImpact()` checks: `newUSDValuation = 5500 - 2000 = 3500 USD`, which is `newUSDValuation: 3500 >= lockedUSD: 3500`
   - The process allows to withdraw 2000 `USDC` amount
   - `poolAmount[USDC]` = 2000 - 2000 = 0 `USDC`

```solidity
function _checkWithdrawlImpact(
    //...
) internal view {
    --- SNIPPED 
---
    else if (strg.setUp.assets.stablecoins.contains(_token)) {
        uint8 decimals = IERC20Metadata(_token).decimals();
        uint256 withdrawUSD = (_amount * _assetPrice).toDecimals(decimals + 8, 18);
@>      uint256 newUSDValuation = _getPoolValue(true, false) - withdrawUSD;

@>      if (newUSDValuation < strg.ledger.state.lockedUSD) revert PoolErrors.InsufficientPoolAmount(_token);
    }
}
```

3. User attempts to exercise their `PUT` position, but `poolAmount[USDC]` = 0 `USDC`, so the `_payout()` reverts.

## Recommendation

Track per-buyToken (stablecoin) locked amounts and validate against individual balances in both `PUT` position opening and withdrawal impact checks.
