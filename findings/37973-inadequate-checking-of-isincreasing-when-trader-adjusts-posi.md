---
tags:
  - lang/solidity
  - platform/codehawks
  - has/github
  - severity/high
  - sector/lending
  - sector/oracle
  - sector/perpetuals
  - sector/stable
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
# Inadequate Checking of `isIncreasing` when trader adjusts position size

- id: 37973
- impact: HIGH
- protocol: [[Zaros]]
- reporter: giraffe0x (Codehawks)
- source: N/A

## Summary


The report discusses a bug in the protocol that allows traders to increase their position size in the opposite direction, despite the market and settlement being disabled. This can lead to unexpected behaviors and make traders subject to liquidation. The bug is caused by inadequate checking of the `isIncreasing` function, which only checks if the `sizeDelta` direction is the same as the position size, but not the `self.size + sizeDelta` direction. The report recommends updating the `isIncreasing` function to also check the `self.size + sizeDelta` direction to prevent this bug.

## Details

## Summary

When a trader submits to adjust position size, protocol will check if the request is to increase position size, however, this checking is inadequate and may lead to unexpected behaviors.

## Vulnerability Details

**Firstly**, when Market or Settlement is disabled, an order cannot be created or filled if the order is to increase the position size.

```Solidity
    function createMarketOrder(CreateMarketOrderParams calldata params) external {
        ...

        // determine whether position is being increased or not
@>      ctx.isIncreasing = Position.isIncreasing(params.tradingAccountId, params.marketId, params.sizeDelta);

        // both markets and settlement can be disabled, however when this happens we want to:
        // 1) allow open positions not subject to liquidation to decrease their size or close
        // 2) prevent new positions from being opened & existing positions being increased
        //
        // the idea is to prevent a state where traders have open positions but are unable
        // to reduce size or close even though they can still be liquidated; such a state
        // would severly disadvantage traders
@>      if (ctx.isIncreasing) {
            // both checks revert if disabled
@>          globalConfiguration.checkMarketIsEnabled(params.marketId);
@>          settlementConfiguration.checkIsSettlementEnabled();
        }

        ...
    }
```

```Solidity
    function _fillOrder(
        uint128 tradingAccountId,
        uint128 marketId,
        uint128 settlementConfigurationId,
        SD59x18 sizeDeltaX18,
        UD60x18 fillPriceX18
    )
        internal
        virtual
    {
        ...

        // determine whether position is being increased or not
@>      ctx.isIncreasing = Position.isIncreasing(tradingAccountId, marketId, sizeDeltaX18.intoInt256().toInt128());


        // both markets and settlement can be disabled, however when this happens we want to:
        // 1) allow open positions not subject to liquidation to decrease their size or close
        // 2) prevent new positions from being opened & existing positions being increased
        //
        // the idea is to prevent a state where traders have open positions but are unable
        // to reduce size or close even though they can still be liquidated; such a state
        // would severly disadvantage traders
@>      if (ctx.isIncreasing) {
            // both checks revert if disabled
@>          globalConfiguration.checkMarketIsEnabled(marketId);
@>          settlementConfiguration.checkIsSettlementEnabled();
        }

        ...
    }
```

For instance, if a user opens a long position, they can creates an order to close the position, and the order will be filled. If later the user wants to open a short position, the transaction for creating the order will be reverted, nor any existing order can be filled.

However, this restriction can be easily bypassed by changing the position size in the opposite direction. Consider the following case:

1. Alice and Bob each opens a long position;
2. Owner disables Market and Settlement;
3. Alice closes her long position, then creates an order to open a short position, the transaction is reverted because the order is considered as an `increasing`;
4. Bob also wants close his long position to open a short position, instead of closing the long position, he converts the long position into a short position directly by setting a  negative `sizeDelta` to reverse the position size direction, the order is successfully created and filled, because this is not considered as an `increasing`.

The culprit is [isIncreasing()](https://github.com/Cyfrin/2024-07-zaros/blob/d687fe96bb7ace8652778797052a38763fbcbb1b/src/perpetuals/leaves/Position.sol#L155-L162) in `Position` lib.

```Solidity
    function isIncreasing(
        uint128 tradingAccountId,
        uint128 marketId,
        int128 sizeDelta
    )
        internal
        view
        returns (bool)
    {
        Data storage self = Position.load(tradingAccountId, marketId);

        // If position is being opened (size is 0) or if position is being increased (sizeDelta direction is same as
        // position size)
        // For a positive position, sizeDelta should be positive to increase, and for a negative position, sizeDelta
        // should be negative to increase.
        // This also implicitly covers the case where if it's a new position (size is 0), it's considered an increase.
@>      return self.size == 0 || (self.size > 0 && sizeDelta > 0) || (self.size < 0 && sizeDelta < 0);
    }
```

This function only checks if `sizeDelta` direction is same as position size, but does not check the `self.size + sizeDelta` direction, in fact, if \``self.size + sizeDelta`\` direction is not same as position size, it should be consider as an `increasing`. For example, `self.size = 1e18` and `sizeDelta = -3e18`, new position size becomes `-2e18`, such scenario should be considered as an `increasing` because user is essentially increasing the position size in the opposite direction.

**In addtion to that**, if the trader is opening a new position or increasing the size of their existing position, protocol wants to ensure they satisfy the higher initial margin requirement:

```Solidity
    // check maintenance margin if:
    // 1) position is not increasing AND
    // 2) existing position is being decreased in size
    //
    // when a position is under the higher initial margin requirement but over the
    // lower maintenance margin requirement, we want to allow the trader to decrease
    // their losing position size before they become subject to liquidation
    //
    // but if the trader is opening a new position or increasing the size
    // of their existing position we want to ensure they satisfy the higher
    // initial margin requirement
    ctx.shouldUseMaintenanceMargin = !Position.isIncreasing(params.tradingAccountId, params.marketId, params.sizeDelta)
        && ctx.isMarketWithActivePosition;

    ctx.requiredMarginUsdX18 =
        ctx.shouldUseMaintenanceMargin ? ctx.requiredMaintenanceMarginUsdX18 : ctx.requiredInitialMarginUsdX18;
```

However, because of the Inadequate Checking of `isIncreasing`, the lower maintenance margin requirement is used, this may make them become prone  to liquidation.

Please run the following PoC in `fillMarketOrder.t.sol` to verify:

```Solidity
    function testAudit_IncreasePositionWhenMarketAndSettlementAreDisabled() public {
        uint256 depositAmount = 10_000e6;

        // Alice opens a long position
        address alice = makeAddr("Alice");
        deal(address(usdc), alice, depositAmount);

        vm.startPrank(alice);
        usdc.approve(address(perpsEngine), depositAmount);
        uint128 aliceTradingAccountId = createAccountAndDeposit(depositAmount, address(usdc));
        perpsEngine.createMarketOrder(
            OrderBranch.CreateMarketOrderParams({
                tradingAccountId: aliceTradingAccountId,
                marketId: BTC_USD_MARKET_ID,
                sizeDelta: 1e18
            })
        );
        vm.stopPrank();

        vm.startPrank(marketOrderKeepers[BTC_USD_MARKET_ID]);
        bytes memory mockSignedReport = getMockedSignedReport(BTC_USD_STREAM_ID, MOCK_BTC_USD_PRICE);
        perpsEngine.fillMarketOrder(aliceTradingAccountId, BTC_USD_MARKET_ID, mockSignedReport);
        vm.stopPrank();

        // Bob opens a long position
        address bob = makeAddr("Bob");
        deal(address(usdc), bob, depositAmount);

        vm.startPrank(bob);
        usdc.approve(address(perpsEngine), depositAmount);
        uint128 bobTradingAccountId = createAccountAndDeposit(depositAmount, address(usdc));
        perpsEngine.createMarketOrder(
            OrderBranch.CreateMarketOrderParams({
                tradingAccountId: bobTradingAccountId,
                marketId: BTC_USD_MARKET_ID,
                sizeDelta: 1e18
            })
        );
        vm.stopPrank();

        vm.startPrank(marketOrderKeepers[BTC_USD_MARKET_ID]);
        mockSignedReport = getMockedSignedReport(BTC_USD_STREAM_ID, MOCK_BTC_USD_PRICE);
        perpsEngine.fillMarketOrder(bobTradingAccountId, BTC_USD_MARKET_ID, mockSignedReport);
        vm.stopPrank();


        // Market and Settlement are disabled
        changePrank({ msgSender: users.owner.account });
        perpsEngine.updatePerpMarketStatus({ marketId: BTC_USD_MARKET_ID, enable: false });

        SettlementConfiguration.DataStreamsStrategy memory marketOrderConfigurationData = SettlementConfiguration
            .DataStreamsStrategy({
            chainlinkVerifier: IVerifierProxy(mockChainlinkVerifier),
            streamId: BTC_USD_STREAM_ID
        });
        SettlementConfiguration.Data memory marketOrderConfiguration = SettlementConfiguration.Data({
            strategy: SettlementConfiguration.Strategy.DATA_STREAMS_DEFAULT,
            isEnabled: false,
            fee: DEFAULT_SETTLEMENT_FEE,
            keeper: marketOrderKeepers[BTC_USD_MARKET_ID],
            data: abi.encode(marketOrderConfigurationData)
        });
        perpsEngine.updateSettlementConfiguration({
            marketId: BTC_USD_MARKET_ID,
            settlementConfigurationId: SettlementConfiguration.MARKET_ORDER_CONFIGURATION_ID,
            newSettlementConfiguration: marketOrderConfiguration
        });
        

        // Alice closes the long position
        vm.startPrank(alice);
        perpsEngine.createMarketOrder(
            OrderBranch.CreateMarketOrderParams({
                tradingAccountId: aliceTradingAccountId,
                marketId: BTC_USD_MARKET_ID,
                sizeDelta: -1e18
            })
        );
        vm.stopPrank();

        vm.startPrank(marketOrderKeepers[BTC_USD_MARKET_ID]);
        mockSignedReport = getMockedSignedReport(BTC_USD_STREAM_ID, MOCK_BTC_USD_PRICE);
        perpsEngine.fillMarketOrder(aliceTradingAccountId, BTC_USD_MARKET_ID, mockSignedReport);
        vm.stopPrank();


        // Alice tries to open a short position, transaction is reveted due to that the market is disabled
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(Errors.PerpMarketDisabled.selector, BTC_USD_MARKET_ID));
        perpsEngine.createMarketOrder(
            OrderBranch.CreateMarketOrderParams({
                tradingAccountId: aliceTradingAccountId,
                marketId: BTC_USD_MARKET_ID,
                sizeDelta: -2e18
            })
        );

        
        // Bob flips the position size to open a short position
        vm.startPrank(bob);
        perpsEngine.createMarketOrder(
            OrderBranch.CreateMarketOrderParams({
                tradingAccountId: bobTradingAccountId,
                marketId: BTC_USD_MARKET_ID,
                sizeDelta: -3e18
            })
        );
        vm.stopPrank();

        // Bob's transaction successfully executed despite the market and settlement are disabled
        vm.startPrank(marketOrderKeepers[BTC_USD_MARKET_ID]);
        mockSignedReport = getMockedSignedReport(BTC_USD_STREAM_ID, MOCK_BTC_USD_PRICE);
        perpsEngine.fillMarketOrder(bobTradingAccountId, BTC_USD_MARKET_ID, mockSignedReport);
        vm.stopPrank();
    }
```

## Impact

1. Trader can increase position size in the opposite direction despite Market and Settlement are disabled;
2. Lower maintenance margin requirement is wrongly used to check against the position's margin balance. makes trader subject to liquidation.

## Tools Used

Manual Review

## Recommendations

`isIncreasing()` should check if `self.size + sizeDelta` direction is same as position size.

```diff
    function isIncreasing(
        uint128 tradingAccountId,
        uint128 marketId,
        int128 sizeDelta
    )
        internal
        view
        returns (bool)
    {
        Data storage self = Position.load(tradingAccountId, marketId);

        // If position is being opened (size is 0) or if position is being increased (sizeDelta direction is same as
        // position size)
        // For a positive position, sizeDelta should be positive to increase, and for a negative position, sizeDelta
        // should be negative to increase.
        // This also implicitly covers the case where if it's a new position (size is 0), it's considered an increase.
-       return self.size == 0 || (self.size > 0 && sizeDelta > 0) || (self.size < 0 && sizeDelta < 0);
+       return self.size == 0 || (self.size > 0 && (sizeDelta > 0 || self.size + sizeDelta < 0)) || (self.size < 0 && (sizeDelta < 0 || self.size + sizeDelta > 0));
    }
```
