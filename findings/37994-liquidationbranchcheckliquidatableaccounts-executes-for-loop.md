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
  - "[[cryptedOji]]"
genome:
  - "[[liquidation-logic]]"
  - "[[permanent]]"
  - "[[chainlink-round-completeness]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
---
# `LiquidationBranch::checkLiquidatableAccounts()` executes `for` loop with wrong values, causing array out of bounds to be recovered, the program will not work as expected

- id: 37994
- impact: HIGH
- protocol: [[Zaros]]
- reporter: cryptedOji (Codehawks)
- source: N/A

## Summary


The program is experiencing a bug where a for loop is using incorrect values, causing the program to not work properly. This can be a medium risk issue. Even if the program conditions are not met, it will still store objects with a value of 0, which will affect how the program runs. This can be fixed by changing the code and testing it again to make sure it works properly.

## Details

## Summary

1. `LiquidationBranch::checkLiquidatableAccounts()` executes `for` loop with wrong values, causing array out of bounds to be recovered, the program will not work as expected
2. Even if the liquidation conditions are not met, the array will still store objects with a value of 0, which will affect the execution logic in `LiquidationKeeper::checkUpkeep()`

## Vulnerability Details

```js
    // LiquidationBranch::checkLiquidatableAccounts() 
    /// @param lowerBound The lower bound of the accounts to check
    /// @param upperBound The upper bound of the accounts to check
    function checkLiquidatableAccounts(
        uint256 lowerBound,
        uint256 upperBound
    )
        external
        view
        returns (uint128[] memory liquidatableAccountsIds)
    {
        // prepare output array size
@>        liquidatableAccountsIds = new uint128[](upperBound - lowerBound);


        // return if nothing to process
        if (liquidatableAccountsIds.length == 0) return liquidatableAccountsIds;


        // fetch storage slot for global config
        GlobalConfiguration.Data storage globalConfiguration = GlobalConfiguration.load();


        // cache active account ids length
        uint256 cachedAccountsIdsWithActivePositionsLength =
            globalConfiguration.accountsIdsWithActivePositions.length();


        // iterate over active accounts within given bounds
@>        for (uint256 i = lowerBound; i < upperBound; i++) {
            // break if `i` greater then length of active account ids
            if (i >= cachedAccountsIdsWithActivePositionsLength) break;


            // get the `tradingAccountId` of the current active account
            uint128 tradingAccountId = uint128(globalConfiguration.accountsIdsWithActivePositions.at(i));


            // load that account's leaf (data + functions)
            TradingAccount.Data storage tradingAccount = TradingAccount.loadExisting(tradingAccountId);


            // get that account's required maintenance margin & unrealized PNL
            (, UD60x18 requiredMaintenanceMarginUsdX18, SD59x18 accountTotalUnrealizedPnlUsdX18) =
                tradingAccount.getAccountMarginRequirementUsdAndUnrealizedPnlUsd(0, SD59x18_ZERO);


            // get that account's current margin balance
            SD59x18 marginBalanceUsdX18 = tradingAccount.getMarginBalanceUsd(accountTotalUnrealizedPnlUsdX18);


            // account can be liquidated if requiredMargin > marginBalance
            if (TradingAccount.isLiquidatable(requiredMaintenanceMarginUsdX18, marginBalanceUsdX18)) {
@>                liquidatableAccountsIds[i] = tradingAccountId;
            }
        }
    }
```

The length of the `liquidatableAccountsIds` array is `upperBound - lowerBound`, and this method can be used for segmented checking. But the starting value of the for loop is `uint256 i = lowerBound`. If `lowerBound != 0`, it is easy to recover due to array out of bounds.

Let's assume a scenario:

```js
upperBound = 10;
lowerBound = 20;
liquidatableAccountsIds = new uint128[](10);
for (uint256 i = lowerBound; i < upperBound; i++) {}
```

At this time, the maximum index of `liquidatableAccountsIds` is 9, but `i = 10` in the first for loop, when the program executes to `liquidatableAccountsIds[10] = tradingAccountId;`, it will recover due to overflow.
And this method is called by `LiquidationKeeper::checkUpkeep()`, where different operations are performed according to the length of the array returned by `LiquidationBranch::checkLiquidatableAccounts()` (the code snippet is as follows).

```js
    // LiquidationKeeper::checkUpkeep()
 @>       uint128[] memory liquidatableAccountsIds =
            perpsEngine.checkLiquidatableAccounts(checkLowerBound, checkUpperBound);
        uint128[] memory accountsToBeLiquidated;


 @>       if (liquidatableAccountsIds.length == 0 || liquidatableAccountsIds.length <= performLowerBound) {
            performData = abi.encode(accountsToBeLiquidated);


            return (upkeepNeeded, performData);
        }
```

However, due to the existence of the following code in `LiquidationBranch::checkLiquidatableAccounts()`, even if the conditions are not met, `liquidatableAccountsIds[i]` will default to 0. So we also need to clean up the objects with 0 in the `liquidationAccountsIds` array.

```js
    // LiquidationBranch::checkLiquidatableAccounts()
            if (TradingAccount.isLiquidatable(requiredMaintenanceMarginUsdX18, marginBalanceUsdX18)) {
@>               liquidatableAccountsIds[i] = tradingAccountId;
            }
```

### Poc

Please add the test code to `test/integration/perpetuals/liquidation-branch/checkLiquidatableAccounts/checkLiquidatableAccounts.t.sol` and execute

```js
    function test_checkLiquidatableAccounts_error() public {
        MarketConfig memory fuzzMarketConfig = getFuzzMarketConfig(1);  
        uint256 amountOfTradingAccounts = 30;
        uint256 marginValueUsd = 10_000e18 * 3 / amountOfTradingAccounts;
        uint256 initialMarginRate = fuzzMarketConfig.imr;
        bool isLong = true;
        deal({ token: address(usdz), to: users.naruto.account, give: marginValueUsd });

        for (uint256 i; i < amountOfTradingAccounts; i++) {
            uint256 accountMarginValueUsd = marginValueUsd / amountOfTradingAccounts;

            uint128 tradingAccountId = createAccountAndDeposit(accountMarginValueUsd, address(usdz));

            openPosition(fuzzMarketConfig, tradingAccountId, initialMarginRate, accountMarginValueUsd, isLong);
        }
        setAccountsAsLiquidatable(fuzzMarketConfig, isLong);
        uint256 lowerBound = 10;
        uint256 upperBound = 20;
        vm.expectRevert(abi.encodeWithSignature("Panic(uint256)", 0x32)); // panic: array out-of-bounds access (0x32)
        perpsEngine.checkLiquidatableAccounts(lowerBound, upperBound);
    }
    // Ran 1 test for test/integration/perpetuals/liquidation-branch/checkLiquidatableAccounts/checkLiquidatableAccounts.t.sol:CheckLiquidatableAccounts_Integration_Test
    // [PASS] test_checkLiquidatableAccounts_error() (gas: 20435116)
```

### Code Snippet

<https://github.com/Cyfrin/2024-07-zaros/blob/d687fe96bb7ace8652778797052a38763fbcbb1b/src/perpetuals/branches/LiquidationBranch.sol#L40-L86>
<https://github.com/Cyfrin/2024-07-zaros/blob/d687fe96bb7ace8652778797052a38763fbcbb1b/src/external/chainlink/keepers/liquidation/LiquidationKeeper.sol#L44-L88>

## Impact

`LiquidationBranch::checkLiquidatableAccounts()` executes `for` loop with wrong values, causing array out of bounds to be recovered, the program will not work as expected

## Tools Used

Manual Review

## Recommendations

1. Fix the revert caused by out-of-bounds i value in for loop
2. Clean up objects with value 0 in the `liquidatableAccountsIds` array

For example:

```diff
    /// @param lowerBound The lower bound of the accounts to check
    /// @param upperBound The upper bound of the accounts to check
    function checkLiquidatableAccounts(
        uint256 lowerBound,
        uint256 upperBound
    )
        external
        view
        returns (uint128[] memory liquidatableAccountsIds)
    {
        // prepare output array size
-        liquidatableAccountsIds = new uint128[](upperBound - lowerBound);
+        uint128[] memory cacheLiquidatableAccountsIds = new uint128[](upperBound - lowerBound);

        // return if nothing to process
-        if (liquidatableAccountsIds.length == 0) return liquidatableAccountsIds;
+        if (cacheLiquidatableAccountsIds.length == 0) return liquidatableAccountsIds;

        // fetch storage slot for global config
        GlobalConfiguration.Data storage globalConfiguration = GlobalConfiguration.load();


        // cache active account ids length
        uint256 cachedAccountsIdsWithActivePositionsLength =
            globalConfiguration.accountsIdsWithActivePositions.length();

+       uint256 count = 0; // Initialize count to keep track of valid entries
        // iterate over active accounts within given bounds
        for (uint256 i = lowerBound; i < upperBound; i++) {
            // break if `i` greater then length of active account ids
            if (i >= cachedAccountsIdsWithActivePositionsLength) break;


            // get the `tradingAccountId` of the current active account
            uint128 tradingAccountId = uint128(globalConfiguration.accountsIdsWithActivePositions.at(i));


            // load that account's leaf (data + functions)
            TradingAccount.Data storage tradingAccount = TradingAccount.loadExisting(tradingAccountId);


            // get that account's required maintenance margin & unrealized PNL
            (, UD60x18 requiredMaintenanceMarginUsdX18, SD59x18 accountTotalUnrealizedPnlUsdX18) =
                tradingAccount.getAccountMarginRequirementUsdAndUnrealizedPnlUsd(0, SD59x18_ZERO);


            // get that account's current margin balance
            SD59x18 marginBalanceUsdX18 = tradingAccount.getMarginBalanceUsd(accountTotalUnrealizedPnlUsdX18);


            // account can be liquidated if requiredMargin > marginBalance
            if (TradingAccount.isLiquidatable(requiredMaintenanceMarginUsdX18, marginBalanceUsdX18)) {
-                liquidatableAccountsIds[i] = tradingAccountId;
+                cacheLiquidatableAccountsIds[count] = tradingAccountId; // Use count as the index
+                count++; // Increment count for next valid entry
            }
        }
+        // Resize the array to remove trailing zeroes
+        liquidatableAccountsIds = new uint128[](count);
+        for (uint256 j = 0; j < count; j++) {
+            liquidatableAccountsIds[j] = cacheLiquidatableAccountsIds[j];   
+        }    
    }
```

test again,it's work.
