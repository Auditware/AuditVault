---
tags:
  - lang/solidity
  - sector/dex
  - sector/stable
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/oracle/spot-price
  - misassumption/oracle-is-reliable
  - misassumption/price-cannot-be-manipulated
  - fix/use-twap
  - trigger/price-manipulation
protocol: "[[AXION]]"
auditors:
  - "[[carrotsmuggler]]"
report: "https://github.com/sherlock-audit/2024-10-axion-judging"
genome:
  - "[[spot-price]]"
  - "[[direct-drain]]"
  - "[[oracle-manipulation-resistance]]"
---
# H-1: Boost buyback burns incorrect amount of liquidity

- id: 43530
- impact: HIGH
- protocol: [[AXION]]
- reporter: carrotsmuggler (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found in the V3AMO contract. The function `_unfarmBuyBurn` is used to burn liquidity and buy boost tokens to raise their price. However, the calculation used to estimate the amount of liquidity to be taken out is not valid for V3 pools. This is because V3 pools allow for single-sided liquidity, which increases the reserves of only one token. This means that the calculated `liquidity` amount has no meaning and can cause the function to revert or overestimate the amount of liquidity to be removed. This can be exploited by malicious actors to push the boost token price above the peg price and make a profit. The root cause of this issue is the use of reserves to calculate `liquidity`, which is not valid for V3 pools. The report suggests using the `quoteSwap` function to calculate the amount of liquidity to be swapped.

## Details

Source: https://github.com/sherlock-audit/2024-10-axion-judging/issues/114 

## Found by 
0x37, carrotsmuggler, pkqs90, s1ce, spark1, vinica\_boy
### Summary

The function `_unfarmBuyBurn` in the V3AMO contract is a public function open to everyone and calculates the amount of liquidity to burn from the pool. This function basically burns LP positions to take out liquidity and uses the usd to buy up boost tokens and burns them to raise the price of boost tokens.

The issue is in the `_unfarmBuyBurn` function when it tries to estimate how much liquidity needs to be taken out.

https://github.com/sherlock-audit/2024-10-axion/blob/main/liquidity-amo/contracts/SolidlyV3AMO.sol#L320-L326

As seen above, first the token reserves of the pool are checked. Then, the `liquidity` to be burnt is calculated from the difference of the reserves.

```solidity
liquidity = (totalLiquidity * (boostBalance - usdBalance)) / (boostBalance + usdBalance);
liquidity = (liquidity * LIQUIDITY_COEFF) / FACTOR;
```

However, this calculation is not valid for V3/CL pools. This is because in V3 pools, single sided liquidity is allowed which adds to the `totalLiquidity` count, but increases the reserves of only 1 token. If a user adds liquidity at a tick lower than the current price, they will be adding only usd to the pool.

For example, lets say the price currently is below peg, at 0.9. Say there are 1000 boost and 900 usd tokens in the pool, similar to a V2 composition. Now, since its a V3 pool, a user can come in and add 100 usd to the pool at a price of 0.5. Since this price is lower than the spot price, only usd will be needed to open this position. Now, the total reserves of both boost and usd are 1000 each, so the calculated `liquidity` amount to be removed will be 0.

Thus the `liquidity` calculated in the contract has absolutely no meaning since it uses the reserves to calculate it, which is not valid for V3 pools. In the best case scenario, this will cause the function to revert and not work. In the worst case scenario, the liquidity calculated will be overestimated and the price will be pushed up even above the peg price. This is possible if users add single sided `boost` to the pool, increasing the `liquidity` amount calculated without changing the price. In this case, the contract assets will be used to force the boost token above peg, and malicious actors can buy the boost token before and sell it after for a handy profit.

### Root Cause

The main cause is that `liquidity` is calculated from the reserves. This is not valid for V3, since it can have single sided liquidity, and thus the reserves does not serve as an indicator of price or in this case the deviation from the peg.

### Internal pre-conditions

None

### External pre-conditions

Any user can add boost-only liquidity to make the contract overestimate the amount of liquidity it needs to burn

### Attack Path

Users can add boost-only liquidity to make the contract overestimate the amount of liquidity it needs to burn. When extra liquidity is burnt and extra boost is bought back and burnt, the price will be pushed up even above the peg price. Users can buy before trigerring this and sell after for profit.

### Impact

Price can be pushed above the peg price

### PoC

None

### Mitigation

Use the `quoteSwap` function to calculate how much needs to be swapped until the target price is hit.
