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
  - "[[nirohgo]]"
  - "[[xiaoming90]]"
report: "https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging"
genome:
  - "[[decimal-mismatch]]"
  - "[[direct-drain]]"
  - "[[chainlink-round-completeness]]"
  - "[[integer-bounds]]"
  - "[[timestamp-dependence]]"
  - "[[token-decimal-normalization]]"
---
# H-9: Wrong decimal precision resulted in the price being inflated

- id: 35122
- impact: HIGH
- protocol: [[Notional]] Leveraged Vaults: Pendle PT and Vault Incentives
- reporter: xiaoming90 (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue with the decimal precision in the Notional platform's `PendlePTOracle` contract. Due to this error, the price returned from the oracle is inflated, which can allow malicious users to borrow more assets than they actually have, potentially stealing from the protocol. The report provides details on how the incorrect decimal precision is causing the issue and includes code snippets to illustrate the problem. The impact of this bug is significant, and the report recommends updating the formula to ensure the correct decimal precision is used. The tool used to identify this bug was manual review.

## Details

Source: https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging/issues/66 

## Found by 
nirohgo, xiaoming90
## Summary

The wrong decimal precision inflated the price returned from the oracle. As a result, the account's collateral will be overinflated, allowing malicious users to borrow significantly more than the actual collateral value, stealing assets from the protocol.

## Vulnerability Detail

When Notional's `PendlePTOracle` is deployed, the `ptDecimals` is set to the decimals of the PT token, as shown below.

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/oracles/PendlePTOracle.sol#L58

```solidity
File: PendlePTOracle.sol
32:     constructor (
..SNIP..
50:         uint8 _baseDecimals = baseToUSDOracle_.decimals();
51:         (/* */, address pt, /* */) = IPMarket(pendleMarket_).readTokens();
52:         uint8 _ptDecimals = IERC20(pt).decimals();
..SNIP..
57:         baseToUSDDecimals = int256(10**_baseDecimals);
58:         ptDecimals = int256(10**_ptDecimals);
```

The `_getPTRate` function below will return:

- If `useSyOracleRate` is true, the Pendle's `getPtToSyRate` function will be called to return how many SY tokens one unit of PT is worth
- If `useSyOracleRate` is false,  the Pendle's `getPtToAssetRate` function will be called to return how many underlying asset tokens one unit of PT is worth

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/oracles/PendlePTOracle.sol#L85

```solidity
File: PendlePTOracle.sol
85:     function _getPTRate() internal view returns (int256) {
86:         uint256 ptRate = useSyOracleRate ? 
87:             Deployments.PENDLE_ORACLE.getPtToSyRate(pendleMarket, twapDuration) :
88:             Deployments.PENDLE_ORACLE.getPtToAssetRate(pendleMarket, twapDuration);
89:         return ptRate.toInt();
90:     }
```

Using PT fUSDC 26DEC2024 as an example to illustrate the issue. Note that this issue will also occur on other PTs due to wrong math.

Assume that the `PendlePTOracle` provides the price of PT fUSDC 26DEC2024. For PT fUSDC 26DEC2024, the details are as follows:

> [YT fUSDC 26DEC2024 (YT-fUSDC-...)](https://etherscan.io/token/0x5935cEdD7D33a32cD60e0F97cFf54A6Bbdbe7Eee) = 6 decimals
>
> [PT fUSDC 26DEC2024 (PT-fUSDC-...)](https://etherscan.io/token/0xd187bea2c423d908d102ebe5ee8c65d37f4085c3) = 6 decimals
>
> [SY fUSDC (SY-fUSDC)](https://etherscan.io/token/0xf94A3798B18140b9Bc322314bbD36BC8e245E29B) = 8 decimals
>
> Underlying Asset = [Flux USDC (fUSDC)](https://etherscan.io/token/0x465a5a630482f3abd6d3b84b39b29b07214d19e5) = 8 decimals
>
> Market = 0xcb71c2a73fd7588e1599df90b88de2316585a860
>
> Pendle's Market Page: https://app.pendle.finance/trade/markets/0xcb71c2a73fd7588e1599df90b88de2316585a860/swap?view=pt&chain=ethereum&py=output

In this case, the `ptDecimals` will be 1e6. The `rateDecimals` is always hardcoded to `1e18`.

Assume that the `baseToUSD` provides the price of fUSDC in terms of US dollars, and `baseToUSDDecimals` is 1e8. The price returned is `99990557`, close to 1 US Dollar (USD).

Assume that `useSyOracleRate` is set to `False`, the Pendle's `getPtToAssetRate` function will be called, and the price (`ptRate`) returned will be `978197897539187120`, as shown below.

https://etherscan.io/address/0x9a9fa8338dd5e5b2188006f1cd2ef26d921650c2#readProxyContract

<img width="325" alt="image-2024070225519056 PM" src="https://github.com/sherlock-audit/2024-06-leveraged-vaults-xiaoming9090/assets/102820284/93cc94d4-c54c-47d0-95ef-993a8a41e231">

The above-returned price (`978197897539187120`) is in 18 decimals. This means 1 PT is worth around 1 fUSDC (`978197897539187120 / 1e18`), which makes sense.

However, based on the formula at Line 117 below, the price of the PT fUSDC 26DEC2024 will be `9.781055263e29`, which is incorrect and is an extremely large number (inflated by 12 orders of magnitude). This is far from the intended price of PT fUSDC 26DEC2024, which should hover around 1 USD.

```solidity
answer = (ptRate * baseToUSD * rateDecimals) /(baseToUSDDecimals * ptDecimals)
answer = (978197897539187120 * baseToUSD * rateDecimals) /(baseToUSDDecimals * 1e6)
answer = (978197897539187120 * 99990557 * rateDecimals) /(1e8 * 1e6)
answer = (978197897539187120 * 99990557 * 1e18) /(1e8 * 1e6)
answer = 9.781055263e29
```

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/oracles/PendlePTOracle.sol#L117

```solidity
File: PendlePTOracle.sol
092:     function _calculateBaseToQuote() internal view returns (
093:         uint80 roundId,
094:         int256 answer,
095:         uint256 startedAt,
096:         uint256 updatedAt,
097:         uint80 answeredInRound
098:     ) {
099:         _checkSequencer();
100: 
101:         int256 baseToUSD;
102:         (
103:             roundId,
104:             baseToUSD,
105:             startedAt,
106:             updatedAt,
107:             answeredInRound
108:         ) = baseToUSDOracle.latestRoundData();
109:         require(baseToUSD > 0, "Chainlink Rate Error");
110:         // Overflow and div by zero not possible
111:         if (invertBase) baseToUSD = (baseToUSDDecimals * baseToUSDDecimals) / baseToUSD;
112: 
113:         // Past expiration, hardcode the PT oracle price to 1. It is no longer tradable and
114:         // is worth 1 unit of the underlying SY at expiration.
115:         int256 ptRate = expiry <= block.timestamp ? ptDecimals : _getPTRate();
116: 
117:         answer = (ptRate * baseToUSD * rateDecimals) /
118:             (baseToUSDDecimals * ptDecimals);
119:     }
```

The root cause is that the code wrongly assumes that the price returned from Pendle's `getPtToAssetRate` function is denominated in PT's decimals. However, it is, in fact, denominated in 18 decimals. Thus, when the PT is not 18 decimals, such as the one in our example (6 decimals), the price returned from Notional's `PendlePTOracle` will be overly inflated.

## Impact

The price returned from the Notional's `PendlePTOracle` contract will be inflated. As a result, the account's collateral will be overinflated, allowing malicious users to borrow significantly more than the actual collateral value, stealing assets from the protocol.

## Code Snippet

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/oracles/PendlePTOracle.sol#L58

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/oracles/PendlePTOracle.sol#L85

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/oracles/PendlePTOracle.sol#L117

## Tool used

Manual Review

## Recommendation

Update the formula to ensure that the PT rate is divided by the rate decimals of Pendle's PT Oracle.
