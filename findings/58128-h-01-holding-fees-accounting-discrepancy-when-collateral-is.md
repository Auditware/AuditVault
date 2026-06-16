---
tags:
  - lang/solidity
  - sector/lending
  - has/github
  - severity/high
protocol: "[[Gains Network]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/GainsNetwork-security-review_2025-05-26.md"
genome:
  - "[[fee-accounting]]"
  - "[[direct-drain]]"
---
# [H-01] Holding fees accounting discrepancy when collateral is less than fees

- id: 58128
- impact: HIGH
- protocol: GainsNetwork_2025-05-26
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/GainsNetwork-security-review_2025-05-26.md

## Summary


The bug report describes an issue where a trade with high leverage can cause an accounting discrepancy, potentially leading to loss of funds for the protocol. This happens when a trade accumulates holding fees that exceed its available collateral, and only a portion of these fees are transferred to the vault. The full amount is recorded as "realized fees", which can result in incorrect calculations when determining the available collateral. The report recommends checking for unsent fees and sending them to the vault when closing the trade.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

When a highly leveraged trade accumulates positive PnL over time, an accounting discrepancy occurs in how holding fees are handled, leading to potential fund loss for the protocol.

The issue arises in the `realizeHoldingFeesOnOpenTrade` function when `holdingFeesCollateral` exceeds `availableCollateralInDiamond`. In this scenario, only the available collateral is sent to the vault, but the full amount is recorded in `realizedTradingFeesCollateral`:

```solidity
    function realizeHoldingFeesOnOpenTrade(address _trader, uint32 _index, uint64 _currentPairPrice) external {
        ...

        if (holdingFees.totalFeeCollateral > 0) {
            ...

            if (availableCollateralInDiamond > 0) {
                amountSentToVaultCollateral = holdingFeesCollateral > availableCollateralInDiamond
                    ? availableCollateralInDiamond
                    : holdingFeesCollateral;

                TradingCommonUtils.transferFeeToVault(trade.collateralIndex, amountSentToVaultCollateral, trade.user);
            }

            uint128 newRealizedTradingFeesCollateral = tradeFeesData.realizedTradingFeesCollateral +
                uint128(holdingFeesCollateral); // @audit Full amount recorded here
            tradeFeesData.realizedTradingFeesCollateral = newRealizedTradingFeesCollateral;
            ...
    }
```

The discrepancy occurs when:

- A trade has accumulated holding fees exceeding its available collateral.
- Only a portion of these fees are actually transferred to the vault.
- The full amount is recorded as "realized fees".
- The trader later adds more collateral to the position.

This creates a situation where the protocol has a record of collecting more fees than it actually has, leading to incorrect accounting when calculating available collateral:

```solidity
    function getTradeAvailableCollateralInDiamond(ITradingStorage.Trade memory _trade) external view returns (uint256) {
        ...
        int256 availableCollateralInDiamondRaw = int256(uint256(_trade.collateralAmount)) -
            int256(realizedTradingFeesCollateral) -
            int256(manuallyRealizedNegativePnlCollateral);

        return availableCollateralInDiamondRaw > 0 ? uint256(availableCollateralInDiamondRaw) : 0;
    }
```

Consider a scenario:

- Trader opens a position with 0.6 ETH collateral at 500x leverage.
- Position becomes profitable, accumulating 0.82 ETH in holding fees.
- Fees are realized, but only 0.6 ETH transferred to vault, while 0.82 ETH recorded as realized.
- Trader adds 0.5 ETH more collateral (total now 1.1 ETH).
- When closing position, available collateral is calculated as: 1.1 ETH - 0.82 ETH = 0.28 ETH.
- Actual available should be: 0.5 ETH (new collateral only, as original 0.6 ETH was already sent to vault).

The vault is effectively losing 0.22 ETH in this scenario.

## Recommendations

When closing the trade, checking for unsent fees when there's enough collateral and send any pending fees to the vault.
