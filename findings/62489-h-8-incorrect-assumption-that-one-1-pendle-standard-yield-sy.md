---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/lending
  - sector/oracle
  - sector/staking
  - sector/token
  - sector/vault
protocol: "[[Notional]]"
auditors:
  - "[[mstpr-brainbot]]"
  - "[[xiaoming90]]"
report: "https://github.com/sherlock-audit/2025-06-notional-exponent-judging"
genome:
  - "[[overflow]]"
  - "[[indirect-loss]]"
  - "[[chainlink-round-completeness]]"
  - "[[fot-slippage]]"
  - "[[integer-bounds]]"
---
# H-8: Incorrect assumption that one (1) Pendle Standard Yield (SY) token is equal to one (1) Yield Token when computing the price in the oracle

- id: 62489
- impact: HIGH
- protocol: [[Notional]] Exponent
- reporter: mstpr-brainbot (Sherlock)
- source: N/A

## Summary


This bug report is about an issue found in the Pendle yield strategy code. The bug was discovered by two individuals and it is caused by an incorrect assumption in the code. The code assumes that one Pendle Standard Yield (SY) token is equal to one Yield Token when calculating the price in the oracle. However, this is not always true and can result in an inflated price. This bug can have a high impact as it can lead to the protocol's solvency being affected and an increased risk of bad debt. There is currently no response or mitigation for this bug.

## Details


Source: https://github.com/sherlock-audit/2025-06-notional-exponent-judging/issues/689 

## Found by 
mstpr-brainbot, xiaoming90

### Summary

-

### Root Cause

- Incorrect assumption that one (1) Pendle Standard Yield (SY) token is equal to one (1) Yield Token when computing the price in the oracle

### Internal Pre-conditions

-

### External Pre-conditions

-

### Attack Path

When deploying the Pendle yield strategy, the deployer can choose to set the `useSyOracleRate_` to true or false. If `useSyOracleRate_` is set to true, the `PENDLE_ORACLE.getPtToSyRate()` function will be used to get the PT rate.

An example of such a setup is shown in the test script provided with the codebase, where the `useSyOracleRate_` setting is set to true in Line 115 below. 

https://github.com/sherlock-audit/2025-06-notional-exponent/blob/main/notional-v4/tests/TestPTStrategyImpl.sol#L111

```solidity
File: TestPTStrategyImpl.sol
079:     function deployYieldStrategy() internal override {
080:         strategyName = "Pendle PT";
081:         address(deployCode("PendlePTLib.sol:PendlePTLib"));
082: 
083:         setMarketVariables();
084:         bool isSUSDe = tokenOut == address(sUSDe);
085: 
..SNIP..
106:         }
107: 
108:         w = ERC20(y.yieldToken());
109:         // NOTE: is tokenOut the right token to use here?
110:         (AggregatorV2V3Interface baseToUSDOracle, ) = TRADING_MODULE.priceOracles(address(tokenOut));
111:         PendlePTOracle pendleOracle = new PendlePTOracle(
112:             market,
113:             baseToUSDOracle,
114:             false,
115:             true, // @audit-info useSyOracleRate_
116:             15 minutes,
117:             "Pendle PT",
118:             address(0)
119:         );
120: 
121:         o = new MockOracle(pendleOracle.latestAnswer());
122:     }
```

When the `useSyOracleRate` is set to true, `PENDLE_ORACLE.getPtToSyRate()` function in Line 63 below will be used to get the PT rate. Note that `getPtToSyRate` will return how much Pendle's Standard Yield (SY) token per PT token.

https://github.com/sherlock-audit/2025-06-notional-exponent/blob/main/notional-v4/src/oracles/PendlePTOracle.sol#L63

```solidity
File: PendlePTOracle.sol
61:     function _getPTRate() internal view returns (int256) {
62:         uint256 ptRate = useSyOracleRate ?
63:             PENDLE_ORACLE.getPtToSyRate(pendleMarket, twapDuration) :
64:             PENDLE_ORACLE.getPtToAssetRate(pendleMarket, twapDuration);
65:         return ptRate.toInt();
66:     }
```

Note that Chainlink or other oracle providers do not provide a price feed directly for the Pendle SY token.

The root cause here is that the codebase incorrectly assumes the price of Pendle SY Token is always equivalent to the Yield Token. Thus, the protocol assumes that it is fine to use the price feed for the Yield Token for Pendle SY Token when computing the price. While this is generally true, it is not always the case that 1 SY == 1 Yield Token.

Not all SY contracts will burn one (1) SY share and return one (1) yield token back. Inspecting the Pendle's source code reveals that for some SY contracts, some redemptions will involve withdrawing/redemption from external staking protocol or performing swaps, which might suffer from slippage or fees.

Below is the Pendle's `SY.redeem` function showing that slippage might occur during the exchange, and thus 1 SY == 1 Yield Token does not always hold.

https://github.com/pendle-finance/pendle-core-v2-public/blob/46d13ce4168e8c5ad9e5641dd6380fea69e48490/contracts/interfaces/IStandardizedYield.sol#L87

```solidity
File: IStandardizedYield.sol
74:     /**
75:      * @notice redeems an amount of base tokens by burning some shares
76:      * @param receiver recipient address
77:      * @param amountSharesToRedeem amount of shares to be burned
78:      * @param tokenOut address of the base token to be redeemed
79:      * @param minTokenOut reverts if amount of base token redeemed is lower than this
80:      * @param burnFromInternalBalance if true, burns from balance of `address(this)`, otherwise burns from `msg.sender`
81:      * @return amountTokenOut amount of base tokens redeemed
82:      * @dev Emits a {Redeem} event
83:      *
84:      * Requirements:
85:      * - (`tokenOut`) must be a valid base token.
86:      */
87:     function redeem(
88:         address receiver,
89:         uint256 amountSharesToRedeem,
90:         address tokenOut,
91:         uint256 minTokenOut,
92:         bool burnFromInternalBalance
93:     ) external returns (uint256 amountTokenOut);
```

The following `_calculateBaseToQuote()` function will be used to compute how many asset tokens are worth per PT token. Assume that `useSyOracleRate_` is true.

- The `baseToUSD` will return how many asset tokens per Yield Token. Only the price feed of Yield token is supported by Chainlink and other oracle providers.
- The `_getPTRate` will return how many Pendle SY tokens per PT token

The following formula is used to compute how many asset tokens are worth per PT token:

```solidity
(asset tokens per PT) = (asset tokens per Yield Token) * (Pendle SY tokens per PT token)
```

This formula will only work if `Yield Token` is equivalent to `Pendle SY tokens`. However, as mentioned earlier, this is not true. In some cases, one Pendle SY token might be worth 0.95 Yield Token. In this case, the price returned will be inflated since it assumes that 1 SY == 1 Yield Token.

https://github.com/sherlock-audit/2025-06-notional-exponent/blob/main/notional-v4/src/oracles/PendlePTOracle.sol#L68

```solidity
File: PendlePTOracle.sol
68:     function _calculateBaseToQuote() internal view override returns (
69:         uint80 roundId,
70:         int256 answer,
71:         uint256 startedAt,
72:         uint256 updatedAt,
73:         uint80 answeredInRound
74:     ) {
75:         int256 baseToUSD;
76:         (
77:             roundId,
78:             baseToUSD,
79:             startedAt,
80:             updatedAt,
81:             answeredInRound
82:         ) = baseToUSDOracle.latestRoundData();
83:         require(baseToUSD > 0, "Chainlink Rate Error");
84:         // Overflow and div by zero not possible
85:         if (invertBase) baseToUSD = (baseToUSDDecimals * baseToUSDDecimals) / baseToUSD;
86: 
87:         int256 ptRate = _getPTRate();
88:         answer = (ptRate * baseToUSD) / baseToUSDDecimals;
89:     }
```

### Impact

High. Price computed will be inflated, leading collateral to be overvalued. As a result, users are allowed to borrow more than expected, affecting the protocol's solvency and increasing the risk of bad debt.

### PoC

_No response_

### Mitigation

_No response_
