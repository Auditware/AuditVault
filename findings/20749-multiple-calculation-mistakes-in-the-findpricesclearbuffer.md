---
tags:
  - lang/solidity
  - platform/consensys
  - severity/high
  - sector/oracle
  - sector/staking
protocol: "[[Geodefi]]"
auditors:
  - "[[Sergii Kravchenko]]"
report: "https://consensys.net/diligence/audits/2022/11/geodefi/"
genome:
  - "[[precision-loss]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# Multiple calculation mistakes in the _findPricesClearBuffer function

- id: 20749
- impact: HIGH
- protocol: [[Geodefi]]
- reporter: Sergii Kravchenko (ConsenSys)
- source: https://consensys.net/diligence/audits/2022/11/geodefi/

## Summary


This bug report is about a function called `_findPricesClearBuffer` which is designed to calculate the gETH/ETH prices. The function calculates two prices - the price at the reference point (midnight) and the price at the time the `reportOracle` is called. The first calculation reduces the current ETH balance by all the minted gETH and increases by all the burnt gETH, but mistakenly uses `self.gETH.totalSupply(_poolId)` instead of `self.gETH.denominator()`. This can lead to the `unbufferedEther` being much larger than it should be and the eventual oracle price will be much higher. The second calculation mistake is that none of the values returned are multiplied by `self.gETH.denominator();`, resulting in both values being around `1` when they should be multiplied by `self.gETH.denominator();`.

## Details

#### Description


The `_findPricesClearBuffer` function is designed to calculate the gETH/ETH prices. The first one (oracle price) is the price at the reference point, for ease of calculation let’s assume it is midnight. The second price is the price at the time the `reportOracle` is called.


**code/contracts/Portal/utils/OracleUtilsLib.sol:L388**



```
return (unbufferedEther / unbufferedSupply, totalEther / supply);

```
To calculate the oracle price at midnight, the current ETH balance is reduced by all the minted gETH (converted to ETH with the old price) and increased by all the burnt gETH (converted to ETH with the old price) starting from midnight to the time transaction is being executed:


**code/contracts/Portal/utils/OracleUtilsLib.sol:L368-L374**



```
uint256 unbufferedEther = totalEther -
 (DATASTORE.readUintForId(\_poolId, \_dailyBufferMintKey) \* price) /
 self.gETH.totalSupply(\_poolId);

unbufferedEther +=
 (DATASTORE.readUintForId(\_poolId, \_dailyBufferBurnKey) \* price) /
 self.gETH.denominator();

```
But in the first calculation, the `self.gETH.totalSupply(_poolId)` is mistakenly used instead of `self.gETH.denominator()`. This can lead to the `unbufferedEther` being much larger, and the eventual oracle price will be much larger too.


There is another serious calculation mistake. In the end, the function returns the following line:


**code/contracts/Portal/utils/OracleUtilsLib.sol:L388**



```
return (unbufferedEther / unbufferedSupply, totalEther / supply);

```
But none of these values are multiplied by `self.gETH.denominator();` so they are in the same range. Both values will usually be around `1`. While the actual price value should be multiplied by `self.gETH.denominator();`.
