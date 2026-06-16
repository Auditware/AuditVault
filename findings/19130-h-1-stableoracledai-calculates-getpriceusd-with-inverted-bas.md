---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/dex
  - sector/oracle
  - sector/stable
protocol: "[[USSD]]"
auditors:
  - "[[0xPkhatri]]"
  - "[[0xRobocop]]"
  - "[[0xyPhilic]]"
  - "[[Bahurum]]"
  - "[[Brenzee]]"
  - "[[J4de]]"
  - "[[Juntao]]"
  - "[[Viktor_Cortess]]"
  - "[[juancito]]"
  - "[[nobody2018]]"
  - "[[pengun]]"
  - "[[sashik_eth]]"
  - "[[shaka]]"
  - "[[twicek]]"
report: "https://github.com/sherlock-audit/2023-05-USSD-judging"
genome:
  - "[[fee-calculation]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[chainlink-round-completeness]]"
---
# H-1: `StableOracleDAI` calculates `getPriceUSD` with inverted base/rate tokens for Chainlink price

- id: 19130
- impact: HIGH
- protocol: [[USSD]] - Autonomous Secure Dollar
- reporter: Juntao (Sherlock)
- source: N/A

## Summary


This bug report is about an issue found in `StableOracleDAI::getPriceUSD()`, which is part of the USSD contracts. This function calculates the average price between the Uniswap pool price for a pair and the Chainlink feed as part of its result. The problem is that it uses `WETH/DAI` as the base/rate tokens for the pool, and `DAI/ETH` for the Chainlink feed, which is the opposite. This will lead to a huge price difference that will impact on the amount of USSD tokens being minted, while requesting the price from this oracle.

The code snippets provided in the bug report show that the Chainlink feed `priceFeedDAIETH` returns the price as DAI/ETH, while the price coming from the Uniswap pool `DAIWethPrice` returns the price as `WETH/DAI`. Both values are then used to calculate an average price, but as seen, one has price in `DAI/ETH` and the other one in `WETH/DAI`, which leads to an incorrect result.

The impact of this bug is that users will receive far more USSD tokens than they should when they call `mintForToken()`, ruining the token value. When performed the `USSDRebalancer::rebalance()`, all the calculations will be broken for the DAI oracle, leading to incorrect pool trades due to the error in `getPrice()`.

The recommendation to fix this issue is to calculate the inverse of the `price` returned by the Chainlink feed so that it can be averaged with the pool price, making sure that both use the correct `WETH/DAI` and `ETH/DAI` base/rate tokens.

## Details

Source: https://github.com/sherlock-audit/2023-05-USSD-judging/issues/102 

## Found by 
0xPkhatri, 0xRobocop, 0xyPhilic, Bahurum, Brenzee, J4de, Juntao, Viktor\_Cortess, juancito, nobody2018, pengun, sashik\_eth, shaka, twicek
## Summary

`StableOracleDAI::getPriceUSD()` calculates the average price between the Uniswap pool price for a pair and the Chainlink feed as part of its result.

The problem is that it uses `WETH/DAI` as the base/rate tokens for the pool, and `DAI/ETH` for the Chainlink feed, which is the opposite.

This will incur in a huge price difference that will impact on the amount of USSD tokens being minted, while requesting the price from this oracle.

## Vulnerability Detail

In `StableOracleDAI::getPrice()` the `price` from the Chainlink feed `priceFeedDAIETH` returns the price as DAI/ETH.

This can be checked on [Etherscan](https://etherscan.io/address/0x773616E4d11A78F511299002da57A0a94577F1f4#readContract#F10) and the [Chainlink Feeds Page](https://docs.chain.link/data-feeds/price-feeds/addresses/).

Also note the comment on the code is misleading, as it is refering to another pair:

> chainlink price data is 8 decimals for WETH/USD

```solidity
/// constructor
24:    priceFeedDAIETH = AggregatorV3Interface(
25:        0x773616E4d11A78F511299002da57A0a94577F1f4
26:    );

/// getPrice()
46:    // chainlink price data is 8 decimals for WETH/USD, so multiply by 10 decimals to get 18 decimal fractional
47:    //(uint80 roundID, int256 price, uint256 startedAt, uint256 timeStamp, uint80 answeredInRound) = priceFeedDAIETH.latestRoundData();
48:    (, int256 price, , , ) = priceFeedDAIETH.latestRoundData();
```

[Link to code](https://github.com/sherlock-audit/2023-05-USSD/blob/main/ussd-contracts/contracts/oracles/StableOracleDAI.sol#L46-L48)

On the other hand, the price coming from the Uniswap pool `DAIWethPrice` returns the price as `WETH/DAI`.

Note that the relation WETH/DAI is given by the orders of the token addresses passed as arguments, being the first the base token, and the second the quote token.

Also note that the variable name `DAIWethPrice` is misleading as well as the base/rate are the opposite (although this doesn't affect the code).

```solidity
    uint256 DAIWethPrice = DAIEthOracle.quoteSpecificPoolsWithTimePeriod(
        1000000000000000000, // 1 Eth
        0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2, // WETH (base token) // @audit
        0x6B175474E89094C44Da98b954EedeAC495271d0F, // DAI (quote token) // @audit
        pools, // DAI/WETH pool uni v3
        600 // period
    );
```

[Link to code](https://github.com/sherlock-audit/2023-05-USSD/blob/main/ussd-contracts/contracts/oracles/StableOracleDAI.sol#L36-L42)

Finally, both values are used to calculate an average price of in `((DAIWethPrice + uint256(price) * 1e10) / 2)`.

But as seen, one has price in `DAI/ETH` and the other one in `WETH/DAI`, which leads to an incorrect result.

```solidity
    return
        (wethPriceUSD * 1e18) /
        ((DAIWethPrice + uint256(price) * 1e10) / 2);
```

[Link to code](https://github.com/sherlock-audit/2023-05-USSD/blob/main/ussd-contracts/contracts/oracles/StableOracleDAI.sol#L50C15-L52)

The average will be lower in this case, and the resulting price higher. 

This will be used by `USSD::mintForToken()` for calculating the amount of tokens to mint for the user, and thus giving them much more than they should.

Also worth mentioning that `USSDRebalancer::rebalance()` also relies on the result of this price calculation and will make it perform trades with incorrect values.

## Impact

Users will receive far more USSD tokens than they should when they call `mintForToken()`, ruining the token value.

When performed the `USSDRebalancer::rebalance()`, all the calculations will be broken for the DAI oracle, leading to incorrect pool trades due to the error in `getPrice()`

## Code Snippet

- https://github.com/sherlock-audit/2023-05-USSD/blob/main/ussd-contracts/contracts/oracles/StableOracleDAI.sol#L46C28-L48
- https://github.com/sherlock-audit/2023-05-USSD/blob/main/ussd-contracts/contracts/oracles/StableOracleDAI.sol#L36-L42
- https://github.com/sherlock-audit/2023-05-USSD/blob/main/ussd-contracts/contracts/oracles/StableOracleDAI.sol#L50C15-L52

## Tool used

Manual Review

## Recommendation

Calculate the inverse of the `price` returned by the Chainlink feed so that it can be averaged with the pool price, making sure that both use the correct `WETH/DAI` and `ETH/DAI` base/rate tokens.





## Discussion

**T1MOH593**

Escalate for 10 USDC

This is not a duplicate of https://github.com/sherlock-audit/2023-05-USSD-judging/issues/909.
It tells about using DAI/ETH instead of ETH/DAI on Chainlink. And #909 tells about completely different issue with oracles

**sherlock-admin**

 > Escalate for 10 USDC
> 
> This is not a duplicate of https://github.com/sherlock-audit/2023-05-USSD-judging/issues/909.
> It tells about using DAI/ETH instead of ETH/DAI on Chainlink. And #909 tells about completely different issue with oracles

You've created a valid escalation for 10 USDC!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**0xJuancito**

Escalate for 10 USDC

Agree with the previous comment. 

This is an **independent High** impact finding. It is not a duplicate of https://github.com/sherlock-audit/2023-05-USSD-judging/issues/909, and hasn't been exposed by other findings selected for report.

It's main point is explained on the Summary:

> The problem is that it uses WETH/DAI as the base/rate tokens for the pool, and DAI/ETH for the Chainlink feed, which is the opposite.

A more detailed explanation and recommendation to fix it is included on the rest of the report.

Possible duplicates:

- https://github.com/sherlock-audit/2023-05-USSD-judging/issues/795
- https://github.com/sherlock-audit/2023-05-USSD-judging/issues/774
- https://github.com/sherlock-audit/2023-05-USSD-judging/issues/491
- https://github.com/sherlock-audit/2023-05-USSD-judging/issues/269

**sherlock-admin**

 > Escalate for 10 USDC
> 
> Agree with the previous comment. 
> 
> This is an **independent High** impact finding. It is not a duplicate of https://github.com/sherlock-audit/2023-05-USSD-judging/issues/909, and hasn't been exposed by other findings selected for report.
> 
> It's main point is explained on the Summary:
> 
> > The problem is that it uses WETH/DAI as the base/rate tokens for the pool, and DAI/ETH for the Chainlink feed, which is the opposite.
> 
> A more detailed explanation and recommendation to fix it is included on the rest of the report.
> 
> Possible duplicates:
> 
> - https://github.com/sherlock-audit/2023-05-USSD-judging/issues/795
> - https://github.com/sherlock-audit/2023-05-USSD-judging/issues/774
> - https://github.com/sherlock-audit/2023-05-USSD-judging/issues/491
> - https://github.com/sherlock-audit/2023-05-USSD-judging/issues/269

You've created a valid escalation for 10 USDC!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**ctf-sec**

See my comments in https://github.com/sherlock-audit/2023-05-USSD-judging/issues/555

**hrishibhat**

Result:
High
Has duplicates 
This is a valid separate issue.


**sherlock-admin**

Escalations have been resolved successfully!

Escalation status:
- [T1MOH593](https://github.com/sherlock-audit/2023-05-USSD-judging/issues/102/#issuecomment-1604525700): accepted
- [0xJuancito](https://github.com/sherlock-audit/2023-05-USSD-judging/issues/102/#issuecomment-1605034302): accepted
