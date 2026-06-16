---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - sector/liquid-staking
  - sector/oracle
  - sector/stable
  - platform/openzeppelin
  - has/github
  - severity/high
  - vuln/oracle/spot-price
  - impact/data-corruption/price-manipulation
  - trigger/low-liquidity
  - trigger/price-manipulation
  - novelty/known-pattern
  - misassumption/oracle-is-reliable
  - misassumption/price-cannot-be-manipulated
  - fix/use-twap
protocol: "[[f(x) Protocol]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/fx-v2-audit"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/low-liquidity]]"
  - "[[trigger/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[chainlink-round-completeness]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-manipulation-resistance]]"
---
# Pools Can Be Subject to Price Manipulation Leading to Early Liquidations or Arbitrage

- id: 61790
- impact: HIGH
- protocol: f(x) v2 Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/fx-v2-audit

## Summary


The [[f(x) Protocol]] has a bug in its price oracle system, which is used to fetch the prices of collateral from different sources. This system is designed to use multiple on-chain pools to fetch spot prices and compare them to an anchor price to ensure accuracy. However, it has been found that an attacker can manipulate the price of a single pool and cause the system to use the manipulated price instead of the anchor price, leading to potential losses for users. To fix this issue, the f(x) Protocol team has removed a low TVL pool and implemented additional risk-control measures. They have also explained their reasoning behind the current oracle design and believe that it strikes a balance between market responsiveness and security.

## Details

The [price oracles](https://github.com/AladdinDAO/fx-protocol-contracts/tree/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/price-oracle) in the protocol are designed to fetch the prices of the collateral from the Chainlink Data feed which [acts as the `anchorPrice`](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/price-oracle/StETHPriceOracle.sol#L36-L43) and also uses multiple on-chain pools to fetch spot prices which act as [`minPrice` and `maxPrice` of the same](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/price-oracle/LSDPriceOracleBase.sol#L180-L207). `minPrice` is derived by taking the lowest of all the spot prices fetched and, similarly, `maxPrice` is derived by taking the highest of the spot prices fetched.

The [`getPrice` function](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/price-oracle/LSDPriceOracleBase.sol#L85-L99) of the oracle contracts ensures that the `minPrice` and `maxPrice` values returned from the on-chain pools have not deviated from the `anchorPrice` by more than 1%. If the price has [deviated by more than 1%](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/price-oracle/LSDPriceOracleBase.sol#L91-L97), it resets the respective deviated `minPrice` or `maxPrice` to `anchorPrice`. The `minPrice` of the collateral is used during [operating positions](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/core/pool/BasePool.sol#L92), [rebalancing](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/core/pool/BasePool.sol#L250), and [liquidations](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/core/pool/BasePool.sol#L388). On the other hand, the `maxPrice` is used in the [`redeem`](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/core/pool/BasePool.sol#L196) functionality.

However, despite the `minPrice` and `maxPrice` being allowed a deviation of 1%, only one pool is required to manipulate the price. Thus, an attacker can target the pool with the lowest TVL or a pool where manipulation can be possible in the same transaction, and manipulate the price in such a way that it causes the `anchorPrice` to deviate exactly by 1% and [bypass the deviation check](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/price-oracle/LSDPriceOracleBase.sol#L91-L97).

This manipulation of 1% of the prices allows malicious liquidators to lower the `minPrice` to force vulnerable positions to get liquidated early and generate more profits. Similarly, `maxPrice` can be manipulated to deviate by more than 1% and reset to `anchorPrice`, which opens up arbitrage opportunities during the `redeem` functionality.

By collapsing all spot prices into one `minPrice` and one `maxPrice`, and then forcing any outlier back to the anchor, the intended multi-pool resilience is negated. In practice, the system always falls back to either a single manipulated pool or the anchor feed. In other words, compromising just one low-TVL pool turns the “diversified” oracle into a single point of failure.

For example, the current [stETH price oracle](https://fxprotocol.gitbook.io/fx-docs/risk-management/oracle/steth) depends upon 3 pools for the ETH/USD spot price: [WETH/USDC Uniswap V2](https://app.uniswap.org/explore/pools/ethereum/0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc), [WETH/USDC Uniswap V3 0.05%](https://app.uniswap.org/explore/pools/ethereum/0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640), and [WETH/USDC Uniswap V3 0.3%](https://app.uniswap.org/explore/pools/ethereum/0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8). The attacker only needs to manipulate one of these pools, and given that the TVL of the Uniswap V2 pool currently stands at $19 million, it is easily manageable for an attacker to deviate the price by 1% and generate profit by liquidating high-value positions. The Uniswap V3 pools can also be subject to manipulation by a combination of multiple transactions.

Consider redesigning the price oracle to not be dependent upon a single spot price if possible. Alternatively, consider ensuring that the [selected pools](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/src/utils/oracle.ts), upon which spot prices are fetched, meet the minimum TVL requirement calculated based on the maximum liquidation profits possible and the fees paid to deviate the pool by 1% of the TVL.

***Update:** Resolved. The WETH/USDC Uniswap V2 pool with low TVL will be removed. In addition, the f(x) Protocol team has implemented sufficient risk-control measures, including an in-house team to monitor the liquidity of all the pools.*

*The f(x) Protocol team stated:*

> *The core price data used by the f(x) Protocol oracle comes from Chainlink. If the protocol goes down, the f(x) Protocol administrator needs to intervene actively and urgently stop all core functions of the f(x) Protocol, such as `operate` positions, `rebalance`, `redeem`, and `liquidate`, to avoid losses of f(x) Protocol users' assets. When the Chainlink oracle is operating normally, the protocol sets different ranges of deviation thresholds for different quoted assets.*
>
> *When the price fluctuation of the quoted asset does not exceed this range, the current quoted data is kept unchanged, which may cause a small range of price differences between the Chainlink quote and the actual market price. For operations that are very sensitive to price accuracy, such as position liquidations on the f(x) Protocol, a small range of price difference may also cause large positions to lose too much principal. As such, the data provided by Chainlink is not suitable for direct use. In order to deal with the problem of delayed Chainlink price updates, the f(x) Protocol supplements and integrates spot price data from multiple DEXs.*
>
> *Although spot prices are closer to the real-time market status, they are more likely to be manipulated. To avoid any price manipulations on DEXes, the f(x) Protocol weighs the characteristics of Chainlink's price stability and the timeliness of DEX spot prices and builds a balance mechanism, which forms the current f(x) Protocol oracle quotation rules, namely: the f(x) Protocol selects all DEX spot price data and the anchor price provided by Chainlink to obtain the maximum price data `maxPrice` and the minimum price data `minPrice`.*
>
> *If the price deviation between the maximum price data `maxPrice` (minimum price data `minPrice`) and the `anchorPrice` does not exceed the preset parameter `maxPriceDeviation`, the data is considered valid. Otherwise, the `anchorPrice` will be used as the valid data. Under the current f(x) price acquisition rules, if a malicious attacker manipulates the spot price of a DEX to deviate from the price range of the protocol preset parameter `maxPriceDeviation`, then f(x) Protocol will eventually use the more credible `anchorPrice` as the effective price.*
>
> *Compared with the best price in the current market, the pricing strategy of f(x) Protocol may cause users to lose a very small proportion of their assets when prices are manipulated or when market prices fluctuate greatly. This is similar to the inevitable slippage in AMM and is an acceptable compromise under the premise of ensuring system robustness. On the other hand, this design can greatly reduce the risk of spot price attacks and better protect the security of users' assets. Therefore, on the whole, we believe that the current pricing strategy of f(x) Protocol is in the best interests of users.*
>
> *Regarding the question "manipulating a specific pool so that its price deviates by exactly 1% from the `anchorPrice`, bypassing deviation detection, and creating arbitrage opportunities.", we analyze the functional modules that use these prices in f(x) Protocol (taking stETH assets as an example):*
>
> ***Functional modules using `minPrice`: `operate` positions, `rebalance`, and `liquidate` operations.***
>
> *1. **`operate` positions operation**: `minPrice` price data is only used to determine the value of user collateral when there is over-collateralization. Even if the attacker manipulates the minimum price to make it deviate from the `anchorPrice` by 1%, due to the existence of the over-collateralization mechanism, the price manipulation behavior of a single transaction will not have any adverse effects on the protocol.*
>
> *2. **`rebalance` and `liquidate` operations**: From the above analysis, we can know that, in theory, it is possible to control the `minPrice` to make it deviate from the `anchorPrice` by just 1%, but in practice, attackers need to consider the difficulty and attack cost more. In most cases, f(x) Protocol performs `rebalance` and `liquidate` operations accompanied by a sharp drop in the price of the collateral asset.*
>
> *First, the spot price of each DEX fluctuates greatly at this time, and the `anchorPrice` corresponding to Chainlink also changes accordingly. It is very difficult to accurately manipulate the spot price so that the price difference between it and the `anchorPrice` is within 1% (ensuring the maximization of potential attack profits).*
>
> *Secondly, even if the attacker happens to construct a matching `minPrice`, due to the sharp drop in the price of the collateral asset at this time, there must be a large number of swap transactions in the corresponding pool, so the 1% profit earned by the attacker is likely to be insufficient to cope with slippage, handling fees and other fees, which further compresses the arbitrage space.*
>
> *Finally, the `anchorPrice` provided by Chainlink combines the price data of various protocols or exchanges in the current market and provides the average price of the current market. The price change itself is lagging. When the price of the collateral asset falls, it is very likely that the spot price of some DEXs will differ from the `anchorPrice` by more than 1%. In this case, if the protocol directly uses the `anchorPrice`, the attack behavior will be more complicated and require additional costs (pull all pool prices exceeding 1% back to within 1%).*
>
> *In summary, the attacker's method of manipulating the minimum price to make it deviate from the `anchorPrice` by 1% faces great difficulty, uncertainty, and high cost, and is difficult to achieve.*
>
> ***Functional module using `maxPrice`: `redeem` operation**.*
>
> *3. In the upcoming upgraded version, the `redeem` operation will only be allowed to be executed when the fxUSD token is unpegged. Assuming that the current fxUSD is unpegged, although this situation is rare, the attacker needs to manipulate all spot prices at this time to make the spot prices that exceed the `anchorPrice` fall back to the `anchorPrice` in order to redeem the higher value collateral. Obviously, this attack requires the attacker to pay the cost of controlling multiple pools. From the final result, even if the attacker finally uses the `anchorPrice` to redeem the collateral assets, the price is still in a reasonable price range in the market, although this price is not the most favorable price for the user's position and there is no significant arbitrage space.*
>
> *Overall, the attacker's solution of manipulating a specific pool to control the spot price and bypass deviation detection to achieve the purpose of arbitrage liquidation is very difficult to implement and requires a high attack cost. In order to deal with oracle price manipulation, f(x) Protocol has introduced a series of risk control measures, from obtaining effective price solutions to real-time monitoring on the chain, such as the following:*
>
> * *1. As mentioned in the question, f(x) Protocol selects the pool with good liquidity and top TVL in the current market as the spot price source for different collateral assets.*
> * *2. For different collateral assets, f(x) Protocol combines the deviation threshold of Chainlink's `anchorPrice` and designs different preset parameters `maxPriceDeviation`.*
> * *3. When running on the current chain, multiple watchers are added to quickly adjust user positions when the price of the mortgage asset fluctuates greatly, greatly reducing the probability of user positions being liquidated.*
>
> *Therefore, we believe that the current price mechanism of f(x) Protocol has achieved a reasonable trade-off between anti-manipulation and market reflection, which is in the best interests of users. And, in the meantime, we have an in-house team that is monitoring the liquidity of all pools and will remove pools with small liquidity.*
>
> *At the end, we would like to present the rationale behind our current oracle design:*
>
> * ***Anchor Price from Chainlink**: Serves as the base for all comparisons.*
> * ***Deviation Thresholds**: Each asset has a max price deviation (e.g., 1% for stETH, 2% for WBTC). If spot prices stay within this deviation from the anchor, they are accepted; otherwise, the system falls back to `anchorPrice`.*
> * ***Spot Price Aggregation**: Spot prices are collected from multiple high-liquidity DEX pools to reduce manipulation exposure.*
>
> ***Key Mitigation Points**:*
>
> * *If an attacker manipulates a single DEX pool beyond the deviation threshold, its price is ignored.*
> * *The use of `minPrice` for liquidation and `maxPrice` for redemption ensures a defensible balance between reactivity and manipulation resistance.*
> * *`redeem` is only enabled off-peg, and even then, arbitrage is economically infeasible.*
> * *The WETH/USDC Uniswap V2 pool with low TVL has been removed.*
> * *All spot sources are selected for depth and reliability, and additional on-chain watchers assist with fast-moving markets.*
>
> *We believe that this approach achieves a strong trade-off between market responsiveness and security.*
