---
tags:
  - lang/solidity
  - lang/vyper
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/governance
  - sector/lending
  - sector/token
  - sector/vault
protocol: "[[Yield Basis]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Yield%20Basis/DAO/README.md#2-loss-of-rewards-when-liquiditygaugetotalsupply0"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# Loss of Rewards When `LiquidityGauge.totalSupply=0`

- id: 61923
- impact: HIGH
- protocol: [[Yield Basis]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Yield%20Basis/DAO/README.md#2-loss-of-rewards-when-liquiditygaugetotalsupply0

## Summary


The report is about a vulnerability in a function called **`LiquidityGauge._checkpoint()`**. This function has a line of code that calculates rewards, but if the total supply of a certain asset is 0, the calculation returns 0 and the rewards are not credited to anyone. The recommendation is to either check if the total supply is greater than 0 before the calculation or create a function for an administrator to claim these uncredited rewards. 

## Details

##### Description

The vulnerability lies in **`LiquidityGauge._checkpoint()`**:
```python
## LiquidityGauge._checkpoint()
r.integral_inv_supply = self.integral_inv_supply
if block.timestamp > r.integral_inv_supply.t:
    r.integral_inv_supply.v += unsafe_div(
        10**36 * (block.timestamp - r.integral_inv_supply.t),
        erc4626.erc20.totalSupply  # ← may be 0
    )
    r.integral_inv_supply.t = block.timestamp
```
https://github.com/yield-basis/yb-core/blob/3352c612fc33e48f1a106da41f63810f31bc38be/contracts/dao/LiquidityGauge.vy#L146

If `totalSupply() == 0`, `unsafe_div` returns `0`, and `v` is not increased. The entire `d_reward` is discarded: extra rewards accumulate in the contract but are not credited to anyone and can't be claimed.
<br/>
##### Recommendation

We recommend checking `totalSupply() > 0` before `unsafe_div`, or providing an admin-only claim function to recover unaccounted rewards if needed.



---
