---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/lending
  - sector/oracle
  - sector/perpetuals
  - sector/stable
protocol: "[[Elfi]]"
auditors:
  - "[[jennifer37]]"
report: "https://github.com/sherlock-audit/2024-05-elfi-protocol-judging"
genome:
  - "[[underflow]]"
  - "[[direct-drain]]"
  - "[[account-ownership]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
---
# H-4: `updateAllPositionFromBalanceMargin` function mistakenly increments positions "fromBalance"

- id: 34766
- impact: HIGH
- protocol: [[Elfi]]
- reporter: jennifer37 (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue with the `updateAllPositionFromBalanceMargin` function in the ELFI protocol. This function is responsible for updating the "from balances" of positions when one position is closed. However, the function is not working correctly and can mistakenly increase the "from balances" of other positions more than it should. This can result in incorrect values for cross accounts and higher borrowing power than intended. The protocol team has fixed this issue in recent PRs/commits.

## Details

Source: https://github.com/sherlock-audit/2024-05-elfi-protocol-judging/issues/35 

## Found by 
KrisRenZo, KupiaSec, dany.armstrong90, debugging3, jennifer37, joicygiore, link, mstpr-brainbot, qpzm, whitehair0330
## Summary
When a position is closed all the other positions "from balances" are updated. However, the function logic `updateAllPositionFromBalanceMargin` is not fully correct and can increment the "from balances" of other positions more than it supposed to. 
## Vulnerability Detail
Assume Bob has 3 positions as follows:
WBTC SHORT 1000$ margin 5x (BTC price 25k)
WETH SHORT 500$ margin 5x (ETH price 1k)
SOL SHORT 1000$ margin 5x (SOL price 10$)

Also, Bob has the following balances in his cross account:
USDC:
balance.amount = 1000
WBTC:
balance.amount = 1

Bob first opens up the WBTC short and since the marginToken is USDC all the balance he has in his account will be used. Hence, this position will have the same `initialMargin` amount as its `initialMarginFromBalance`.

When Bob opens the SOL and WETH shorts the `initialMarginFromBalance` for them will be "0" since the first WBTC short occupied all the available USDC.

At some time later, assume the BTC price goes to 23K. Bob opened the short position from 25k and assuming fees are not more than the profit bob has profits. Say Bob's settled margin after closing this position is 1381 USDC (actual amount from the PoC) which means there is a profit of 381$ for Bob. 

Below code snippet in DecreasePosition::_settleCrossAccount() will be calculating the `changeToken` which since the entire position is closed the value for it will be the settle margin, 1381 USDC.
```solidity
 if (!cache.isLiquidation) {
            int256 changeToken = (
                cache.decreaseMarginInUsdFromBalance.mul(cache.position.initialMargin).div(
                    cache.position.initialMarginInUsd
                )
            ).toInt256() +
                cache.settledMargin -
                cache.decreaseMargin.toInt256();
            PositionMarginProcess.updateAllPositionFromBalanceMargin(
                requestId,
                accountProps.owner,
                cache.position.marginToken,
                changeToken,
                position.key
            );
        }
```

Below code snippet in PositionMarginProcess::updateAllPositionFromBalanceMargin() function will start incrementing the "from balance"s of the other remaining SOL and WETH positions. As we can see `updatePositionFromBalanceMargin` always gets the initial `amount` as function variable which remember it was the settle margin amount.
```solidity
bytes32[] memory positionKeys = Account.load(account).getAllPosition();
        int256 reduceAmount = amount;
        for (uint256 i; i < positionKeys.length; i++) {
            Position.Props storage position = Position.load(positionKeys[i]);
            if (token == position.marginToken && position.isCrossMargin) {
                int256 changeAmount = updatePositionFromBalanceMargin(
                    position,
                    originPositionKey.length > 0 && originPositionKey == position.key,
                    requestId,
                    amount
                ).toInt256();
                reduceAmount = amount > 0 ? reduceAmount - changeAmount : reduceAmount + changeAmount;
                if (reduceAmount == 0) {
                    break;
                }
            }
        }
```

Below code snippet in PositionMarginProcess::updatePositionFromBalanceMargin() will be executed for both SOL and WETH positions. Assume WETH is the first in the position keys line, `changeAmount` will be calculated as the `borrowMargin` because of the `min` operation and `position.initialMarginInUsdFromBalance` will be increased by the `position.initialMarginInUsdFromBalance` which is 500$. When the execution ends here and we go back to the above code snippets for loop for the SOL position, the `reduceAmount` will be decreased by 500$ and will be 1381 - 500 = 881$. 
However, when the `updatePositionFromBalanceMargin` function called for the SOL position the `amount` is still 1381 USDC. Hence, the return value for the function will be again the `borrowMargin` which is 1000$. When we go back to the loop we will update the `decreaseAmount` as 881 - 1000 = -119 and the loop ends because we looped over all the positions (no underflow since `reduceAmount` is int256). However, what happened here is that although the reduceAmount was lower than what needed to be increased for the positions "from balance" the full amount increased. Which is completely wrong and now the accounts overall "from balance"s are completely wrong as well. 
```solidity
if (amount > 0) {
            // @review how much I am borrowing
            uint256 borrowMargin = (position.initialMarginInUsd - position.initialMarginInUsdFromBalance)
                .mul(position.initialMargin)
                .div(position.initialMarginInUsd);
            changeAmount = amount.toUint256().min(borrowMargin);
            position.initialMarginInUsdFromBalance += changeAmount.mul(position.initialMarginInUsd).div(
                position.initialMargin
            );
        }
```

**Coded PoC:**
```typescript
it("From balances will be updated mistakenly", async function () {
		const wbtcAm = precision.token(1, 18); // 1 btc
		const usdcAm = precision.token(1000, 6);
		// User has 1000 USDC and 1 BTC
		await deposit(fixture, {
			account: user0,
			token: wbtc,
			amount: wbtcAm,
		});

		await deposit(fixture, {
			account: user0,
			token: usdc,
			amount: usdcAm,
		});

		const oracleBeginning = [
			{
				token: wbtcAddr,
				targetToken: ethers.ZeroAddress,
				minPrice: precision.price(25_000),
				maxPrice: precision.price(25_000),
			},
			{
				token: wethAddr,
				targetToken: ethers.ZeroAddress,
				minPrice: precision.price(1000),
				maxPrice: precision.price(1000),
			},
			{
				token: solAddr,
				targetToken: ethers.ZeroAddress,
				minPrice: precision.price(10),
				maxPrice: precision.price(10),
			},
			{
				token: usdcAddr,
				targetToken: ethers.ZeroAddress,
				minPrice: precision.price(1),
				maxPrice: precision.price(1),
			},
		];

		const orderMargin = precision.token(1000); // 1000$
		const executionFee = precision.token(2, 15);
		const tx = await orderFacet.connect(user0).createOrderRequest(
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
				orderMargin: orderMargin,
				isNativeToken: false,
			},
			{
				value: executionFee,
			}
		);

		await tx.wait();

		const requestId = await marketFacet.getLastUuid(ORDER_ID_KEY);

		await orderFacet.connect(user3).executeOrder(requestId, oracleBeginning);

		const wbtcPositionInfo = await positionFacet.getSinglePosition(
			user0.address,
			btcUsd,
			usdcAddr,
			true
		);

		let accountInfo = await accountFacet.getAccountInfo(user0.address);
		console.log("account info", accountInfo.tokenBalances);

		console.log(
			"Wbtc from balance",
			wbtcPositionInfo.initialMarginInUsdFromBalance
		);
		console.log("WBTC initial balance", wbtcPositionInfo.initialMarginInUsd);
		//////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////
		const wethMargin = precision.token(500);
		const tx2 = await orderFacet.connect(user0).createOrderRequest(
			{
				symbol: ethUsd,
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
				orderMargin: wethMargin,
				isNativeToken: false,
			},
			{
				value: executionFee,
			}
		);

		await tx2.wait();

		const requestId2 = await marketFacet.getLastUuid(ORDER_ID_KEY);

		await orderFacet.connect(user3).executeOrder(requestId2, oracleBeginning);

		const wethPositionInfo = await positionFacet.getSinglePosition(
			user0.address,
			ethUsd,
			usdcAddr,
			true
		);

		accountInfo = await accountFacet.getAccountInfo(user0.address);
		console.log("account info", accountInfo.tokenBalances);

		console.log(
			"WETH from balance",
			wethPositionInfo.initialMarginInUsdFromBalance
		);
		console.log("WETH initial balance", wethPositionInfo.initialMarginInUsd);
		//////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////

		//////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////
		const solMargin = precision.token(1000);
		const tx3 = await orderFacet.connect(user0).createOrderRequest(
			{
				symbol: solUsd,
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
				orderMargin: solMargin,
				isNativeToken: false,
			},
			{
				value: executionFee,
			}
		);

		await tx3.wait();

		const requestId3 = await marketFacet.getLastUuid(ORDER_ID_KEY);

		await orderFacet.connect(user3).executeOrder(requestId3, oracleBeginning);

		const solPositionInfo = await positionFacet.getSinglePosition(
			user0.address,
			solUsd,
			usdcAddr,
			true
		);

		accountInfo = await accountFacet.getAccountInfo(user0.address);
		console.log("account info", accountInfo.tokenBalances);

		console.log(
			"SOL from balance",
			solPositionInfo.initialMarginInUsdFromBalance
		);
		console.log("SOL initial balance", solPositionInfo.initialMarginInUsd);
		//////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////

		const oracleNext = [
			{
				token: wbtcAddr,
				targetToken: ethers.ZeroAddress,
				minPrice: precision.price(23_000),
				maxPrice: precision.price(23_000),
			},
			{
				token: wethAddr,
				targetToken: ethers.ZeroAddress,
				minPrice: precision.price(1000),
				maxPrice: precision.price(1000),
			},
			{
				token: solAddr,
				targetToken: ethers.ZeroAddress,
				minPrice: precision.price(10),
				maxPrice: precision.price(10),
			},
			{
				token: usdcAddr,
				targetToken: ethers.ZeroAddress,
				minPrice: precision.price(1),
				maxPrice: precision.price(1),
			},
		];

		//////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////

		const tx4 = await orderFacet.connect(user0).createOrderRequest(
			{
				symbol: btcUsd,
				orderSide: OrderSide.LONG,
				posSide: PositionSide.DECREASE,
				orderType: OrderType.MARKET,
				stopType: StopType.NONE,
				isCrossMargin: true,
				marginToken: usdcAddr,
				qty: BigInt(wbtcPositionInfo.qty),
				leverage: precision.rate(5),
				triggerPrice: 0,
				acceptablePrice: 0,
				executionFee: executionFee,
				placeTime: 0,
				orderMargin: 0,
				isNativeToken: false,
			},
			{
				value: executionFee,
			}
		);

		await tx4.wait();

		const requestId4 = await marketFacet.getLastUuid(ORDER_ID_KEY);

		await orderFacet.connect(user3).executeOrder(requestId4, oracleNext);

		let accountInfoFinal = await accountFacet.getAccountInfo(user0.address);
		console.log("account final", accountInfoFinal.tokenBalances);

		const solPositionInfo2 = await positionFacet.getSinglePosition(
			user0.address,
			solUsd,
			usdcAddr,
			true
		);
		const wethPositionInfo2 = await positionFacet.getSinglePosition(
			user0.address,
			ethUsd,
			usdcAddr,
			true
		);

		console.log("Weth info 2", wethPositionInfo2.initialMarginInUsdFromBalance);
		console.log("SOL info 2", solPositionInfo2.initialMarginInUsdFromBalance);
		//////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////
	});
```
## Impact
Cross accounts values will be completely off. Cross available value will be a lower number than it should be. 
Also, the opposite scenario can happen which would make the account  has more borrowing power than it should be.
Hence, high. 
## Code Snippet
https://github.com/sherlock-audit/2024-05-elfi-protocol/blob/8a1a01804a7de7f73a04d794bf6b8104528681ad/elfi-perp-contracts/contracts/process/DecreasePositionProcess.sol#L206-L336
https://github.com/sherlock-audit/2024-05-elfi-protocol/blob/8a1a01804a7de7f73a04d794bf6b8104528681ad/elfi-perp-contracts/contracts/process/DecreasePositionProcess.sol#L338-L414
https://github.com/sherlock-audit/2024-05-elfi-protocol/blob/8a1a01804a7de7f73a04d794bf6b8104528681ad/elfi-perp-contracts/contracts/process/PositionMarginProcess.sol#L274-L338
## Tool used

Manual Review

## Recommendation
Do the following for the `updateAllPositionFromBalanceMargin` function
```solidity
function updateAllPositionFromBalanceMargin(
        uint256 requestId,
        address account,
        address token,
        int256 amount,
        bytes32 originPositionKey
    ) external {
        if (amount == 0) {
            return;
        }

        bytes32[] memory positionKeys = Account.load(account).getAllPosition();
        int256 reduceAmount = amount;
        for (uint256 i; i < positionKeys.length; i++) {
            Position.Props storage position = Position.load(positionKeys[i]);
            if (token == position.marginToken && position.isCrossMargin) {
                int256 changeAmount = updatePositionFromBalanceMargin(
                    position,
                    originPositionKey.length > 0 && originPositionKey == position.key,
                    requestId,
 -                 amount
 +                reduceAmount
                ).toInt256();
                reduceAmount = amount > 0 ? reduceAmount - changeAmount : reduceAmount + changeAmount;
                if (reduceAmount == 0) {
                    break;
                }
            }
        }
    }
```



## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/0xCedar/elfi-perp-contracts/pull/13
