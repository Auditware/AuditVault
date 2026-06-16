---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/oracle
  - sector/stable
protocol: "[[USSD]]"
auditors:
  - "[[0xStalin]]"
  - "[[0xeix]]"
  - "[[0xlmanini]]"
  - "[[Bahurum]]"
  - "[[Brenzee]]"
  - "[[Dug]]"
  - "[[G-Security]]"
  - "[[PNS]]"
  - "[[Proxy]]"
  - "[[SanketKogekar]]"
  - "[[T1MOH]]"
  - "[[Vagner]]"
  - "[[WATCHPUG]]"
  - "[[ast3ros]]"
  - "[[ctf_sec]]"
  - "[[immeas]]"
  - "[[juancito]]"
  - "[[kutugu]]"
  - "[[n33k]]"
  - "[[peanuts]]"
  - "[[pengun]]"
  - "[[qbs]]"
  - "[[qpzm]]"
  - "[[saidam017]]"
  - "[[sam_gmk]]"
  - "[[sashik_eth]]"
  - "[[twicek]]"
report: "https://github.com/sherlock-audit/2023-05-USSD-judging"
genome:
  - "[[decimal-mismatch]]"
  - "[[direct-drain]]"
  - "[[chainlink-round-completeness]]"
---
# H-4: The price from `StableOracleDAI` is returned with the incorrect number of decimals

- id: 19133
- impact: HIGH
- protocol: [[USSD]] - Autonomous Secure Dollar
- reporter: 0xStalin (Sherlock)
- source: N/A

## Summary


A bug has been found in the `StableOracleDAI` contract of the 2023-05-USSD protocol. It was identified by a group of auditors including 0xStalin, 0xeix, 0xlmanini, Bahurum, Brenzee, Dug, G-Security, PNS, Proxy, SanketKogekar, T1MOH, Vagner, WATCHPUG, ast3ros, ctf\_sec, immeas, juancito, kutugu, n33k, peanuts, pengun, qbs, qpzm, saidam017, sam\_gmk, sashik\_eth, and twicek.

The `getPriceUSD` function of the `StableOracleDAI` is designed to return the price of DAI in USD. The function assumes that the `DAIWethPrice` is 8 decimals and multiplies it by `1e10` to scale it up to 18 decimals. However, the Chainlink DAI/ETH price feed returns a value with 18 decimals as can be seen on their site. This means that the price returned from the `getPriceUSD` function is scaled up by `1e10`, which results in 28 decimals instead of the intended 18, drastically overvaluing the DAI/USD price.

This will result in the USSD token price being a tiny fraction of what it is intended to be. Instead of being pegged to $1, it will be pegged to $0.0000000001, completely defeating the purpose of the protocol. For example, if a user calls `USSD.mintForToken`, supplying DAI, they'll be able to mint `1e10` times more USSD than intended.

The code snippet for the `getPriceUSD` function can be found at https://github.com/sherlock-audit/2023-05-USSD/blob/main/ussd-contracts/contracts/oracles/StableOracleDAI.sol#L33-L53.

The recommendation to fix this issue is to remove the `* 1e10` from the return statement.

```diff
-   return (wethPriceUSD * 1e18) / ((DAIWethPrice + uint256(

## Details

Source: https://github.com/sherlock-audit/2023-05-USSD-judging/issues/236 

## Found by 
0xStalin, 0xeix, 0xlmanini, Bahurum, Brenzee, Dug, G-Security, PNS, Proxy, SanketKogekar, T1MOH, Vagner, WATCHPUG, ast3ros, ctf\_sec, immeas, juancito, kutugu, n33k, peanuts, pengun, qbs, qpzm, saidam017, sam\_gmk, sashik\_eth, twicek
## Summary

The price returned from the `getPriceUSD` function of the `StableOracleDAI` is scaled up by `1e10`, which results in 28 decimals instead of the intended 18.

## Vulnerability Detail

In `StableOracleDAI` the `getPriceUSD` function is defined as follows...

```solidity
    function getPriceUSD() external view override returns (uint256) {
        address[] memory pools = new address[](1);
        pools[0] = 0x60594a405d53811d3BC4766596EFD80fd545A270;
        uint256 DAIWethPrice = DAIEthOracle.quoteSpecificPoolsWithTimePeriod(
            1000000000000000000, // 1 Eth
            0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2, // WETH (base token)
            0x6B175474E89094C44Da98b954EedeAC495271d0F, // DAI (quote token)
            pools, // DAI/WETH pool uni v3
            600 // period
        );

        uint256 wethPriceUSD = ethOracle.getPriceUSD();

        // chainlink price data is 8 decimals for WETH/USD, so multiply by 10 decimals to get 18 decimal fractional
        //(uint80 roundID, int256 price, uint256 startedAt, uint256 timeStamp, uint80 answeredInRound) = priceFeedDAIETH.latestRoundData();
        (, int256 price,,,) = priceFeedDAIETH.latestRoundData();

        return (wethPriceUSD * 1e18) / ((DAIWethPrice + uint256(price) * 1e10) / 2);
    }
```

The assumption is made that the `DAIWethPrice` is 8 decimals, and is therefore multiplied by `1e10` in the return statement to scale it up to 18 decimals. 

The _other_ price feeds used in the protocol are indeed received with decimals, however, the Chainlink DAI/ETH price feed returns a value with 18 decimals as can be seen on their site.

https://docs.chain.link/data-feeds/price-feeds/addresses

## Impact

This means that the price returned from the `getPriceUSD` function is scaled up by `1e10`, which results in 28 decimals instead of the intended 18, drastically overvaluing the DAI/USD price.

This will result in the USSD token price being a tiny fraction of what it is intended to be. Instead of being pegged to $1, it will be pegged to $0.0000000001, completely defeating the purpose of the protocol.

For example, if a user calls `USSD.mintForToken`, supplying DAI, they'll be able to mint `1e10` times more USSD than intended.

## Code Snippet

https://github.com/sherlock-audit/2023-05-USSD/blob/main/ussd-contracts/contracts/oracles/StableOracleDAI.sol#L33-L53

## Tool used

Manual Review

## Recommendation

Remove the `* 1e10` from the return statement.

```diff
-   return (wethPriceUSD * 1e18) / ((DAIWethPrice + uint256(price) * 1e10) / 2);
+   return (wethPriceUSD * 1e18) / (DAIWethPrice + uint256(price) / 2);
```
