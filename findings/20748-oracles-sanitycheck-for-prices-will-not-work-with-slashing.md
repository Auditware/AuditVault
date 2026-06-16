---
tags:
  - lang/solidity
  - platform/consensys
  - severity/high
  - sector/gaming
  - sector/oracle
  - sector/staking
protocol: "[[Geodefi]]"
auditors:
  - "[[Sergii Kravchenko]]"
report: "https://consensys.net/diligence/audits/2022/11/geodefi/"
genome:
  - "[[stale-price]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[frontrun-exposure]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# Oracle’s _sanityCheck for prices will not work with slashing

- id: 20748
- impact: HIGH
- protocol: [[Geodefi]]
- reporter: Sergii Kravchenko (ConsenSys)
- source: https://consensys.net/diligence/audits/2022/11/geodefi/

## Summary


This bug report is about the `_sanityCheck` feature in the OracleUtilsLib.sol file. This feature is used to verify that the new price hasn’t changed significantly. The bug is that if there is a slashing event, the oracle will not be updated because of the sanity check, which could lead to an arbitrage opportunity and the devaluation of gETH to zero. The recommendation is to make sure that slashing can be adequately processed when updating the price.

## Details

#### Description


The `_sanityCheck` is verifying that the new price didn’t change significantly:


**code/contracts/Portal/utils/OracleUtilsLib.sol:L405-L417**



```
uint256 maxPrice = curPrice +
 ((curPrice \*
 self.PERIOD\_PRICE\_INCREASE\_LIMIT \*
 \_periodsSinceUpdate) / PERCENTAGE\_DENOMINATOR);

uint256 minPrice = curPrice -
 ((curPrice \*
 self.PERIOD\_PRICE\_DECREASE\_LIMIT \*
 \_periodsSinceUpdate) / PERCENTAGE\_DENOMINATOR);

require(
 \_newPrice >= minPrice && \_newPrice <= maxPrice,
 "OracleUtils: price is insane"

```
While the rewards of staking can be reasonably predicted, the balances may also be changed due to slashing. So any slashing event should reduce the price, and if enough ETH is slashed, the price will drop heavily. The oracle will not be updated because of a sanity check. After that, there will be an arbitrage opportunity, and everyone will be incentivized to withdraw as soon as possible. That process will inevitably devaluate gETH to zero.
The severity of this issue is also amplified by the fact that operators have no skin in the game and won’t lose anything from slashing.


#### Recommendation


Make sure that slashing can be adequately processed when updating the price.
