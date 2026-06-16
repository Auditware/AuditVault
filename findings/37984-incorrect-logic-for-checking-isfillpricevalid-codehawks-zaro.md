---
tags:
  - lang/solidity
  - platform/codehawks
  - has/poc
  - severity/high
  - sector/perpetuals
  - sector/stable
protocol: "[[Zaros]]"
auditors:
  - "[[cryptedOji]]"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[cross-contract-state-consistency]]"
---
# Incorrect logic for checking isFillPriceValid

- id: 37984
- impact: HIGH
- protocol: [[Zaros]]
- reporter: cryptedOji (Codehawks)
- source: N/A

## Summary


This report is about a bug in a program's code that checks if a trader has set a valid target price for their trade. The bug causes the program to always think the target price is invalid, so the trade cannot go through. This means traders cannot add take profit or stop loss to their trades. The bug can be fixed by changing the code to check if the target price is greater than or equal to the fill price for buy orders and less than or equal to the fill price for sell orders. 

## Details

## Summary

The logic for calculating if a trader added a valid FillPrice is not correct.

## Vulnerability Details

According to the code, when there is a buy order, the target price is less than or equal to the fill price, and when there is a sell order, the target price is greater than or equal to the fill price. Using the above conditions, any trader will not be able to set their target price because the isFillPriceValid will always be false and the trade will not go through. The correct implementation is the opposite of what is currently implemented.

```Solidity
 function fillOffchainOrders(
        uint128 marketId,
        OffchainOrder.Data[] calldata offchainOrders,
        bytes calldata priceData
    )
        external
        onlyOffchainOrdersKeeper(marketId)
    {
      ............

    @>   ctx.isFillPriceValid = (ctx.isBuyOrder && ctx.offchainOrder.targetPrice <= ctx.fillPriceX18.intoUint256())
    @>           || (!ctx.isBuyOrder && ctx.offchainOrder.targetPrice >= ctx.fillPriceX18.intoUint256());

            // we don't revert here because we want to continue filling other orders.
            if (!ctx.isFillPriceValid) {
                continue;
           }

      .............
    }
```

## POC

Copy the test to  test/integration/perpetuals/settlement-branch/fillOffchainOrders/fillOffchainOrders.t.sol

Run the test

```Solidity
 function testOffChainOrder()
        external
        givenTheSenderIsTheKeeper
        whenThePriceDataIsValid
        whenAllOffchainOrdersHaveAValidSizeDelta
        whenAllTradingAccountsExist
        whenAnOffchainOrdersMarketIdIsEqualToTheProvidedMarketId
        whenAllOffchainOrdersNoncesAreEqualToTheTradingAccountsNonces
    {
    

     MarketConfig memory fuzzMarketConfig = getFuzzMarketConfig(BTC_USD_MARKET_ID);

      uint256 initialMarginRate = 1000e18;

      initialMarginRate = bound({ x: initialMarginRate, min: fuzzMarketConfig.imr, max: MAX_MARGIN_REQUIREMENTS });
      uint256 marginValueUsd = 100000e18;
      marginValueUsd = bound({
            x: marginValueUsd,
            min: USDC_MIN_DEPOSIT_MARGIN,
            max: convertUd60x18ToTokenAmount(address(usdc), USDC_DEPOSIT_CAP_X18)
        });

        deal({ token: address(usdc), to: users.naruto.account, give: marginValueUsd });
        uint128 tradingAccountId = createAccountAndDeposit(marginValueUsd, address(usdc));
        int128 sizeDelta = fuzzOrderSizeDelta(
            FuzzOrderSizeDeltaParams({
                tradingAccountId: tradingAccountId,
                marketId: fuzzMarketConfig.marketId,
                settlementConfigurationId: SettlementConfiguration.MARKET_ORDER_CONFIGURATION_ID,
                initialMarginRate: ud60x18(initialMarginRate),
                marginValueUsd: ud60x18(marginValueUsd),
                maxSkew: ud60x18(fuzzMarketConfig.maxSkew),
                minTradeSize: ud60x18(fuzzMarketConfig.minTradeSize),
                price: ud60x18(fuzzMarketConfig.mockUsdPrice),
                isLong: true,
                shouldDiscountFees: true
            })
        );

        uint128 markPrice = perpsEngine.getMarkPrice(
            fuzzMarketConfig.marketId, fuzzMarketConfig.mockUsdPrice, sizeDelta
        ).intoUint128();

        uint128 targetPrice = 200000e18;

        bytes32 salt = bytes32(block.prevrandao);

        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                perpsEngine.DOMAIN_SEPARATOR(),
                keccak256(
                    abi.encode(
                        Constants.CREATE_OFFCHAIN_ORDER_TYPEHASH,
                        tradingAccountId,
                        fuzzMarketConfig.marketId,
                        sizeDelta,
                        targetPrice,
                        false,
                        uint120(0),
                        salt
                    )
                )
            )
        );

        (uint8 v, bytes32 r, bytes32 s) = vm.sign({ privateKey: users.naruto.privateKey, digest: digest });

        OffchainOrder.Data[] memory offchainOrders = new OffchainOrder.Data[](1);

        offchainOrders[0] = OffchainOrder.Data({
            tradingAccountId: tradingAccountId,
            marketId: fuzzMarketConfig.marketId,
            sizeDelta: sizeDelta,
            targetPrice: targetPrice,
            shouldIncreaseNonce: false,
            nonce: 0,
            salt: salt,
            v: v,
            r: r,
            s: s
        });

        bytes memory mockSignedReport =
            getMockedSignedReport(fuzzMarketConfig.streamId, fuzzMarketConfig.mockUsdPrice);
        address offchainOrdersKeeper = OFFCHAIN_ORDERS_KEEPER_ADDRESS;

        changePrank({ msgSender: offchainOrdersKeeper });

        perpsEngine.fillOffchainOrders(fuzzMarketConfig.marketId, offchainOrders, mockSignedReport);

    }
```

The above test does not fail but the order does not get completed, since the isFillPriceValid is false, it just skips the order and moves to the next offchain order.

## Impact

1. Traders will not be able to add target price which means they cannot add Take profit or stop loss to their trade
2. The Offchain order will always fail

## Tools Used

Manual Review

## Recommendations 

Change the condition to when there is a buy order, the target price is greater than or equal to the fill price, and when there is a sell order, the target price is less than or equal to the fill price.

```diff
function fillOffchainOrders(
        uint128 marketId,
        OffchainOrder.Data[] calldata offchainOrders,
        bytes calldata priceData
    )
        external
        onlyOffchainOrdersKeeper(marketId)
    {
      ............

-      ctx.isFillPriceValid = (ctx.isBuyOrder && ctx.offchainOrder.targetPrice <= ctx.fillPriceX18.intoUint256())
-           || (!ctx.isBuyOrder && ctx.offchainOrder.targetPrice >= ctx.fillPriceX18.intoUint256());
+      ctx.isFillPriceValid = (ctx.isBuyOrder && ctx.offchainOrder.targetPrice >= ctx.fillPriceX18.intoUint256())
+           || (!ctx.isBuyOrder && ctx.offchainOrder.targetPrice <= ctx.fillPriceX18.intoUint256());

            // we don't revert here because we want to continue filling other orders.
            if (!ctx.isFillPriceValid) {
                continue;
           }

      .............
    }
```
