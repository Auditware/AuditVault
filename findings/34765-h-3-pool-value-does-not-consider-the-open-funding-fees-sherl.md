---
tags:
  - lang/solidity
  - sector/oracle
  - sector/perpetuals
  - sector/stable
  - sector/staking
  - sector/staking-pool
  - sector/vault
  - platform/sherlock
  - has/github
  - severity/high
  - vuln/logic/fee-calculation
  - impact/mev/sandwich
  - trigger/sandwich-attack
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Elfi]]"
auditors:
  - "[[mstpr-brainbot]]"
report: "https://github.com/sherlock-audit/2024-05-elfi-protocol-judging"
genome:
  - "[[fee-calculation]]"
  - "[[sandwich]]"
  - "[[defi/sandwich-attack]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
  - "[[frontrun-exposure]]"
---
# H-3: Pool value does not consider the open funding fees

- id: 34765
- impact: HIGH
- protocol: [[Elfi]]
- reporter: mstpr-brainbot (Sherlock)
- source: N/A

## Summary


This report discusses a bug in the ELFI protocol, specifically in the calculation of the pool's value. The bug was discovered by a user named mstpr-brainbot and has been acknowledged by the protocol. The bug is related to the fact that the pool's value does not take into account the open funding fees, which can lead to inaccurate calculations of staking token minting and redeeming shares. This can also be exploited by sandwiching a closing position and taking advantage of the previous pool value. The vulnerability is explained in detail, along with a code snippet and a test log. The impact of this bug is that the pool's value will spike when positions are updated, leading to unfair minting and redeeming of shares. The recommendation is to account for the net funding fee in the pool's value calculation. The discussion suggests that this issue is not a design choice and could potentially lead to funding fee imbalances.

## Details

Source: https://github.com/sherlock-audit/2024-05-elfi-protocol-judging/issues/33 

The protocol has acknowledged this issue.

## Found by 
mstpr-brainbot
## Summary
The pool's value is not considering a vital component: the open funding fees. The pool value is used when calculating staking token mint/redeem shares, and since the funding fees are not accounted for, minting/redeeming of shares will not be accurate. Additionally, someone can exploit this by sandwiching a closing position, knowing that the funding fees will be realized when the position is closed, and take advantage of the previous pool value.
## Vulnerability Detail
First, let's see how the pools value is calculated:

```solidity
function getPoolIntValue(
        LpPool.Props storage pool,
        OracleProcess.OracleParam[] memory oracles
    ) public view returns (int256) {
        int256 value = 0;
       -> if (pool.baseTokenBalance.amount > 0 || pool.baseTokenBalance.unsettledAmount > 0) {
            int256 unPnl = getMarketUnPnl(pool.symbol, oracles, true, pool.baseToken, true);
            int256 baseTokenPrice = OracleProcess.getIntOraclePrices(oracles, pool.baseToken, true);
            value = CalUtils.tokenToUsdInt(
                (pool.baseTokenBalance.amount.toInt256() + pool.baseTokenBalance.unsettledAmount + unPnl),
                TokenUtils.decimals(pool.baseToken),
                baseTokenPrice
            );
        }
        address[] memory stableTokens = pool.getStableTokens();
        if (stableTokens.length > 0) {
            // ignore here, assume no stable tokens exists in the pool
        }
        return value;
    }
```

Simply, considering there are no stable tokens in a pool the total value is:
**baseTokenBalance.amount + baseTokenBalance.unsettledAmount + marketPnL**

Little bit more detail on the `unsettledAmount`:
`unsettledAmount` is only accounted when a position is updated. For example when closing a position or increasing a positions margin. Also, it will change via funding fees. Since the previous actions changes the funding fee the `unsettledAmount` will also change.

When a position is closed the funding fees will accounted in `unsettledAmount` which previously it wasn't accounted as follows:
```solidity
function decreasePosition(Position.Props storage position, DecreasePositionParams calldata params) external {
        int256 totalPnlInUsd = PositionQueryProcess.getPositionUnPnl(position, params.executePrice.toInt256(), false);
        Symbol.Props memory symbolProps = Symbol.load(params.symbol);
        AppConfig.SymbolConfig memory symbolConfig = AppConfig.getSymbolConfig(params.symbol);
        FeeProcess.updateBorrowingFee(position, symbolProps.stakeToken);
        -> FeeProcess.updateFundingFee(position);
        .
        .
}
```

```solidity
function updateFundingFee(Position.Props storage position) public {
        .
        -> MarketProcess.updateMarketFundingFee(
            position.symbol,
            realizedFundingFee,
            position.isLong,
            true,
            position.marginToken
        );
    }
```

```solidity
function updateMarketFundingFee(
        bytes32 symbol,
        int256 realizedFundingFeeDelta,
        bool isLong,
        bool needUpdateUnsettle,
        address marginToken
    ) external {
        Market.Props storage market = Market.load(symbol);
        .
        if (needUpdateUnsettle) {
            Symbol.Props storage symbolProps = Symbol.load(symbol);
            LpPool.Props storage pool = LpPool.load(symbolProps.stakeToken);
            if (isLong) {
               -> pool.addUnsettleBaseToken(realizedFundingFeeDelta);
            } else {
                pool.addUnsettleStableToken(marginToken, realizedFundingFeeDelta);
            }
        }
    }
```

So if there are some funding fees accrued in the life time of the position they are now added to the pools `unsettledAmount` which this amount is directly affecting the pools value.

If the closed position is "cross" `unsettledAmount` is not resetted as we can see here:
```solidity
function decreasePosition(Position.Props storage position, DecreasePositionParams calldata params) external {
        .
        .
        // update funding fee
        -> MarketProcess.updateMarketFundingFee(
            symbolProps.code,
            -cache.settledFundingFee, // the negative of what's added
            cache.position.isLong,
            !position.isCrossMargin, // since the position is cross this will be false and unsettledAmount will not be resetted!
            cache.position.marginToken
        );
        .
        .
}
```

Hence, the `unsettledAmount` is increased and pools value changed without any changes in stake token supply creating a discrepancy in the share calculation. 

Share calculations for minting and redeeming is like ERC4626 just for a reference let's see how minting new shares are calculated:
```solidity
uint256 baseMintAmountInUsd = CalUtils.tokenToUsd(
                mintAmount,
                tokenDecimals,
                OracleProcess.getLatestUsdUintPrice(pool.baseToken, true)
            );
            mintStakeTokenAmount = totalSupply.mul(baseMintAmountInUsd).div(poolValue);
```

As we can observe, the increase on `unsettledAmount` will spike the pools value and share calculations will not be correct. 

**Coded PoC:**
```typescript
it("Pools entire value is not accounting the unsettled funding fees", async function () {
		const usdcAmount = precision.token(60_000, 6); // enough amount to open in desired qty
		// fund user0
		await deposit(fixture, {
			account: user0,
			token: usdc,
			amount: usdcAmount,
		});

		// fund user1
		await deposit(fixture, {
			account: user1,
			token: usdc,
			amount: usdcAmount,
		});

		const oracleBeginning = [
			{
				token: wbtcAddr,
				targetToken: ethers.ZeroAddress,
				minPrice: precision.price(25_000),
				maxPrice: precision.price(25_000),
			},
			{
				token: usdcAddr,
				targetToken: ethers.ZeroAddress,
				minPrice: precision.price(99, 6),
				maxPrice: precision.price(99, 6),
			},
		];
		let poolInfoBeginning = await poolFacet.getPoolWithOracle(
			xBtc,
			oracleBeginning
		);
		console.log("Pool value very beginning", poolInfoBeginning.poolValue);

		const orderMargin = precision.token(50_000); // 50k$
		const executionFee = precision.token(2, 15);
		// wbtc.connect(user0).approve(diamondAddr, orderMargin);
		const tx = await orderFacet.connect(user0).createOrderRequest(
			{
				symbol: btcUsd,
				orderSide: OrderSide.LONG,
				posSide: PositionSide.INCREASE,
				orderType: OrderType.MARKET,
				stopType: StopType.NONE,
				isCrossMargin: true,
				marginToken: wbtcAddr,
				qty: 0,
				leverage: precision.rate(10),
				triggerPrice: 0,
				acceptablePrice: 0,
				executionFee: executionFee,
				placeTime: 0,
				orderMargin: orderMargin,
				isNativeToken: false,
			},
			{
				value: executionFee,
			}
		);

		await tx.wait();

		const requestId = await marketFacet.getLastUuid(ORDER_ID_KEY);

		const tokenPrice = precision.price(25000);
		const usdcPrice = precision.price(99, 6); // 0.99$
		const oracle = [
			{
				token: wbtcAddr,
				targetToken: ethers.ZeroAddress,
				minPrice: tokenPrice,
				maxPrice: tokenPrice,
			},
			{
				token: usdcAddr,
				targetToken: ethers.ZeroAddress,
				minPrice: usdcPrice,
				maxPrice: usdcPrice,
			},
		];

		await orderFacet.connect(user3).executeOrder(requestId, oracle);

		const btcShortAm = precision.token(100); // only 100$, I want longs to pay shorts funding fee
		// user1 opens the short
		const tx2 = await orderFacet.connect(user1).createOrderRequest(
			{
				symbol: btcUsd,
				orderSide: OrderSide.SHORT,
				posSide: PositionSide.INCREASE,
				orderType: OrderType.MARKET,
				stopType: StopType.NONE,
				isCrossMargin: true,
				marginToken: usdcAddr,
				qty: 0,
				leverage: precision.rate(5),
				triggerPrice: 0,
				acceptablePrice: 0,
				executionFee: executionFee,
				placeTime: 0,
				orderMargin: btcShortAm,
				isNativeToken: false,
			},
			{
				value: executionFee,
			}
		);

		await tx2.wait();

		const requestId2 = await marketFacet.getLastUuid(ORDER_ID_KEY);
		await orderFacet.connect(user3).executeOrder(requestId2, oracle);

		// assume price is 30k, user in profit pool in loss.
		const oracleNext = [
			{
				token: wbtcAddr,
				targetToken: ethers.ZeroAddress,
				minPrice: precision.price(30_000),
				maxPrice: precision.price(30_000),
			},
			{
				token: usdcAddr,
				targetToken: ethers.ZeroAddress,
				minPrice: usdcPrice,
				maxPrice: usdcPrice,
			},
		];

		let poolInfoWithNextOracle = await poolFacet.getPoolWithOracle(
			xBtc,
			oracleNext
		);

		console.log(
			"Pool value with next oracle",
			poolInfoWithNextOracle.poolValue
		);

		// close the position.
		const positionInfo = await positionFacet.getSinglePosition(
			user0.address,
			btcUsd,
			wbtcAddr,
			true
		);

		// mimick funding fees
		await mine(1000, { interval: 300 });

		// funding fees accrued but did we catch it? no untill the position
		// is updated the unsettledAmount will not change however, everyone knows when a position
		// closes the unsettledAmount will immediately added and it will spike up the pools value!
		let poolInfoWithNextOrcleAfterFundingFees =
			await poolFacet.getPoolWithOracle(xBtc, oracleNext);
		console.log(
			"Pool value with next oracle after funding fees",
			poolInfoWithNextOrcleAfterFundingFees.poolValue
		);

		const tx3 = await orderFacet.connect(user0).createOrderRequest(
			{
				symbol: btcUsd,
				orderSide: OrderSide.SHORT,
				posSide: PositionSide.DECREASE,
				orderType: OrderType.MARKET,
				stopType: StopType.NONE,
				isCrossMargin: true,
				marginToken: wbtcAddr,
				qty: positionInfo.qty,
				leverage: precision.rate(10),
				triggerPrice: 0,
				acceptablePrice: 0,
				executionFee: executionFee,
				placeTime: 0,
				orderMargin: orderMargin,
				isNativeToken: false,
			},
			{
				value: executionFee,
			}
		);

		await tx3.wait();

		const requestId3 = await marketFacet.getLastUuid(ORDER_ID_KEY);
		await orderFacet.connect(user3).executeOrder(requestId3, oracleNext);

		let poolInfoFinal = await poolFacet.getPoolWithOracle(xBtc, oracleNext);

		console.log("Pool value final", poolInfoFinal.poolValue);
		console.log("Pool balances", poolInfoFinal.baseTokenBalance);

		// when the funding fees accrued the actual balance is higher!!!!
		expect(poolInfoFinal.poolValue).greaterThan(
			poolInfoWithNextOrcleAfterFundingFees.poolValue
		);
	});
```

**Test Logs:**
Pool value very beginning 2497000000000000000000000n
Pool value with next oracle 2897900000000000000010000n
Pool value with next oracle after funding fees 2897900000000000000010000n
Pool value final 2910696155073654825000000n

## Impact
Pools value will spike when positions are updated. This will create unfair minting/redeeming for shares. 
## Code Snippet
https://github.com/sherlock-audit/2024-05-elfi-protocol/blob/8a1a01804a7de7f73a04d794bf6b8104528681ad/elfi-perp-contracts/contracts/process/LpPoolQueryProcess.sol#L110-L144

https://github.com/sherlock-audit/2024-05-elfi-protocol/blob/8a1a01804a7de7f73a04d794bf6b8104528681ad/elfi-perp-contracts/contracts/process/DecreasePositionProcess.sol#L150-L156

https://github.com/sherlock-audit/2024-05-elfi-protocol/blob/8a1a01804a7de7f73a04d794bf6b8104528681ad/elfi-perp-contracts/contracts/process/MarketProcess.sol#L104-L127

https://github.com/sherlock-audit/2024-05-elfi-protocol/blob/8a1a01804a7de7f73a04d794bf6b8104528681ad/elfi-perp-contracts/contracts/process/FeeProcess.sol#L102-L137

https://github.com/sherlock-audit/2024-05-elfi-protocol/blob/8a1a01804a7de7f73a04d794bf6b8104528681ad/elfi-perp-contracts/contracts/process/DecreasePositionProcess.sol#L64-L65
## Tool used

Manual Review

## Recommendation
Account the net funding fee market will have considering all users positions and add it to the pools value calculation. 



## Discussion

**0xELFi02**

Not a issue:
Mechanistically, it is neutral in the long term, and the mechanism balances the impact of funding fee imbalances.


**nevillehuang**

@0xELFi02 What exactly is the design choice here that makes it neutral in the long term to balance funding fee imbalance? Since it was not noted in the READ.ME, I believe this issue could be valid

Same comments applies for issue #33, #102, #258

**0xELFi**

For the funding fee, we will use the pool as an intermediary for receiving and paying. The pool will bear the risk of timing differences in funding fee settlements. During a certain period, the pool may either profit or incur losses. Over a longer period, we believe that these fluctuations will remain within a certain range.
