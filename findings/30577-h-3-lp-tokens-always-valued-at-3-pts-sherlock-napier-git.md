---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/dex
  - sector/liquid-staking
  - sector/stable
protocol: "[[Napier]]"
auditors:
  - "[[xiaoming90]]"
report: "https://github.com/sherlock-audit/2024-01-napier-judging"
genome:
  - "[[precision-loss]]"
  - "[[frontrun]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
---
# H-3: LP Tokens always valued at 3 PTs

- id: 30577
- impact: HIGH
- protocol: [[Napier]]
- reporter: xiaoming90 (Sherlock)
- source: N/A

## Summary


This bug report is about a problem where LP Tokens, which are used in an AMM pool for trading assets, are always valued at 3 PTs. This means that users may receive less assets/PTs than expected and the pool could be unfairly arbitraged, resulting in a loss for LPs. The issue is caused by the pool assuming that the LP token is equivalent to 3 times the amount of PTs, but in reality, the value of the LP token can increase over time. This could lead to issues such as users receiving less assets/PTs than expected and malicious users taking advantage of the price difference. The report recommends that the LP tokens should be valued based on their current value, rather than a static exchange rate of 3. The issue has been fixed by the protocol team. 

## Details

Source: https://github.com/sherlock-audit/2024-01-napier-judging/issues/90 

## Found by 
xiaoming90
## Summary

LP Tokens are always valued at 3 PTs. As a result, users of the AMM pool might receive fewer assets/PTs than expected. The AMM pool might be unfairly arbitraged, resulting in a loss for the pool's LPs.

## Vulnerability Detail

The Napier AMM pool facilitates trade between underlying assets and PTs. The PTs in the pool are represented by the Curve's Base LP Token of the Curve's pool that holds the PTs. The Napier AMM pool and Router math assumes that the Base LP Token is equivalent to 3 times the amount of PTs, as shown below. When the pool is initially deployed, it is correct that the LP token is equivalent to 3 times the amount of PT.

https://github.com/sherlock-audit/2024-01-napier/blob/main/v1-pool/src/libs/PoolMath.sol#L106


```solidity
File: PoolMath.sol
83:     int256 internal constant N_COINS = 3;
..SNIP..
96:     function swapExactBaseLpTokenForUnderlying(PoolState memory pool, uint256 exactBaseLptIn)
97:         internal
..SNIP..
105:             // Note: Here we are multiplying by N_COINS because the swap formula is defined in terms of the amount of PT being swapped.
106:             // BaseLpt is equivalent to 3 times the amount of PT due to the initial deposit of 1:1:1:1=pt1:pt2:pt3:Lp share in Curve pool.
107:             exactBaseLptIn.neg() * N_COINS
..SNIP..
120:     function swapUnderlyingForExactBaseLpToken(PoolState memory pool, uint256 exactBaseLptOut)
..SNIP..
125:         (int256 _netUnderlyingToAccount18, int256 _netUnderlyingFee18, int256 _netUnderlyingToProtocol18) = executeSwap(
126:             pool,
127:             // Note: sign is defined from the perspective of the swapper.
128:             // positive because the swapper is buying pt
129:             exactBaseLptOut.toInt256() * N_COINS
```

https://github.com/sherlock-audit/2024-01-napier/blob/main/v1-pool/src/NapierPool.sol#L48

```solidity
File: NapierPool.sol
47:     /// @dev Number of coins in the BasePool
48:     uint256 internal constant N_COINS = 3;
..SNIP..
226:                     totalBaseLptTimesN: baseLptUsed * N_COINS,
..SNIP..
584:             totalBaseLptTimesN: totalBaseLpt * N_COINS,
```

In Curve, LP tokens are generally priced by computing the underlying tokens per share, hence dividing the total underlying token amounts by the total supply of the LP token. Given that the underlying assets in Curve’s stable swap are pegged to each other, the invariant���s $D$ value can be computed to estimate the total value of the underlying tokens.

Curve itself provides a function `get_virtual_price` that computes the price of the LP token by dividing $D$ with the total supply. 

Note that for LP tokens, the ratio of the total underlying value and the total supply will grow (fee mechanism) over time. Thus, the virtual price’s value will increase over time.

This means the LP token will be worth more than 3 PTs in the Curve Pool over time. However, the Naiper AMM pool still values its LP token at a constant value of 3 PTs. This discrepancy between the value of the LP tokens in the Napier AMM pool and Curve pool might result in various issues, such as the following:

- Investors brought LP tokens at the price of 3.X PT from the market. The LP tokens are deposited into or swap into the Napier AMM pool. The Naiper Pool will always assume that the price of the LP token is 3 PTs, thus shortchanging the number of assets or PTs returned to users.
- Potential arbitrage opportunity where malicious users obtain the LP token from the Naiper AMM pool at a value of 3 PT and redeem the LP token at a value higher than 3 PTs, pocketing the differences.

## Impact

Users of the AMM pool might receive fewer assets/PTs than expected. The AMM pool might be unfairly arbitraged, resulting in a loss for the pool's LPs.

## Code Snippet

https://github.com/sherlock-audit/2024-01-napier/blob/main/v1-pool/src/libs/PoolMath.sol#L106

https://github.com/sherlock-audit/2024-01-napier/blob/main/v1-pool/src/NapierPool.sol#L48

## Tool used

Manual Review

## Recommendation

Naiper and Pendle share the same core math for their AMM pool.

In Pendle, the AMM stores the PTs and SY (Standard Yield Token). When performing any operation (e.g., deposit, swap), the SY will be converted to the underlying assets based on SY's current rate before performing any math operation. If it is a SY (wstETH), the SY's rate will be the [current exchange rate](https://github.com/pendle-finance/pendle-core-v2-public/blob/39f3a613e2ec55dc38a7d3c562529d67844a263a/contracts/core/StandardizedYield/implementations/PendleWstEthSY.sol#L88) for wstETH to stETH/ETH. One could also think the AMM's reserve is PTs and Underlying Assets under the hood.

In Napier, the AMM stores the PTs and Curve's LP tokens. When performing any operation, the math will always convert the LP token to underlying assets using a static exchange rate of 3. However, this is incorrect, as the value of an LP token will grow over time. The AMM should value the LP tokens based on their current value. The virtual price of the LP token and other information can be leveraged to derive the current value of the LP tokens to facilitate the math operation within the pool.



## Discussion

**sherlock-admin**

1 comment(s) were left on this issue during the judging contest.

**takarez** commented:
>  valid; high(9)



**sherlock-admin4**

The protocol team fixed this issue in PR/commit https://github.com/napierfi/v1-pool/pull/159.
