---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/lending
  - sector/oracle
  - sector/stable
protocol: "[[Notional]]"
auditors:
  - "[[blackhole]]"
  - "[[nirohgo]]"
  - "[[xiaoming90]]"
report: "https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging"
genome:
  - "[[stale-price]]"
  - "[[direct-drain]]"
  - "[[chainlink-round-completeness]]"
  - "[[timestamp-dependence]]"
  - "[[token-decimal-normalization]]"
  - "[[oracle-manipulation-resistance]]"
---
# H-5: Incorrect valuation of vault share

- id: 35118
- impact: HIGH
- protocol: [[Notional]] Leveraged Vaults: Pendle PT and Vault Incentives
- reporter: blackhole (Sherlock)
- source: N/A

## Summary


This report discusses a bug found in the code for computing the valuation of vault shares. This bug allows malicious users to borrow more than the actual collateral value, draining assets from the protocol. The bug is caused by an incorrect formula used to calculate the value of a withdraw request in terms of the borrowed token. The code uses an incorrect exchange rate and does not account for the precision of the tokens. This results in an overinflated value for the withdraw request, allowing malicious users to steal assets. The report recommends updating the formula to account for the precision of the tokens.

## Details

Source: https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging/issues/60 

## Found by 
blackhole, nirohgo, xiaoming90
## Summary

The code for computing the valuation of the vault shares was found to be incorrect. As a result, the account's collateral will be overinflated, allowing malicious users to borrow significantly more than the actual collateral value, draining assets from the protocol.

## Vulnerability Detail

Let $BT$ be the borrowed token with 6 decimal precision, and $RT$ be the redemption token with 18 decimal precision.

When a withdraw request has split and is finalized, the following `_getValueOfSplitFinalizedWithdrawRequest` function will be used to calculate the value of a withdraw request in terms of the borrowed token ($BT$).

In Line 77 below, the `Deployments.TRADING_MODULE.getOraclePrice` function will be called to fetch the exchange rate of the redemption token ($RT$) and borrowed token ($BT$).

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/WithdrawRequestBase.sol#L77

```solidity
File: WithdrawRequestBase.sol
65:     function _getValueOfSplitFinalizedWithdrawRequest(
66:         WithdrawRequest memory w,
67:         SplitWithdrawRequest memory s,
68:         address borrowToken,
69:         address redeemToken
70:     ) internal virtual view returns (uint256) {
71:         // If the borrow token and the withdraw token match, then there is no need to apply
72:         // an exchange rate at this point.
73:         if (borrowToken == redeemToken) {
74:             return (s.totalWithdraw * w.vaultShares) / s.totalVaultShares;
75:         } else {
76:             // Otherwise, apply the proper exchange rate
77:             (int256 rate, /* */) = Deployments.TRADING_MODULE.getOraclePrice(redeemToken, borrowToken);
78: 
79:             return (s.totalWithdraw * rate.toUint() * w.vaultShares) / 
80:                 (s.totalVaultShares * Constants.EXCHANGE_RATE_PRECISION);
81:         }
82:     }
```

Within the `Deployments.TRADING_MODULE.getOraclePrice` function, chainlink oracle will be used. Refer to the source code's comment on Lines 255-257 below for more details. Note that the $RT$ is the base, while the $BT$ is the quote here.

Assume that one $BT$ is worth 1 USD, so the `quotePrice` will be 1e8. Assume that one $RT$ is worth 10 USD, so the `basePrice` will be 10e18. Note that Chainlink oracle's price is always denominated in 8 decimals for USD price feed.

This function will always return the exchange rate is `RATE_DECIMALS` (18 decimals - Hardcoded). Thus, based on the calculation in Lines 283-285, the exchange rate returned will be 10e18, which is equivalent to one unit of $RT$ is worth 10 units of $BT$.

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/trading/TradingModule.sol#L283

```solidity
File: TradingModule.sol
255:     /// @notice Returns the Chainlink oracle price between the baseToken and the quoteToken, the
256:     /// Chainlink oracles. The quote currency between the oracles must match or the conversion
257:     /// in this method does not work. Most Chainlink oracles are baseToken/USD pairs.
258:     /// @param baseToken address of the first token in the pair, i.e. USDC in USDC/DAI
259:     /// @param quoteToken address of the second token in the pair, i.e. DAI in USDC/DAI
260:     /// @return answer exchange rate in rate decimals
261:     /// @return decimals number of decimals in the rate, currently hardcoded to 1e18
262:     function getOraclePrice(address baseToken, address quoteToken)
263:         public
264:         view
265:         override
266:         returns (int256 answer, int256 decimals)
267:     {
268:         _checkSequencer();
269:         PriceOracle memory baseOracle = priceOracles[baseToken];
270:         PriceOracle memory quoteOracle = priceOracles[quoteToken];
271: 
272:         int256 baseDecimals = int256(10**baseOracle.rateDecimals);
273:         int256 quoteDecimals = int256(10**quoteOracle.rateDecimals);
274: 
275:         (/* */, int256 basePrice, /* */, uint256 bpUpdatedAt, /* */) = baseOracle.oracle.latestRoundData();
276:         require(block.timestamp - bpUpdatedAt <= maxOracleFreshnessInSeconds);
277:         require(basePrice > 0); /// @dev: Chainlink Rate Error
278: 
279:         (/* */, int256 quotePrice, /* */, uint256 qpUpdatedAt, /* */) = quoteOracle.oracle.latestRoundData();
280:         require(block.timestamp - qpUpdatedAt <= maxOracleFreshnessInSeconds);
281:         require(quotePrice > 0); /// @dev: Chainlink Rate Error
282: 
283:         answer =
284:             (basePrice * quoteDecimals * RATE_DECIMALS) / 
285:             (quotePrice * baseDecimals);
286:         decimals = RATE_DECIMALS;
287:     }
```

The `rate` at Line 77 below will be 10e18 based on our earlier calculation. Note the following:

- `s.totalWithdraw` is the total $RT$ claimed and is denominated in 18 decimals (Token's native precision). Assume that `s.totalWithdraw=100e18 RT` was claimed.
- `w.vaultShares` and `s.totalVaultShares` are the number of vault shares and is denominated in 8 decimals (`INTERNAL_TOKEN_PRECISION`). Assume that `w.vaultShares=5e8` and `s.totalVaultShares=10e8`
- `Constants.EXCHANGE_RATE_PRECISION` is 1e18

Intuitively, the split's total withdraw (`s.totalWithdraw`) is 100 units of $RT$. In terms of the borrowed token ($BT$), it will be 1000 units of $BT$ since the price is (1:10). Since the withdraw request owns 50% of the vault shares in the split withdraw request, it is entitled to 500 units of $BT$.

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/WithdrawRequestBase.sol#L77

```solidity
File: WithdrawRequestBase.sol
65:     function _getValueOfSplitFinalizedWithdrawRequest(
66:         WithdrawRequest memory w,
67:         SplitWithdrawRequest memory s,
68:         address borrowToken,
69:         address redeemToken
70:     ) internal virtual view returns (uint256) {
71:         // If the borrow token and the withdraw token match, then there is no need to apply
72:         // an exchange rate at this point.
73:         if (borrowToken == redeemToken) {
74:             return (s.totalWithdraw * w.vaultShares) / s.totalVaultShares;
75:         } else {
76:             // Otherwise, apply the proper exchange rate
77:             (int256 rate, /* */) = Deployments.TRADING_MODULE.getOraclePrice(redeemToken, borrowToken);
78: 
79:             return (s.totalWithdraw * rate.toUint() * w.vaultShares) / 
80:                 (s.totalVaultShares * Constants.EXCHANGE_RATE_PRECISION);
81:         }
82:     }
```

To calculate the value of a withdraw request in terms of the borrowed token ($BT$), the following formula at Line 79 above will be used:

```solidity
(s.totalWithdraw * rate * w.vaultShares) / (s.totalVaultShares * Constants.EXCHANGE_RATE_PRECISION)
(100e18 * 10e18 * 5e8) / (10e8 * 1e18)
500000000000000000000
500000000000000e6
```

However, the code above indicates that the withdraw request is entitled to 500000000000000 units of $BT$ instead of 500 units of $BT$, which is overly inflated. As a result, the account's collateral will be overly inflated.

## Impact

The account's collateral will be overinflated, allowing malicious users to borrow significantly more than the actual collateral value, stealing assets from the protocol.

## Code Snippet

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/WithdrawRequestBase.sol#L77

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/trading/TradingModule.sol#L283

## Tool used

Manual Review

## Recommendation

Update the formula to as follows:

```diff
- (s.totalWithdraw * rate.toUint() * w.vaultShares) / (s.totalVaultShares * Constants.EXCHANGE_RATE_PRECISION);
+ (s.totalWithdraw * rate.toUint() * w.vaultShares * BORROW_PRECISION) / (s.totalVaultShares * Constants.EXCHANGE_RATE_PRECISION * REDEMPTION_PRECISION);
```

`BORROW_PRECISION` = 1e6 and `REDEMPTION_PRECISION` = 1e18.

Let's redo the calculation to verify that the new formula works as intended:

```solidity
(s.totalWithdraw * rate.toUint() * w.vaultShares * BORROW_PRECISION) / (s.totalVaultShares * Constants.EXCHANGE_RATE_PRECISION * REDEMPTION_PRECISION);
(100e18 * 10e18 * 5e8 * 1e6) / (10e8 * 1e18 * 1e18)
500000000
500e6
```

The new formula returned  500 units of $BT$, which is correct.
