---
tags:
  - lang/solidity
  - platform/codehawks
  - has/github
  - has/poc
  - severity/high
  - sector/lending
  - sector/oracle
  - sector/perpetuals
protocol: "[[Zaros]]"
auditors:
  - "[[giraffe0x]]"
genome:
  - "[[liquidation-logic]]"
  - "[[direct-drain]]"
  - "[[account-ownership]]"
  - "[[chainlink-round-completeness]]"
  - "[[liquidation-underwater]]"
---
# `SettlementBranch._fillOrder` does not guarantee the collateral of a position is enough to pay the future liquidation fee.

- id: 37983
- impact: HIGH
- protocol: [[Zaros]]
- reporter: giraffe0x (Codehawks)
- source: N/A

## Summary


The bug report is about a function called `SettlementBranch._fillOrder` that does not properly check if there is enough collateral to pay for future liquidation fees. This can be a problem because traders may not put enough collateral to cover the fees and exploit the system. The report suggests adding a check in the function to make sure the fees can be paid after opening a position. An alternative solution is also proposed, which involves estimating the total fees and comparing them to the available collateral. 

## Details

## Summary
`SettlementBranch._fillOrder` does not guarantee the collateral of a position is enough to pay the future liquidation
fee.

## Vulnerability Details
`SettlementBranch._fillOrder` does not check the collateral of a position is enough to pay the future liquidation
fee after paying the fee for opening a position.

## POC
1. Add this file to `test/integration/perpetuals/settlement-branch/fillMarketOrder/fillMarketOrderPOC.t.sol`.
2. Run `forge test --mt test_POC_fillMarketOrder`.
```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.25;

// Zaros dependencies
import { PremiumReport } from "@zaros/external/chainlink/interfaces/IStreamsLookupCompatible.sol";
import { IVerifierProxy } from "@zaros/external/chainlink/interfaces/IVerifierProxy.sol";
import { Errors } from "@zaros/utils/Errors.sol";
import { OrderBranch } from "@zaros/perpetuals/branches/OrderBranch.sol";
import { MarketOrder } from "@zaros/perpetuals/leaves/MarketOrder.sol";
import { SettlementBranch } from "@zaros/perpetuals/branches/SettlementBranch.sol";
import { PerpMarket } from "@zaros/perpetuals/leaves/PerpMarket.sol";
import { Position } from "@zaros/perpetuals/leaves/Position.sol";
import { SettlementConfiguration } from "@zaros/perpetuals/leaves/SettlementConfiguration.sol";
import { Base_Test } from "test/Base.t.sol";
import { TradingAccountHarness } from "test/harnesses/perpetuals/leaves/TradingAccountHarness.sol";
import { GlobalConfigurationHarness } from "test/harnesses/perpetuals/leaves/GlobalConfigurationHarness.sol";
import { PerpMarketHarness } from "test/harnesses/perpetuals/leaves/PerpMarketHarness.sol";
import { PositionHarness } from "test/harnesses/perpetuals/leaves/PositionHarness.sol";

// PRB Math dependencies
import { UD60x18, ud60x18 } from "@prb-math/UD60x18.sol";
import { SD59x18, sd59x18, unary } from "@prb-math/SD59x18.sol";

contract FillMarketOrder_Integration_POC_Test is Base_Test {
    function setUp() public override {
        Base_Test.setUp();
        changePrank({ msgSender: users.owner.account });
        configureSystemParameters();
        createPerpMarkets();
        changePrank({ msgSender: users.naruto.account });
    }

    struct Test_GivenTheMarginBalanceUsdIsOverTheMaintenanceMarginUsdRequired_Context {
        uint256 marketId;
        uint256 marginValueUsd;
        uint256 expectedLastFundingTime;
        uint256 expectedOpenInterest;
        int256 expectedSkew;
        int256 firstOrderExpectedPnl;
        SD59x18 secondOrderExpectedPnlX18;
        int256 expectedLastFundingRate;
        int256 expectedLastFundingFeePerUnit;
        uint128 tradingAccountId;
        int128 firstOrderSizeDelta;
        int128 secondOrderSizeDelta;
        bytes firstMockSignedReport;
        bytes secondMockSignedReport;
        UD60x18 openInterestX18;
        UD60x18 firstOrderFeeUsdX18;
        UD60x18 secondOrderFeeUsdX18;
        UD60x18 firstFillPriceX18;
        UD60x18 secondFillPriceX18;
        SD59x18 skewX18;
        MarketConfig fuzzMarketConfig;
        PerpMarket.Data perpMarketData;
        MarketOrder.Data marketOrder;
        Position.Data expectedPosition;
        Position.Data position;
        address marketOrderKeeper;
    }

    function test_POC_fillMarketOrder() external {
        Test_GivenTheMarginBalanceUsdIsOverTheMaintenanceMarginUsdRequired_Context memory ctx;

        ctx.marketId = BTC_USD_MARKET_ID;
        // @audit
        //  requiredMarginUsdX18: 1000000000050000000
        //  marginBalanceUsdX18: 3080000000054000000
        //  totalFeesUsdX18: 2080000000004000000
        ctx.marginValueUsd = 3080000000054000000;

        deal({ token: address(usdz), to: users.naruto.account, give: ctx.marginValueUsd });

        // Config first fill order

        ctx.fuzzMarketConfig = getFuzzMarketConfig(ctx.marketId);

        ctx.marketOrderKeeper = marketOrderKeepers[ctx.fuzzMarketConfig.marketId];

        ctx.tradingAccountId = createAccountAndDeposit(ctx.marginValueUsd, address(usdz));

        // MOCK_BTC_USD_PRICE: $100_000
        ctx.firstOrderSizeDelta = 0.001e18; // BTC_USD_MIN_TRADE_SIZE

        (,,, ctx.firstOrderFeeUsdX18,,) = perpsEngine.simulateTrade(
            ctx.tradingAccountId,
            ctx.fuzzMarketConfig.marketId,
            SettlementConfiguration.MARKET_ORDER_CONFIGURATION_ID,
            ctx.firstOrderSizeDelta
        );

        ctx.firstFillPriceX18 = perpsEngine.getMarkPrice(
            ctx.fuzzMarketConfig.marketId, ctx.fuzzMarketConfig.mockUsdPrice, ctx.firstOrderSizeDelta
        );

        perpsEngine.createMarketOrder(
            OrderBranch.CreateMarketOrderParams({
                tradingAccountId: ctx.tradingAccountId,
                marketId: ctx.fuzzMarketConfig.marketId,
                sizeDelta: ctx.firstOrderSizeDelta
            })
        );

        ctx.firstOrderExpectedPnl = int256(0);

        ctx.firstMockSignedReport =
            getMockedSignedReport(ctx.fuzzMarketConfig.streamId, ctx.fuzzMarketConfig.mockUsdPrice);

        changePrank({ msgSender: ctx.marketOrderKeeper });

        // it should transfer the pnl and fees
        // margin value: $4
        // settlementFee: $2
        // orderFee: $0.080000000004
        expectCallToTransfer(usdz, feeRecipients.settlementFeeRecipient, DEFAULT_SETTLEMENT_FEE);
        expectCallToTransfer(usdz, feeRecipients.orderFeeRecipient, ctx.firstOrderFeeUsdX18.intoUint256());

        perpsEngine.fillMarketOrder(ctx.tradingAccountId, ctx.fuzzMarketConfig.marketId, ctx.firstMockSignedReport);
        Position.State memory positionState = perpsEngine.getPositionState(
            ctx.tradingAccountId, ctx.fuzzMarketConfig.marketId, ctx.fuzzMarketConfig.mockUsdPrice
        );

        // @audit Only initial margin is left.
        assertEq(
            UD60x18.unwrap(TradingAccountHarness(address(perpsEngine)).exposed_getMarginCollateralBalance({
                tradingAccountId: 1,
                collateralType: address(usdz)
            }))
            , 1000000000050000000,
            "Wrong margin collateral balance after liquidation"
        );

        // @audit Make the position liquidatable.
        uint256 updatedPrice = MOCK_BTC_USD_PRICE - MOCK_BTC_USD_PRICE / 10;
        updateMockPriceFeed(BTC_USD_MARKET_ID, updatedPrice);

        uint128[] memory accountsIds = new uint128[](1);
        accountsIds[0] = 1;
        changePrank({ msgSender: liquidationKeeper });

        // @audit liquidation fee is equal to the initial margin, but is less than LIQUIDATION_FEE_USD = 5e18.
        // ctx.liquidatedCollateralUsdX18: 1000000000050000000
        perpsEngine.liquidateAccounts(accountsIds);
        assertEq(
            UD60x18.unwrap(TradingAccountHarness(address(perpsEngine)).exposed_getMarginCollateralBalance({
                tradingAccountId: 1,
                collateralType: address(usdz)
            }))
            , 0,
            "Wrong margin collateral balance after liquidation"
        );
    }
}
```

## Impact
Traders may put too small collateral to pay the whole liquidation fee to exploit the imbalance between expected profit
and loss. `TradingAccount.deductAccountMargin` pays liquidation fee first, so market making engine also receives 0
from pnl.
https://github.com/Cyfrin/2024-07-zaros/blob/7439d79e627286ade431d4ea02805715e46ccf42/src/perpetuals/branches/LiquidationBranch.sol#L152-L161
https://github.com/Cyfrin/2024-07-zaros/blob/7439d79e627286ade431d4ea02805715e46ccf42/src/perpetuals/leaves/TradingAccount.sol#L528-L566

## Tools Used
Foundry.

## Recommendations
In `SettlementBranch._fillOrder`, check liquidation fee can be paid after paying the fee for
opening a position in `deductAccountMargin`.
```diff
            tradingAccount.deductAccountMargin({
                // ...
            });

+           tradingAccount.validateMarginRequirement(
+               UD60x18.wrap(0),
+               tradingAccount.getMarginBalanceUsd(accountTotalUnrealizedPnlUsdX18),
+               ctx.orderFeeUsdX18.add(UD60x18.wrap(globalConfiguration.liquidationFeeUsdX18))
+           );

            emit LogFillOrder(
```
https://github.com/Cyfrin/2024-07-zaros/blob/7439d79e627286ade431d4ea02805715e46ccf42/src/perpetuals/branches/SettlementBranch.sol#L495-L516

**Alternative**
In the test, `settlementFeeUsdX18` is configured to 2e18.
https://github.com/Cyfrin/2024-07-zaros/blob/7439d79e627286ade431d4ea02805715e46ccf42/script/markets/Markets.sol#L76
`orderFeeUsdX18` depends on skew, mark price, and sizeDelta.
https://github.com/Cyfrin/2024-07-zaros/blob/7439d79e627286ade431d4ea02805715e46ccf42/src/perpetuals/leaves/PerpMarket.sol#L155
If the sum of `settlementFeeUsdX18` and `orderFeeUsdX18` can be estimated well and more expensive, it can be compared
with `tradingAccount.getMarginBalanceUsd(accountTotalUnrealizedPnlUsdX18)` instead of `liquidationFeeUsdX18`.
