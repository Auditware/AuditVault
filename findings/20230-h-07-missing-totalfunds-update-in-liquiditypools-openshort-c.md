---
tags:
  - lang/solidity
  - sector/perpetuals
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Polynomial Protocol]]"
auditors:
  - "[[auditor0517]]"
report: "https://code4rena.com/reports/2023-03-polynomial"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[fee-accounting]]"
---
# [H-07] Missing totalFunds update in LiquidityPool's `OpenShort()`, causing LiquidityPool token holder to lose a portion of their token value

- id: 20230
- impact: HIGH
- protocol: [[Polynomial Protocol]]
- reporter: auditor0517 (Code4rena)
- source: https://code4rena.com/reports/2023-03-polynomial

## Summary


The bug report is about a function named `openShort()` in `LiquidityPool.sol` which is missing an update to `totalFunds` to increase `LiquidityPool` funds by the collected net fees. This bug impacts the token price, causing a lower token price on `openShort()` trades and causing `LiquidityPool` token holders to lose part of their token value.

The bug is caused by the missing increment to `totalFunds` in the `openShort()` function which is supposed to increase the `totalFunds` by `(feesCollected - externalFee)` as the trading fees is paid by the trader, via a deduction of the `tradeCost`.

The recommended mitigation step is to add the following to update `totalFunds` with the net fee collection: 

`totalFunds += feesCollected - externalFee;`

The bug was disputed by rivalq and the judge gave the benefit of the doubt and asked rivalq to view it a second time. There is another issue which is the opposite of this bug, which is that `openShort` is done right but `closeLong` has an extra update that shouldn't exist. The bug was confirmed by mubaris and the judge kept the risk as high as it is a loss of funds for users.

## Details


The function `openShort()` in `LiquidityPool.sol` is missing an update to `totalFunds`, to increase `LiquidityPool` funds by the collected net fees.

### Impact

As a result of the missing increment to `totalFunds`, the `availableFunds` in the `LiquidityPool` will be lower. This will impact the token price, causing a lower token price on `openShort()` trades. This will result in `LiquidityPool` token holders to lose part of their token value.

**Detailed Explanation**

The function `openShort()` is supposed to increase the `totalFunds` by `(feesCollected - externalFee)` as the trading fees is paid by the trader, via a deduction of the `tradeCost`.

        totalCost = tradeCost - fees;

        SUSD.safeTransfer(user, totalCost);


### Proof of Concept

Add the following imports and test case to `test/LiquidityPool.Trades.t.sol`

    import {wadMul} from "solmate/utils/SignedWadMath.sol";
    import {IPerpsV2Market} from "../src/interfaces/synthetix/IPerpsV2Market.sol";


    function testLiquidityPoolOpenShort() public {
        uint256 amount = 1e18;

        (uint256 markPrice, bool isInvalid) = pool.getMarkPrice();
        uint256 tradeCost = amount.mulWadDown(markPrice);
        uint256 fees = pool.orderFee(int256(amount)); 
        uint256 delta = pool.getDelta();
        int256 hedgingSize = wadMul(int256(amount), int256(delta));
        IPerpsV2Market perp = pool.perpMarket();
        (uint256 hedgingFees, ) = perp.orderFee(hedgingSize, IPerpsV2MarketBaseTypes.OrderType.Delayed);
        uint256 feesCollected = fees - hedgingFees;
        uint256 externalFee = feesCollected.mulWadDown(pool.devFee());

        uint256 totalFundsBefore = pool.totalFunds();
        int256 usedFundsBefore = pool.usedFunds();

        // Open a Short trade
        openShort(amount, amount * 1000, user_1);

        // Calculated expected totalFunds and usedFunds
        uint256 expectedTotalFunds = totalFundsBefore + feesCollected - externalFee;
        uint256 marginRequired = tradeCost + hedgingFees;
        int256 expectedUsedFunds = usedFundsBefore + int256(tradeCost) - int256(hedgingFees) + int256(marginRequired);

        // This is incorrect as LiquidityPool's totalFunds is supposed to increase by net fee (feesCollected - externalFee)
        assertLt(pool.totalFunds(), expectedTotalFunds);

        // LiquidityPool's UsedFunds is also wrong and is higher than expected as it included hedgingFees.
        assertGt(pool.usedFunds(), expectedUsedFunds);

        uint256 poolAvailableFunds = pool.totalFunds() - uint256(pool.usedFunds());
        uint256 expectedAvailableFunds = expectedTotalFunds - uint256(expectedUsedFunds);
      
        // LiquidityPool's available funds is wrong and is less than expected, as totalFunds is not increased correctly
        assertLt(poolAvailableFunds, expectedAvailableFunds);
        assertEq(poolAvailableFunds, expectedAvailableFunds - hedgingFees);


        // LiquidityPool's available funds is wrong and is also less than SUSD balance 
        assertLt(poolAvailableFunds, susd.balanceOf(address(pool)));

        // LiquidityPool's available fund is expected to be the same as Pool's SUSD balance
        assertEq(expectedAvailableFunds, susd.balanceOf(address(pool)));

        // LiquidityPool Token price is less than expected.
        assertLt(pool.getTokenPrice(), getExpectedTokenPrice(expectedTotalFunds, expectedUsedFunds, perp));

    }

    function getExpectedTokenPrice(uint256 expectedTotalFunds, int256 expectedUsedFunds, IPerpsV2Market perp) public returns (uint256 expectedTokenPrice) {
        (uint256 markPrice,) = pool.getMarkPrice();
        uint256 totalValue = expectedTotalFunds;
        uint256 totalSupply = lqToken.totalSupply() + pool.totalQueuedWithdrawals();
        uint256 amountOwed = markPrice.mulWadDown(powerPerp.totalSupply());
        uint256 amountToCollect = markPrice.mulWadDown(shortToken.totalShorts());
        //uint256 totalMargin = _getTotalMargin();

        (uint256 totalMargin,) = perp.remainingMargin(address(pool));

        totalValue += totalMargin + amountToCollect;
        totalValue -= uint256((int256(amountOwed) + expectedUsedFunds));

        expectedTokenPrice = totalValue.divWadDown(totalSupply);
    }

### Recommended Mitigation Steps

Add the following to update `totalFunds` with the net fee collection.

        totalFunds += feesCollected - externalFee;

**[rivalq (Polynomial) disputed and commented](https://github.com/code-423n4/2023-03-polynomial-findings/issues/153#issuecomment-1494736619):**
 > Fee part is included in usedFunds, At any time pool's total funds is not just included in `totalFunds`, but some part of it is in `usedFunds`, note that usedFunds can be negative too. 

**[Dravee (judge) commented](https://github.com/code-423n4/2023-03-polynomial-findings/issues/153#issuecomment-1500991349):**
 > As this issue was raised by several wardens, I'm willing to give this the benefit of the doubt and would like to ask the sponsor @rivalq to view it a second time. Perhaps looking through duplicated issues? They are mostly low quality and badly explained but might be on to something. https://github.com/code-423n4/2023-03-polynomial-findings/issues/46 is the duplicate with the most arguments.
> 
> I'd like to use this issue to bring attention to another issue, https://github.com/code-423n4/2023-03-polynomial-findings/issues/117, as it actually says the opposite (that `openShort` is done right but `closeLong` has an extra update that shouldn't exist). So, this one, which I repeat isn't a duplicate but actually an opposite finding, might be right.

**[mubaris (Polynomial) confirmed and commented](https://github.com/code-423n4/2023-03-polynomial-findings/issues/153#issuecomment-1518536308):**
 > I'm confirming this from our side, although I think it's a Medium risk similar to `#117`.

**[Dravee (judge) commented](https://github.com/code-423n4/2023-03-polynomial-findings/issues/153#issuecomment-1532263820):**
 > As this is still considered a loss of funds for users, I'll keep it as High.

***
